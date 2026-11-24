// Ewha Market - login state in the top bar + "login required" guard (ES module)
//
// Use on any page that has the top bar (.topbar-actions with .login-pill):
//   <link rel="stylesheet" href="auth-ui.css">
//   <script src="listings-i18n.js"></script>
//   <script type="module" src="auth-ui.js"></script>
//
// For pages that need a logged-in student (add-item, my-listings, messages, profile) add to <body>:
//   <body data-requires-auth>
// Visitors are sent to login.html?next=<this page> and come back after logging in.

import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const loginPill = document.querySelector(".login-pill");
const actions = document.querySelector(".topbar-actions");
let chip = null;
let logoutButton = null;

function currentPage() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  return file + window.location.search;
}

function label(key, fallback) {
  return window.EwhaI18n ? window.EwhaI18n.t(key) : fallback;
}

onAuthStateChanged(auth, (user) => {
  // Only students with a verified email count as logged in
  const loggedIn = Boolean(user && user.emailVerified);

  if (document.body.hasAttribute("data-requires-auth") && !loggedIn) {
    window.location.replace(
      "login.html?next=" + encodeURIComponent(currentPage()),
    );
    return;
  }

  if (!loginPill || !actions) return;

  if (!loggedIn) {
    loginPill.hidden = false;
    if (chip) chip.remove();
    if (logoutButton) logoutButton.remove();
    chip = null;
    logoutButton = null;
    return;
  }

  loginPill.hidden = true;

  if (!chip) {
    chip = document.createElement("a");
    chip.className = "user-chip";
    chip.href = "profile.html";
    actions.appendChild(chip);

    logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "logout-btn";
    logoutButton.setAttribute("data-i18n", "nav.logout");
    logoutButton.textContent = label("nav.logout", "Log out");
    logoutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } finally {
        window.location.href = "index.html";
      }
    });
    actions.appendChild(logoutButton);
  }

  chip.textContent = "👤 " + (user.displayName || user.email.split("@")[0]);
  chip.title = user.email;
});
