// Ewha Market - Messages page logic (messages.html)
// Owner: Zhansaya
//
// This file only handles the page: drawing the list and bubbles, clicks, typing.
// Everything about the database and login is in messages-data.js.

import {
    onUserChanged,
    getListing,
    getOrCreateChat,
    watchMyChats,
    watchMessages,
    sendMessage,
    markChatRead
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

// ---------- 2. State ----------
let me = null;               // { uid, nickname } of the logged-in user
let currentRole = "buyer";   // "buyer" = Buying tab, "seller" = Selling tab
let chats = [];              // chats of the current tab, newest first
let openChatId = null;       // the chat shown on the right
let currentMessages = [];    // messages of the open chat
let messagesLoaded = false;  // true after the first answer for the open chat
let pendingChatId = null;    // chat to open as soon as it appears (Contact Seller)
let stopChats = null;        // function that stops the chat list listener
let stopMessages = null;     // function that stops the messages listener

// ---------- 3. Helpers ----------
function showStatus(text) {
    statusBox.textContent = text;
    statusBox.hidden = !text;        // empty text -> hide the box
}

function findChat(chatId) {
    return chats.find((c) => c.chatId === chatId);
}

// The person I'm talking to (not me).
function otherPerson(chat) {
    if (chat.buyerId === me.uid) {
        return { uid: chat.sellerId, name: chat.sellerNickname, role: "Seller" };
    }
    return { uid: chat.buyerId, name: chat.buyerNickname, role: "Buyer" };
}

function firstLetter(name) {
    return (name || "?").charAt(0).toUpperCase();
}

function formatPrice(chat) {
    if (chat.listingIsFree) return "Free";
    return "₩" + Number(chat.listingPrice || 0).toLocaleString("ko-KR");   // 350000 -> 350,000
}

// Firestore gives a Timestamp; .toDate() turns it into a normal JS Date.
function toDate(ts) {
    return ts ? ts.toDate() : new Date();
}

// List time: "10:24 AM" today, "Yesterday", weekday this week, otherwise "11/3".
function formatListTime(ts) {
    const date = toDate(ts);
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

// Bubble time: always like "10:24 AM".
function formatBubbleTime(ts) {
    return toDate(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// Creates an element with a class and (optional) text.
// IMPORTANT: textContent, never innerHTML, for anything a user typed.
// Otherwise someone could send "<img src=x onerror=...>" and run code in your browser.
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

// ---------- 4. Left side: conversation list ----------
function renderChatList() {
    const term = searchInput.value.trim().toLowerCase();

    // search by the other person's name or the item title
    const visible = chats.filter((chat) => {
        const searchable = (otherPerson(chat).name + " " + chat.listingTitle).toLowerCase();
        return searchable.includes(term);
    });

    listEl.replaceChildren();                  // remove the old items
    listEmpty.hidden = visible.length > 0;     // "No conversations yet" only if empty
    visible.forEach((chat) => listEl.appendChild(buildChatItem(chat)));
}

// Builds one <li> - the same structure you wrote by hand in Phase 1, step 7.
function buildChatItem(chat) {
    const person = otherPerson(chat);
    const unread = (chat.unread && chat.unread[me.uid]) || 0;

    const li = el("li");
    const button = el("button", "chat-list-item");
    button.type = "button";
    if (chat.chatId === openChatId) button.classList.add("is-active");

    const avatar = el("div", "chat-avatar", firstLetter(person.name));

    const body = el("div", "chat-list-body");
    const top = el("div", "chat-list-top");
    top.append(
        el("span", "chat-list-name", person.name),
        el("span", "chat-list-time", formatListTime(chat.lastMessageAt))
    );

    const item = el("p", "chat-list-listing", chat.listingTitle + " · " + formatPrice(chat));
    const preview = el("p", "chat-list-preview", chat.lastMessage || "No messages yet");

    body.append(top, item, preview);
    button.append(avatar, body);

    if (unread > 0) {
        button.appendChild(el("span", "chat-badge", String(unread)));
    }

    button.addEventListener("click", () => openChat(chat.chatId));
    li.appendChild(button);
    return li;
}

// ---------- 5. Listen to the chat list of the current tab ----------
function startWatchingChats() {
    if (stopChats) stopChats();                // stop the previous tab's listener first

    stopChats = watchMyChats(me.uid, currentRole, (list) => {
        chats = list;
        renderChatList();

        // Coming from "Contact Seller": open that chat once it shows up.
        if (pendingChatId && findChat(pendingChatId)) {
            openChat(pendingChatId);
            pendingChatId = null;
        }

        // The open chat changed (new message, other person read it...) -> refresh the right side.
        const open = findChat(openChatId);
        if (open) {
            fillHeader(open);
            renderMessages();                  // redraw so ✓ can become ✓✓
            if ((open.unread && open.unread[me.uid]) > 0) {
                markChatRead(open.chatId, me.uid);   // a message arrived while I'm looking
            }
        }
    }, (err) => {
        console.error(err);
        // Usually a missing index (see Part 1, step 12d) or the security rules.
        showStatus("Could not load conversations. Open the console (F12) for details.");
    });
}

// ---------- 6. Tabs + search ----------
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        if (tab.dataset.role === currentRole) return;      // already on this tab
        currentRole = tab.dataset.role;                    // reads data-role="buyer"/"seller"
        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        closeChat();
        startWatchingChats();
    });
});

