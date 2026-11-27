// Ewha Market - shared helpers for login, register and auth-action pages (ES module)

export const ALLOWED_DOMAINS = ["@ewha.ac.kr", "@ewhain.net"];

export function isEwhaEmail(email) {
  return ALLOWED_DOMAINS.some((domain) => email.endsWith(domain));
}

// At least 8 characters, one letter and one number
export function meetsPasswordRules(password) {
  return (
    password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
  );
}

// Translation helper: t("key") or t("key", { n: 3 })
export function t(key, params) {
  return window.EwhaI18n ? window.EwhaI18n.t(key, params) : key;
}

/* ---------- "next" page (return after login) ---------- */

// Only plain page names are accepted ("add-item.html?id=3"), never other sites
const NEXT_PATTERN = /^[A-Za-z0-9_-]+\.html(\?[A-Za-z0-9_\-=&%.]*)?$/;
const NEXT_BLOCKED = ["login.html", "register.html", "auth-action.html"];

export function getNext() {
  const raw = new URLSearchParams(window.location.search).get("next") || "";
  if (!NEXT_PATTERN.test(raw)) return "";
  const file = raw.split("?")[0].toLowerCase();
  return NEXT_BLOCKED.includes(file) ? "" : raw;
}

export function afterLoginUrl() {
  return getNext() || "index.html";
}

// Keep ?next=... when moving between login and register
export function keepNextOnLinks(selector) {
  const next = getNext();
  if (!next) return;
  document.querySelectorAll(selector).forEach((link) => {
    const base = link.getAttribute("href").split("?")[0];
    link.setAttribute("href", base + "?next=" + encodeURIComponent(next));
  });
}

// "Back" link returns to the page the user came from (e.g. the item they were viewing)
export function keepNextOnBackLink(selector = ".auth-back-link") {
  const next = getNext();
  if (!next) return;
  document.querySelectorAll(selector).forEach((link) => {
    link.setAttribute("href", next);
  });
}

/* ---------- messages that re-translate when the language changes ---------- */

export function messenger(element) {
  let key = "";
  let type = "error";

  function render() {
    element.textContent = key ? t(key) : "";
    element.className = "login-message " + type;
  }

  document.addEventListener("ewha:langchange", render);

  return {
    show(newKey, newType = "error") {
      key = newKey;
      type = newType;
      render();
    },
    clear() {
      key = "";
      render();
    },
  };
}

/* ---------- error text under a single field ---------- */

function errorElement(input) {
  let el = document.getElementById(input.id + "-error");
  if (!el) {
    el = document.createElement("small");
    el.className = "field-error";
    el.id = input.id + "-error";
    el.setAttribute("role", "alert");
    el.hidden = true;

    const host = input.closest(".login-field");
    if (host) host.appendChild(el);
    else
      (input.closest("label") || input).insertAdjacentElement("afterend", el);
  }
  return el;
}

export function setFieldError(input, key) {
  const el = errorElement(input);

  if (!key) {
    el.hidden = true;
    el.textContent = "";
    delete el.dataset.key;
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    return;
  }

  el.dataset.key = key;
  el.textContent = t(key);
  el.hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", el.id);
}

document.addEventListener("ewha:langchange", () => {
  document.querySelectorAll(".field-error[data-key]").forEach((el) => {
    el.textContent = t(el.dataset.key);
  });
});

/* ---------- show / hide password button ---------- */

export function setupPasswordToggle(button, inputs) {
  function update() {
    const hidden = inputs[0].type === "password";
    button.textContent = t(hidden ? "login.show" : "login.hide");
    button.setAttribute("aria-pressed", String(!hidden));
  }

  button.addEventListener("click", () => {
    const type = inputs[0].type === "password" ? "text" : "password";
    inputs.forEach((input) => (input.type = type));
    update();
  });

  document.addEventListener("ewha:langchange", update);
  update();
}

/* ---------- submit button with a "loading" label ---------- */

export function submitLabel(button, idleKey, busyKey) {
  let busy = false;

  function render() {
    button.disabled = busy;
    button.textContent = t(busy ? busyKey : idleKey);
  }

  document.addEventListener("ewha:langchange", render);

  return function setBusy(value) {
    busy = value;
    render();
  };
}
