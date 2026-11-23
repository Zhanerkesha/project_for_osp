// Ewha Market - Firebase App Check (blocks bots and scripts that call Firebase directly)
//
// Setup (5 minutes):
//  1. Google reCAPTCHA admin -> create a "reCAPTCHA v3" site -> add your domain (and localhost).
//  2. Firebase Console -> App Check -> register your web app with reCAPTCHA v3 (paste the SECRET key).
//  3. Paste the SITE key below.
//  4. When the site works, press "Enforce" for Authentication and Firestore in the App Check page.
//
// While SITE_KEY is not set, this file does nothing, so the site keeps working.

import { auth } from "./firebase-config.js";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-check.js";

const SITE_KEY = "PASTE_RECAPTCHA_V3_SITE_KEY_HERE";

if (SITE_KEY.startsWith("PASTE_")) {
  console.info("App Check is off: set SITE_KEY in app-check.js");
} else {
  // On localhost, a debug token is printed in the console; add it in the App Check page
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(auth.app, {
    provider: new ReCaptchaV3Provider(SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}
