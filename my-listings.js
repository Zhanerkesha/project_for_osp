// Ewha Market - my-listings.html
// Owner: Zhanerke
// Stage 1 (Nov 22): filter sample cards by type/status, demo buttons.
// Stage 2 (Dec 3): load the logged-in user's listings from Firestore (ownerId == user.uid),
//                  and make Edit / Delete / Mark completed update Firestore.

(function () {
    'use strict';

    const grid = document.getElementById('myListingsGrid');
    const emptyState = document.getElementById('myListingsEmpty');
    const statusFilter = document.getElementById('statusFilter');
    const tabs = document.querySelectorAll('.mylist-tab');

    let currentType = 'all';

    function cards() {
        return Array.from(grid.querySelectorAll('.mylist-card'));
    }

    function updateCounts() {
        const status = statusFilter.value;
        const counts = { all: 0, buy: 0, rent: 0, service: 0 };
        cards().forEach(function (card) {
            if (status !== 'all' && card.dataset.status !== status) return;
            counts.all += 1;
            counts[card.dataset.type] += 1;
        });
        Object.keys(counts).forEach(function (key) {
            const el = document.querySelector('[data-count="' + key + '"]');
            if (el) el.textContent = '(' + counts[key] + ')';
        });
    }

    function applyFilters() {
        const status = statusFilter.value;
        let visible = 0;

        cards().forEach(function (card) {
            const typeOk = currentType === 'all' || card.dataset.type === currentType;
            const statusOk = status === 'all' || card.dataset.status === status;
            card.hidden = !(typeOk && statusOk);
            if (!card.hidden) visible += 1;
        });

        emptyState.hidden = visible > 0;
        grid.hidden = visible === 0;
        updateCounts();
    }

    function setStatus(card, status) {
        const label = card.querySelector('.mylist-status');
        card.dataset.status = status;
        card.classList.toggle('completed', status === 'completed');
        label.classList.toggle('completed', status === 'completed');
        label.textContent = status === 'completed' ? 'Completed' : 'Active';
        // TODO (Dec 3): update the "status" field of this listing in Firestore.
    }

    function handleCardClick(event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const card = button.closest('.mylist-card');
        const action = button.dataset.action;

        if (action === 'complete') {
            setStatus(card, 'completed');
        } else if (action === 'reactivate') {
            setStatus(card, 'active');
        } else if (action === 'delete') {
            // TODO (Dec 3): ask for confirmation in a small in-page dialog, then delete from Firestore.
            card.remove();
        }
        applyFilters();
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            currentType = tab.dataset.filter;
            applyFilters();
        });
    });

    statusFilter.addEventListener('change', applyFilters);
    grid.addEventListener('click', handleCardClick);

    applyFilters();
})();
