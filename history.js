
// Recently Viewed Page
// Owner: Sara

import './listings-data.js';

(function () {
    'use strict';

    const store = window.EwhaListings.store;

    const HISTORY_KEY = 'ewhaRecentlyViewed';

    const historyGrid = document.getElementById('historyGrid');
    const historyCount = document.getElementById('historyCount');
    const historyEmpty = document.getElementById('historyEmpty');
    const historyError = document.getElementById('historyError');
    const clearButton = document.getElementById('clearHistoryBtn');

    // Read saved viewing history
    function getHistory() {
        try {
            const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

            if (!Array.isArray(saved)) return [];

            return saved.filter(function (entry) {
                return entry && typeof entry.id === 'string';
            });
        } catch (error) {
            console.error('Could not read viewing history:', error);
            return [];
        }
    }

    // Format listing price
    function formatPrice(listing) {
        if (listing.isFree || listing.priceUnit === 'free') {
            return 'Free';
        }

        const price = Number(listing.price || 0).toLocaleString('ko-KR');

        const unit = {
            per_day: '/ day',
            per_week: '/ week',
            per_hour: '/ hour',
            once: ''
        }[listing.priceUnit] || '';

        return '₩' + price + unit;
    }

    // Make listing type readable
    function formatType(type) {
        const types = {
            buy: 'Buy & Sell',
            rent: 'Rent & Borrow',
            service: 'Student Service'
        };

        return types[type] || 'Listing';
    }

    // Format when the listing was viewed
    function formatViewedDate(timestamp) {
        if (!timestamp) return 'Recently viewed';

        return 'Viewed ' + new Date(timestamp).toLocaleDateString();
    }

    // Create one listing card
    function createCard(listing, viewedAt) {
        const card = document.createElement('a');

        card.className = 'history-card';
        card.href = 'item-detail.html?id=' +
            encodeURIComponent(listing.listingId);

        // Image
        const imageContainer = document.createElement('div');
        imageContainer.className = 'history-card-image';

        if (listing.imageUrl) {
            const image = document.createElement('img');
            image.src = listing.imageUrl;
            image.alt = listing.title || 'Listing image';
            imageContainer.appendChild(image);
        } else {
            const placeholder = document.createElement('span');
            placeholder.className = 'history-card-placeholder';
            placeholder.textContent = '📦';
            imageContainer.appendChild(placeholder);
        }

        // Listing information
        const info = document.createElement('div');
        info.className = 'history-card-info';

        const type = document.createElement('span');
        type.className = 'history-card-type';
        type.textContent = formatType(listing.listingType);

        const title = document.createElement('h3');
        title.textContent = listing.title || 'Untitled listing';

        const price = document.createElement('div');
        price.className = 'history-card-price';
        price.textContent = formatPrice(listing);

        const meta = document.createElement('div');
        meta.className = 'history-card-meta';

        const seller = document.createElement('span');
        seller.textContent = listing.ownerNickname || 'Unknown seller';

        const date = document.createElement('span');
        date.textContent = formatViewedDate(viewedAt);

        meta.append(seller, date);
        info.append(type, title, price, meta);
        card.append(imageContainer, info);

        return card;
    }

    // Load and display viewing history
    async function loadHistory() {
        historyGrid.replaceChildren();
        historyError.hidden = true;

        const entries = getHistory();

        if (entries.length === 0) {
            showEmptyState();
            return;
        }

        try {
            // Retrieve each listing from Firestore
            const results = await Promise.all(
                entries.map(async function (entry) {
                    try {
                        const listing = await store.getListing(entry.id);

                        if (!listing) return null;

                        return {
                            listing: listing,
                            viewedAt: entry.viewedAt
                        };
                    } catch (error) {
                        console.error('Could not load listing:', entry.id, error);
                        return null;
                    }
                })
            );

            const validResults = results.filter(Boolean);

            // Remove listings that no longer exist
            const validEntries = validResults.map(function (result) {
                return {
                    id: result.listing.listingId,
                    viewedAt: result.viewedAt
                };
            });

            localStorage.setItem(HISTORY_KEY, JSON.stringify(validEntries));

            if (validResults.length === 0) {
                showEmptyState();
                return;
            }

            historyCount.textContent =
                validResults.length + (validResults.length === 1
                    ? ' listing viewed'
                    : ' listings viewed');

            clearButton.hidden = false;
            historyEmpty.hidden = true;

            validResults.forEach(function (result) {
                const card = createCard(
                    result.listing,
                    result.viewedAt
                );

                historyGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading history:', error);
            historyError.hidden = false;
            historyCount.textContent = 'Unable to load history';
        }
    }

    // Display empty state
    function showEmptyState() {
        historyGrid.replaceChildren();
        historyCount.textContent = 'No listings viewed yet';
        historyEmpty.hidden = false;
        clearButton.hidden = true;
    }

    // Clear all viewing history
    clearButton.addEventListener('click', function () {
        const confirmed = window.confirm(
            'Are you sure you want to clear your viewing history?'
        );

        if (!confirmed) return;

        localStorage.removeItem(HISTORY_KEY);
        loadHistory();
    });

    loadHistory();

})();
