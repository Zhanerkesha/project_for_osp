// Ewha Market - favorites.html page
// Owner: Safiyya
//
// Shows the logged-in student's favorites (from favorites.js) with:
//   search, category filter, sorting, SOLD / unavailable labels,
//   View details, Message seller, and empty states.
//
// For each favorite it also reads the original listing from Firestore ("listings"):
//   - found            -> show its CURRENT price, photo, location, condition, status
//   - status completed -> "SOLD" label (card stays, dimmed)
//   - deleted later    -> "No longer available" label (card stays, dimmed)
//   - never a Firestore listing (sample cards on index) -> shown as saved
//
// Load order in favorites.html:
//   listings-i18n.js -> favorites-i18n.js -> lang-toggle.js -> favorites.js -> favorites-page.js -> auth-ui.js

import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  subscribe,
  t,
  goToLogin,
  safeLink,
  priceToNumber,
  markFromListing,
} from "./favorites.js";

const FALLBACK_IMAGE = "images/ewha.jpg";

/* ---------- page elements ---------- */

const $ = (id) => document.getElementById(id);
const grid = $("favoritesGrid");
const loadingEl = $("favoritesLoading");
const emptyEl = $("favoritesEmpty");
const noResultsEl = $("favoritesNoResults");
const countEl = $("favoritesCount");
const messageEl = $("favoritesMessage");
const toolbar = $("favoritesToolbar");
const searchInput = $("favoritesSearch");
const sortSelect = $("favoritesSort");
const chipsEl = $("favoritesCategories");
const clearBtn = $("favoritesClear");

/* ---------- state ---------- */

let latest = null; // last state from favorites.js
let category = "all";
const listings = new Map(); // itemId -> listing object | null (not in Firestore) | "loading"
const marked = new Set(); // favorites already marked as real listings (write once)

/* ---------- original listings from Firestore ---------- */

async function loadListing(id) {
  listings.set(id, "loading");
  try {
    const snap = await getDoc(doc(db, "listings", id));
    listings.set(id, snap.exists() ? snap.data() : null);
  } catch (error) {
    // e.g. not allowed or offline: just show the saved copy
    listings.set(id, null);
  }
  render();
}

function loadMissingListings(favs) {
  favs.forEach(function (fav) {
    if (!listings.has(fav.itemId)) loadListing(fav.itemId);
  });
}

/* ---------- one favorite = saved copy + current listing ---------- */

function formatPrice(listing) {
  if (listing.isFree || listing.priceUnit === "free") return t("price.free");
  const amount = "₩" + Number(listing.price || 0).toLocaleString("ko-KR");
  const suffix = {
    per_day: t("price.perDay"),
    per_week: t("price.perWeek"),
    per_hour: t("price.perHour"),
  }[listing.priceUnit];
  if (suffix) return amount + " " + suffix;
  if (listing.listingType === "service" && listing.priceUnit === "once") {
    return amount + " " + t("price.perSession");
  }
  return amount;
}

// Saved copies keep the price text in the language it was saved in ("Free", "₩2,000 / day").
// Show it in the current language: Free -> 무료, "/ day" -> "/ 일", ...
function localizeSavedPrice(text, value) {
  if (value === 0) return t("price.free");
  if (!text) return "";
  return text
    .replace(/\/\s*(day\b|일)/i, t("price.perDay"))
    .replace(/\/\s*(week\b|주)/i, t("price.perWeek"))
    .replace(/\/\s*(hour\b|시간)/i, t("price.perHour"))
    .replace(/\/\s*(session\b|회)/i, t("price.perSession"));
}

function view(fav) {
  const live = listings.get(fav.itemId);
  const found = live && live !== "loading";

  // Remember once that this favorite is a real listing
  if (found && !fav.fromListing && !marked.has(fav.itemId)) {
    marked.add(fav.itemId);
    markFromListing(fav.itemId).catch(function () {});
  }

  let status = "available";
  if (found && live.status === "completed") status = "sold";
  if (live === null && fav.fromListing) status = "unavailable";

  const priceValue = found
    ? live.isFree || live.priceUnit === "free"
      ? 0
      : Number(live.price || 0)
    : typeof fav.priceValue === "number"
      ? fav.priceValue
      : priceToNumber(fav.price);

  // Price drop: current price is lower than when it was saved
  const savedValue = typeof fav.priceValue === "number" ? fav.priceValue : priceToNumber(fav.price);
  const priceDropped =
    found && typeof savedValue === "number" && savedValue > 0 && priceValue < savedValue;

  let type = (found && live.listingType) || fav.listingType || "";
  if (found && live.category === "study_notes") type = "notes";

  return {
    id: fav.itemId,
    type: type,
    oldPrice: priceDropped ? "₩" + savedValue.toLocaleString("ko-KR") : "",
    title: (found && live.title) || fav.title || t("fav.untitled"),
    price: found ? formatPrice(live) : localizeSavedPrice(fav.price, priceValue),
    priceValue: priceValue,
    imageUrl: (found && live.imageUrl) || fav.imageUrl || FALLBACK_IMAGE,
    link: safeLink(fav.link, fav.itemId),
    location: (found && live.location) || fav.location || "",
    condition: (found && live.condition) || fav.condition || "",
    category: (found && live.category) || fav.category || "",
    ownerId: found ? live.ownerId || "" : "",
    status: status,
    savedAt: fav.savedAt,
    saved: fav,
  };
}

