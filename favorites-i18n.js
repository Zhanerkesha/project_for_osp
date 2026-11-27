// Ewha Market - EN/KO strings for favorites.html and the like (heart) buttons
// Owner: Safiyya
//
// listings-i18n.js creates window.EwhaI18n with the shared dictionary.
// This file ADDS the favourites words to it (it does not edit the shared file).
// Load order: listings-i18n.js -> favorites-i18n.js -> lang-toggle.js -> favorites.js

(function () {
  "use strict";

  if (!window.EwhaI18n) {
    console.warn("favorites-i18n.js: load listings-i18n.js first");
    return;
  }

  const FAV_STRINGS = {
    en: {
      "fav.pageTitle": "My Favorites - Ewha Market",
      "fav.title": "❤️ My Favorites",
      "fav.subtitle": "Items you liked, saved in one place",
      "fav.count": "{n} saved",
      "fav.loading": "Loading your favorites…",
      "fav.empty.title": "No favorites yet",
      "fav.empty.text": "Tap the 🤍 on any item to save it here.",
      "fav.error": "Could not load your favorites. Please try again.",
      "fav.saveError": "Could not update favorites. Please try again.",
      "fav.add": "Save to favorites",
      "fav.remove": "Remove from favorites",
      "fav.detail.add": "♡ Save to Favorites",
      "fav.detail.saved": "♥ Saved to Favorites",
      "fav.savedOn": "Saved {date}",
      "fav.untitled": "Untitled item",
      "fav.empty.cta": "Browse Marketplace",
      "fav.search.label": "Search favorites",
      "fav.search.placeholder": "Search your favorites...",
      "fav.sort.label": "Sort by",
      "fav.sort.recent": "Recently added",
      "fav.sort.priceAsc": "Price: low to high",
      "fav.sort.priceDesc": "Price: high to low",
      "fav.filter.label": "Filter by category",
      "fav.filter.all": "All",
      "fav.noResults.title": "No matching favorites",
      "fav.noResults.text": "Try another word or category.",
      "fav.noResults.clear": "Clear filters",
      "fav.status.sold": "SOLD",
      "fav.status.unavailable": "No longer available",
      "fav.viewDetails": "View details",
      "fav.messageSeller": "💬 Message seller",
      "fav.toast.saved": "Saved to favorites",
      "fav.toast.removed": "Removed from favorites",
      "fav.toast.undo": "Undo",
      "fav.toast.view": "View",
      "fav.badge.buy": "Buy",
      "fav.badge.rent": "Rent",
      "fav.badge.service": "Service",
      "fav.badge.notes": "Notes",
      "fav.priceDropped": "↓ Price dropped",
      "fav.wasPrice": "was {price}",
      "fav.saved.justNow": "Saved just now",
      "fav.saved.minutes": "Saved {n}m ago",
      "fav.saved.hours": "Saved {n}h ago",
      "fav.saved.days": "Saved {n}d ago",
      "fav.messageSellerLabel": "Message seller",
      "fav.messageShort": "Message",
    },
    ko: {
      "fav.pageTitle": "찜한 목록 - 이화 마켓",
      "fav.title": "❤️ 찜한 목록",
      "fav.subtitle": "마음에 든 물품을 한곳에서 확인하세요",
      "fav.count": "{n}개 저장됨",
      "fav.loading": "찜한 목록을 불러오는 중…",
      "fav.empty.title": "아직 찜한 물품이 없어요",
      "fav.empty.text": "물품의 🤍를 누르면 여기에 저장됩니다.",
      "fav.error": "찜한 목록을 불러오지 못했습니다. 다시 시도해 주세요.",
      "fav.saveError": "찜 목록을 변경하지 못했습니다. 다시 시도해 주세요.",
      "fav.add": "찜하기",
      "fav.remove": "찜 해제",
      "fav.detail.add": "♡ 찜하기",
      "fav.detail.saved": "♥ 찜한 물품",
      "fav.savedOn": "{date} 저장",
      "fav.untitled": "제목 없음",
      "fav.empty.cta": "마켓 둘러보기",
      "fav.search.label": "찜한 물품 검색",
      "fav.search.placeholder": "찜한 물품 검색...",
      "fav.sort.label": "정렬",
      "fav.sort.recent": "최근 추가순",
      "fav.sort.priceAsc": "가격 낮은순",
      "fav.sort.priceDesc": "가격 높은순",
      "fav.filter.label": "카테고리별 보기",
      "fav.filter.all": "전체",
      "fav.noResults.title": "일치하는 찜한 물품이 없어요",
      "fav.noResults.text": "다른 검색어나 카테고리를 선택해 보세요.",
      "fav.noResults.clear": "필터 초기화",
      "fav.status.sold": "판매 완료",
      "fav.status.unavailable": "더 이상 이용할 수 없음",
      "fav.viewDetails": "상세 보기",
      "fav.messageSeller": "💬 판매자에게 메시지",
      "fav.toast.saved": "찜 목록에 저장했어요",
      "fav.toast.removed": "찜 목록에서 삭제했어요",
      "fav.toast.undo": "되돌리기",
      "fav.toast.view": "보기",
      "fav.badge.buy": "판매",
      "fav.badge.rent": "대여",
      "fav.badge.service": "서비스",
      "fav.badge.notes": "노트",
      "fav.priceDropped": "↓ 가격 인하",
      "fav.wasPrice": "이전 가격 {price}",
      "fav.saved.justNow": "방금 저장",
      "fav.saved.minutes": "{n}분 전 저장",
      "fav.saved.hours": "{n}시간 전 저장",
      "fav.saved.days": "{n}일 전 저장",
      "fav.messageSellerLabel": "판매자에게 메시지",
      "fav.messageShort": "메시지",
    },
  };

  // Shared sidebar / top bar words used on favorites.html.
  // Only added if the shared dictionary doesn't have them yet (never overwrites a teammate's text).
  const SHELL_STRINGS = {
    en: {
      "nav.home": "Home",
      "nav.categories": "Categories",
      "nav.chat": "Chat",
      "nav.profile": "My Profile",
      "sidebar.hub": "Ewha Campus Hub",
      "fav.sidebar.verified": "Verified students only",
      "search.placeholder": "Enter item title, course code, or keyword...",
    },
    ko: {
      "nav.home": "홈",
      "nav.categories": "카테고리",
      "nav.chat": "채팅",
      "nav.profile": "내 프로필",
      "sidebar.hub": "이화 캠퍼스 허브",
      "fav.sidebar.verified": "인증된 학생 전용",
      "search.placeholder": "물품명, 학수번호 또는 키워드를 입력하세요...",
    },
  };

  ["en", "ko"].forEach(function (lang) {
    const dict = window.EwhaI18n.strings[lang];
    if (!dict) return;
    Object.assign(dict, FAV_STRINGS[lang]);
    Object.keys(SHELL_STRINGS[lang]).forEach(function (key) {
      if (dict[key] === undefined) dict[key] = SHELL_STRINGS[lang][key];
    });
  });

  // If the page was already translated before these words were added, translate it again
  window.EwhaI18n.translate(document);
})();
