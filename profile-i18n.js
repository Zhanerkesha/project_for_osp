
 // Ewha Market - English/Korean translations for profile.html
// Owner: Sara
//
// Load after listings-i18n.js and before lang-toggle.js.

(function () {
    "use strict";

    if (!window.EwhaI18n) {
        console.warn("profile-i18n.js: load listings-i18n.js first.");
        return;
    }

    const PROFILE_STRINGS = {
        en: {
            // profile page
            "profile.pageTitle": "My Profile - Ewha Market",
            "profile.title": "My Profile",
            "profile.subtitle": "View your verified student badge, active listings, and saved favorites",
            "profile.post": "Post New Listing",

            // profile shortcuts
            "profile.myListings": "My Listings",
            "profile.manageItems": "Manage your items",
            "profile.favorites": "Favorites",
            "profile.savedItems": "Saved items",
            "profile.history": "History",
            "profile.recentlyViewed": "Recently viewed",

            // active listings
            "profile.activeListings": "Active Listings",
            "profile.viewAll": "View All",
            "profile.loadingListings": "Loading your listings...",
            "profile.emptyListings": "You do not have any active listings yet.",
            "profile.loadListingsError": "Unable to load your listings. Please try again later.",

            // profile information
            "profile.guest": "Guest",
            "profile.student": "Student",
            "profile.noEmail": "No email available",
            "profile.loginToView": "Please log in to view your profile",
            "profile.notLoggedIn": "Not logged in",
            "profile.loginToViewListings": "Please log in to view your listings.",
            "profile.guestError": "You are currently not logged in.",
            "profile.checking": "Checking verification...",
            "profile.verified": "✓ Verified student",
            "profile.notVerified": "Email not verified",

            // listing cards
            "profile.listingImage": "Listing image",
            "profile.untitled": "Untitled listing",
            "profile.active": "Active",
            "profile.edit": "Edit",

            // prices
            "profile.price.free": "Free",
            "profile.price.day": "/ day",
            "profile.price.week": "/ week",
            "profile.price.hour": "/ hour",
            "profile.price.session": "/ session",

            // sidebar
            "sidebar.home": "🏠 Home",
            "sidebar.categories": "🗂️ Categories",
            "sidebar.chat": "💬 Chat",
            "sidebar.profile": "👤 My Profile",
            "sidebar.campusHub": "Ewha Campus Hub",
            "sidebar.verifiedOnly": "Verified students only (@ewha.ac.kr / @ewhain.net)"
        },

        ko: {
            // profile page
            "profile.pageTitle": "내 프로필 - 이화 마켓",
            "profile.title": "내 프로필",
            "profile.subtitle": "학생 인증 배지, 판매 중인 상품 및 저장한 즐겨찾기를 확인하세요",
            "profile.post": "새 상품 등록",

            // profile shortcuts
            "profile.myListings": "내 등록 상품",
            "profile.manageItems": "상품 관리",
            "profile.favorites": "즐겨찾기",
            "profile.savedItems": "저장한 상품",
            "profile.history": "기록",
            "profile.recentlyViewed": "최근 본 상품",

            // active listings
            "profile.activeListings": "판매 중인 상품",
            "profile.viewAll": "모두 보기",
            "profile.loadingListings": "등록 상품을 불러오는 중...",
            "profile.emptyListings": "아직 판매 중인 상품이 없습니다.",
            "profile.loadListingsError": "등록 상품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",

            // profile information
            "profile.guest": "비회원",
            "profile.student": "학생",
            "profile.noEmail": "이메일 정보 없음",
            "profile.loginToView": "프로필을 보려면 로그인해 주세요",
            "profile.notLoggedIn": "로그인되지 않음",
            "profile.loginToViewListings": "등록 상품을 보려면 로그인해 주세요.",
            "profile.guestError": "현재 로그인되어 있지 않습니다.",
            "profile.checking": "인증 상태 확인 중...",
            "profile.verified": "✓ 학생 인증 완료",
            "profile.notVerified": "이메일 인증 미완료",

            // listing cards
            "profile.listingImage": "상품 이미지",
            "profile.untitled": "제목 없는 상품",
            "profile.active": "판매 중",
            "profile.edit": "수정",

            // prices
            "profile.price.free": "무료",
            "profile.price.day": "/ 일",
            "profile.price.week": "/ 주",
            "profile.price.hour": "/ 시간",
            "profile.price.session": "/ 회",

            // sidebar
            "sidebar.home": "🏠 홈",
            "sidebar.categories": "🗂️ 카테고리",
            "sidebar.chat": "💬 채팅",
            "sidebar.profile": "👤 내 프로필",
            "sidebar.campusHub": "이화 캠퍼스 허브",
            "sidebar.verifiedOnly": "인증된 학생 전용 (@ewha.ac.kr / @ewhain.net)"
        }
    };

    // Add profile translations to the shared translation system
    ["en", "ko"].forEach(function (lang) {
        Object.assign(
            window.EwhaI18n.strings[lang],
            PROFILE_STRINGS[lang]
        );
    });

    // Translate the page using the currently selected language
    window.EwhaI18n.translate(document);

})();
