// Ewha Market - shared data layer for add-item.html and my-listings.html
// Owner: Zhanerke
//
// Both pages read and write listings ONLY through window.EwhaListings.store,
// so the pages never talk to Firebase directly. This file connects to:
//   - Firestore      -> the shared "listings" collection
//                       (schema: Notion > "3. Tech Stack & Team Rules")
//   - Cloudinary     -> listing photos (Firestore keeps only the photo URL)
//   - Firebase Auth  -> who is posting (ownerId / ownerNickname)
//
// This file is an ES module (it uses `import`), so the HTML must load it with
// <script type="module">. Page scripts that use window.EwhaListings must also be
// modules and come AFTER this one: modules run in order, after the page loads.

import { auth, db } from './firebase-config.js';
import { uploadImage } from './cloudinary.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
    collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
    query, where, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// ---------- Shared constants (the whole team uses these values) ----------
// "value" is what gets saved in Firestore. Labels are translation keys (listings-i18n.js).
const CATEGORIES = {
    buy: ['textbooks', 'study_notes', 'electronics', 'clothing', 'dorm_essentials', 'stationery', 'other'],
    rent: ['calculators', 'textbooks', 'cameras', 'study_equipment', 'other'],
    service: ['language_exchange', 'tutoring', 'study_partner', 'skill_sharing']
};

const PRICE_UNITS = {
    buy: ['once'],
    rent: ['per_day', 'per_week'],
    service: ['per_hour', 'once']
};

// Categories that show course name / code / subject fields.
const COURSE_CATEGORIES = ['study_notes', 'textbooks', 'tutoring'];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

// ---------- Firestore settings ----------
const LISTINGS = 'listings';

// Fields a page is never allowed to set or overwrite. The data layer fills them itself.
const PROTECTED_FIELDS = ['listingId', 'ownerId', 'ownerNickname', 'createdAt'];

// ---------- Login ----------
// TEMPORARY: login.html is not connected to Firebase Auth yet (Safiyya, Nov 26).
// While ALLOW_TEST_USER is true and nobody is logged in, everyone posts as this
// shared test account so the form can be tested end to end.
// >>> Set ALLOW_TEST_USER to false as soon as Firebase login is merged into main. <<<
const ALLOW_TEST_USER = false;
const TEST_USER = { uid: 'test-user', nickname: 'Test User', isVerified: true };

// Firebase needs a moment after page load to restore a logged-in session.
// This promise resolves once, when Firebase knows whether someone is logged in.
const authReady = new Promise(function (resolve) {
    const stop = onAuthStateChanged(auth, function (user) {
        stop();
        resolve(user);
    });
});

// Returns { uid, nickname, isVerified } or null when nobody is logged in.
async function getCurrentUser() {
    await authReady;
    const user = auth.currentUser;

    if (!user) {
        return ALLOW_TEST_USER ? Object.assign({}, TEST_USER) : null;
    }

    // Nickname comes from the users collection (created at registration);
    // fall back to the part of the email before "@".
    let nickname = user.displayName || (user.email || '').split('@')[0];
    try {
        const profile = await getDoc(doc(db, 'users', user.uid));
        if (profile.exists() && profile.data().nickname) nickname = profile.data().nickname;
    } catch (error) {
        console.warn('[listings-data] could not read user profile', error);
    }

    return { uid: user.uid, nickname: nickname, isVerified: user.emailVerified };
}

// Every write (create / edit / delete / status change) needs a logged-in user
// whose Ewha email is verified (MVP rule FR-01: posting is for verified users only).
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) throw new Error('not_logged_in');
    if (!user.isVerified) throw new Error('not_verified');
    return user;
}

// ---------- Helpers ----------

// Firestore document -> plain object the pages understand.
// createdAt becomes milliseconds (a number), like Date.now().
function fromDoc(snapshot) {
    const data = snapshot.data({ serverTimestamps: 'estimate' });
    const created = data.createdAt;
    const createdAt = (created && typeof created.toMillis === 'function') ? created.toMillis()
        : (typeof created === 'number' ? created : 0);
    return Object.assign({}, data, { listingId: snapshot.id, createdAt: createdAt });
}

