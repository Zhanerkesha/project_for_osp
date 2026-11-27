// Ewha Market - Favorites: like (heart) buttons + shared favorites data
// Owner: Safiyya
//
// Load on ANY page that shows like buttons (after the page's other scripts):
//   <script type="module" src="favorites.js"></script>
//
// What it does on every page:
//   - Makes these buttons save / unsave an item for the logged-in student:
//       .fav-btn            (heart on item cards)
//       .favorite-item-btn  ("Save to Favorites" on item-detail.html)
//       [data-fav-btn]      (any other button)
//   - Shows liked = ❤️ / not liked = 🤍 (also for cards drawn later by other scripts)
//   - Logged-out visitors are sent to login.html?next=<this page>
//   - A small message ("Saved to favorites" / "Removed" + Undo) appears after each click
//
// favorites-page.js (favorites.html only) imports the functions exported at the bottom.
//
// Firestore: users/{uid}/favorites/{itemId}
//   { itemId, title, price, priceValue, imageUrl, link, location, category,
//     condition, listingType, savedAt, fromListing? }
//   A copy of the card is saved, so favorites still show if the original changes.
//
// Item info comes from the button's data attributes when present:
//   data-fav-id, data-fav-title, data-fav-price, data-fav-image, data-fav-link,
//   data-fav-location, data-fav-category, data-fav-condition, data-fav-type
// otherwise from the surrounding .item-card (link ?id=, img, .item-price, .item-title, 📍 location).

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const BUTTONS = ".fav-btn, .favorite-item-btn, [data-fav-btn]";
// Only our own pages can be links (never "javascript:" or other sites)
const SAFE_LINK = /^[A-Za-z0-9_-]+\.html(\?[A-Za-z0-9_\-=&%.]*)?$/;

/* ---------- state ---------- */

const state = {
  authKnown: false, // false until Firebase says who is logged in
  user: null, // logged-in student with a verified email, or null
  listReady: false, // true after the first list arrives from Firestore
  error: false, // true if the list could not be loaded
  favorites: new Map(), // itemId -> saved data (newest first)
};

const subscribers = [];
let stopWatching = null;

function emit() {
  subscribers.forEach(function (fn) {
    fn(state);
  });
}

/* ---------- text (EN fallback for pages without listings-i18n.js) ---------- */

const FALLBACK_EN = {
  "fav.add": "Save to favorites",
  "fav.remove": "Remove from favorites",
  "fav.detail.add": "♡ Save to Favorites",
  "fav.detail.saved": "♥ Saved to Favorites",
  "fav.toast.saved": "Saved to favorites",
  "fav.toast.removed": "Removed from favorites",
  "fav.toast.undo": "Undo",
  "fav.toast.view": "View",
  "fav.saveError": "Could not update favorites. Please try again.",
};

export function t(key, params) {
  let text = window.EwhaI18n ? window.EwhaI18n.t(key, params) : key;
  if (text === key && FALLBACK_EN[key]) text = FALLBACK_EN[key];
  return text;
}

/* ---------- helpers ---------- */

function currentPage() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  return file + window.location.search;
}

export function goToLogin() {
  window.location.href = "login.html?next=" + encodeURIComponent(currentPage());
}

function textOf(root, selector) {
  const el = root ? root.querySelector(selector) : null;
  return el ? el.textContent.trim() : "";
}

