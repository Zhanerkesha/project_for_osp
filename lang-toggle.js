// Ewha Market - shared language toggle (EN <-> KO)
// Load AFTER listings-i18n.js (later: after the shared lang.js) on every page that has #langToggle.
(function () {
  "use strict";

  // 1. Restore the saved language before anything is translated
  try {
    var saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "ko") {
      document.documentElement.setAttribute("lang", saved);
    }
  } catch (e) {}

  function current() {
    if (window.EwhaI18n) return window.EwhaI18n.currentLang();
    return document.documentElement.getAttribute("lang") === "ko" ? "ko" : "en";
  }

  function updateLabel() {
    var btn = document.getElementById("langToggle");
    if (btn) btn.textContent = "🌐 " + current().toUpperCase() + " ▾";

    // English / 한국어 pills in the index right panel (if present)
    var pills = document.querySelectorAll(".lang-pills .pill");
    pills.forEach(function (pill, i) {
      pill.classList.toggle("active", (i === 1) === (current() === "ko"));
    });
  }

  function setLang(next) {
    document.documentElement.setAttribute("lang", next);
    try { localStorage.setItem("lang", next); } catch (err) {}
    updateLabel();
  }

  // 2. One handler for every page (event delegation)
  document.addEventListener("click", function (e) {
    if (e.target.closest("#langToggle")) {
      setLang(current() === "en" ? "ko" : "en");
      return;
    }
    var pill = e.target.closest(".lang-pills .pill");
    if (pill) {
      var pills = Array.prototype.slice.call(document.querySelectorAll(".lang-pills .pill"));
      setLang(pills.indexOf(pill) === 1 ? "ko" : "en");
    }
  });

  document.addEventListener("ewha:langchange", updateLabel);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateLabel);
  } else {
    updateLabel();
  }
})();
