// Profile Page
// Owner: Sara
import { auth, db } from './firebase-config.js';

import {
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

import {
    doc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';


const nicknameElement = document.getElementById('profileNickname');
const emailElement = document.getElementById('profileEmail');
const avatarElement = document.getElementById('profileAvatar');
const verificationElement = document.getElementById('verificationBadge');
const errorElement = document.getElementById('profileError');
const logoutButton = document.getElementById('logoutBtn');


// Listen for the currently logged-in user
onAuthStateChanged(auth, async (user) => {

    // If nobody is logged in
    if (!user) {
        nicknameElement.textContent = 'Guest';
        emailElement.textContent = 'Please log in to view your profile';

        verificationElement.textContent = 'Not logged in';

        errorElement.hidden = false;
        errorElement.textContent = 'You are currently not logged in.';

        return;
    }

    // Default nickname
    let nickname = user.displayName ||
        (user.email ? user.email.split('@')[0] : 'Student');

    try {

        // Retrieve profile document from Firestore
        const userDoc = await getDoc(
            doc(db, 'users', user.uid)
        );

        // If a profile document exists
        if (userDoc.exists()) {

            const profileData = userDoc.data();

            // Use nickname saved in Firestore
            if (profileData.nickname) {
                nickname = profileData.nickname;
            }

        }

    } catch (error) {

        console.error('Error retrieving profile:', error);

    }

    // Display nickname
    nicknameElement.textContent = nickname;

    // Display email
    emailElement.textContent = user.email || 'No email available';

    // Display first letter as avatar
    avatarElement.textContent = nickname.charAt(0).toUpperCase();

    // Email verification
    if (user.emailVerified) {

        verificationElement.textContent = '✓ Verified student';
        verificationElement.classList.add('verified');

    } else {

        verificationElement.textContent = 'Email not verified';
        verificationElement.classList.remove('verified');

    }

});


// Logout functionality
logoutButton.addEventListener('click', async () => {

    try {

        await signOut(auth);
        window.location.href = 'login.html';

    } catch (error) {

        console.error('Logout failed:', error);
        alert('Unable to log out. Please try again.');

    }

});