// Firestore ids cannot contain "/"
function cleanId(id) {
  return String(id || "")
    .trim()
    .replace(/\//g, "_")
    .slice(0, 150);
}

export function safeLink(link, id) {
  if (link && SAFE_LINK.test(link)) return link;
  return "item-detail.html?id=" + encodeURIComponent(id);
}

function idFromLink(link) {
  if (!link) return "";
  try {
    return new URL(link, window.location.href).searchParams.get("id") || "";
  } catch (e) {
    return "";
  }
}

// "₩12,000" -> 12000, "Free" / "무료" -> 0, nothing -> null
export function priceToNumber(text) {
  if (!text) return null;
  const digits = String(text).replace(/[^\d]/g, "");
  if (digits) return Number(digits);
  return /free|무료/i.test(text) ? 0 : null;
}

// "📍 ECC Gate 4" on index cards
function locationOf(card) {
  if (!card) return "";
  const spans = card.querySelectorAll(".item-meta span, .item-location");
  for (const span of spans) {
    const text = span.textContent.trim();
    if (text.indexOf("📍") === 0 || span.classList.contains("item-location")) {
      return text.replace("📍", "").trim();
    }
  }
  return "";
}

// Badge on index cards: <span class="item-badge badge-rent"> -> "rent"
function typeFromBadge(card) {
  const badge = card ? card.querySelector(".item-badge") : null;
  if (!badge) return "";
  const match = badge.className.match(/badge-([a-z]+)/);
  return match ? match[1] : "";
}

/* ---------- read the item a button belongs to ---------- */

function itemFromButton(btn) {
  const data = btn.dataset;
  const card = btn.closest(".item-card");
  const onDetailPage = !card;

  // Link: data attribute -> card link -> this page (item-detail.html?id=...)
  let link = data.favLink || "";
  if (!link && card) {
    const anchor = card.matches("a[href]") ? card : card.querySelector("a[href]");
    link = anchor ? anchor.getAttribute("href") : "";
  }
  if (!link && onDetailPage) link = currentPage();

  const id = cleanId(data.favId || idFromLink(link) || link);

  const scope = card || document;
  const title =
    data.favTitle ||
    textOf(scope, ".item-title") ||
    (onDetailPage ? textOf(document, "#itemTitle, .item-detail-title, main h1") : "");
  const price =
    data.favPrice ||
    textOf(scope, ".item-price") ||
    (onDetailPage ? textOf(document, "#itemPrice, .item-detail-price") : "");

  let image = data.favImage || "";
  if (!image) {
    const img = card
      ? card.querySelector("img")
      : document.querySelector("#itemImage, .item-main-image img");
    image = img ? img.getAttribute("src") || "" : "";
  }

  return {
    itemId: id,
    title: title.slice(0, 200),
    price: price.slice(0, 50),
    priceValue: priceToNumber(price),
    imageUrl: image.slice(0, 1000),
    link: safeLink(link, id),
    location: (data.favLocation || locationOf(card)).slice(0, 100),
    category: (data.favCategory || "").slice(0, 50),
    condition: (data.favCondition || "").slice(0, 30),
    listingType: (data.favType || typeFromBadge(card)).slice(0, 20),
  };
}

/* ---------- liked / not liked on every button ---------- */

function setText(el, text) {
  if (el.textContent !== text) el.textContent = text; // no change = no extra DOM update
}

function setAttr(el, name, value) {
  if (el.getAttribute(name) !== value) el.setAttribute(name, value);
}

export function paintButton(btn) {
  const id = itemFromButton(btn).itemId;
  if (!id) return;
  const liked = state.favorites.has(id);

  btn.classList.toggle("is-favorite", liked);
  setAttr(btn, "aria-pressed", liked ? "true" : "false");
  setAttr(btn, "aria-label", t(liked ? "fav.remove" : "fav.add"));

  if (btn.classList.contains("favorite-item-btn")) {
    setText(btn, t(liked ? "fav.detail.saved" : "fav.detail.add"));
  } else if (btn.classList.contains("fav-btn")) {
    setText(btn, liked ? "❤️" : "🤍");
  }
}

function paintAllButtons() {
  document.querySelectorAll(BUTTONS).forEach(paintButton);
}

let paintQueued = false;
function queuePaint() {
  if (paintQueued) return;
  paintQueued = true;
  requestAnimationFrame(function () {
    paintQueued = false;
    paintAllButtons();
  });
}

/* ---------- small message at the bottom of the screen ---------- */

let toastEl = null;
let toastTimer = null;

export function notify(text, action) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "fav-toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    // Inline styles so the message also looks right on pages without favorites.css
    Object.assign(toastEl.style, {
      position: "fixed",
      left: "50%",
      bottom: "calc(1rem + env(safe-area-inset-bottom))",
      transform: "translateX(-50%)",
      zIndex: "1000",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      maxWidth: "calc(100vw - 2rem)",
      padding: "0.7rem 1rem",
      borderRadius: "999px",
      background: "#1e293b",
      color: "#ffffff",
      fontSize: "0.9rem",
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.25)",
    });
    document.body.appendChild(toastEl);
  }

  toastEl.replaceChildren();
  const label = document.createElement("span");
  label.textContent = text;
  toastEl.appendChild(label);

  if (action) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = action.label;
    Object.assign(btn.style, {
      border: "none",
      background: "transparent",
      color: "#86efac",
      fontWeight: "700",
      fontSize: "0.9rem",
      cursor: "pointer",
      padding: "0.25rem 0.25rem",
      minHeight: "44px",
    });
    btn.addEventListener("click", function () {
      hideToast();
      action.run();
    });
    toastEl.appendChild(btn);
  }

  toastEl.style.display = "flex";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4000);
}

