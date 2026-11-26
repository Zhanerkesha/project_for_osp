// Ewha Market - Messages page logic (messages.html)
// Owner: Zhansaya
//
// This file only handles the page: the list, the bubbles, clicks and typing.
// Everything about the database and login is in messages-data.js.
//
// Two kinds of conversations are shown in ONE list:
//   - "listing": started from a listing (Contact Seller). Depends on the Buying / Selling tab.
//   - "direct":  a person I added by email. Shown in both tabs.
// Messages are a SAMPLE: typed messages appear on the page but are not saved.

import {
    onUserChanged,
    getListing,
    getOrCreateChat,
    watchMyChats,
    findUserByEmail,
    addContact,
    watchMyContacts, 
    saveMyLookup
} from "./messages-data.js";

// ---------- 1. Page elements ----------
const tabs = document.querySelectorAll(".chat-tab");
const layout = document.getElementById("chatLayout");
const statusBox = document.getElementById("chatStatus");
const searchInput = document.getElementById("chatSearch");
const listEl = document.getElementById("chatList");
const listEmpty = document.getElementById("chatListEmpty");
const placeholder = document.getElementById("chatPlaceholder");
const activeBox = document.getElementById("chatActive");
const userAvatar = document.getElementById("chatUserAvatar");
const userName = document.getElementById("chatUserName");
const userRole = document.getElementById("chatUserRole");
const itemLink = document.getElementById("chatItem");
const itemImg = document.getElementById("chatItemImg");
const itemTitle = document.getElementById("chatItemTitle");
const itemPrice = document.getElementById("chatItemPrice");
const messagesEl = document.getElementById("chatMessages");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const backButton = document.getElementById("chatBack");

// NEW: "Add by email"
const addToggle = document.getElementById("chatAddToggle");
const addForm = document.getElementById("chatAddForm");
const addEmail = document.getElementById("chatAddEmail");
const addSubmit = document.getElementById("chatAddSubmit");
const addCancel = document.getElementById("chatAddCancel");
const addMessage = document.getElementById("chatAddMessage");

// ---------- 2. State ----------
let me = null;               // { uid, nickname, email } of the logged-in user
let currentRole = "buyer";   // "buyer" = Buying tab, "seller" = Selling tab
let listingChats = [];       // listing chats of the current tab (from Firestore)
let contacts = [];           // people I added by email (from Firestore)
let conversations = [];      // both lists together, newest first (what the list shows)
let openId = null;           // the conversation shown on the right
let pendingOpenId = null;    // open this one as soon as it appears in the list
let stopChats = null;        // stops the listing chats listener
let stopContacts = null;     // stops the contacts listener

// Messages typed on this page: { conversationId: [ {mine, text, time}, ... ] }
// Only in memory -> they disappear after a refresh (sample chat).
const typedMessages = {};

// The sample bubbles use times relative to when the page was opened.
const PAGE_OPENED_AT = Date.now();

// ---------- 3. Helpers ----------
function showStatus(text) {
    statusBox.textContent = text;
    statusBox.hidden = !text;
}

function findConversation(id) {
    return conversations.find((c) => c.id === id);
}

// In a listing chat: the person I'm talking to (not me).
function otherPerson(chat) {
    if (chat.buyerId === me.uid) {
        return { name: chat.sellerNickname, role: "Seller" };
    }
    return { name: chat.buyerNickname, role: "Buyer" };
}

function firstLetter(name) {
    return (name || "?").charAt(0).toUpperCase();
}

function formatPrice(chat) {
    if (chat.listingIsFree) return "Free";
    return "₩" + Number(chat.listingPrice || 0).toLocaleString("ko-KR");
}

// Works for Firestore Timestamps AND normal JS Dates.
function toDate(time) {
    if (!time) return new Date();
    return typeof time.toDate === "function" ? time.toDate() : time;
}

