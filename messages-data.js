// Ewha Market - Chat data layer
// Owner: Zhansaya
//
// Why this file exists:
//   messages.js (the page) never touches the data directly. It only calls the
//   functions exported here. 
//
//   if the database changes, only this file changes.
//
// Data structure in Firestore:
//
//   chats/{chatId}                  one chat per (listing + buyer) pair
//     listingId, listingTitle, listingPrice, listingIsFree, listingImageUrl
//     buyerId, buyerNickname
//     sellerId, sellerNickname
//     lastMessage, lastSenderId, lastMessageAt
//     unread:     { <uid>: number }   how many messages each person hasn't read
//     lastReadAt: { <uid>: time }     when each person last opened the chat (for ✓✓)
//
//   chats/{chatId}/messages/{messageId}
//     senderId, text, createdAt

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    increment
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ---------- Chat ID ----------
// Same buyer + same listing  ->  always the same ID.
// So pressing "Contact Seller" twice opens the old chat instead of making a duplicate.
export function makeChatId(listingId, buyerId) {
    return listingId + "_" + buyerId;
}

// ---------- Current user ----------
// callback(user) runs when the page opens AND whenever the user logs in / out.
// user = { uid, nickname }  or  null when nobody is logged in.
// Returns a function that stops listening.
export function onUserChanged(callback) {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser) {
            callback(null);
            return;
        }
        callback({
            uid: firebaseUser.uid,
            // TODO: ask Safiyya where the nickname is saved at sign up
            // (displayName, or a "users" collection). For now: displayName,
            // or the part of the email before "@".
            nickname: firebaseUser.displayName || firebaseUser.email.split("@")[0]
        });
    });
}

// ---------- Read one listing ----------
// Used for "Contact Seller" (messages.html?listingId=...).
// Returns the listing with its id, or null if it doesn't exist.
export async function getListing(listingId) {
    const snap = await getDoc(doc(db, "listings", listingId));
    if (!snap.exists()) return null;
    return { listingId: snap.id, ...snap.data() };
}

// ---------- Get or create a chat ----------
// buyer = { uid, nickname }. Returns the chatId.
export async function getOrCreateChat(listing, buyer) {
    const chatId = makeChatId(listing.listingId, buyer.uid);
    const chatRef = doc(db, "chats", chatId);

    const snap = await getDoc(chatRef);
    if (snap.exists()) return chatId;               // already chatting -> reuse it

    await setDoc(chatRef, {
        listingId: listing.listingId,
        listingTitle: listing.title || "",
        listingPrice: listing.price || 0,
        listingIsFree: !!listing.isFree,            // !! turns anything into true / false
        listingImageUrl: listing.imageUrl || "",
        buyerId: buyer.uid,
        buyerNickname: buyer.nickname,
        sellerId: listing.ownerId,
        sellerNickname: listing.ownerNickname || "Seller",
        lastMessage: "",
        lastSenderId: "",
        lastMessageAt: serverTimestamp(),           // Google's clock, not the user's laptop
        unread: { [buyer.uid]: 0, [listing.ownerId]: 0 },
        lastReadAt: {}
    });
    return chatId;
}

// ---------- Watch my chats (live) ----------
// role = "buyer" (Buying tab) or "seller" (Selling tab).
// onChange(chats) runs now AND every time one of my chats changes.
// Returns a function that STOPS listening (call it before starting a new one).
export function watchMyChats(uid, role, onChange, onError) {
    const field = role === "seller" ? "sellerId" : "buyerId";

    const q = query(
        collection(db, "chats"),
        where(field, "==", uid),                    // only chats where I'm the buyer / seller
        orderBy("lastMessageAt", "desc")            // newest conversation on top
    );

    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((d) => ({
            chatId: d.id,
            // "estimate": a message I just sent has no server time yet (it's on its way).
            // Without this, the time would be null for a split second.
            ...d.data({ serverTimestamps: "estimate" })
        }));
        onChange(chats);
    }, onError);
}

export function watchMessages(chatId, onChange, onError) {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((d) => ({
            messageId: d.id,
            ...d.data({ serverTimestamps: "estimate" })
        }));
        onChange(messages);
    }, onError);
}

// ---------- Send a message ----------
// 1) add the message to the chat's "messages" subcollection
// 2) update the chat summary: preview, time, +1 unread for the OTHER person
export async function sendMessage(chat, senderId, text) {
    const otherId = senderId === chat.buyerId ? chat.sellerId : chat.buyerId;

    await addDoc(collection(db, "chats", chat.chatId, "messages"), {
        senderId: senderId,
        text: text,
        createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, "chats", chat.chatId), {
        lastMessage: text,
        lastSenderId: senderId,
        lastMessageAt: serverTimestamp(),
        // "unread.<uid>" changes only ONE key inside the unread map (dot = "inside").
        // increment(1) adds 1 ON THE SERVER, so two quick messages never overwrite each other.
        ["unread." + otherId]: increment(1)
    });
}

export async function markChatRead(chatId, uid) {
    await updateDoc(doc(db, "chats", chatId), {
        ["unread." + uid]: 0,
        ["lastReadAt." + uid]: serverTimestamp()
    });
}