searchInput.addEventListener("input", renderChatList);    // redraw on every keystroke

// ---------- 7. Right side: open / close a chat ----------
function openChat(chatId) {
    const chat = findChat(chatId);
    if (!chat) return;

    openChatId = chatId;
    placeholder.hidden = true;
    activeBox.hidden = false;
    fillHeader(chat);
    renderChatList();                          // moves the green highlight

    if (stopMessages) stopMessages();          // stop listening to the previous chat
    currentMessages = [];
    messagesLoaded = false;
    messagesEl.replaceChildren();

    stopMessages = watchMessages(chatId, (messages) => {
        currentMessages = messages;
        messagesLoaded = true;
        renderMessages();
    }, (err) => {
        console.error(err);
        showStatus("Could not load messages.");
    });

    markChatRead(chatId, me.uid);
    input.focus();                             // ready to type
}

function closeChat() {
    if (stopMessages) stopMessages();
    stopMessages = null;
    openChatId = null;
    currentMessages = [];
    messagesLoaded = false;
    activeBox.hidden = true;
    placeholder.hidden = false;
}

function fillHeader(chat) {
    const person = otherPerson(chat);
    userAvatar.textContent = firstLetter(person.name);
    userName.textContent = person.name;
    userRole.textContent = person.role;
    itemTitle.textContent = chat.listingTitle;
    itemPrice.textContent = formatPrice(chat);
    itemImg.hidden = !chat.listingImageUrl;    // no photo -> hide the <img>
    if (chat.listingImageUrl) itemImg.src = chat.listingImageUrl;
    // TODO: ask Sara which URL item-detail.html expects. "?id=" is a guess.
    itemLink.href = "item-detail.html?id=" + encodeURIComponent(chat.listingId);
}

// ---------- 8. Message bubbles ----------
function renderMessages() {
    const chat = findChat(openChatId);
    if (!chat || !messagesLoaded) return;

    // When did the OTHER person last open this chat? (for ✓✓)
    const otherReadAt = chat.lastReadAt ? chat.lastReadAt[otherPerson(chat).uid] : null;
    messagesEl.replaceChildren();

    if (currentMessages.length === 0) {
        messagesEl.appendChild(el("p", "chat-empty", "No messages yet. Say hi 👋"));
        return;
    }

    currentMessages.forEach((msg) => {
        const mine = msg.senderId === me.uid;

        const bubble = el("div", "chat-bubble " + (mine ? "is-mine" : "is-theirs"));
        const text = el("p", "chat-bubble-text", msg.text);
        let timeText = formatBubbleTime(msg.createdAt);

        // ✓ = sent, ✓✓ = the other person opened the chat after this message
        if (mine) {
            const isRead = otherReadAt && msg.createdAt &&
                otherReadAt.toMillis() >= msg.createdAt.toMillis();
            timeText += isRead ? " ✓✓" : " ✓";
        }

        bubble.append(text, el("span", "chat-bubble-time", timeText));
        messagesEl.appendChild(bubble);
    });

    messagesEl.scrollTop = messagesEl.scrollHeight;    // jump to the newest message
}

// ---------- 9. Sending ----------
// The input is inside a <form>, so pressing Enter also fires "submit".
form.addEventListener("submit", async (event) => {
    event.preventDefault();                    // stop the browser from reloading the page

    const text = input.value.trim();
    const chat = findChat(openChatId);
    if (!text || !chat) return;                // ignore empty messages

    input.value = "";                          // clear right away so it feels fast
    try {
        await sendMessage(chat, me.uid, text);
        // No drawing here! The listeners see the new data and redraw by themselves.
    } catch (err) {
        console.error(err);
        input.value = text;                    // give the text back so it isn't lost
        showStatus("Message not sent. Please try again.");
    }
});

// ---------- 10. "Contact Seller" ----------
async function handleContactSeller() {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("listingId");
    if (!listingId) return;                    // normal visit, nothing to do

    // Remove ?listingId from the address bar, so refreshing doesn't repeat this.
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

        pendingChatId = await getOrCreateChat(listing, me);

        // If the chat is already in the list, open it now.
        // If not (brand-new chat), the listener in step 6 opens it when it arrives.
        if (findChat(pendingChatId)) {
            openChat(pendingChatId);
            pendingChatId = null;
        }
    } catch (err) {
        console.error(err);
        showStatus("Could not start the chat. Please try again.");
    }
}

// ---------- 11. Start: wait for the login ----------
onUserChanged((user) => {
    if (!user) {
        // Logged out: stop everything and ask to log in
        if (stopChats) stopChats();
        stopChats = null;
        closeChat();
        layout.hidden = true;
        showStatus("Please log in to see your messages.");
        return;
    }

    me = user;
    layout.hidden = false;
    showStatus("");
    startWatchingChats();      // Buying tab first
    handleContactSeller();     // if the URL has ?listingId=...
});

