
// Ewha Market - EN/KO translations for item-detail.html
// Owner: Sara
//
// Load after listings-i18n.js and before lang-toggle.js.

(function () {
    "use strict";

    if (!window.EwhaI18n) {
        console.warn("item-detail-i18n.js: load listings-i18n.js first");
        return;
    }

    const ITEM_DETAIL_STRINGS = {
        en: {
            "itemDetail.pageTitle": "Item Details - Ewha Market",
            "itemDetail.heading": "Item Details",
            "itemDetail.home": "Home",
            "itemDetail.loading": "Loading item details...",
            "itemDetail.notSpecified": "Not specified",
            "itemDetail.free": "Free",
            "itemDetail.locationNotSpecified": "Location not specified",
            "itemDetail.postedJustNow": "Posted just now",
            "itemDetail.postedMinutes": "Posted {n} minutes ago",
            "itemDetail.postedMinute": "Posted 1 minute ago",
            "itemDetail.postedHours": "Posted {n} hours ago",
            "itemDetail.postedHour": "Posted 1 hour ago",
            "itemDetail.postedDays": "Posted {n} days ago",
            "itemDetail.postedDay": "Posted 1 day ago",
            "itemDetail.noDescription": "No description provided.",
            "itemDetail.unknownSeller": "Unknown seller",
            "itemDetail.verifiedStudent": "Verified Ewha Student",
            "itemDetail.contact": "Contact Seller/Provider",
            "itemDetail.save": "♡ Save to Favorites",
            "itemDetail.saved": "♥ Saved to Favorites",
            "itemDetail.imageAlt": "Listing image",
            "itemDetail.untitled": "Untitled listing",

            "itemDetail.type.buy": "Buy",
            "itemDetail.type.rent": "Rent",
            "itemDetail.type.service": "Service",

            "itemDetail.condition.new": "New",
            "itemDetail.condition.likeNew": "Like New",
            "itemDetail.condition.good": "Good",
            "itemDetail.condition.fair": "Fair",

            "itemDetail.price.perDay": "/ day",
            "itemDetail.price.perWeek": "/ week",
            "itemDetail.price.perHour": "/ hour",

            "itemDetail.error.noId": "No listing ID was provided. Please open this page by selecting a listing.",
            "itemDetail.error.noStore": "The listing data store could not be found. Check listings-data.js.",
            "itemDetail.error.notFound": "This listing could not be found.",
            "itemDetail.error.load": "Could not load listing. Please check your database connection.",

            "sidebar.home": "🏠 Home",
            "sidebar.categories": "🗂️ Categories",
            "sidebar.chat": "💬 Chat",
            "sidebar.profile": "👤 My Profile",
            "sidebar.campusHub": "Ewha Campus Hub",
            "sidebar.verifiedOnly": "Verified students only (@ewha.ac.kr / @ewhain.net)"
        },

        ko: {
            "itemDetail.pageTitle": "물품 상세 정보 - 이화 마켓",
            "itemDetail.heading": "물품 상세 정보",
            "itemDetail.home": "홈",
            "itemDetail.loading": "물품 정보를 불러오는 중...",
            "itemDetail.notSpecified": "정보 없음",
            "itemDetail.free": "무료",
            "itemDetail.locationNotSpecified": "위치 정보 없음",
            "itemDetail.postedJustNow": "방금 등록됨",
            "itemDetail.postedMinutes": "{n}분 전 등록",
            "itemDetail.postedMinute": "1분 전 등록",
            "itemDetail.postedHours": "{n}시간 전 등록",
            "itemDetail.postedHour": "1시간 전 등록",
            "itemDetail.postedDays": "{n}일 전 등록",
            "itemDetail.postedDay": "1일 전 등록",
            "itemDetail.noDescription": "등록된 설명이 없습니다.",
            "itemDetail.unknownSeller": "알 수 없는 판매자",
            "itemDetail.verifiedStudent": "이화 학생 인증 완료",
            "itemDetail.contact": "판매자/제공자에게 연락하기",
            "itemDetail.save": "♡ 찜하기",
            "itemDetail.saved": "♥ 찜한 물품",
            "itemDetail.imageAlt": "등록된 물품 이미지",
            "itemDetail.untitled": "제목 없는 물품",

            "itemDetail.type.buy": "판매",
            "itemDetail.type.rent": "대여",
            "itemDetail.type.service": "서비스",

            "itemDetail.condition.new": "새 상품",
            "itemDetail.condition.likeNew": "거의 새 상품",
            "itemDetail.condition.good": "좋음",
            "itemDetail.condition.fair": "보통",

            "itemDetail.price.perDay": "/ 일",
            "itemDetail.price.perWeek": "/ 주",
            "itemDetail.price.perHour": "/ 시간",

            "itemDetail.error.noId": "물품 ID가 제공되지 않았습니다. 물품을 선택하여 이 페이지를 열어 주세요.",
            "itemDetail.error.noStore": "물품 데이터 저장소를 찾을 수 없습니다. listings-data.js를 확인해 주세요.",
            "itemDetail.error.notFound": "물품을 찾을 수 없습니다.",
            "itemDetail.error.load": "물품을 불러오지 못했습니다. 데이터베이스 연결을 확인해 주세요.",

            "sidebar.home": "🏠 홈",
            "sidebar.categories": "🗂️ 카테고리",
            "sidebar.chat": "💬 채팅",
            "sidebar.profile": "👤 내 프로필",
            "sidebar.campusHub": "이화 캠퍼스 허브",
            "sidebar.verifiedOnly": "인증된 학생 전용 (@ewha.ac.kr / @ewhain.net)"
        }
    };

    // Add item-detail translations to the shared dictionary
    ["en", "ko"].forEach(function (lang) {
        const dictionary = window.EwhaI18n.strings[lang];

        if (!dictionary) return;

        Object.assign(dictionary, ITEM_DETAIL_STRINGS[lang]);
    });

    // Translate the page after adding the new translations
    window.EwhaI18n.translate(document);

})();
