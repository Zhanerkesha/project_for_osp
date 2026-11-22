// Ewha Market - add-item.html (create + edit listing)
// Owner: Zhanerke
//
//   add-item.html           -> create a new listing
//   add-item.html?id=<id>   -> edit an existing listing (form is pre-filled)
//
// All reading/saving goes through EwhaListings.store (listings-data.js),
// so this file never talks to Firebase directly.

(function () {
    'use strict';

    const { CATEGORIES, PRICE_UNITS, COURSE_CATEGORIES, CONDITIONS, store, getCurrentUser } = window.EwhaListings;
    const t = window.EwhaI18n.t;

    const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
    const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png'];

    const form = document.getElementById('addItemForm');
    const message = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    const categorySelect = document.getElementById('category');
    const conditionSelect = document.getElementById('condition');
    const priceInput = document.getElementById('price');
    const priceUnitSelect = document.getElementById('priceUnit');
    const isFreeCheckbox = document.getElementById('isFree');
    const isFreeLabel = document.getElementById('isFreeLabel');
    const courseFields = document.getElementById('courseFields');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const photoRemove = document.getElementById('photoRemove');

    const editId = new URLSearchParams(window.location.search).get('id');
    let existingImageUrl = '';   // photo of the listing being edited
    let previewObjectUrl = null; // local preview URL (released when replaced)
    let saving = false;

    // ---------- helpers ----------

    function getListingType() {
        return form.querySelector('input[name="listingType"]:checked').value;
    }

    function setListingType(type) {
        const radio = form.querySelector('input[name="listingType"][value="' + type + '"]');
        if (radio) radio.checked = true;
    }

    // Rebuilds a <select>, keeping the current value if it is still allowed.
    function fillSelect(select, options) {
        const previous = select.value;
        select.innerHTML = '';
        options.forEach(function (opt) {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
        if (options.some(function (opt) { return opt.value === previous; })) {
            select.value = previous;
        }
    }

    function unitLabel(type, unit) {
        // "once" means "one-time" for Buy but "per session" for Services.
        return (type === 'service' && unit === 'once') ? t('unit.session') : t('unit.' + unit);
    }

    function showMessage(text, kind) {
        message.textContent = text;
        message.className = 'additem-message ' + (kind === 'success' ? 'is-success' : 'is-error');
        message.hidden = false;
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearMessage() {
        message.hidden = true;
        message.textContent = '';
    }

    function markInvalid(field, invalid) {
        field.classList.toggle('additem-invalid', invalid);
        field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }

    // ---------- show / hide fields per type ----------

    function renderTypeDependentFields() {
        const type = getListingType();

        fillSelect(categorySelect, CATEGORIES[type].map(function (value) {
            return { value: value, label: t('cat.' + value) };
        }));

        fillSelect(priceUnitSelect, PRICE_UNITS[type].map(function (value) {
            return { value: value, label: unitLabel(type, value) };
        }));

        fillSelect(conditionSelect, [{ value: '', label: t('field.condition.select') }].concat(
            CONDITIONS.map(function (value) { return { value: value, label: t('cond.' + value) }; })
        ));

        form.querySelectorAll('[data-show-for]').forEach(function (el) {
            el.hidden = !el.getAttribute('data-show-for').split(' ').includes(type);
        });

        conditionSelect.required = (type === 'buy' || type === 'rent');
        isFreeLabel.setAttribute('data-i18n', 'field.free.' + type);
        isFreeLabel.textContent = t('field.free.' + type);

        renderCourseFields();
    }

    function renderCourseFields() {
        courseFields.hidden = !COURSE_CATEGORIES.includes(categorySelect.value);
    }

    function renderFreeState() {
        priceInput.disabled = isFreeCheckbox.checked;
        priceUnitSelect.disabled = isFreeCheckbox.checked;
        if (isFreeCheckbox.checked) {
            priceInput.value = '';
            markInvalid(priceInput, false);
        }
    }

    // ---------- photo ----------

    function setPreview(src) {
        if (previewObjectUrl && previewObjectUrl !== src) {
            URL.revokeObjectURL(previewObjectUrl);
            previewObjectUrl = null;
        }
        photoPreviewImg.src = src || '';
        photoPreview.hidden = !src;
    }

    function handlePhotoChange() {
        const file = photoInput.files[0];
        if (!file) return;

        if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
            showMessage(t('msg.photoType'), 'error');
            photoInput.value = '';
            return;
        }
        if (file.size > MAX_PHOTO_BYTES) {
            showMessage(t('msg.photoTooBig'), 'error');
            photoInput.value = '';
            return;
        }

        clearMessage();
        const url = URL.createObjectURL(file);
        setPreview(url);
        previewObjectUrl = url;
    }

    function handlePhotoRemove() {
        photoInput.value = '';
        existingImageUrl = '';
        setPreview('');
    }

    // ---------- validation ----------

    function validate() {
        let firstInvalid = null;

        const checks = [
            { field: document.getElementById('title'), ok: document.getElementById('title').value.trim() !== '' },
            { field: categorySelect, ok: categorySelect.value !== '' },
            { field: conditionSelect, ok: !conditionSelect.required || conditionSelect.value !== '' },
            { field: document.getElementById('description'), ok: document.getElementById('description').value.trim() !== '' },
            {
                field: priceInput,
                ok: isFreeCheckbox.checked || (priceInput.value !== '' && Number(priceInput.value) >= 0 && Number.isInteger(Number(priceInput.value)))
            },
            { field: document.getElementById('policyAgree'), ok: document.getElementById('policyAgree').checked }
        ];

        checks.forEach(function (check) {
            const hiddenField = check.field.closest('[hidden]');
            const invalid = !check.ok && !hiddenField;
            markInvalid(check.field, invalid);
            if (invalid && !firstInvalid) firstInvalid = check.field;
        });

        if (firstInvalid) {
            showMessage(firstInvalid === priceInput ? t('msg.priceMissing') : t('msg.fixErrors'), 'error');
            firstInvalid.focus({ preventScroll: true });
            return false;
        }
        return true;
    }

    // ---------- build the Firestore-shaped object ----------

    function buildListing() {
        const type = getListingType();
        const isFree = isFreeCheckbox.checked;
        const value = function (id) { return document.getElementById(id).value.trim(); };
        const showsCourse = !courseFields.hidden;

        return {
            listingType: type,
            title: value('title'),
            description: value('description'),
            category: categorySelect.value,
            price: isFree ? 0 : Number(priceInput.value),
            isFree: isFree,
            priceUnit: isFree ? 'free' : (type === 'buy' ? 'once' : priceUnitSelect.value),
            condition: (type === 'buy' || type === 'rent') ? conditionSelect.value : '',
            courseName: showsCourse ? value('courseName') : '',
            courseCode: showsCourse ? value('courseCode') : '',
            subject: showsCourse ? value('subject') : '',
            availability: type === 'buy' ? '' : value('availability'),
            location: value('location')
        };
    }

    // ---------- submit ----------

    function setSaving(isSaving) {
        saving = isSaving;
        submitBtn.disabled = isSaving;
        submitBtn.textContent = isSaving ? t('btn.saving') : t(editId ? 'btn.save' : 'btn.post');
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (saving) return; // prevent double posts
        clearMessage();
        if (!validate()) return;

        setSaving(true);
        try {
            const user = await getCurrentUser();
            if (!user || !user.isVerified) {
                showMessage(t('msg.loginRequired'), 'error');
                return;
            }

            const listing = buildListing();
            const file = photoInput.files[0];
            listing.imageUrl = file ? await store.uploadPhoto(file) : existingImageUrl;

            if (editId) {
                await store.updateListing(editId, listing);
                window.location.href = 'my-listings.html?msg=updated';
            } else {
                await store.createListing(listing);
                window.location.href = 'my-listings.html?msg=created';
            }
        } catch (error) {
            console.error('[add-item] save failed', error);
            showMessage(t('msg.saveFailed'), 'error');
        } finally {
            setSaving(false);
        }
    }

    // ---------- edit mode ----------

    async function loadForEdit(id) {
        let listing = null;
        try {
            const results = await Promise.all([store.getListing(id), getCurrentUser()]);
            const user = results[1];
            // Only the owner may edit: someone else's listing is treated as "not found".
            if (results[0] && user && results[0].ownerId === user.uid) listing = results[0];
        } catch (error) {
            console.error('[add-item] could not load listing', error);
        }
        if (!listing) {
            showMessage(t('msg.notFound'), 'error');
            submitBtn.disabled = true;
            return;
        }

        setListingType(listing.listingType);
        renderTypeDependentFields();

        document.getElementById('title').value = listing.title || '';
        document.getElementById('description').value = listing.description || '';
        categorySelect.value = listing.category || '';
        conditionSelect.value = listing.condition || '';
        isFreeCheckbox.checked = !!listing.isFree;
        priceInput.value = listing.isFree ? '' : listing.price;
        if (!listing.isFree && listing.priceUnit) priceUnitSelect.value = listing.priceUnit;
        document.getElementById('availability').value = listing.availability || '';
        document.getElementById('location').value = listing.location || '';
        document.getElementById('courseName').value = listing.courseName || '';
        document.getElementById('courseCode').value = listing.courseCode || '';
        document.getElementById('subject').value = listing.subject || '';

        existingImageUrl = listing.imageUrl || '';
        setPreview(existingImageUrl);

        renderCourseFields();
        renderFreeState();
    }

    function applyPageMode() {
        const title = document.getElementById('pageTitle');
        const subtitle = document.getElementById('pageSubtitle');
        title.setAttribute('data-i18n', editId ? 'additem.titleEdit' : 'additem.title');
        subtitle.setAttribute('data-i18n', editId ? 'additem.subtitleEdit' : 'additem.subtitle');
        submitBtn.setAttribute('data-i18n', editId ? 'btn.save' : 'btn.post');
        document.title = (editId ? 'Edit Listing' : 'Post New Listing') + ' - Ewha Market';
        window.EwhaI18n.translate(document.querySelector('main'));
    }

    // ---------- events ----------

    form.querySelectorAll('input[name="listingType"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            renderTypeDependentFields();
            renderFreeState();
        });
    });
    categorySelect.addEventListener('change', renderCourseFields);
    isFreeCheckbox.addEventListener('change', renderFreeState);
    photoInput.addEventListener('change', handlePhotoChange);
    photoRemove.addEventListener('click', handlePhotoRemove);
    form.addEventListener('submit', handleSubmit);

    // Clear the red border as soon as the user fixes a field.
    form.addEventListener('input', function (e) { markInvalid(e.target, false); });
    form.addEventListener('change', function (e) { markInvalid(e.target, false); });

    // Language switched: rebuild the JS-generated option labels.
    document.addEventListener('ewha:langchange', function () {
        const keep = { category: categorySelect.value, condition: conditionSelect.value, unit: priceUnitSelect.value };
        renderTypeDependentFields();
        categorySelect.value = keep.category;
        conditionSelect.value = keep.condition;
        priceUnitSelect.value = keep.unit;
        renderCourseFields();
        renderFreeState();
        if (!saving) submitBtn.textContent = t(editId ? 'btn.save' : 'btn.post');
    });

    // ---------- start ----------

    applyPageMode();
    renderTypeDependentFields();
    renderFreeState();
    if (editId) loadForEdit(editId);
})();
