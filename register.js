import "./app-check.js";
import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  deleteUser,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  doc,
  runTransaction,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import {
  t,
  isEwhaEmail,
  meetsPasswordRules,
  messenger,
  setFieldError,
  setupPasswordToggle,
  submitLabel,
  afterLoginUrl,
  keepNextOnLinks,
} from "./auth-common.js";

// Student ID: letters and numbers, 4-15 characters (exchange students have letters too).
// Change this one line if you learn the exact format.
const STUDENT_ID_REGEX = /^[A-Z0-9]{4,15}$/;
const RESEND_SECONDS = 60;

const $ = (id) => document.getElementById(id);

const form = $("registerForm");
const nameInput = $("name");
const nicknameInput = $("nickname");
const typeInput = $("studentType");
const studentInput = $("studentId");
const majorInput = $("major");
const emailInput = $("email");
const passwordInput = $("password");
const confirmInput = $("confirmPassword");
const termsInput = $("terms");

const message = messenger($("registerMessage"));
const setBusy = submitLabel(
  $("registerButton"),
  "register.submit",
  "register.loading",
);

setupPasswordToggle($("togglePassword"), [passwordInput, confirmInput]);
keepNextOnLinks('a[href^="login.html"]');

const fields = [
  nameInput,
  nicknameInput,
  typeInput,
  studentInput,
  emailInput,
  passwordInput,
  confirmInput,
  termsInput,
];

/* ---------- field behaviour ---------- */

// Student ID: letters and numbers only, always upper case
studentInput.addEventListener("input", () => {
  studentInput.value = studentInput.value
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 15);
});

fields.forEach((input) => {
  const eventName = input.type === "checkbox" ? "change" : "input";
  input.addEventListener(eventName, () => setFieldError(input, null));
});

// Already logged in with a verified email -> nothing to register
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) window.location.replace(afterLoginUrl());
});

/* ---------- password strength ---------- */

const strengthBox = $("strength");
const strengthFill = $("strengthFill");
const strengthLabel = $("strengthLabel");

function passwordLevel(password) {
  if (!password) return 0;
  if (!meetsPasswordRules(password)) return 1;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 5) return 4;
  if (score === 4) return 3;
  return 2;
}

function renderStrength() {
  const level = passwordLevel(passwordInput.value);
  strengthBox.hidden = level === 0;
  strengthBox.dataset.level = String(level);
  strengthFill.style.width = level * 25 + "%";
  strengthLabel.textContent = level ? t("register.strength." + level) : "";
}

passwordInput.addEventListener("input", renderStrength);

/* ---------- validation ---------- */

function validate() {
  const errors = [];
  const email = emailInput.value.trim().toLowerCase();

  if (nameInput.value.trim().length < 2) {
    errors.push([nameInput, "register.error.name"]);
  }
  const nick = nicknameInput.value.trim();
  if (nick.length < 2 || nick.length > 20) {
    errors.push([nicknameInput, "register.error.nickname"]);
  }
  if (!typeInput.value) {
    errors.push([typeInput, "register.error.studentType"]);
  }
  if (!STUDENT_ID_REGEX.test(studentInput.value.trim().toUpperCase())) {
    errors.push([studentInput, "register.error.studentId"]);
  }
  if (!isEwhaEmail(email)) {
    errors.push([emailInput, "register.error.email"]);
  }
  if (!meetsPasswordRules(passwordInput.value)) {
    errors.push([passwordInput, "register.error.weak"]);
  }
  if (!confirmInput.value || confirmInput.value !== passwordInput.value) {
    errors.push([confirmInput, "register.error.mismatch"]);
  }
  if (!termsInput.checked) {
    errors.push([termsInput, "register.error.terms"]);
  }

  return errors;
}

/* ---------- profile + student ID (one atomic step) ---------- */

async function saveProfile(
  user,
  name,
  nickname,
  studentType,
  studentId,
  major,
) {
  await runTransaction(db, async (tx) => {
    const idRef = doc(db, "studentIds", studentId);
    if ((await tx.get(idRef)).exists()) throw new Error("student-id-taken");

    tx.set(idRef, { uid: user.uid, createdAt: serverTimestamp() });
    tx.set(doc(db, "users", user.uid), {
      nickname, // read by listings-data.js (ownerNickname)
      name,
      email: user.email,
      studentType,
      studentId,
      major,
      studentIdVerified: false, // only an admin / Cloud Function may set this to true
      createdAt: serverTimestamp(),
    });
  });
}

