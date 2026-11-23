import "./app-check.js";
import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  isEwhaEmail,
  messenger,
  setFieldError,
  setupPasswordToggle,
  submitLabel,
  afterLoginUrl,
  keepNextOnLinks,
} from "./auth-common.js";

const $ = (id) => document.getElementById(id);

const loginForm = $("loginForm");
const emailInput = $("email");
const passwordInput = $("password");
const rememberInput = $("remember");
const forgotLink = $("forgotLink");
const resendBtn = $("resendBtn");

const message = messenger($("loginMessage"));
const setLoginBusy = submitLabel($("loginButton"), "login.submit", "login.loading");

setupPasswordToggle($("togglePassword"), [passwordInput]);
keepNextOnLinks('a[href^="register.html"]');

let unverifiedUser = null;
let isLoggingIn = false;

// Already logged in with a verified email -> skip the login page
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified && !isLoggingIn) {
    window.location.replace(afterLoginUrl());
  }
});

// Remove a field's error as soon as the person edits it
[emailInput, passwordInput].forEach((input) =>
  input.addEventListener("input", () => setFieldError(input, null)),
);

// Log in
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  message.clear();
  resendBtn.hidden = true;
  unverifiedUser = null;
  setFieldError(emailInput, null);
  setFieldError(passwordInput, null);

  let firstInvalid = null;

  if (!email) {
    setFieldError(emailInput, "login.error.emailRequired");
    firstInvalid = emailInput;
  } else if (!isEwhaEmail(email)) {
    setFieldError(emailInput, "login.error.email");
    firstInvalid = emailInput;
  }

  if (!password) {
    setFieldError(passwordInput, "login.error.passwordRequired");
    firstInvalid = firstInvalid || passwordInput;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  isLoggingIn = true;
  setLoginBusy(true);

  try {
    // "Remember me" = stay logged in after closing the browser
    await setPersistence(
      auth,
      rememberInput.checked
        ? browserLocalPersistence
        : browserSessionPersistence,
    );

    const { user } = await signInWithEmailAndPassword(auth, email, password);

    if (!user.emailVerified) {
      // Kept only so that "Resend" works; signed out right after
      unverifiedUser = user;
      message.show("login.error.unverified");
      resendBtn.hidden = false;
      return;
    }

    message.show("login.success", "success");
    window.location.href = afterLoginUrl();
  } catch (error) {
    console.error("Login error:", error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-email"
    ) {
      message.show("login.error.credentials");
    } else if (error.code === "auth/too-many-requests") {
      message.show("login.error.attempts");
    } else if (error.code === "auth/network-request-failed") {
      message.show("login.error.network");
    } else {
      message.show("login.error.general");
    }
  } finally {
    isLoggingIn = false;
    setLoginBusy(false);
  }
});

// Resend verification email
resendBtn.addEventListener("click", async () => {
  if (!unverifiedUser) return;

  resendBtn.disabled = true;

  try {
    await sendEmailVerification(unverifiedUser);
    message.show("login.success.verification", "success");

    // Unverified users must not stay signed in
    await signOut(auth);
    unverifiedUser = null;
    resendBtn.hidden = true;
  } catch (error) {
    console.error("Verification error:", error);
    message.show(
      error.code === "auth/too-many-requests"
        ? "login.error.attempts"
        : "login.error.resend",
    );
  } finally {
    resendBtn.disabled = false;
  }
});

// Forgot password
forgotLink.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();

  message.clear();
  setFieldError(emailInput, null);

  if (!email) {
    setFieldError(emailInput, "login.error.emailFirst");
    emailInput.focus();
    return;
  }

  if (!isEwhaEmail(email)) {
    setFieldError(emailInput, "login.error.email");
    emailInput.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    message.show("login.success.reset", "success");
  } catch (error) {
    console.error("Password reset error:", error);

    if (error.code === "auth/user-not-found") {
      // Same answer as success, so nobody can find out which emails are registered
      message.show("login.success.reset", "success");
    } else if (error.code === "auth/too-many-requests") {
      message.show("login.error.attempts");
    } else if (error.code === "auth/network-request-failed") {
      message.show("login.error.network");
    } else {
      message.show("login.error.reset");
    }
  }
});

// The language button is handled by lang-toggle.js
