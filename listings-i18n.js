// Ewha Market - KR/EN strings for add-item.html and my-listings.html
// Owner: Zhanerke  |  For Sara (lang.js): these keys can be merged into the shared dictionary.
//
// How it works:
//   - Static text in the HTML has data-i18n="key" (text) or data-i18n-placeholder="key" / data-i18n-aria="key".
//   - JS-generated text uses EwhaI18n.t('key').
//   - The current language is read from <html lang="..."> (set by the shared language toggle),
//     falling back to localStorage "lang". When <html lang> changes, the page re-translates itself
//     and fires "ewha:langchange" so the page scripts can re-render generated text.

(function () {
    'use strict';

    const STRINGS = {
        en: {
            // add-item: page
            'additem.title': '➕ Create New Listing',
            'additem.titleEdit': '✏️ Edit Listing',
            'additem.subtitle': 'Post an item for Buy, Rent, Study Notes, or Student Services',
            'additem.subtitleEdit': 'Update your listing details and save your changes',

            // add-item: type
            'additem.step1': '1. What are you posting?',
            'additem.typeGroup': 'Listing type',
            'type.buy': 'Buy & Sell',
            'type.rent': 'Rent & Borrow',
            'type.service': 'Student Service',
            'type.buy.hint': 'Items & study notes',
            'type.rent.hint': 'Lend for a day or week',
            'type.service.hint': 'Tutoring, language exchange',
            'badge.buy': 'Buy',
            'badge.notes': 'Notes',
            'badge.rent': 'Rent',
            'badge.service': 'Service',

            // add-item: basic info
            'additem.step2': '2. Basic information',
            'field.title': 'Title',
            'field.title.ph': 'e.g. Calculus 9th Edition Textbook',
            'field.category': 'Category',
            'field.condition': 'Condition',
            'field.condition.select': 'Select condition',
            'field.description': 'Description',
            'field.description.ph': "Describe the item or service: what's included, any damage, rental/return rules, languages, level...",
            'field.courseName': 'Course name',
            'field.courseName.ph': 'e.g. Calculus I',
            'field.courseCode': 'Course code',
            'field.courseCode.ph': 'e.g. 36338',
            'field.subject': 'Subject',
            'field.subject.ph': 'e.g. Mathematics',
            'field.course.help': 'Optional, but helps students find your listing by course.',
            'field.required': 'required',

            // add-item: price
            'additem.step3': '3. Price & availability',
            'field.price': 'Price',
            'field.priceUnit': 'Price unit',
            'field.free.buy': 'This item is free (giveaway)',
            'field.free.rent': 'Free to borrow',
            'field.free.service': 'This service is free (e.g. language exchange)',
            'field.availability': 'Availability',
            'field.availability.ph': 'e.g. Available now / Mon & Wed afternoons / Until Dec 15',
            'field.location': 'Meetup location',
            'field.location.select': 'Select a campus spot (optional)',

            // add-item: photo
            'additem.step4': '4. Photo',
            'field.photo.cta': 'Click to upload a photo',
            'field.photo.help': 'JPG or PNG, up to 5 MB',
            'field.photo.remove': 'Remove photo',
            'field.photo.preview': 'Selected photo preview',

            // add-item: policy & actions
            'policy.title': '📌 Ewha Market content policy',
            'policy.own': 'Only post items and study materials you own and are allowed to share.',
            'policy.copyright': 'No copyrighted textbook copies, lecture slides, or exam papers.',
            'policy.contact': 'Do not post private contact details. Use Ewha Market chat instead.',
            'policy.agree': 'I confirm this listing follows the content policy.',
            'btn.cancel': 'Cancel',
            'btn.post': 'Post Listing',
            'btn.save': 'Save Changes',
            'btn.saving': 'Saving…',

            // add-item: messages
            'msg.priceMissing': 'Please enter a price, or tick the "free" box.',
            'msg.photoTooBig': 'This photo is larger than 5 MB. Please choose a smaller file.',
            'msg.photoType': 'Please choose a JPG or PNG image.',
            'msg.fixErrors': 'Please fill in the highlighted fields.',
            'msg.saveFailed': 'Something went wrong while saving. Please try again.',
            'msg.notFound': 'This listing could not be found. It may have been deleted.',
            'msg.loginRequired': 'Please log in with your verified Ewha email to post a listing.',
            'msg.created': '✅ Your listing was posted.',
            'msg.updated': '✅ Your changes were saved.',
            'msg.deleted': '🗑️ Listing deleted.',
            'msg.loadFailed': 'Could not load your listings. Check your connection and refresh the page.',

            // categories
            'cat.textbooks': '📚 Textbooks & reference books',
            'cat.study_notes': '📝 Student notes & study materials',
            'cat.electronics': '💻 Electronics',
            'cat.clothing': '👕 Clothing & accessories',
            'cat.dorm_essentials': '🛏️ Dorm & household essentials',
            'cat.stationery': '✏️ Stationery & school supplies',
            'cat.other': '📦 Other',
            'cat.calculators': '🧮 Calculators',
            'cat.cameras': '📷 Cameras & photography',
            'cat.study_equipment': '🎧 Study equipment',
            'cat.language_exchange': '🗣️ Language exchange',
            'cat.tutoring': '👩‍🏫 Peer tutoring',
            'cat.study_partner': '🤝 Study partner / mentoring',
            'cat.skill_sharing': '🎨 Skill sharing',

            // price units & conditions
            'unit.once': 'one-time',
            'unit.per_day': 'per day',
            'unit.per_week': 'per week',
            'unit.per_hour': 'per hour',
            'unit.session': 'per session',
            'price.free': 'Free',
            'price.perDay': '/ day',
            'price.perWeek': '/ week',
            'price.perHour': '/ hour',
            'price.perSession': '/ session',
            'cond.New': 'New',
            'cond.Like New': 'Like New',
            'cond.Good': 'Good',
            'cond.Fair': 'Fair',

            // my-listings
            'mylist.title': '📋 My Listings',
            'mylist.subtitle': 'Edit, delete, or mark your Buy, Rent, and Service posts as completed',
            'mylist.new': '➕ New Listing',
            'mylist.filterType': 'Filter by listing type',
            'mylist.filterStatus': 'Filter by status',
            'mylist.tab.all': 'All',
            'mylist.tab.buy': '🛍️ Buy',
            'mylist.tab.rent': '🔄 Rent',
            'mylist.tab.service': '🤝 Services',
            'mylist.status.all': 'All statuses',
            'mylist.status.active': 'Active',
            'mylist.status.completed': 'Completed',
            'mylist.done.buy': 'Sold',
            'mylist.done.rent': 'Rented',
            'mylist.done.service': 'Done',
            'mylist.action.edit': '✏️ Edit',
            'mylist.action.complete.buy': '✔️ Mark sold',
            'mylist.action.complete.rent': '✔️ Mark rented',
            'mylist.action.complete.service': '✔️ Mark done',
            'mylist.action.relist': '↩️ Relist',
            'mylist.action.delete': 'Delete listing',
            'mylist.empty.title': 'No listings here yet',
            'mylist.empty.text': 'Sell a textbook, lend a calculator, or offer a language exchange.',
            'mylist.empty.cta': '➕ Create your first listing',
            'mylist.loading': 'Loading your listings…',
            'mylist.delete.title': 'Delete this listing?',
            'mylist.delete.text': '"{title}" will be removed permanently. This cannot be undone.',
            'mylist.delete.confirm': 'Delete',

            // time
            'time.justNow': 'just now',
            'time.minutes': '{n}m ago',
            'time.hours': '{n}h ago',
            'time.days': '{n}d ago',
            'time.weeks': '{n}w ago',

            
            // profile page
            'profile.title': 'My Profile',
            'profile.subtitle': 'View your verified student badge, active listings, and saved favorites',
            'profile.post': 'Post New Listing',
            'profile.myListings': 'My Listings',
            'profile.manageItems': 'Manage your items',
            'profile.favorites': 'Favorites',
            'profile.savedItems': 'Saved items',
            'profile.orders': 'Orders',
            'profile.currentOrders': 'Your current orders',
            'profile.history': 'History',
            'profile.recentlyViewed': 'Recently viewed',
            'profile.activeListings': 'Active Listings',
            'profile.viewAll': 'View All',
            'profile.edit': 'Edit',
            'profile.logout': 'Log Out',
            'profile.checking': 'Checking verification...',
            'profile.verified': '✓ Verified student',
            'profile.unverified': 'Email not verified',
            'profile.notLoggedIn': 'Not logged in',
            'profile.guest': 'Guest',
            'profile.loginRequired': 'Please log in to view your profile',
            'profile.noEmail': 'No email available',
            'profile.error': 'You are currently not logged in.',
            'profile.logoutError': 'Unable to log out. Please try again.',

            // item detail page
            'item.loading': 'Loading item details...',
            'item.error.noId': 'No listing ID was provided. Please open this page by selecting a listing.',
            'item.error.notFound': 'This listing could not be found.',
            'item.error.store': 'The listing data store could not be found. Check listings-data.js.',
            'item.error.load': 'Could not load listing. Please check your database connection.',
            'item.title': 'Item Details',
            'item.home': 'Home',
            'item.textbooks': 'Textbooks',
            'item.buy': 'Buy',
            'item.rent': 'Rent',
            'item.service': 'Service',
            'item.notSpecified': 'Not specified',
            'item.free': 'Free',
            'item.locationMissing': 'Location not specified',
            'item.descriptionMissing': 'No description provided.',
            'item.unknownSeller': 'Unknown seller',
            'item.verifiedSeller': '✦ Verified Ewha Student',
            'item.messageSeller': 'Message Seller',
            'item.saveFavorites': '♡ Save to Favorites',
            'item.login': 'Log In',
            'item.searchPlaceholder': 'Enter item title, course code, or keyword...'
        },

        ko: {
            'additem.title': '➕ 새 게시물 등록',
            'additem.titleEdit': '✏️ 게시물 수정',
            'additem.subtitle': '판매, 대여, 학습 자료, 학생 서비스를 등록하세요',
            'additem.subtitleEdit': '게시물 정보를 수정하고 저장하세요',

            'additem.step1': '1. 어떤 게시물을 올리나요?',
            'additem.typeGroup': '게시물 유형',
            'type.buy': '판매',
            'type.rent': '대여',
            'type.service': '학생 서비스',
            'type.buy.hint': '물품 및 필기 노트',
            'type.rent.hint': '하루 또는 일주일 단위 대여',
            'type.service.hint': '튜터링, 언어 교환',
            'badge.buy': '판매',
            'badge.notes': '노트',
            'badge.rent': '대여',
            'badge.service': '서비스',

            'additem.step2': '2. 기본 정보',
            'field.title': '제목',
            'field.title.ph': '예: 미적분학 9판 교재',
            'field.category': '카테고리',
            'field.condition': '상태',
            'field.condition.select': '상태 선택',
            'field.description': '설명',
            'field.description.ph': '구성품, 손상 여부, 대여/반납 규칙, 언어, 수준 등을 적어주세요...',
            'field.courseName': '과목명',
            'field.courseName.ph': '예: 미적분학 I',
            'field.courseCode': '학수번호',
            'field.courseCode.ph': '예: 36338',
            'field.subject': '분야',
            'field.subject.ph': '예: 수학',
            'field.course.help': '선택 사항이지만, 과목으로 검색할 때 도움이 됩니다.',
            'field.required': '필수',

            'additem.step3': '3. 가격 및 일정',
            'field.price': '가격',
            'field.priceUnit': '가격 단위',
            'field.free.buy': '무료 나눔',
            'field.free.rent': '무료 대여',
            'field.free.service': '무료 서비스 (예: 언어 교환)',
            'field.availability': '가능한 시간',
            'field.availability.ph': '예: 지금 가능 / 월·수 오후 / 12월 15일까지',
            'field.location': '거래 장소',
            'field.location.select': '캠퍼스 장소 선택 (선택 사항)',

            'additem.step4': '4. 사진',
            'field.photo.cta': '클릭하여 사진 업로드',
            'field.photo.help': 'JPG 또는 PNG, 최대 5MB',
            'field.photo.remove': '사진 삭제',
            'field.photo.preview': '선택한 사진 미리보기',

            'policy.title': '📌 이화마켓 게시 규칙',
            'policy.own': '본인이 소유하고 공유할 수 있는 물품과 자료만 올려주세요.',
            'policy.copyright': '저작권이 있는 교재 복사본, 강의 슬라이드, 시험지는 금지됩니다.',
            'policy.contact': '개인 연락처는 올리지 말고 이화마켓 채팅을 이용하세요.',
            'policy.agree': '이 게시물이 게시 규칙을 준수함을 확인합니다.',
            'btn.cancel': '취소',
            'btn.post': '등록하기',
            'btn.save': '변경사항 저장',
            'btn.saving': '저장 중…',

            'msg.priceMissing': '가격을 입력하거나 "무료"에 체크해주세요.',
            'msg.photoTooBig': '사진이 5MB보다 큽니다. 더 작은 파일을 선택해주세요.',
            'msg.photoType': 'JPG 또는 PNG 이미지를 선택해주세요.',
            'msg.fixErrors': '표시된 항목을 입력해주세요.',
            'msg.saveFailed': '저장 중 오류가 발생했습니다. 다시 시도해주세요.',
            'msg.notFound': '게시물을 찾을 수 없습니다. 삭제되었을 수 있습니다.',
            'msg.loginRequired': '게시물을 등록하려면 인증된 이화 이메일로 로그인해주세요.',
            'msg.created': '✅ 게시물이 등록되었습니다.',
            'msg.updated': '✅ 변경사항이 저장되었습니다.',
            'msg.deleted': '🗑️ 게시물이 삭제되었습니다.',
            'msg.loadFailed': '게시물을 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침해주세요.',

            'cat.textbooks': '📚 교재 및 참고서',
            'cat.study_notes': '📝 필기 노트 및 학습 자료',
            'cat.electronics': '💻 전자기기',
            'cat.clothing': '👕 의류 및 잡화',
            'cat.dorm_essentials': '🛏️ 기숙사 및 생활용품',
            'cat.stationery': '✏️ 문구 및 학용품',
            'cat.other': '📦 기타',
            'cat.calculators': '🧮 계산기',
            'cat.cameras': '📷 카메라 및 촬영 장비',
            'cat.study_equipment': '🎧 학습 용품',
            'cat.language_exchange': '🗣️ 언어 교환',
            'cat.tutoring': '👩‍🏫 튜터링',
            'cat.study_partner': '🤝 스터디 파트너 / 멘토링',
            'cat.skill_sharing': '🎨 재능 공유',

            'unit.once': '1회',
            'unit.per_day': '1일당',
            'unit.per_week': '1주당',
            'unit.per_hour': '1시간당',
            'unit.session': '1회당',
            'price.free': '무료',
            'price.perDay': '/ 일',
            'price.perWeek': '/ 주',
            'price.perHour': '/ 시간',
            'price.perSession': '/ 회',
            'cond.New': '새 상품',
            'cond.Like New': '거의 새 것',
            'cond.Good': '좋음',
            'cond.Fair': '사용감 있음',

            'mylist.title': '📋 내 게시물',
            'mylist.subtitle': '판매, 대여, 서비스 게시물을 수정, 삭제하거나 거래 완료로 표시하세요',
            'mylist.new': '➕ 새 게시물',
            'mylist.filterType': '게시물 유형별 보기',
            'mylist.filterStatus': '상태별 보기',
            'mylist.tab.all': '전체',
            'mylist.tab.buy': '🛍️ 판매',
            'mylist.tab.rent': '🔄 대여',
            'mylist.tab.service': '🤝 서비스',
            'mylist.status.all': '모든 상태',
            'mylist.status.active': '진행 중',
            'mylist.status.completed': '완료',
            'mylist.done.buy': '판매 완료',
            'mylist.done.rent': '대여 완료',
            'mylist.done.service': '완료',
            'mylist.action.edit': '✏️ 수정',
            'mylist.action.complete.buy': '✔️ 판매 완료',
            'mylist.action.complete.rent': '✔️ 대여 완료',
            'mylist.action.complete.service': '✔️ 완료 표시',
            'mylist.action.relist': '↩️ 다시 게시',
            'mylist.action.delete': '게시물 삭제',
            'mylist.empty.title': '아직 게시물이 없습니다',
            'mylist.empty.text': '교재를 판매하거나, 계산기를 빌려주거나, 언어 교환을 시작해보세요.',
            'mylist.empty.cta': '➕ 첫 게시물 등록하기',
            'mylist.loading': '게시물을 불러오는 중…',
            'mylist.delete.title': '이 게시물을 삭제할까요?',
            'mylist.delete.text': '"{title}" 게시물이 영구적으로 삭제됩니다. 되돌릴 수 없습니다.',
            'mylist.delete.confirm': '삭제',

            'time.justNow': '방금 전',
            'time.minutes': '{n}분 전',
            'time.hours': '{n}시간 전',
            'time.days': '{n}일 전',
            'time.weeks': '{n}주 전',


            // profile page
            'profile.title': '내 프로필',
            'profile.subtitle': '학생 인증 배지, 활성 게시물 및 즐겨찾기를 확인하세요',
            'profile.post': '새 게시물 등록',
            'profile.myListings': '내 게시물',
            'profile.manageItems': '게시물 관리',
            'profile.favorites': '즐겨찾기',
            'profile.savedItems': '저장한 게시물',
            'profile.orders': '주문',
            'profile.currentOrders': '현재 주문',
            'profile.history': '최근 기록',
            'profile.recentlyViewed': '최근 본 게시물',
            'profile.activeListings': '진행 중인 게시물',
            'profile.viewAll': '전체 보기',
            'profile.edit': '수정',
            'profile.logout': '로그아웃',
            'profile.checking': '인증 확인 중...',
            'profile.verified': '✓ 인증된 학생',
            'profile.unverified': '이메일 미인증',
            'profile.notLoggedIn': '로그인되지 않음',
            'profile.guest': '게스트',
            'profile.loginRequired': '프로필을 보려면 로그인하세요',
            'profile.noEmail': '이메일 정보가 없습니다',
            'profile.error': '현재 로그인되어 있지 않습니다.',
            'profile.logoutError': '로그아웃할 수 없습니다. 다시 시도해 주세요.',

            // item detail page
            'item.loading': '게시물 정보를 불러오는 중...',
            'item.error.noId': '게시물 ID가 없습니다. 게시물을 선택하여 이 페이지를 열어주세요.',
            'item.error.notFound': '게시물을 찾을 수 없습니다.',
            'item.error.store': '게시물 데이터 저장소를 찾을 수 없습니다. listings-data.js를 확인하세요.',
            'item.error.load': '게시물을 불러올 수 없습니다. 데이터베이스 연결을 확인하세요.',
            'item.title': '게시물 상세 정보',
            'item.home': '홈',
            'item.textbooks': '교재',
            'item.buy': '판매',
            'item.rent': '대여',
            'item.service': '서비스',
            'item.notSpecified': '정보 없음',
            'item.free': '무료',
            'item.locationMissing': '장소 정보 없음',
            'item.descriptionMissing': '설명이 없습니다.',
            'item.unknownSeller': '알 수 없는 판매자',
            'item.verifiedSeller': '✦ 이화 인증 학생',
            'item.messageSeller': '판매자에게 메시지 보내기',
            'item.saveFavorites': '♡ 즐겨찾기에 저장',
            'item.login': '로그인',
            'item.searchPlaceholder': '상품명, 과목 코드 또는 키워드 입력...',

            
        }
    };

    function currentLang() {
        let lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
        if (!STRINGS[lang]) {
            try { lang = (localStorage.getItem('lang') || '').toLowerCase(); } catch (e) { lang = ''; }
        }
        return STRINGS[lang] ? lang : 'en';
    }

    // t('time.hours', { n: 3 }) -> "3h ago"
    function t(key, params) {
        const dict = STRINGS[currentLang()];
        let text = dict[key] !== undefined ? dict[key] : (STRINGS.en[key] !== undefined ? STRINGS.en[key] : key);
        if (params) {
            Object.keys(params).forEach(function (name) {
                text = text.split('{' + name + '}').join(params[name]);
            });
        }
        return text;
    }

    function translate(root) {
        const scope = root || document;
        scope.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
        });
        scope.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
    }

    // Re-translate when the shared toggle changes <html lang="...">
    let lastLang = null;
    function onLangMaybeChanged() {
        const lang = currentLang();
        if (lang === lastLang) return;
        lastLang = lang;
        translate(document.querySelector('main') || document);
        document.dispatchEvent(new CustomEvent('ewha:langchange', { detail: { lang: lang } }));
    }

    new MutationObserver(onLangMaybeChanged)
        .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    window.addEventListener('storage', function (e) {
        if (e.key === 'lang') onLangMaybeChanged();
    });

    window.EwhaI18n = { t: t, translate: translate, currentLang: currentLang, strings: STRINGS };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onLangMaybeChanged);
    } else {
        onLangMaybeChanged();
    }
})();
