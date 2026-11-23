// Ewha Market - handles the links in Firebase emails (verify email, reset password, recover email)
//
// One-time setup in Firebase Console -> Authentication -> Templates -> (each template)
// -> pencil icon -> "Customize action URL" -> https://YOUR-DOMAIN/auth-action.html

import "./app-check.js";
import { auth } from "./firebase-config.js";

import {
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  t,
  meetsPasswordRules,
  messenger,
  setFieldError,
  setupPasswordToggle,
  submitLabel,
} from "./auth-common.js";

const $ = (id) => document.getElementById(id);

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
const code = params.get("oobCode");

const title = $("actionTitle");
const text = $("actionText");
const link = $("actionLink");
const resetForm = $("resetForm");
const newPassword = $("newPassword");
const confirmNewPassword = $("confirmNewPassword");

const message = messenger($("actionMessage"));
const setBusy = submitLabel($("resetButton"), "action.reset.submit", "action.reset.saving");
setupPasswordToggle($("togglePassword"), [newPassword, confirmNewPassword]);

// What the card currently shows (re-rendered when the language changes)
const state = {
  titleKey: "action.loading.title",
  textKey: "action.loading.text",
  textParams: {},
  linkKey: null,
};

function render() {
  title.textContent = t(state.titleKey);
  text.textContent = t(state.textKey, state.textParams);
  link.hidden = !state.linkKey;
  if (state.linkKey) link.textContent = t(state.linkKey);
}

function setState(next) {
  Object.assign(state, { textParams: {}, linkKey: null }, next);
  render();
  title.focus();
}

document.addEventListener("ewha:langchange", render);

function showInvalid() {
  resetForm.hidden = true;
  setState({
    titleKey: "action.invalid.title",
    textKey: "action.invalid.text",
    linkKey: "action.toLogin",
  });
}

[newPassword, confirmNewPassword].forEach((input) =>
  input.addEventListener("input", () => setFieldError(input, null)),
);

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.clear();
  setFieldError(newPassword, null);
  setFieldError(confirmNewPassword, null);

  if (!meetsPasswordRules(newPassword.value)) {
    setFieldError(newPassword, "register.error.weak");
    newPassword.focus();
    return;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    setFieldError(confirmNewPassword, "register.error.mismatch");
    confirmNewPassword.focus();
    return;
  }

  setBusy(true);

  try {
    await confirmPasswordReset(auth, code, newPassword.value);
    resetForm.hidden = true;
    setState({
      titleKey: "action.reset.done.title",
      textKey: "action.reset.done.text",
      linkKey: "action.toLogin",
    });
  } catch (error) {
    console.error("Reset error:", error);

    if (error.code === "auth/weak-password") {
      setFieldError(newPassword, "register.error.weak");
    } else if (
      error.code === "auth/expired-action-code" ||
      error.code === "auth/invalid-action-code"
    ) {
      showInvalid();
    } else if (error.code === "auth/network-request-failed") {
      message.show("register.error.network");
    } else {
      message.show("action.error.general");
    }
  } finally {
    setBusy(false);
  }
});

async function main() {
  render();

  if (!code) {
    showInvalid();
    return;
  }

  try {
    if (mode === "verifyEmail") {
      await applyActionCode(auth, code);
      setState({
        titleKey: "action.verified.title",
        textKey: "action.verified.text",
        linkKey: "action.toLogin",
      });
    } else if (mode === "resetPassword") {
      const email = await verifyPasswordResetCode(auth, code);
      setState({
        titleKey: "action.reset.title",
        textKey: "action.reset.text",
        textParams: { email },
      });
      resetForm.hidden = false;
      newPassword.focus();
    } else if (mode === "recoverEmail") {
      await checkActionCode(auth, code);
      await applyActionCode(auth, code);
      setState({
        titleKey: "action.recover.title",
        textKey: "action.recover.text",
        linkKey: "action.toLogin",
      });
    } else {
      showInvalid();
    }
  } catch (error) {
    console.error("Action error:", error);
    showInvalid();
  }
}

main();
