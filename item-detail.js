// Item Detail
// Owner: Sara
import './listings-data.js';

(function () {
    'use strict';

    const store = window.EwhaListings.store;

    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('id');

    const loading = document.getElementById('itemLoading');
    const error = document.getElementById('itemError');
    const details = document.getElementById('itemDetails');

    // Format the price
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

    // Make category codes readable
    function formatText(value) {
        if (!value) return 'Not specified';

        return value
            .replace(/_/g, ' ')
            .replace(/\b\w/g, function (letter) {
                return letter.toUpperCase();
            });
    }

    // Display listing information

    function renderListing(listing) {

        // Title
        document.getElementById('itemTitle').textContent =
            listing.title || 'Untitled listing';

        // Buy / Rent / Service
        document.getElementById('itemType').textContent =
            formatText(listing.listingType);

        // Price
        document.getElementById('itemPrice').textContent =
            formatPrice(listing);

        // Category
        document.getElementById('itemCategory').textContent =
            formatText(listing.category);

        // Condition
        document.getElementById('itemCondition').textContent =
            listing.condition || 'Not specified';

        // Description
        document.getElementById('itemFullDescription').textContent =
            listing.description || 'No description provided.';

        // Seller
        document.getElementById('itemSeller').textContent =
            listing.ownerNickname || 'Unknown seller';

        // Location
        document.getElementById('itemLocation').textContent =
            listing.location || 'Not specified';

        // Availability
        const availabilityElement =
            document.getElementById('itemAvailability');

        if (availabilityElement) {
            availabilityElement.textContent =
                listing.availability || 'Not specified';
        }

        // Course information
        const courseRow = document.getElementById('courseRow');
        const courseElement = document.getElementById('itemCourse');

        if (listing.courseName || listing.courseCode || listing.subject) {

            if (courseRow) courseRow.hidden = false;

            courseElement.textContent = [
                listing.courseName,
                listing.courseCode,
                listing.subject
            ].filter(Boolean).join(' | ');

        } else if (courseRow) {
            courseRow.hidden = true;
        }

        // Condition visibility
        const conditionRow = document.getElementById('conditionRow');

        if (conditionRow) {
            conditionRow.hidden =
                !(listing.listingType === 'buy' ||
                    listing.listingType === 'rent');
        }

        // Availability visibility
        const availabilityRow =
            document.getElementById('availabilityRow');

        if (availabilityRow) {
            availabilityRow.hidden =
                listing.listingType === 'buy';
        }

        // Status
        const status = listing.status || 'active';

        const statusElement = document.getElementById('itemStatus');

        if (statusElement) {
            statusElement.textContent = formatText(status);
        }

        // Main image
        const image = document.getElementById('itemImage');

        if (image) {
            image.src = listing.imageUrl || 'images/ewha.jpg';
            image.alt = listing.title || 'Listing image';
        }

        // Edit listing link
        const editButton = document.getElementById('editListingBtn');

        if (editButton) {
            editButton.href =
                'add-item.html?id=' +
                encodeURIComponent(listing.listingId);
        }

        // Page title
        document.title =
            (listing.title || 'Item Details') + ' - Ewha Market';

        // Display the listing
        loading.hidden = true;
        details.hidden = false;
    }


    // Load listing from Firestore
    async function loadListing() {

        if (!listingId) {
            loading.hidden = true;
            error.hidden = false;
            error.textContent = 'No listing ID was provided.';
            return;
        }

        try {
            const listing = await store.getListing(listingId);

            if (!listing) {
                loading.hidden = true;
                error.hidden = false;
                error.textContent = 'This listing could not be found.';
                return;
            }

            renderListing(listing);

        } catch (err) {
            console.error('Error loading listing:', err);

            loading.hidden = true;
            error.hidden = false;
            error.textContent = 'Could not load listing. Please try again.';
        }
    }

    loadListing();

})();