function hideToast() {
  if (toastEl) toastEl.style.display = "none";
}

/* ---------- save / remove ---------- */

function favRef(id) {
  return doc(db, "users", state.user.uid, "favorites", id);
}

export async function saveFavorite(item, options) {
  if (!state.user) {
    goToLogin();
    return;
  }
  const data = Object.assign({}, item, { savedAt: serverTimestamp() });
  delete data.fromListing; // set again by favorites-page.js when it checks the listing
  await setDoc(favRef(item.itemId), data);
  if (!(options && options.silent)) {
    notify(t("fav.toast.saved"), onFavoritesPage() ? null : {
      label: t("fav.toast.view"),
      run: function () {
        window.location.href = "favorites.html";
      },
    });
  }
}

export async function removeFavorite(id) {
  if (!state.user) return;
  const saved = state.favorites.get(id);
  await deleteDoc(favRef(id));
  if (saved) {
    // Undo puts back the same copy (date becomes "now")
    const copy = Object.assign({}, saved);
    delete copy.savedAt;
    notify(t("fav.toast.removed"), {
      label: t("fav.toast.undo"),
      run: function () {
        saveFavorite(copy, { silent: true }).catch(showSaveError);
      },
    });
  }
}

// favorites-page.js: remember that this favorite is a real listing (so a deleted one shows "Unavailable")
export async function markFromListing(id) {
  if (!state.user) return;
  await setDoc(favRef(id), { fromListing: true }, { merge: true });
}

// Small "pop" when a heart is tapped (skipped for people who turned off animations)
function popHeart(btn) {
  if (!btn.animate) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  btn.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(0.95)" }, { transform: "scale(1)" }],
    { duration: 350, easing: "ease-out" },
  );
}

function showSaveError(error) {
  console.error("Favorites:", error);
  notify(t("fav.saveError"));
}

function onFavoritesPage() {
  return Boolean(document.getElementById("favoritesGrid"));
}

async function toggleFromButton(btn) {
  if (!state.authKnown) return; // Firebase still starting
  if (!state.user) {
    goToLogin();
    return;
  }
  const item = itemFromButton(btn);
  if (!item.itemId) return;

  popHeart(btn);
  btn.disabled = true;
  try {
    if (state.favorites.has(item.itemId)) {
      await removeFavorite(item.itemId);
    } else {
      await saveFavorite(item);
    }
  } catch (error) {
    showSaveError(error);
  } finally {
    btn.disabled = false;
  }
}

// One listener for the whole page (capture = runs before the card link opens)
document.addEventListener(
  "click",
  function (event) {
    const btn = event.target.closest(BUTTONS);
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    toggleFromButton(btn);
  },
  true,
);

/* ---------- login + live list from Firestore ---------- */

export function subscribe(fn) {
  subscribers.push(fn);
  fn(state);
}

onAuthStateChanged(auth, function (user) {
  // Same rule as auth-ui.js: only students with a verified email count as logged in
  state.user = user && user.emailVerified ? user : null;
  state.authKnown = true;
  state.listReady = false;
  state.error = false;
  state.favorites = new Map();
  if (stopWatching) stopWatching();
  stopWatching = null;

  if (!state.user) {
    paintAllButtons();
    emit();
    return;
  }

  const q = query(
    collection(db, "users", state.user.uid, "favorites"),
    orderBy("savedAt", "desc"),
  );

  stopWatching = onSnapshot(
    q,
    function (snapshot) {
      const next = new Map();
      snapshot.docs.forEach(function (d) {
        next.set(
          d.id,
          Object.assign({ itemId: d.id }, d.data({ serverTimestamps: "estimate" })),
        );
      });
      state.favorites = next;
      state.listReady = true;
      state.error = false;
      paintAllButtons();
      emit();
    },
    function (error) {
      console.error("Favorites:", error);
      state.error = true;
      emit();
    },
  );

  emit();
});

new MutationObserver(queuePaint).observe(document.body, { childList: true, subtree: true });
document.addEventListener("ewha:langchange", paintAllButtons);
paintAllButtons();
