// Ewha Market - Item Detail Page
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

        document.getElementById('itemTitle').textContent =
            listing.title || 'Untitled listing';

        document.getElementById('itemDescriptionShort').textContent =
            listing.category ? formatText(listing.category) : '';

        document.getElementById('itemPrice').textContent =
            formatPrice(listing);

        document.getElementById('itemCategory').textContent =
            formatText(listing.category);

        document.getElementById('itemType').textContent =
            formatText(listing.listingType);

        document.getElementById('itemCondition').textContent =
            listing.condition || 'Not specified';

        document.getElementById('itemFullDescription').textContent =
            listing.description || 'No description provided.';

        document.getElementById('itemSeller').textContent =
            listing.ownerNickname || 'Unknown seller';

        document.getElementById('itemLocation').textContent =
            listing.location || 'Not specified';

        document.getElementById('itemAvailability').textContent =
            listing.availability || 'Not specified';

        // Course information
        const courseRow = document.getElementById('courseRow');

        if (listing.courseName || listing.courseCode || listing.subject) {
            courseRow.hidden = false;

            document.getElementById('itemCourse').textContent = [
                listing.courseName,
                listing.courseCode,
                listing.subject
            ].filter(Boolean).join(' | ');
        } else {
            courseRow.hidden = true;
        }

        // Condition only applies to buy/rent listings
        document.getElementById('conditionRow').hidden =
            !(listing.listingType === 'buy' || listing.listingType === 'rent');

        // Availability only applies to rent/services
        document.getElementById('availabilityRow').hidden =
            listing.listingType === 'buy';

        // Status
        const status = listing.status || 'active';

        document.getElementById('itemStatus').textContent =
            formatText(status);

        document.getElementById('itemStatusDetail').textContent =
            formatText(status);

        // Product image
        const image = document.getElementById('itemImage');

        image.src = listing.imageUrl || 'images/ewha.jpg';
        image.alt = listing.title || 'Listing image';

        // Edit button links to existing edit form
        document.getElementById('editListingBtn').href =
            'add-item.html?id=' + encodeURIComponent(listing.listingId);

        // Update page title
        document.title = listing.title + ' - Ewha Market';

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