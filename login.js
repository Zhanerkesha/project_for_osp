import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const togglePassword = document.getElementById("togglePassword");
const forgotLink = document.getElementById("forgotLink");
const loginMessage = document.getElementById("loginMessage");
const resendBtn = document.getElementById("resendBtn");

let unverifiedUser = null;

// Translation helper
function t(key, fallback) {
  return window.EwhaI18n?.t(key) || fallback;
}

// Display translated messages
let currentMessageKey = "";
let currentMessageType = "error";

function showMessage(messageKey, type = "error") {
  currentMessageKey = messageKey;
  currentMessageType = type;

  loginMessage.textContent = messageKey ? t(messageKey, messageKey) : "";

  loginMessage.className = `login-message ${type}`;
}

// Update visible messages when language changes
document.addEventListener("ewha:langchange", () => {
  if (currentMessageKey) {
    loginMessage.textContent = t(currentMessageKey, currentMessageKey);
    loginMessage.className = `login-message ${currentMessageType}`;
  }

  updatePasswordButton();
  updateLoginButton();
});

// Show or hide the password
function updatePasswordButton() {
  const isPassword = passwordInput.type === "password";

  togglePassword.textContent = isPassword
    ? t("login.show", "Show")
    : t("login.hide", "Hide");
}

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";

  passwordInput.type = isPassword ? "text" : "password";

  updatePasswordButton();
});

// Login button text
function updateLoginButton() {
  loginButton.textContent = loginButton.disabled
    ? t("login.loading", "Logging in...")
    : t("login.submit", "Log in");
}

// Log in
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  showMessage("");
  resendBtn.hidden = true;
  unverifiedUser = null;

  if (!email || !password) {
    showMessage("login.error.empty");
    return;
  }

  const allowedDomains = ["@ewha.ac.kr", "@ewhain.net"];

  if (!allowedDomains.some((domain) => email.endsWith(domain))) {
    showMessage("login.error.email");
    return;
  }

  loginButton.disabled = true;
  updateLoginButton();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    if (!user.emailVerified) {
      unverifiedUser = user;

      showMessage("login.error.unverified");

      resendBtn.hidden = false;
      return;
    }

    showMessage("login.success", "success");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login error:", error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      showMessage("login.error.credentials");
    } else if (error.code === "auth/too-many-requests") {
      showMessage("login.error.attempts");
    } else if (error.code === "auth/network-request-failed") {
      showMessage("login.error.network");
    } else {
      showMessage("login.error.general");
    }
  } finally {
    loginButton.disabled = false;
    updateLoginButton();
  }
});

// Resend verification email
resendBtn.addEventListener("click", async () => {
  if (!unverifiedUser) return;

  try {
    await sendEmailVerification(unverifiedUser);

    showMessage("login.success.verification", "success");
  } catch (error) {
    console.error("Verification error:", error);

    showMessage("login.error.resend");
  }
});

// Forgot password
forgotLink.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();

  if (!email) {
    showMessage("login.error.emailFirst");
    emailInput.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    showMessage("login.success.reset", "success");
  } catch (error) {
    console.error("Password reset error:", error);

    if (error.code === "auth/user-not-found") {
      showMessage("login.error.notFound");
    } else {
      showMessage("login.error.reset");
    }
  }
});

// Language toggle
const langToggle = document.getElementById("langToggle");

if (langToggle) {
  function updateLanguageButton() {
    const currentLang = window.EwhaI18n?.currentLang() || "en";

    langToggle.textContent = currentLang === "ko" ? "🌐 KO ▾" : "🌐 EN ▾";
  }

  updateLanguageButton();

  langToggle.addEventListener("click", () => {
    const currentLang = window.EwhaI18n?.currentLang() || "en";
    const newLang = currentLang === "en" ? "ko" : "en";

    document.documentElement.setAttribute("lang", newLang);
    localStorage.setItem("lang", newLang);

    updateLanguageButton();
  });
}
