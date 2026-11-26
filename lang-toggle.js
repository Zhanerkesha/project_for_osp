
// Shared language toggle for Ewha Market

(function () {
    'use strict';

    const button = document.getElementById('languageToggle');

    // Get the saved language, defaulting to English
    let language = localStorage.getItem('lang') || 'en';

    if (language !== 'en' && language !== 'ko') {
        language = 'en';
    }

    // Apply the selected language
    function applyLanguage(lang) {
        language = lang;

        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);

        updateButton();
    }

    // Update the button label
    function updateButton() {
        if (!button) return;

        button.textContent = language === 'en'
            ? '🌐 EN ▾'
            : '🌐 한국어 ▾';

        button.setAttribute(
            'aria-label',
            language === 'en' ? 'Change language' : '언어 변경'
        );
    }

    // Switch between English and Korean
    if (button) {
        button.addEventListener('click', function () {
            const newLanguage = language === 'en' ? 'ko' : 'en';
            applyLanguage(newLanguage);
        });
    }

    // Apply saved language when the page loads
    applyLanguage(language);

})();