function showError(error) {
  const code = error.code || error.message;

  if (code === "auth/email-already-in-use") {
    setFieldError(emailInput, "register.error.exists");
    emailInput.focus();
  } else if (code === "student-id-taken") {
    setFieldError(studentInput, "register.error.studentIdTaken");
    studentInput.focus();
  } else if (code === "auth/invalid-email") {
    setFieldError(emailInput, "register.error.email");
    emailInput.focus();
  } else if (code === "auth/weak-password") {
    setFieldError(passwordInput, "register.error.weak");
    passwordInput.focus();
  } else if (code === "auth/network-request-failed") {
    message.show("register.error.network");
  } else if (code === "auth/too-many-requests") {
    message.show("register.error.attempts");
  } else if (code === "permission-denied") {
    message.show("register.error.profile");
  } else {
    message.show("register.error.general");
  }
}

/* ---------- "check your email" screen ---------- */

const registerView = $("registerView");
const verifyPanel = $("verifyPanel");
const verifyText = $("verifyText");
const resendVerify = $("resendVerify");
const verifiedBtn = $("verifiedBtn");
const toLoginLink = $("toLoginLink");
const verifyMessage = messenger($("verifyMessage"));

let verifyEmail = "";
let cooldownLeft = 0;
let cooldownTimer = null;

function renderVerify() {
  verifyText.textContent = t("register.verify.text", { email: verifyEmail });
  resendVerify.disabled = cooldownLeft > 0;
  resendVerify.textContent =
    cooldownLeft > 0
      ? t("register.verify.resendIn", { s: cooldownLeft })
      : t("register.verify.resend");
}

function startCooldown(seconds) {
  clearInterval(cooldownTimer);
  cooldownLeft = seconds;
  renderVerify();

  if (seconds <= 0) return;

  cooldownTimer = setInterval(() => {
    cooldownLeft -= 1;
    if (cooldownLeft <= 0) clearInterval(cooldownTimer);
    renderVerify();
  }, 1000);
}

document.addEventListener("ewha:langchange", () => {
  renderStrength();
  if (!verifyPanel.hidden) renderVerify();
});

function showVerifyView(email) {
  verifyEmail = email;
  registerView.hidden = true;
  verifyPanel.hidden = false;
  renderVerify();
  verifyPanel.querySelector("h2").focus();
}

resendVerify.addEventListener("click", async () => {
  if (!auth.currentUser) return;

  verifyMessage.clear();

  try {
    await sendEmailVerification(auth.currentUser);
    verifyMessage.show("register.verify.sent", "success");
    startCooldown(RESEND_SECONDS);
  } catch (error) {
    console.error("Resend error:", error);
    verifyMessage.show(
      error.code === "auth/too-many-requests"
        ? "register.error.attempts"
        : "register.verify.error",
    );
  }
});

verifiedBtn.addEventListener("click", async () => {
  verifyMessage.clear();

  if (!auth.currentUser) {
    window.location.href = toLoginLink.getAttribute("href");
    return;
  }

  try {
    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
      window.location.href = afterLoginUrl();
    } else {
      verifyMessage.show("register.verify.notYet");
    }
  } catch (error) {
    console.error("Reload error:", error);
    verifyMessage.show("register.error.network");
  }
});

// Leaving the screen signs the unverified user out
toLoginLink.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    await signOut(auth);
  } finally {
    window.location.href = toLoginLink.getAttribute("href");
  }
});

/* ---------- submit ---------- */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.clear();
  fields.forEach((input) => setFieldError(input, null));

  const errors = validate();
  if (errors.length) {
    errors.forEach(([input, key]) => setFieldError(input, key));
    errors[0][0].focus();
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  setBusy(true);

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      passwordInput.value,
    );

    try {
      await updateProfile(credential.user, {
        displayName: nicknameInput.value.trim(),
      });
      await saveProfile(
        credential.user,
        name,
        nicknameInput.value.trim(),
        typeInput.value,
        studentInput.value.trim().toUpperCase(),
        majorInput.value.trim(),
      );
    } catch (profileError) {
      // Never leave an account without a profile, or with a duplicate student ID
      await deleteUser(credential.user).catch(() => {});
      throw profileError;
    }

    let emailSent = true;
    try {
      await sendEmailVerification(credential.user);
    } catch (sendError) {
      console.error("Verification email error:", sendError);
      emailSent = false;
    }

    showVerifyView(email);
    if (emailSent) {
      startCooldown(RESEND_SECONDS);
    } else {
      startCooldown(0);
      verifyMessage.show("register.verify.error");
    }
  } catch (error) {
    console.error("Register error:", error);
    showError(error);
  } finally {
    setBusy(false);
  }
});

renderStrength();