/* ---------- search / filter / sort ---------- */

function categoryLabel(value) {
  const label = t("cat." + value);
  return label === "cat." + value ? value : label;
}

function matchesSearch(item, words) {
  if (!words) return true;
  const haystack = [item.title, item.location, item.condition, item.category ? categoryLabel(item.category) : ""]
    .join(" ")
    .toLowerCase();
  return words.split(/\s+/).every(function (word) {
    return haystack.indexOf(word) !== -1;
  });
}

function savedTime(item) {
  const s = item.savedAt;
  return s && s.toMillis ? s.toMillis() : s && s.toDate ? s.toDate().getTime() : 0;
}

function sortItems(items) {
  const mode = sortSelect ? sortSelect.value : "recent";
  const noPriceLast = function (v, dir) {
    return v === null || v === undefined || isNaN(v) ? (dir > 0 ? Infinity : -Infinity) : v;
  };
  return items.slice().sort(function (a, b) {
    if (mode === "priceAsc") return noPriceLast(a.priceValue, 1) - noPriceLast(b.priceValue, 1);
    if (mode === "priceDesc") return noPriceLast(b.priceValue, -1) - noPriceLast(a.priceValue, -1);
    return savedTime(b) - savedTime(a);
  });
}

/* ---------- drawing ---------- */

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function renderChips(items) {
  if (!chipsEl) return;
  const present = Array.from(
    new Set(
      items
        .map(function (i) {
          return i.category;
        })
        .filter(Boolean),
    ),
  ).sort();
  if (category !== "all" && present.indexOf(category) === -1) category = "all";

  const values = ["all"].concat(present);
  chipsEl.replaceChildren(
    ...values.map(function (value) {
      const chip = makeEl("button", "fav-chip", value === "all" ? t("fav.filter.all") : categoryLabel(value));
      chip.type = "button";
      chip.dataset.category = value;
      chip.setAttribute("aria-pressed", value === category ? "true" : "false");
      return chip;
    }),
  );
  // Only show the chips when there is something to choose between
  chipsEl.hidden = present.length === 0;
}

// "Saved 2d ago" (older than a week: "Saved Nov 27")
function savedLabel(item) {
  const time = savedTime(item);
  if (!time) return "";
  const minutes = Math.floor(Math.max(0, Date.now() - time) / 60000);
  if (minutes < 1) return t("fav.saved.justNow");
  if (minutes < 60) return t("fav.saved.minutes", { n: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("fav.saved.hours", { n: hours });
  const days = Math.floor(hours / 24);
  if (days < 7) return t("fav.saved.days", { n: days });
  const lang = window.EwhaI18n ? window.EwhaI18n.currentLang() : "en";
  const date = new Date(time).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    month: "short",
    day: "numeric",
  });
  return t("fav.savedOn", { date: date });
}

