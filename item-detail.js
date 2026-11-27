
// Item Detail
// Owner: Sara

import './listings-data.js';

(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('id');

    const loading = document.getElementById('itemLoading');
    const error = document.getElementById('itemError');
    const details = document.getElementById('itemDetails');

    // Show an error message
    function showError(message) {
        if (loading) loading.hidden = true;
        if (details) details.hidden = true;

        if (error) {
            error.textContent = message;
            error.hidden = false;
        }

        console.error(message);
    }

    // Make category codes readable
    function formatText(value) {
        if (!value) return 'Not specified';

        return String(value)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    // Format the price
    function formatPrice(listing) {
        if (listing.isFree || listing.priceUnit === 'free') {
            return 'Free';
        }

        const price = Number(listing.price || 0).toLocaleString('ko-KR');

        const units = {
            per_day: '/ day',
            per_week: '/ week',
            per_hour: '/ hour',
            once: ''
        };

        return '₩' + price + (units[listing.priceUnit] || '');
    }

    // Display listing information
    function renderListing(listing) {
        const title = listing.title || 'Untitled listing';

        // Listing title
        document.getElementById('itemTitle').textContent = title;

        // Listing type badge
        const typeBadge = document.getElementById('itemTypeBadge');
        if (typeBadge) {
            typeBadge.textContent = '◇ ' + formatText(listing.listingType);
        }

        // Listing type in metadata
        const typeElement = document.getElementById('itemType');
        if (typeElement) {
            typeElement.textContent = formatText(listing.listingType);
        }

        // Price
        document.getElementById('itemPrice').textContent =
            formatPrice(listing);

        // Condition
        document.getElementById('itemCondition').textContent =
            '✦ ' + (listing.condition || 'Not specified');

        // Category
        document.getElementById('itemCategory').textContent =
            '▤ ' + formatText(listing.category);

        // Course information
        const courseElement = document.getElementById('itemCourse');

        if (courseElement) {
            const courseInfo = [
                listing.courseName,
                listing.courseCode,
                listing.subject
            ].filter(Boolean).join(' / ');

            courseElement.textContent = courseInfo || '';
        }

        // Location
        const locationElement = document.getElementById('itemLocation');

        if (locationElement) {
            locationElement.textContent =
                '⌖ ' + (listing.location || 'Location not specified');
        }

        // Description
        const descriptionElement =
            document.querySelector('#itemFullDescription p');

        if (descriptionElement) {
            descriptionElement.textContent =
                listing.description || 'No description provided.';
        }

        // Seller
        const sellerElement = document.getElementById('itemSeller');

        if (sellerElement) {
            sellerElement.textContent =
                listing.ownerNickname || 'Unknown seller';
        }

        // Contact Seller/Provider button
        const contactButton = document.getElementById('contactSellerBtn');

        if (contactButton) {
            contactButton.href =
                'messages.html?userId=' +
                encodeURIComponent(listing.ownerId) + '&listingId=' + encodeURIComponent(listing.listingId);
        }

        // Main image
        const image = document.getElementById('itemImage');

        if (image) {
            image.src = listing.imageUrl || 'images/ewha.jpg';
            image.alt = title;
        }

        // Update page title
        document.title = title + ' - Ewha Market';

        // Show the completed listing
        if (loading) loading.hidden = true;
        if (error) error.hidden = true;
        if (details) details.hidden = false;
    }

    // Load listing from the data store
    async function loadListing() {
        if (!listingId) {
            showError('No listing ID was provided. Please open this page by selecting a listing.');
            return;
        }

        // Check whether the listing store exists
        const store = window.EwhaListings?.store;

        if (!store || typeof store.getListing !== 'function') {
            showError('The listing data store could not be found. Check listings-data.js.');
            return;
        }

        try {
            const listing = await store.getListing(listingId);

            if (!listing) {
                showError('This listing could not be found.');
                return;
            }

            renderListing(listing);

        } catch (err) {
            console.error('Error loading listing:', err);
            showError('Could not load listing. Please check your database connection.');
        }
    }

    loadListing();

})();
