// Ewha Market - Messages page logic (messages.html)
// Owner: Zhansaya
//
// This file only handles the page: the list, the bubbles, clicks and typing.
// Everything about the database and login is in messages-data.js.
// All words come from messages-i18n.js (EN / KO) through t("key").
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
const backButton = document.getElementById("chatBack");
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

// "Add by email"
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

// The status box and the add-form message remember their KEY (not the text),
// so they can be re-translated when the language changes.
let statusKey = "";
let addMessageKey = "";
let addMessageType = "info";

// Messages typed on this page: { conversationId: [ {mine, text, time}, ... ] }
// Only in memory -> they disappear after a refresh (sample chat).
const typedMessages = {};

// The sample bubbles use times relative to when the page was opened.
const PAGE_OPENED_AT = Date.now();

// ---------- 3. Helpers ----------
// Translation: t("chat.send") -> "Send" or "보내기"
function t(key, params) {
    return window.EwhaI18n ? window.EwhaI18n.t(key, params) : key;
}

// Date/time format follows the language: "3:38 PM" (en-US) or "오후 3:38" (ko-KR)
function locale() {
    const lang = window.EwhaI18n ? window.EwhaI18n.currentLang() : "en";
    return lang === "ko" ? "ko-KR" : "en-US";
}

function showStatus(key) {
    statusKey = key || "";
    statusBox.textContent = statusKey ? t(statusKey) : "";
    statusBox.hidden = !statusKey;
}

function findConversation(id) {
    return conversations.find((c) => c.id === id);
}

// In a listing chat: the person I'm talking to (not me).
// roleKey (not the word) -> translated when drawn.
function otherPerson(chat) {
    if (chat.buyerId === me.uid) {
        return { name: chat.sellerNickname, roleKey: "chat.role.seller" };
    }
    return { name: chat.buyerNickname, roleKey: "chat.role.buyer" };
}

function firstLetter(name) {
    return (name || "?").charAt(0).toUpperCase();
}

function formatPrice(chat) {
    if (chat.listingIsFree) return t("chat.free");
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
        return date.toLocaleTimeString(locale(), { hour: "numeric", minute: "2-digit" });
    }
    if (date.getTime() >= startOfToday - dayMs) return t("chat.yesterday");
    if (date.getTime() >= startOfToday - 6 * dayMs) {
        return date.toLocaleDateString(locale(), { weekday: "short" });
    }
    return (date.getMonth() + 1) + "/" + date.getDate();
}

function formatBubbleTime(time) {
    return toDate(time).toLocaleTimeString(locale(), { hour: "numeric", minute: "2-digit" });
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
        headerInfo: t(person.roleKey),
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

// Called whenever listingChats or contacts change (and when the language changes).
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
        showStatus("chat.status.loadChats");
    });
}

function startWatchingContacts() {
    if (stopContacts) stopContacts();
    stopContacts = watchMyContacts(me.uid, (list) => {
        contacts = list;
        rebuildConversations();
    }, (err) => {
        console.error(err);
        showStatus("chat.status.loadContacts");
    });
}

// ---------- 8. Tabs + search + back button ----------
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
    clearPending();
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
    messagesEl.appendChild(el("p", "chat-sample-note", t("chat.sampleNote")));

    allMessages(conversation).forEach((msg) => {
        const bubble = el("div", "chat-bubble " + (msg.mine ? "is-mine" : "is-theirs"));

        (msg.attachments || []).forEach((att) => bubble.appendChild(renderAttachment(att)));
        if (msg.text) bubble.appendChild(el("p", "chat-bubble-text", msg.text));
        bubble.appendChild(el("span", "chat-bubble-time", formatBubbleTime(msg.time)));

        messagesEl.appendChild(bubble);
    });

    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ---------- 10b. Attachments (sample: only in this browser tab) ----------
const fileInput = document.getElementById("chatFile");
const attachBtn = document.getElementById("chatAttach");
const attachPreview = document.getElementById("chatAttachPreview");

const MAX_FILES = 5;
const MAX_SIZE_MB = 20;
let pendingFiles = [];          // [{ kind, name, size, url }] picked but not sent yet

function fileKind(file) {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "file";
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Open the hidden file picker
attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    let error = "";

    for (const file of fileInput.files) {
        if (pendingFiles.length >= MAX_FILES) {
            if (pendingFiles.length >= MAX_FILES) {
                error = EwhaI18n.t("chat.attach.tooMany").replace("{max}", MAX_FILES);
                break;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                error = EwhaI18n.t("chat.attach.tooBig")
                    .replace("{name}", file.name)
                    .replace("{max}", MAX_SIZE_MB);
                continue;
            }
            break;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            error = file.name + " is larger than " + MAX_SIZE_MB + " MB.";
            continue;
        }
        pendingFiles.push({
            kind: fileKind(file),
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file)   // temporary local link to the file
        });
    }

    fileInput.value = "";        // so picking the same file again still fires "change"
    renderPending(error);
    input.focus();
});

