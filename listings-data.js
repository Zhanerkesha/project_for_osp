// Ewha Market - shared data layer for add-item.html and my-listings.html
// Owner: Zhanerke
//
// Why this file exists:
//   Both pages read/write listings through ONE object (EwhaListings.store).
//   Right now the store keeps demo data in the browser (localStorage) so Edit / Delete /
//   Mark as sold already work end-to-end for testing and the demo.
//   Nov 26 / Dec 3: replace the bodies of the store functions with Firestore calls
//   (same function names), and the pages keep working without changes.

(function () {
    'use strict';

    // ---------- Shared constants (proposal: the whole team uses these values) ----------
    // "value" is saved in Firestore. Labels are translation keys (see listings-i18n.js).
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

    // ---------- Demo data (removed when Firestore is connected) ----------
    const DEMO_OWNER = { ownerId: 'demo-user', ownerNickname: 'Zhanerke' };
    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;

    function demoListings() {
        const now = Date.now();
        return [
            {
                listingId: 'demo-1', listingType: 'buy', title: 'Calculus 9th Edition Textbook',
                description: 'Metric version, a few highlights in chapter 2-3. No missing pages.',
                category: 'textbooks', price: 12000, isFree: false, priceUnit: 'once', condition: 'Good',
                courseName: 'Calculus I', courseCode: '', subject: 'Mathematics', availability: '',
                location: 'ECC', imageUrl: 'images/Calculus_textbook.jpg', status: 'active', createdAt: now - 2 * HOUR
            },
            {
                listingId: 'demo-2', listingType: 'buy', title: 'Data Structures handwritten notes',
                description: 'My own handwritten summary of all lectures + practice problems. Original notes only.',
                category: 'study_notes', price: 7000, isFree: false, priceUnit: 'once', condition: 'Like New',
                courseName: 'Data Structures', courseCode: '36338', subject: 'Computer Science', availability: '',
                location: 'Engineering Building', imageUrl: 'images/cat-notes.jpg', status: 'active', createdAt: now - DAY
            },
            {
                listingId: 'demo-3', listingType: 'rent', title: 'Noise-cancelling headphones for exam week',
                description: 'Borrow for library study sessions. Please return with the case.',
                category: 'study_equipment', price: 2000, isFree: false, priceUnit: 'per_day', condition: 'Like New',
                courseName: '', courseCode: '', subject: '', availability: 'Available now',
                location: 'Main Library', imageUrl: 'images/cat-electronics.jpg', status: 'active', createdAt: now - 3 * DAY
            },
            {
                listingId: 'demo-4', listingType: 'service', title: 'Korean ↔ English language exchange',
                description: 'Native Korean speaker practice, I help with English writing. 1 hour per week.',
                category: 'language_exchange', price: 0, isFree: true, priceUnit: 'free', condition: '',
                courseName: '', courseCode: '', subject: '', availability: 'Mon / Wed afternoons',
                location: 'Student Union', imageUrl: 'images/cat-services.jpg', status: 'active', createdAt: now - 5 * DAY
            },
            {
                listingId: 'demo-5', listingType: 'buy', title: 'Python programming notebook',
                description: 'Hardcover notebook with my Python lecture notes.',
                category: 'study_notes', price: 5000, isFree: false, priceUnit: 'once', condition: 'Good',
                courseName: 'Intro to Programming', courseCode: '', subject: 'Computer Science', availability: '',
                location: 'ECC', imageUrl: 'images/notes.jpg', status: 'completed', createdAt: now - 14 * DAY
            }
        ].map(function (item) { return Object.assign({}, DEMO_OWNER, item); });
    }

    // ---------- Store (demo implementation) ----------
    const STORAGE_KEY = 'ewhaMarket.demoListings.v1';
    let memory = null; // fallback when localStorage is unavailable

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) { /* storage blocked: use memory */ }
        if (!memory) memory = demoListings();
        return memory;
    }

    function save(list) {
        memory = list;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
    }

    const store = {
        // TODO (Dec 3): query(collection(db, 'listings'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'))
        getMyListings: function () {
            return Promise.resolve(load().slice().sort(function (a, b) { return b.createdAt - a.createdAt; }));
        },

        // TODO (Dec 3): getDoc(doc(db, 'listings', id))
        getListing: function (id) {
            const found = load().find(function (l) { return l.listingId === id; });
            return Promise.resolve(found ? Object.assign({}, found) : null);
        },

        // TODO (Nov 26): addDoc(collection(db, 'listings'), {...data, ownerId, ownerNickname, createdAt: serverTimestamp()})
        createListing: function (data) {
            const list = load();
            const listing = Object.assign({}, DEMO_OWNER, data, {
                listingId: 'local-' + Date.now(),
                status: 'active',
                createdAt: Date.now()
            });
            list.push(listing);
            save(list);
            return Promise.resolve(listing);
        },

        // TODO (Dec 3): updateDoc(doc(db, 'listings', id), changes)
        updateListing: function (id, changes) {
            const list = load();
            const index = list.findIndex(function (l) { return l.listingId === id; });
            if (index === -1) return Promise.reject(new Error('not_found'));
            list[index] = Object.assign({}, list[index], changes, { listingId: id });
            save(list);
            return Promise.resolve(list[index]);
        },

        // TODO (Dec 3): deleteDoc(doc(db, 'listings', id)) (+ delete the photo from storage)
        deleteListing: function (id) {
            save(load().filter(function (l) { return l.listingId !== id; }));
            return Promise.resolve();
        },

        // TODO (Nov 26): upload to the image storage chosen in PR #7 (Cloudinary) and return its URL.
        // For now: shrink the photo to a small JPEG data URL so it survives a page reload in the demo.
        uploadPhoto: function (file) {
            if (!file) return Promise.resolve('');
            return new Promise(function (resolve, reject) {
                const url = URL.createObjectURL(file);
                const img = new Image();
                img.onload = function () {
                    const maxSide = 600;
                    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    URL.revokeObjectURL(url);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = function () {
                    URL.revokeObjectURL(url);
                    reject(new Error('image_load_failed'));
                };
                img.src = url;
            });
        },

        // Demo only: bring back the sample listings.
        resetDemo: function () {
            save(demoListings());
            return Promise.resolve();
        }
    };

    // ---------- Auth guard ----------
    // TODO (Nov 26): use Firebase Auth (Safiyya's login) -> resolve { uid, nickname, isVerified }.
    // Pages must block posting/editing when the user is not logged in or not verified.
    function getCurrentUser() {
        return Promise.resolve({ uid: DEMO_OWNER.ownerId, nickname: DEMO_OWNER.ownerNickname, isVerified: true });
    }

    window.EwhaListings = {
        CATEGORIES: CATEGORIES,
        PRICE_UNITS: PRICE_UNITS,
        COURSE_CATEGORIES: COURSE_CATEGORIES,
        CONDITIONS: CONDITIONS,
        store: store,
        getCurrentUser: getCurrentUser
    };
})();