function formatListTime(time) {
    const date = toDate(time);
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (date.getTime() >= startOfToday) {
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    if (date.getTime() >= startOfToday - dayMs) return "Yesterday";
    if (date.getTime() >= startOfToday - 6 * dayMs) {
        return date.toLocaleDateString("en-US", { weekday: "short" });
    }
    return (date.getMonth() + 1) + "/" + date.getDate();
}

function formatBubbleTime(time) {
    return toDate(time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// Creates an element with a class and (optional) text.
// textContent, never innerHTML, for anything a user typed.
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

// ---------- 4. One shape for both kinds of conversations ----------
function fromListingChat(chat) {
    const person = otherPerson(chat);
    return {
        id: chat.chatId,
        type: "listing",
        name: person.name,
        subtitle: chat.listingTitle + " · " + formatPrice(chat),
        headerInfo: person.role,
        time: chat.lastMessageAt,
        listing: {
            listingId: chat.listingId,
            title: chat.listingTitle,
            price: formatPrice(chat),
            imageUrl: chat.listingImageUrl
        }
    };
}

function fromContact(contact) {
    return {
        id: "direct_" + contact.uid,
        type: "direct",
        name: contact.nickname,
        subtitle: contact.email,
        headerInfo: contact.email,
        time: contact.addedAt,
        listing: null
    };
}

// Called whenever listingChats or contacts change.
function rebuildConversations() {
    conversations = listingChats.map(fromListingChat)
        .concat(contacts.map(fromContact))
        .sort((a, b) => toDate(b.time).getTime() - toDate(a.time).getTime());

    renderChatList();

    // Open a conversation we were waiting for (new contact / Contact Seller)
    if (pendingOpenId && findConversation(pendingOpenId)) {
        openChat(pendingOpenId);
        pendingOpenId = null;
    }

    // Keep the header up to date (e.g. a nickname changed)
    const open = findConversation(openId);
    if (open) fillHeader(open);
}

// ---------- 5. Sample messages ----------
// Same short conversation for everyone, with the other person's nickname.
function sampleMessages(conversation) {
    const minute = 60 * 1000;
    return [
        { mine: false, text: "Hi! 👋", time: new Date(PAGE_OPENED_AT - 30 * minute) },
        { mine: true, text: "Hi " + conversation.name + "! How can I help you?", time: new Date(PAGE_OPENED_AT - 28 * minute) },
        { mine: false, text: "Can we meet at ECC tomorrow?", time: new Date(PAGE_OPENED_AT - 25 * minute) },
        { mine: true, text: "Sure, see you at 3 PM!", time: new Date(PAGE_OPENED_AT - 20 * minute) }
    ];
}

function allMessages(conversation) {
    return sampleMessages(conversation).concat(typedMessages[conversation.id] || []);
}

function lastMessage(conversation) {
    const messages = allMessages(conversation);
    return messages[messages.length - 1];
}

// ---------- 6. Left side: conversation list ----------
function renderChatList() {
    const term = searchInput.value.trim().toLowerCase();

    const visible = conversations.filter((c) =>
        (c.name + " " + c.subtitle).toLowerCase().includes(term)
    );

    listEl.replaceChildren();
    listEmpty.hidden = visible.length > 0;
    visible.forEach((c) => listEl.appendChild(buildChatItem(c)));
}

function buildChatItem(conversation) {
    const li = el("li");
    const button = el("button", "chat-list-item");
    button.type = "button";
    if (conversation.id === openId) button.classList.add("is-active");

    // Direct chats get a light avatar, so they're easy to tell apart
    const avatarClass = conversation.type === "direct" ? "chat-avatar is-direct" : "chat-avatar";
    const avatar = el("div", avatarClass, firstLetter(conversation.name));

    const body = el("div", "chat-list-body");
    const top = el("div", "chat-list-top");
    top.append(
        el("span", "chat-list-name", conversation.name),
        el("span", "chat-list-time", formatListTime(conversation.time))
    );
    const subtitle = el("p", "chat-list-listing", conversation.subtitle);
    const preview = el("p", "chat-list-preview", lastMessage(conversation).text);
    body.append(top, subtitle, preview);

    button.append(avatar, body);
    button.addEventListener("click", () => openChat(conversation.id));
    li.appendChild(button);
    return li;
}

// ---------- 7. Listen to Firestore ----------
function startWatchingChats() {
    if (stopChats) stopChats();
    stopChats = watchMyChats(me.uid, currentRole, (list) => {
        listingChats = list;
        rebuildConversations();
    }, (err) => {
        console.error(err);
        showStatus("Could not load conversations. Open the console (F12) for details.");
    });
}

function startWatchingContacts() {
    if (stopContacts) stopContacts();
    stopContacts = watchMyContacts(me.uid, (list) => {
        contacts = list;
        rebuildConversations();
    }, (err) => {
        console.error(err);
        showStatus("Could not load the people you added. Open the console (F12) for details.");
    });
}

// ---------- 8. Tabs + search ----------
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        if (tab.dataset.role === currentRole) return;
        currentRole = tab.dataset.role;
        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));

        // A listing chat belongs to one tab -> close it. A direct chat is in both tabs -> keep it open.
        const open = findConversation(openId);
        if (open && open.type === "listing") closeChat();

        startWatchingChats();
    });
});

searchInput.addEventListener("input", renderChatList);
// Phone: "←" goes back to the conversation list
backButton.addEventListener("click", closeChat);

// ---------- 9. Right side: open / close ----------
function openChat(id) {
    const conversation = findConversation(id);
    if (!conversation) return;

    openId = id;
    placeholder.hidden = true;
    activeBox.hidden = false;
    layout.classList.add("is-chat-open");      // phone: show only the chat
    fillHeader(conversation);
    renderChatList();          // move the green highlight
    renderMessages();
    input.focus();
}

function closeChat() {
    openId = null;
    activeBox.hidden = true;
    placeholder.hidden = false;
    layout.classList.remove("is-chat-open");   // phone: back to the list
    renderChatList();
}

