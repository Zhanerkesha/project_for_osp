// Ewha Market - Chat data layer
// Owner: Zhansaya
//
// Why this file exists:
//   messages.js (the page) never touches the database directly. It only calls the
//   functions exported here. If the database changes, only this file changes.
//
// Messages are a SAMPLE for now (shown only on the page, never saved).
// Firestore keeps only the list of conversations:
//
//   chats/{chatId}                      chat started from a listing ("Contact Seller")
//     listingId, listingTitle, listingPrice, listingIsFree, listingImageUrl
//     buyerId, buyerNickname, sellerId, sellerNickname
//     lastMessage, lastMessageAt
//
//   users/{myUid}/contacts/{theirUid}   person I added by email (only in MY list)
//     nickname, email, addedAt
//
//   emailLookup/{email}                 public "email -> user" entry for "Add by email"
//     uid, nickname                     (no private data; users/{uid} stays private)

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ---------- Chat ID ----------
// Same buyer + same listing  ->  always the same ID (no duplicate chats).
export function makeChatId(listingId, buyerId) {
    return listingId + "_" + buyerId;
}

// ---------- Current user ----------
// callback(user) runs when the page opens AND whenever the user logs in / out.
// user = { uid, nickname, email }  or  null when nobody is logged in.
export function onUserChanged(callback) {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser) {
            callback(null);
            return;
        }
        callback({
            uid: firebaseUser.uid,
            // register.js saves the nickname as displayName
            nickname: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: (firebaseUser.email || "").toLowerCase()
        });
    });
}

// ---------- Read one listing ----------
// Used for "Contact Seller" (messages.html?listingId=...). Returns null if not found.
export async function getListing(listingId) {
    const snap = await getDoc(doc(db, "listings", listingId));
    if (!snap.exists()) return null;
    return { listingId: snap.id, ...snap.data() };
}

// ---------- Get or create a listing chat ----------
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
        listingIsFree: !!listing.isFree,
        listingImageUrl: listing.imageUrl || "",
        buyerId: buyer.uid,
        buyerNickname: buyer.nickname,
        sellerId: listing.ownerId,
        sellerNickname: listing.ownerNickname || "Seller",
        lastMessage: "",
        lastMessageAt: serverTimestamp()
    });
    return chatId;
}

// ---------- Watch my listing chats (live) ----------
// role = "buyer" (Buying tab) or "seller" (Selling tab). Returns a "stop" function.
export function watchMyChats(uid, role, onChange, onError) {
    const field = role === "seller" ? "sellerId" : "buyerId";
    const q = query(
        collection(db, "chats"),
        where(field, "==", uid),
        orderBy("lastMessageAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((d) => ({
            chatId: d.id,
            ...d.data({ serverTimestamps: "estimate" })
        }));
        onChange(chats);
    }, onError);
}

// ---------- Put MY email in the lookup ----------
// Called every time I open the chat page, so other people can find me by email.
// (Register.js should also do this at sign-up - see the note for Safiyya.)
export async function saveMyLookup(user) {
    await setDoc(doc(db, "emailLookup", user.email), {
        uid: user.uid,
        nickname: user.nickname
    });
}

// ---------- Find a user by email ----------
// The email IS the document id, so this is one getDoc (no searching through users).
// Returns { uid, nickname, email } or null if nobody with this email is in the lookup.
export async function findUserByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    const snap = await getDoc(doc(db, "emailLookup", cleanEmail));
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
        uid: data.uid,
        nickname: data.nickname,
        email: cleanEmail
    };
}

// ---------- Add a person to MY chat list ----------
// Saved under my own user, so only I see it.
// Adding the same person again just moves them to the top (addedAt = now).
export async function addContact(myUid, person) {
    await setDoc(doc(db, "users", myUid, "contacts", person.uid), {
        nickname: person.nickname,
        email: person.email,
        addedAt: serverTimestamp()
    });
}

// ---------- Watch the people I added (live) ----------
export function watchMyContacts(myUid, onChange, onError) {
    const q = query(
        collection(db, "users", myUid, "contacts"),
        orderBy("addedAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const contacts = snapshot.docs.map((d) => ({
            uid: d.id,
            ...d.data({ serverTimestamps: "estimate" })
        }));
        onChange(contacts);
    }, onError);
}