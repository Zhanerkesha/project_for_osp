// Ewha Market - my-listings.html
// Owner: Zhanerke
// Shows the current user's listings with Edit / Mark completed / Relist / Delete.
// Data comes from EwhaListings.store (listings-data.js), which reads/writes Firestore.

(function () {
    'use strict';

    const { store } = window.EwhaListings;
    const t = window.EwhaI18n.t;

    const grid = document.getElementById('myListingsGrid');
    const emptyState = document.getElementById('myListingsEmpty');
    const loading = document.getElementById('myListingsLoading');
    const statusFilter = document.getElementById('statusFilter');
    const tabs = document.querySelectorAll('.mylist-tab');
    const template = document.getElementById('listingCardTemplate');
    const pageMessage = document.getElementById('myListingsMessage');
    const deleteDialog = document.getElementById('deleteDialog');
    const deleteDialogText = document.getElementById('deleteDialogText');

    let listings = [];
    let currentType = 'all';
    let pendingDeleteId = null;

    // ---------- formatting ----------

    function formatPrice(listing) {
        if (listing.isFree || listing.priceUnit === 'free') return t('price.free');
        const amount = '₩' + Number(listing.price || 0).toLocaleString('ko-KR');
        const suffix = {
            per_day: t('price.perDay'),
            per_week: t('price.perWeek'),
            per_hour: t('price.perHour')
        }[listing.priceUnit];
        if (suffix) return amount + ' ' + suffix;
        if (listing.listingType === 'service' && listing.priceUnit === 'once') return amount + ' ' + t('price.perSession');
        return amount;
    }

    function timeAgo(timestamp) {
        const diff = Math.max(0, Date.now() - Number(timestamp || 0));
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return t('time.justNow');
        if (minutes < 60) return t('time.minutes', { n: minutes });
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return t('time.hours', { n: hours });
        const days = Math.floor(hours / 24);
        if (days < 7) return t('time.days', { n: days });
        return t('time.weeks', { n: Math.floor(days / 7) });
    }

    function badgeFor(listing) {
        // Uses the shared badge classes from style.css.
        if (listing.listingType === 'rent') return { cls: 'badge-rent', label: t('badge.rent') };
        if (listing.listingType === 'service') return { cls: 'badge-service', label: t('badge.service') };
        if (listing.category === 'study_notes') return { cls: 'badge-notes', label: t('badge.notes') };
        return { cls: 'badge-buy', label: t('badge.buy') };
    }

    // ---------- rendering ----------

    function makeButton(className, text, action, id, ariaLabel) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = className;
        btn.textContent = text;
        btn.dataset.action = action;
        btn.dataset.id = id;
        if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
        return btn;
    }

    function renderCard(listing) {
        const card = template.content.firstElementChild.cloneNode(true);
        const completed = listing.status === 'completed';
        const badge = badgeFor(listing);

        card.dataset.id = listing.listingId;
        card.classList.toggle('is-completed', completed);

        const badgeEl = card.querySelector('.item-badge');
        badgeEl.classList.add(badge.cls);
        badgeEl.textContent = badge.label;

        const img = card.querySelector('img');
        img.src = listing.imageUrl || 'images/ewha.jpg';
        img.alt = listing.title;

        card.querySelector('.item-price').textContent = formatPrice(listing);
        card.querySelector('.item-title').textContent = listing.title; // textContent = safe from HTML injection

        const status = card.querySelector('.mylist-status');
        status.textContent = completed ? t('mylist.done.' + listing.listingType) : t('mylist.status.active');
        status.classList.toggle('is-completed', completed);
        card.querySelector('.mylist-time').textContent = timeAgo(listing.createdAt);

        const actions = card.querySelector('.mylist-card-actions');
        if (completed) {
            actions.appendChild(makeButton('btn-outline-ewha', t('mylist.action.relist'), 'relist', listing.listingId));
        } else {
            const edit = document.createElement('a');
            edit.className = 'btn-outline-ewha';
            edit.href = 'add-item.html?id=' + encodeURIComponent(listing.listingId);
            edit.textContent = t('mylist.action.edit');
            actions.appendChild(edit);
            actions.appendChild(makeButton('btn-outline-ewha', t('mylist.action.complete.' + listing.listingType), 'complete', listing.listingId));
        }
        actions.appendChild(makeButton('btn-outline-ewha mylist-delete', '🗑️', 'delete', listing.listingId, t('mylist.action.delete')));

        return card;
    }

    function matchesFilters(listing) {
        const status = statusFilter.value;
        const typeOk = currentType === 'all' || listing.listingType === currentType;
        const statusOk = status === 'all' || listing.status === status;
        return typeOk && statusOk;
    }

    function render() {
        const status = statusFilter.value;
        const counts = { all: 0, buy: 0, rent: 0, service: 0 };
        listings.forEach(function (l) {
            if (status !== 'all' && l.status !== status) return;
            counts.all += 1;
            counts[l.listingType] += 1;
        });
        Object.keys(counts).forEach(function (key) {
            const el = document.querySelector('[data-count="' + key + '"]');
            if (el) el.textContent = '(' + counts[key] + ')';
        });

        const visible = listings.filter(matchesFilters);
        grid.replaceChildren.apply(grid, visible.map(renderCard));
        grid.hidden = visible.length === 0;
        emptyState.hidden = visible.length > 0;
    }

    async function reload() {
        try {
            listings = await store.getMyListings();
            loading.hidden = true;
            render();
        } catch (error) {
            // Network / Firestore problem: say so instead of showing "Loading…" forever.
            console.error('[my-listings] load failed', error);
            loading.textContent = t('msg.loadFailed');
        }
    }

    function showPageMessage(key) {
        pageMessage.textContent = t(key);
        pageMessage.hidden = false;
        clearTimeout(showPageMessage.timer);
        showPageMessage.timer = setTimeout(function () { pageMessage.hidden = true; }, 4000);
    }

    // ---------- actions ----------

    function askDelete(id) {
        const listing = listings.find(function (l) { return l.listingId === id; });
        if (!listing) return;
        pendingDeleteId = id;
        deleteDialogText.textContent = t('mylist.delete.text', { title: listing.title });
        deleteDialog.showModal();
    }

    async function handleGridClick(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const id = button.dataset.id;
        const action = button.dataset.action;

        try {
            if (action === 'complete') {
                await store.updateListing(id, { status: 'completed' });
                await reload();
            } else if (action === 'relist') {
                await store.updateListing(id, { status: 'active' });
                await reload();
            } else if (action === 'delete') {
                askDelete(id);
            }
        } catch (error) {
            console.error('[my-listings] action failed', error);
            showPageMessage('msg.saveFailed');
        }
    }

    deleteDialog.addEventListener('close', async function () {
        const id = pendingDeleteId;
        pendingDeleteId = null;
        if (deleteDialog.returnValue !== 'confirm' || !id) return;
        try {
            await store.deleteListing(id);
            await reload();
            showPageMessage('msg.deleted');
        } catch (error) {
            console.error('[my-listings] delete failed', error);
            showPageMessage('msg.saveFailed');
        }
    });

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (other) {
                other.classList.toggle('active', other === tab);
                other.setAttribute('aria-pressed', other === tab ? 'true' : 'false');
            });
            currentType = tab.dataset.filter;
            render();
        });
    });

    statusFilter.addEventListener('change', render);
    grid.addEventListener('click', handleGridClick);
    document.addEventListener('ewha:langchange', render);

    // Message after coming back from add-item.html (?msg=created / ?msg=updated)
    const msg = new URLSearchParams(window.location.search).get('msg');
    if (msg === 'created' || msg === 'updated') {
        showPageMessage('msg.' + msg);
        history.replaceState(null, '', 'my-listings.html');
    }

    reload();
})();
