// Ewha Market - add-item.html
// Owner: Zhanerke
// Stage 1 (Nov 22): show/hide fields depending on the listing type + basic validation.
// Stage 2 (Nov 26): save the listing to Firestore and upload the photo (see TODO in handleSubmit).

(function () {
    'use strict';

    // Category options per listing type.
    // "value" is what gets saved in Firestore (unified schema), "label" is what the user sees.
    const CATEGORIES = {
        buy: [
            { value: 'textbooks', label: '📚 Textbooks & reference books' },
            { value: 'study_notes', label: '📝 Student notes & study materials' },
            { value: 'electronics', label: '💻 Electronics & calculators' },
            { value: 'clothing', label: '👕 Clothing & accessories' },
            { value: 'dorm', label: '🛏️ Dorm & household essentials' },
            { value: 'stationery', label: '✏️ Stationery & school supplies' },
            { value: 'other', label: '📦 Other' }
        ],
        rent: [
            { value: 'calculators', label: '🧮 Calculators' },
            { value: 'textbooks', label: '📚 Textbooks (e.g. open-book exams)' },
            { value: 'cameras', label: '📷 Cameras & photography' },
            { value: 'study_equipment', label: '🎧 Study equipment' },
            { value: 'other', label: '📦 Other' }
        ],
        service: [
            { value: 'language_exchange', label: '🗣️ Language exchange' },
            { value: 'tutoring', label: '👩‍🏫 Peer tutoring' },
            { value: 'study_partner', label: '🤝 Study partner / mentoring' },
            { value: 'skill_sharing', label: '🎨 Skill sharing' }
        ]
    };

    // Price units per listing type ("once" for Buy is set automatically).
    const PRICE_UNITS = {
        rent: [
            { value: 'per_day', label: 'per day' },
            { value: 'per_week', label: 'per week' }
        ],
        service: [
            { value: 'per_hour', label: 'per hour' },
            { value: 'once', label: 'per session' }
        ]
    };

    // Categories that should show the course name / code / subject fields.
    const COURSE_CATEGORIES = ['study_notes', 'textbooks', 'tutoring'];

    const FREE_LABELS = {
        buy: 'This item is free (giveaway)',
        rent: 'Free to borrow',
        service: 'This service is free (e.g. language exchange)'
    };

    const MAX_PHOTO_MB = 5;

    const form = document.getElementById('addItemForm');
    const categorySelect = document.getElementById('category');
    const conditionSelect = document.getElementById('condition');
    const priceInput = document.getElementById('price');
    const priceUnitSelect = document.getElementById('priceUnit');
    const isFreeCheckbox = document.getElementById('isFree');
    const isFreeLabel = document.getElementById('isFreeLabel');
    const courseFields = document.getElementById('courseFields');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');

    function getListingType() {
        return form.querySelector('input[name="listingType"]:checked').value;
    }

    function fillSelect(select, options) {
        select.innerHTML = '';
        options.forEach(function (opt) {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
    }

    // Show only the fields that belong to the chosen listing type.
    function updateFieldsForType() {
        const type = getListingType();

        fillSelect(categorySelect, CATEGORIES[type]);

        if (PRICE_UNITS[type]) {
            fillSelect(priceUnitSelect, PRICE_UNITS[type]);
        }

        form.querySelectorAll('[data-show-for]').forEach(function (el) {
            const types = el.getAttribute('data-show-for').split(' ');
            el.hidden = !types.includes(type);
        });

        // Condition is required only for Buy & Rent
        conditionSelect.required = (type === 'buy' || type === 'rent');

        isFreeLabel.textContent = FREE_LABELS[type];
        updateCourseFields();
    }

    function updateCourseFields() {
        courseFields.hidden = !COURSE_CATEGORIES.includes(categorySelect.value);
    }

    function updatePriceForFree() {
        priceInput.disabled = isFreeCheckbox.checked;
        if (isFreeCheckbox.checked) {
            priceInput.value = 0;
        }
    }

    function showPhotoPreview() {
        photoPreview.innerHTML = '';
        const file = photoInput.files[0];
        if (!file) return;

        if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
            alertUser('Photo is larger than ' + MAX_PHOTO_MB + ' MB. Please choose a smaller file.');
            photoInput.value = '';
            return;
        }

        const img = document.createElement('img');
        img.alt = 'Selected photo preview';
        img.src = URL.createObjectURL(file);
        photoPreview.appendChild(img);
    }

    function alertUser(message) {
        // Simple inline message for now (no browser popups).
        let box = document.getElementById('formMessage');
        if (!box) {
            box = document.createElement('p');
            box.id = 'formMessage';
            box.className = 'text-muted';
            box.setAttribute('role', 'alert');
            box.style.marginBottom = '12px';
            form.querySelector('.additem-actions').before(box);
        }
        box.textContent = message;
    }

    // Collects the form into an object shaped like the Firestore "listings" document.
    function buildListing() {
        const type = getListingType();
        const isFree = isFreeCheckbox.checked;
        const value = function (id) {
            return document.getElementById(id).value.trim();
        };

        return {
            listingType: type,
            title: value('title'),
            description: value('description'),
            category: categorySelect.value,
            price: isFree ? 0 : Number(priceInput.value || 0),
            isFree: isFree,
            priceUnit: isFree ? 'free' : (type === 'buy' ? 'once' : priceUnitSelect.value),
            condition: (type === 'buy' || type === 'rent') ? conditionSelect.value : '',
            courseName: courseFields.hidden ? '' : value('courseName'),
            courseCode: courseFields.hidden ? '' : value('courseCode'),
            subject: courseFields.hidden ? '' : value('subject'),
            availability: type === 'buy' ? '' : value('availability'),
            location: value('location'),
            status: 'active'
            // imageUrl, ownerId, ownerNickname, createdAt -> added on Nov 26 with Firebase
        };
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!isFreeCheckbox.checked && priceInput.value === '') {
            alertUser('Please enter a price, or tick the "free" box.');
            priceInput.focus();
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const listing = buildListing();
        console.log('[add-item] listing ready to save:', listing);

        // TODO (Nov 26): upload photo -> get imageUrl, add ownerId / ownerNickname / createdAt,
        // save to Firestore "listings" collection, then redirect to my-listings.html.
        alertUser('✅ Form is valid. Saving to Firebase will be connected on Nov 26.');
    }

    // Event listeners
    form.querySelectorAll('input[name="listingType"]').forEach(function (radio) {
        radio.addEventListener('change', updateFieldsForType);
    });
    categorySelect.addEventListener('change', updateCourseFields);
    isFreeCheckbox.addEventListener('change', updatePriceForFree);
    photoInput.addEventListener('change', showPhotoPreview);
    form.addEventListener('submit', handleSubmit);

    // Initial state
    updateFieldsForType();
})();
