// Ewha Market - EN/KO strings for messages.html
// Owner: Zhansaya
//
// How it works:
//   listings-i18n.js (Zhanerke) creates window.EwhaI18n with the shared dictionary.
//   This file ADDS the chat page's words to that dictionary (it does not edit her file).
//   - Static HTML text: data-i18n="key", data-i18n-placeholder="key", data-i18n-aria="key"
//   - Text made in messages.js: EwhaI18n.t("key")
// Load order in messages.html: listings-i18n.js -> lang-toggle.js -> messages-i18n.js -> messages.js

(function () {
    "use strict";

    if (!window.EwhaI18n) {
        console.warn("messages-i18n.js: load listings-i18n.js first");
        return;
    }

    const CHAT_STRINGS = {
        en: {
            // sidebar + top bar (same keys as index.html)
            "nav.home": "Home",
            "nav.categories": "Categories",
            "nav.chat": "Chat",
            "nav.profile": "My Profile",
            "sidebar.hub": "Ewha Campus Hub",
            "chat.sidebar.verified": "Verified students only",

            // page
            "chat.pageTitle": "Messages - Ewha Market",
            "chat.title": "💬 Campus Messages",
            "chat.subtitle": "Chat directly with Ewha buyers, sellers, and study partners",
            "chat.tab.buying": "Buying",
            "chat.tab.selling": "Selling",

            // left: list + add by email
            "chat.search.placeholder": "Search conversations...",
            "chat.search.aria": "Search conversations",
            "chat.add.toggle": "+ Add",
            "chat.add.aria": "Add a person by email",
            "chat.add.label": "Start a chat by email",
            "chat.add.submit": "Add",
            "chat.add.cancel": "Cancel",
            "chat.add.searching": "Searching...",
            "chat.add.self": "That's your own email 🙂",
            "chat.add.notFound": "No user found. They may need to open the Chat page once first.",
            "chat.add.denied": "Searching users is not allowed yet (Firestore rules).",
            "chat.add.error": "Something went wrong. Please try again.",
            "chat.list.empty": "No conversations yet",

            // right: chat window
            "chat.placeholder": "Select a conversation to start chatting",
            "chat.back": "Back to conversations",
            "chat.input.placeholder": "Type a message...",
            "chat.input.aria": "Message",
            "chat.send": "Send",
            "chat.role.seller": "Seller",
            "chat.role.buyer": "Buyer",
            "chat.free": "Free",
            "chat.yesterday": "Yesterday",

            // sample messages ({name} = the other person's nickname)
            "chat.sampleNote": "Sample chat · messages are not saved",

            // status box
            "chat.status.loadChats": "Could not load conversations. Open the console (F12) for details.",
            "chat.status.loadContacts": "Could not load the people you added. Open the console (F12) for details.",
            "chat.status.noListing": "This listing doesn't exist anymore.",
            "chat.status.ownListing": "This is your own listing. Check the Selling tab for buyers' messages.",
            "chat.status.startError": "Could not start the chat. Please try again.",
            "chat.status.login": "Please log in to see your messages."
        },

        ko: {
            "nav.home": "홈",
            "nav.categories": "카테고리",
            "nav.chat": "채팅",
            "nav.profile": "마이페이지",
            "sidebar.hub": "이화 캠퍼스 허브",
            "chat.sidebar.verified": "이화인 인증 학생 전용",

            "chat.pageTitle": "메시지 - 이화마켓",
            "chat.title": "💬 캠퍼스 메시지",
            "chat.subtitle": "이화인 구매자, 판매자, 스터디 파트너와 바로 대화하세요",
            "chat.tab.buying": "구매",
            "chat.tab.selling": "판매",

            "chat.search.placeholder": "대화 검색...",
            "chat.search.aria": "대화 검색",
            "chat.add.toggle": "+ 추가",
            "chat.add.aria": "이메일로 사람 추가",
            "chat.add.label": "이메일로 채팅 시작하기",
            "chat.add.submit": "추가",
            "chat.add.cancel": "취소",
            "chat.add.searching": "검색 중...",
            "chat.add.self": "본인의 이메일이에요 🙂",
            "chat.add.notFound": "사용자를 찾을 수 없어요. 상대방이 채팅 페이지를 한 번 열어야 할 수도 있어요.",
            "chat.add.denied": "아직 사용자 검색이 허용되지 않았어요 (Firestore 규칙).",
            "chat.add.error": "문제가 발생했어요. 다시 시도해 주세요.",
            "chat.list.empty": "아직 대화가 없어요",

            "chat.placeholder": "대화를 선택해 채팅을 시작하세요",
            "chat.back": "대화 목록으로 돌아가기",
            "chat.input.placeholder": "메시지를 입력하세요...",
            "chat.input.aria": "메시지",
            "chat.send": "보내기",
            "chat.role.seller": "판매자",
            "chat.role.buyer": "구매자",
            "chat.free": "무료",
            "chat.yesterday": "어제",

            "chat.sampleNote": "샘플 채팅 · 메시지는 저장되지 않아요",

            "chat.status.loadChats": "대화를 불러오지 못했어요. 자세한 내용은 콘솔(F12)을 확인하세요.",
            "chat.status.loadContacts": "추가한 사람 목록을 불러오지 못했어요. 자세한 내용은 콘솔(F12)을 확인하세요.",
            "chat.status.noListing": "이 게시물은 더 이상 존재하지 않아요.",
            "chat.status.ownListing": "내가 올린 게시물이에요. 구매자의 메시지는 판매 탭에서 확인하세요.",
            "chat.status.startError": "채팅을 시작하지 못했어요. 다시 시도해 주세요.",
            "chat.status.login": "메시지를 보려면 로그인해 주세요."
        }
    };

    // Add our words to the shared dictionary (Object.assign = copy all keys into it)
    Object.assign(window.EwhaI18n.strings.en, CHAT_STRINGS.en);
    Object.assign(window.EwhaI18n.strings.ko, CHAT_STRINGS.ko);

    // Translate the page now (in case listings-i18n.js already translated before our words existed)
    window.EwhaI18n.translate(document);
    document.title = window.EwhaI18n.t("chat.pageTitle");
})();