// Profile Page
// Owner: Sara

import { auth, db } from './firebase-config.js';
import './listings-data.js';

import {
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

import {
    doc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

(function () {
    'use strict';

    // ---------- HTML elements ----------

    const nicknameElement = document.getElementById('profileNickname');
    const emailElement = document.getElementById('profileEmail');
    const avatarElement = document.getElementById('profileAvatar');
    const verificationElement = document.getElementById('verificationBadge');
    const errorElement = document.getElementById('profileError');
    const listingsGrid = document.getElementById('activeListingsGrid');

    const store = window.EwhaListings.store;

    // ---------- Price formatting ----------

    function formatPrice(listing) {
        if (listing.isFree || listing.priceUnit === 'free') {
            return 'Free';
        }

        const amount = '₩' +
            Number(listing.price || 0).toLocaleString('ko-KR');

        const units = {
            per_day: '/ day',
            per_week: '/ week',
            per_hour: '/ hour'
        };

        if (units[listing.priceUnit]) {
            return amount + ' ' + units[listing.priceUnit];
        }

        if (
            listing.listingType === 'service' &&
            listing.priceUnit === 'once'
        ) {
            return amount + ' / session';
        }

        return amount;
    }

    // ---------- Display profile information ----------

    async function loadProfile(user) {
        let nickname = user.displayName ||
            (user.email ? user.email.split('@')[0] : 'Student');

        try {
            const userDoc = await getDoc(
                doc(db, 'users', user.uid)
            );

            if (userDoc.exists()) {
                const profileData = userDoc.data();

                if (profileData.nickname) {
                    nickname = profileData.nickname;
                }
            }

        } catch (error) {
            console.error('[profile] Could not load user profile:', error);
        }

        nicknameElement.textContent = nickname;
        emailElement.textContent = user.email || 'No email available';
        avatarElement.textContent = nickname.charAt(0).toUpperCase();

        if (user.emailVerified) {
            verificationElement.textContent = '✓ Verified student';
            verificationElement.classList.add('verified');
        } else {
            verificationElement.textContent = 'Email not verified';
            verificationElement.classList.remove('verified');
        }
    }

    // ---------- Display active listings ----------

    function createListingCard(listing) {
        const card = document.createElement('article');
        card.className = 'active-listing-card';

        // Listing image
        if (listing.imageUrl) {
            const image = document.createElement('img');

            image.className = 'listing-image';
            image.src = listing.imageUrl;
            image.alt = listing.title || 'Listing image';

            card.appendChild(image);
        } else {
            const placeholder = document.createElement('div');

            placeholder.className = 'listing-image listing-placeholder';
            placeholder.textContent = '📦';

            card.appendChild(placeholder);
        }

        // Listing information
        const info = document.createElement('div');
        info.className = 'listing-info';

        const title = document.createElement('h3');
        title.textContent = listing.title || 'Untitled listing';

        const meta = document.createElement('div');
        meta.className = 'listing-meta';

        const price = document.createElement('strong');
        price.textContent = formatPrice(listing);

        const status = document.createElement('span');
        status.className = 'listing-status';
        status.textContent = 'Active';

        meta.append(price, status);
        info.append(title, meta);

        // Edit button
        const editButton = document.createElement('a');

        editButton.href = 'my-listings.html';
        editButton.className = 'edit-listing-btn';
        editButton.textContent = 'Edit';

        card.append(info, editButton);

        return card;
    }

    async function loadActiveListings() {
        listingsGrid.replaceChildren();

        const loading = document.createElement('p');
        loading.textContent = 'Loading your listings...';
        listingsGrid.appendChild(loading);

        try {
            const listings = await store.getMyListings();

            const activeListings = listings
                .filter(listing => listing.status === 'active')
                .slice(0, 3);

            listingsGrid.replaceChildren();

            if (activeListings.length === 0) {
                const emptyMessage = document.createElement('p');

                emptyMessage.className = 'empty-listings-message';
                emptyMessage.textContent =
                    'You do not have any active listings yet.';

                listingsGrid.appendChild(emptyMessage);
                return;
            }

            activeListings.forEach(listing => {
                listingsGrid.appendChild(createListingCard(listing));
            });

        } catch (error) {
            console.error('[profile] Could not load listings:', error);

            listingsGrid.replaceChildren();

            const errorMessage = document.createElement('p');
            errorMessage.textContent =
                'Unable to load your listings. Please try again later.';

            listingsGrid.appendChild(errorMessage);
        }
    }

    // ---------- Authentication ----------

    onAuthStateChanged(auth, async (user) => {

        errorElement.hidden = true;

        if (!user) {
            nicknameElement.textContent = 'Guest';
            emailElement.textContent = 'Please log in to view your profile';

            avatarElement.textContent = '👤';

            verificationElement.textContent = 'Not logged in';
            verificationElement.classList.remove('verified');

            listingsGrid.replaceChildren();

            const message = document.createElement('p');
            message.textContent = 'Please log in to view your listings.';

            listingsGrid.appendChild(message);

            errorElement.hidden = false;
            errorElement.textContent =
                'You are currently not logged in.';

            return;
        }

        await loadProfile(user);
        await loadActiveListings();

    });

})();
