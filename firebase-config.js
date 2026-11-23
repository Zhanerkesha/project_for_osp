// Ewha Market - Shared Firebase keys 
// Owner: Zhansaya 

// Every page should import `auth` and `db` from here.
// Never call initializeApp() anywhere else.
//
// Usage in any page:
//   <script type="module">
//     import { auth, db } from "./firebase-config.js";
//   </script>


// Import the functions you need from Google's CDN - same version used
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9G_d-cypILrakpfMuKFMDOU0jQJl6H8M",
    authDomain: "ewha-market-ce79d.firebaseapp.com",
    projectId: "ewha-market-ce79d",
    messagingSenderId: "592263266608",
    appId: "1:592263266608:web:9c450b05f7257d513c88f5"
};

// Start Firebase once
const app = initializeApp(firebaseConfig);

// Shared tools for the whole site
export const auth = getAuth(app); // login, sign up, current user
export const db = getFirestore(app); // database