function fillHeader(conversation) {
    userAvatar.textContent = firstLetter(conversation.name);
    userAvatar.className = conversation.type === "direct" ? "chat-avatar is-direct" : "chat-avatar";
    userName.textContent = conversation.name;
    userRole.textContent = conversation.headerInfo;

    // Item card only for listing chats
    itemLink.hidden = !conversation.listing;
    if (!conversation.listing) return;

    itemTitle.textContent = conversation.listing.title;
    itemPrice.textContent = conversation.listing.price;
    itemImg.hidden = !conversation.listing.imageUrl;
    if (conversation.listing.imageUrl) itemImg.src = conversation.listing.imageUrl;
    // TODO: ask Sara which URL item-detail.html expects. "?id=" is a guess.
    itemLink.href = "item-detail.html?id=" + encodeURIComponent(conversation.listing.listingId);
}

// ---------- 10. Message bubbles ----------
function renderMessages() {
    const conversation = findConversation(openId);
    if (!conversation) return;

    messagesEl.replaceChildren();
    messagesEl.appendChild(el("p", "chat-sample-note", "Sample chat · messages are not saved"));

    allMessages(conversation).forEach((msg) => {
        const bubble = el("div", "chat-bubble " + (msg.mine ? "is-mine" : "is-theirs"));
        bubble.append(
            el("p", "chat-bubble-text", msg.text),
            el("span", "chat-bubble-time", formatBubbleTime(msg.time))
        );
        messagesEl.appendChild(bubble);
    });

    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ---------- 11. Sending (sample: only on this page) ----------
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text || !openId) return;

    if (!typedMessages[openId]) typedMessages[openId] = [];
    typedMessages[openId].push({ mine: true, text: text, time: new Date() });

    input.value = "";
    renderMessages();
    renderChatList();          // update the preview text in the list
});

// ---------- 12. Add a person by email ----------
function showAddMessage(text, type) {
    addMessage.textContent = text;
    addMessage.className = "chat-add-message is-" + type;
    addMessage.hidden = !text;
}

function setAddFormOpen(open) {
    addForm.hidden = !open;
    addToggle.setAttribute("aria-expanded", String(open));
    showAddMessage("", "info");
    if (open) {
        addEmail.focus();
    } else {
        addForm.reset();
    }
}

addToggle.addEventListener("click", () => setAddFormOpen(addForm.hidden));
addCancel.addEventListener("click", () => setAddFormOpen(false));

addForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = addEmail.value.trim().toLowerCase();
    if (!email) return;
    if (email === me.email) {
        showAddMessage("That's your own email 🙂", "error");
        return;
    }

    addSubmit.disabled = true;
    showAddMessage("Searching...", "info");

    try {
        const person = await findUserByEmail(email);
        if (!person) {
            showAddMessage("No user found. They may need to open the Chat page once first.", "error");
            return;
        }

        await addContact(me.uid, person);

        // The contacts listener will add them to the list -> open the chat when they appear
        pendingOpenId = "direct_" + person.uid;
        if (findConversation(pendingOpenId)) {
            openChat(pendingOpenId);
            pendingOpenId = null;
        }
        setAddFormOpen(false);
    } catch (err) {
        console.error(err);
        if (err.code === "permission-denied") {
            showAddMessage("Searching users is not allowed yet (Firestore rules).", "error");
        } else {
            showAddMessage("Something went wrong. Please try again.", "error");
        }
    } finally {
        addSubmit.disabled = false;
    }
});

// ---------- 13. "Contact Seller" (messages.html?listingId=...) ----------
async function handleContactSeller() {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("listingId");
    if (!listingId) return;

    history.replaceState(null, "", "messages.html");

    try {
        const listing = await getListing(listingId);
        if (!listing) {
            showStatus("This listing doesn't exist anymore.");
            return;
        }
        if (listing.ownerId === me.uid) {
            showStatus("This is your own listing. Check the Selling tab for buyers' messages.");
            return;
        }

        pendingOpenId = await getOrCreateChat(listing, me);
        if (findConversation(pendingOpenId)) {
            openChat(pendingOpenId);
            pendingOpenId = null;
        }
    } catch (err) {
        console.error(err);
        showStatus("Could not start the chat. Please try again.");
    }
}

// ---------- 14. Start: wait for the login ----------
onUserChanged((user) => {
    if (!user) {
        if (stopChats) stopChats();
        if (stopContacts) stopContacts();
        stopChats = null;
        stopContacts = null;
        closeChat();
        layout.hidden = true;
        showStatus("Please log in to see your messages.");
        return;
    }

    me = user;
    // Make sure others can find me by email (doesn't block the page if it fails)
    saveMyLookup(me).catch((err) => console.warn("Could not save my email lookup:", err));
    layout.hidden = false;
    showStatus("");
    startWatchingChats();      // listing chats of the Buying tab
    startWatchingContacts();   // people added by email
    handleContactSeller();     // if the URL has ?listingId=...
});