// Small preview chips above the input
function renderPending(errorText = "") {
    attachPreview.replaceChildren();

    pendingFiles.forEach((att, index) => {
        const chip = el("div", "attach-chip");

        if (att.kind === "image") {
            const thumb = el("img", "attach-chip-thumb");
            thumb.src = att.url;
            thumb.alt = "";
            chip.appendChild(thumb);
        } else {
            chip.appendChild(el("span", "attach-chip-icon", att.kind === "video" ? "🎬" : "📄"));
        }

        chip.appendChild(el("span", "attach-chip-name", att.name));

        const remove = el("button", "attach-chip-remove", "✕");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove " + att.name);
        remove.addEventListener("click", () => {
            URL.revokeObjectURL(att.url);    // free the memory
            pendingFiles.splice(index, 1);
            renderPending();
        });
        chip.appendChild(remove);

        attachPreview.appendChild(chip);
    });

    if (errorText) attachPreview.appendChild(el("p", "attach-error", errorText));
    attachPreview.hidden = attachPreview.children.length === 0;
}

// Throw away picked files (e.g. when switching to another chat)
function clearPending() {
    pendingFiles.forEach((att) => URL.revokeObjectURL(att.url));
    pendingFiles = [];
    renderPending();
}

// One attachment inside a bubble
function renderAttachment(att) {
    if (att.kind === "image") {
        const link = el("a", "chat-bubble-media");
        link.href = att.url;
        link.target = "_blank";
        link.rel = "noopener";
        const img = el("img", "chat-bubble-img");
        img.src = att.url;
        img.alt = att.name;
        img.addEventListener("load", scrollToBottom);   // images load late -> re-scroll
        link.appendChild(img);
        return link;
    }

    if (att.kind === "video") {
        const video = el("video", "chat-bubble-video");
        video.src = att.url;
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;
        video.addEventListener("loadedmetadata", scrollToBottom);
        return video;
    }

    const link = el("a", "chat-bubble-file");
    link.href = att.url;
    link.download = att.name;          // clicking downloads it with its real name
    link.append(
        el("span", "chat-bubble-file-icon", "📄"),
        el("span", "chat-bubble-file-name", att.name),
        el("span", "chat-bubble-file-size", formatSize(att.size))
    );
    return link;
}

// Text for the chat list preview when a message has no text
function previewText(msg) {
    if (msg.text) return msg.text;
    const att = (msg.attachments || [])[0];
    if (!att) return "";
    return att.kind === "image" ? "📷 Photo" : att.kind === "video" ? "🎬 Video" : "📄 " + att.name;
}

// ---------- 11. Sending (sample: only on this page) ----------
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if ((!text && pendingFiles.length === 0) || !openId) return;

    if (!typedMessages[openId]) typedMessages[openId] = [];
    typedMessages[openId].push({
        mine: true,
        text: text,
        time: new Date(),
        attachments: pendingFiles        // links move into the message, so don't revoke them
    });

    pendingFiles = [];
    renderPending();
    input.value = "";
    renderMessages();
    renderChatList();
});

// ---------- 12. Add a person by email ----------
function showAddMessage(key, type) {
    addMessageKey = key || "";
    addMessageType = type || "info";
    addMessage.textContent = addMessageKey ? t(addMessageKey) : "";
    addMessage.className = "chat-add-message is-" + addMessageType;
    addMessage.hidden = !addMessageKey;
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
        showAddMessage("chat.add.self", "error");
        return;
    }

    addSubmit.disabled = true;
    showAddMessage("chat.add.searching", "info");

    try {
        const person = await findUserByEmail(email);
        if (!person) {
            showAddMessage("chat.add.notFound", "error");
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
        showAddMessage(err.code === "permission-denied" ? "chat.add.denied" : "chat.add.error", "error");
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
            showStatus("chat.status.noListing");
            return;
        }
        if (listing.ownerId === me.uid) {
            showStatus("chat.status.ownListing");
            return;
        }

        pendingOpenId = await getOrCreateChat(listing, me);
        if (findConversation(pendingOpenId)) {
            openChat(pendingOpenId);
            pendingOpenId = null;
        }
    } catch (err) {
        console.error(err);
        showStatus("chat.status.startError");
    }
}

// ---------- 14. Language changed (🌐 button) -> redraw everything made in JS ----------
// Static HTML (data-i18n) is translated by listings-i18n.js by itself.
document.addEventListener("ewha:langchange", () => {
    document.title = t("chat.pageTitle");
    showStatus(statusKey);                         // same message, new language
    showAddMessage(addMessageKey, addMessageType);
    if (me) {
        rebuildConversations();                    // list: roles, "Free", times, previews
        renderMessages();                          // bubbles: sample text, times
    }
});

// ---------- 15. Start: wait for the login ----------
onUserChanged((user) => {
    if (!user) {
        if (stopChats) stopChats();
        if (stopContacts) stopContacts();
        stopChats = null;
        stopContacts = null;
        closeChat();
        layout.hidden = true;
        showStatus("chat.status.login");
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