// Removes protected fields and undefined values (Firestore rejects undefined).
function cleanInput(data) {
    const result = {};
    Object.keys(data || {}).forEach(function (key) {
        if (PROTECTED_FIELDS.includes(key) || data[key] === undefined) return;
        result[key] = data[key];
    });
    return result;
}

// Loads a listing and checks that the current user owns it (edit / delete / status).
async function getOwnedListingRef(id, user) {
    const ref = doc(db, LISTINGS, id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) throw new Error('not_found');
    if (snapshot.data().ownerId !== user.uid) throw new Error('not_owner');
    return { ref: ref, listing: fromDoc(snapshot) };
}

// Phone photos can be 5-10 MB. Shrink to max 1600 px as JPEG before uploading:
// faster uploads and faster pages. If anything goes wrong, upload the original.
const MAX_PHOTO_SIDE = 1600;

function shrinkPhoto(file) {
    return new Promise(function (resolve) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function () {
            URL.revokeObjectURL(url);
            const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(img.width, img.height));
            if (scale === 1 && file.type === 'image/jpeg') return resolve(file); // already small
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff'; // transparent PNG areas become white, not black
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function (blob) {
                resolve(blob ? new File([blob], 'listing.jpg', { type: 'image/jpeg' }) : file);
            }, 'image/jpeg', 0.85);
        };
        img.onerror = function () {
            URL.revokeObjectURL(url);
            resolve(file);
        };
        img.src = url;
    });
}

// ---------- Store (Firestore) ----------
const store = {
    // All listings owned by the current user, newest first.
    // Sorted here (not with orderBy) so Firestore needs no extra composite index.
    getMyListings: async function () {
        const user = await getCurrentUser();
        if (!user) return [];
        const snap = await getDocs(query(collection(db, LISTINGS), where('ownerId', '==', user.uid)));
        return snap.docs.map(fromDoc).sort(function (a, b) { return b.createdAt - a.createdAt; });
    },

    // One listing by id, or null if it does not exist.
    getListing: async function (id) {
        if (!id) return null;
        const snapshot = await getDoc(doc(db, LISTINGS, id));
        return snapshot.exists() ? fromDoc(snapshot) : null;
    },

    // Saves a new listing. One write: the id is created first so it can be stored
    // inside the document as listingId (team schema).
    createListing: async function (data) {
        const user = await requireUser();
        const ref = doc(collection(db, LISTINGS));
        const listing = Object.assign(cleanInput(data), {
            listingId: ref.id,
            ownerId: user.uid,
            ownerNickname: user.nickname,
            status: 'active',
            createdAt: serverTimestamp()
        });
        await setDoc(ref, listing);
        return Object.assign({}, listing, { createdAt: Date.now() });
    },

    // Changes some fields of the user's own listing (edit form, mark sold / relist).
    updateListing: async function (id, changes) {
        const user = await requireUser();
        const owned = await getOwnedListingRef(id, user);
        const safeChanges = cleanInput(changes);
        await updateDoc(owned.ref, safeChanges);
        return Object.assign({}, owned.listing, safeChanges);
    },

    // Deletes the user's own listing.
    // Note: the photo stays on Cloudinary (unsigned uploads cannot be deleted from the browser).
    deleteListing: async function (id) {
        const user = await requireUser();
        const owned = await getOwnedListingRef(id, user);
        await deleteDoc(owned.ref);
    },

    // Uploads a photo to Cloudinary and returns its https URL ('' when there is no file).
    uploadPhoto: async function (file) {
        if (!file) return '';
        return uploadImage(await shrinkPhoto(file));
    }
};

window.EwhaListings = {
    CATEGORIES: CATEGORIES,
    PRICE_UNITS: PRICE_UNITS,
    COURSE_CATEGORIES: COURSE_CATEGORIES,
    CONDITIONS: CONDITIONS,
    store: store,
    getCurrentUser: getCurrentUser
};