function buildCard(item) {
  // The whole card opens the listing: the title link stretches over the card (see favorites.css).
  // The heart and the message button sit above that link, so they still work on their own.
  const card = makeEl("article", "item-card fav-card");
  if (item.status !== "available") card.classList.add("is-unavailable");

  // ----- image + type badge + heart + status label -----
  const imageWrap = makeEl("div", "item-img-wrap");
  const img = document.createElement("img");
  img.src = item.imageUrl;
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", function () {
    if (img.getAttribute("src") !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
  });
  imageWrap.appendChild(img);

  if (item.type) {
    const badgeText = t("fav.badge." + item.type);
    if (badgeText !== "fav.badge." + item.type) {
      imageWrap.appendChild(makeEl("span", "item-badge badge-" + item.type, badgeText));
    }
  }

  const heart = makeEl("button", "fav-btn is-favorite", "❤️");
  heart.type = "button";
  heart.dataset.favId = item.id;
  heart.dataset.favLink = item.link;
  heart.dataset.favTitle = item.saved.title || "";
  heart.dataset.favPrice = item.saved.price || "";
  heart.dataset.favImage = item.saved.imageUrl || "";
  heart.setAttribute("aria-pressed", "true");
  heart.setAttribute("aria-label", t("fav.remove"));
  imageWrap.appendChild(heart);

  if (item.status !== "available") {
    imageWrap.appendChild(
      makeEl("span", "fav-status fav-status--" + item.status, t("fav.status." + item.status)),
    );
  }

  // ----- price (+ price drop) -----
  const info = makeEl("div", "item-info");
  const priceRow = makeEl("div", "fav-price-row");
  priceRow.appendChild(makeEl("p", "item-price", item.price));
  if (item.oldPrice && item.status === "available") {
    const old = makeEl("s", "fav-old-price", item.oldPrice);
    old.setAttribute("aria-label", t("fav.wasPrice", { price: item.oldPrice }));
    priceRow.append(old, makeEl("span", "fav-drop", t("fav.priceDropped")));
  }
  info.appendChild(priceRow);

  // ----- title (= the link for the whole card) -----
  const title = makeEl("a", "item-title fav-card-title", item.title);
  title.href = item.link;
  info.appendChild(title);

  // ----- location + condition -----
  const meta = makeEl("div", "fav-meta");
  if (item.location) meta.appendChild(makeEl("span", "fav-location", "📍 " + item.location));
  if (item.condition) {
    const cond = t("cond." + item.condition);
    meta.appendChild(makeEl("span", "fav-condition", cond === "cond." + item.condition ? item.condition : cond));
  }
  if (meta.childNodes.length) info.appendChild(meta);

  // ----- footer: saved time + message seller -----
  const footer = makeEl("div", "fav-footer");
  footer.appendChild(makeEl("span", "fav-saved", savedLabel(item)));

  const me = latest && latest.user ? latest.user.uid : "";
  if (item.status === "available" && item.ownerId && item.ownerId !== me) {
    const message = makeEl("a", "fav-msg");
    message.href = "messages.html?listingId=" + encodeURIComponent(item.id);
    message.setAttribute("aria-label", t("fav.messageSellerLabel"));
    message.title = t("fav.messageSellerLabel");
    message.append(
      makeEl("span", "fav-msg-icon", "💬"),
      makeEl("span", "fav-msg-text", t("fav.messageShort")),
    );
    footer.appendChild(message);
  }
  info.appendChild(footer);

  card.append(imageWrap, info);
  return card;
}

function showMessage(text) {
  if (!messageEl) return;
  messageEl.textContent = text || "";
  messageEl.hidden = !text;
}

function render() {
  if (!latest) return;

  if (latest.authKnown && !latest.user) {
    goToLogin();
    return;
  }

  if (latest.error) {
    loadingEl.hidden = true;
    showMessage(t("fav.error"));
    return;
  }
  showMessage("");

  const ready = latest.authKnown && latest.listReady;
  loadingEl.hidden = ready;
  if (!ready) return;

  const favs = Array.from(latest.favorites.values());
  loadMissingListings(favs);

  const all = favs.map(view);
  const total = all.length;

  countEl.textContent = total ? t("fav.count", { n: total }) : "";
  toolbar.hidden = total === 0;
  emptyEl.hidden = total !== 0;

  renderChips(all);

  const words = (searchInput.value || "").trim().toLowerCase();
  const shown = sortItems(
    all.filter(function (item) {
      return (category === "all" || item.category === category) && matchesSearch(item, words);
    }),
  );

  grid.replaceChildren(...shown.map(buildCard));
  grid.hidden = shown.length === 0;
  noResultsEl.hidden = !(total > 0 && shown.length === 0);
}

/* ---------- events ---------- */

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

chipsEl.addEventListener("click", function (event) {
  const chip = event.target.closest(".fav-chip");
  if (!chip) return;
  category = chip.dataset.category;
  render();
});

clearBtn.addEventListener("click", function () {
  searchInput.value = "";
  category = "all";
  sortSelect.value = "recent";
  render();
  searchInput.focus();
});

document.addEventListener("ewha:langchange", function () {
  document.title = t("fav.pageTitle");
  render();
});

document.title = t("fav.pageTitle");
subscribe(function (state) {
  latest = state;
  render();
});

// The heart buttons on the cards are handled by favorites.js (remove + Undo message).
