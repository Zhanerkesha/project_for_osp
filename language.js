"use strict";

// ==========================================
// EWHA MARKET - LANGUAGE TRANSLATION
// ==========================================

const dictionary = {
    home: ["Home", "홈"],
    categories: ["Categories", "카테고리"],
    chat: ["Chat", "채팅"],
    profile: ["My Profile", "내 프로필"],
    login: ["Log In", "로그인"],
    campusHub: ["Ewha Campus Hub", "이화 캠퍼스 커뮤니티"],
    verifiedStudents: ["Verified students only", "인증된 학생만 이용 가능"],

    browseCategory: ["Browse by Category", "카테고리별 둘러보기"],
    exploreCategories: ["Explore Categories", "카테고리 탐색"],
    browseSubcategories: ["Browse Subcategories", "세부 카테고리"],
    featuredListings: ["Featured Listings", "추천 게시글"],

    categoryIntro: [
        "Explore secondhand items, rentals, study materials, and student services within the Ewha community.",
        "이화 커뮤니티에서 중고거래, 물품 대여, 학습 자료 및 다양한 학생 서비스를 이용해 보세요."
    ],

    exploreDescription: [
        "Choose a category to discover available listings.",
        "카테고리를 선택하여 등록된 게시글을 확인해 보세요."
    ],

    subcategoryDescription: [
        "Find exactly what you need for your campus life.",
        "캠퍼스 생활에 필요한 물품과 서비스를 찾아보세요."
    ],

    featuredDescription: [
        "Discover useful items and services from the Ewha community.",
        "이화 커뮤니티의 유용한 물품과 서비스를 만나보세요."
    ],

    buy: ["Buy", "중고거래"],
    rent: ["Rent", "대여"],
    services: ["Services", "서비스"],
    studyMaterials: ["Study Materials", "학습 자료"],

    buySell: ["Buy & Sell", "중고거래"],
    rentLend: ["Rent & Lend", "물품 대여"],
    studentServices: ["Student Services", "학생 서비스"],

    buyDescription: [
        "Shop affordable clothes, electronics, and everyday essentials.",
        "합리적인 가격의 의류, 전자기기 및 생활용품을 찾아보세요."
    ],

    rentDescription: [
        "Rent calculators, cameras, textbooks, and equipment.",
        "계산기, 카메라, 교재 및 다양한 장비를 대여해 보세요."
    ],

    servicesDescription: [
        "Explore tutoring, language exchange, translation, and career support.",
        "과외, 언어 교환, 번역 및 취업 지원 서비스를 찾아보세요."
    ],

    notesDescription: [
        "Find textbooks, class notes, notebooks, and study resources.",
        "교재, 강의 필기, 노트 및 다양한 학습 자료를 찾아보세요."
    ],

    sample17: ["17 sample listings", "예시 게시글 17개"],
    sample7: ["7 sample listings", "예시 게시글 7개"],
    sample6: ["6 sample listings", "예시 게시글 6개"],

    everydayEssentials: ["Everyday essentials", "일상생활 필수품"],
    borrowInstead: ["Borrow instead of buying", "구매 대신 대여하기"],
    connectLearn: ["Connect and learn together", "함께 소통하고 배우기"],
    academicResources: ["Academic resources", "학업 관련 자료"],

    // BUY AND SELL CATEGORIES

    clothes: ["Clothes", "의류"],
    shoes: ["Shoes", "신발"],
    accessories: ["Bags & Accessories", "가방 및 액세서리"],
    beauty: ["Beauty & Makeup", "뷰티 및 화장품"],
    electronics: ["Electronics", "전자기기"],
    homeLiving: ["Home & Living", "생활용품"],
    books: ["Books", "도서"],
    hobbies: ["Toys & Hobbies", "장난감 및 취미"],
    sports: ["Sports & Fitness", "스포츠 및 운동"],
    stationery: ["Stationery", "문구류"],
    freeItems: ["Free Items", "무료 나눔"],
    other: ["Other", "기타"],

    clothesDescription: [
        "Hoodies, jackets, skirts and cardigans",
        "후드티, 재킷, 치마 및 카디건"
    ],

    shoesDescription: [
        "Sneakers, boots and flats",
        "운동화, 부츠 및 플랫슈즈"
    ],

    accessoriesDescription: [
        "Bags, jewelry and hair accessories",
        "가방, 주얼리 및 헤어 액세서리"
    ],

    beautyDescription: [
        "Beauty tools and organizers",
        "미용 도구 및 화장품 정리함"
    ],

    electronicsDescription: [
        "Headphones, laptops and gadgets",
        "헤드폰, 노트북 및 전자기기"
    ],

    homeLivingDescription: [
        "Desk lamps and room essentials",
        "책상 조명 및 생활 필수품"
    ],

    booksDescription: [
        "Novels, magazines and general books",
        "소설, 잡지 및 일반 도서"
    ],

    hobbiesDescription: [
        "Collectibles, crafts and board games",
        "수집품, 공예 및 보드게임"
    ],

    sportsDescription: [
        "Sports equipment and accessories",
        "운동 장비 및 스포츠 용품"
    ],

    stationeryDescription: [
        "Pens, planners and notebooks",
        "필기구, 플래너 및 노트"
    ],

    freeItemsDescription: [
        "Free giveaways from students",
        "학생들의 무료 나눔 물품"
    ],

    otherDescription: [
        "Other secondhand items",
        "기타 중고 물품"
    ],

    // RENTAL CATEGORIES

    calculators: ["Calculators", "계산기"],
    cameras: ["Cameras & Electronics", "카메라 및 전자기기"],
    textbooks: ["Books & Textbooks", "도서 및 교재"],
    eventEquipment: ["Event Equipment", "행사 장비"],
    otherRentals: ["Other Rentals", "기타 대여 물품"],

    calculatorsDescription: [
        "Scientific and engineering calculators",
        "과학용 및 공학용 계산기"
    ],

    camerasDescription: [
        "Cameras, projectors and devices",
        "카메라, 프로젝터 및 전자기기"
    ],

    textbooksDescription: [
        "Borrow books for short periods",
        "단기간 도서 및 교재 대여"
    ],

    eventEquipmentDescription: [
        "Presentation and event supplies",
        "발표 및 행사 관련 용품"
    ],

    otherRentalsDescription: [
        "Other items available to rent",
        "대여 가능한 기타 물품"
    ],

    // STUDENT SERVICES

    tutoring: ["Tutoring", "과외"],
    languageExchange: ["Language Exchange", "언어 교환"],
    translation: ["Translation", "번역"],
    career: ["Career & Portfolio Help", "취업 및 포트폴리오 지원"],
    studyGroups: ["Study Groups", "스터디 그룹"],

    tutoringDescription: [
        "Python, Java, mathematics and more",
        "파이썬, 자바, 수학 등 다양한 과외"
    ],

    languageExchangeDescription: [
        "Practice Korean, English and more",
        "한국어, 영어 등 다양한 언어 연습"
    ],

    translationDescription: [
        "Language and translation assistance",
        "언어 및 번역 지원"
    ],

    careerDescription: [
        "Resume and portfolio reviews",
        "이력서 및 포트폴리오 검토"
    ],

    studyGroupsDescription: [
        "Find students to study together",
        "함께 공부할 학생 찾기"
    ],

    // STUDY MATERIALS

    lectureNotes: ["Lecture Notes", "강의 필기"],
    courseTextbooks: ["Course Textbooks", "전공 교재"],
    pastPapers: ["Past Papers / Jokbo", "기출문제 / 족보"],
    studyGuides: ["Study Guides", "학습 가이드"],
    labSupplies: ["Lab & Engineering Supplies", "실험 및 공학 용품"],

    lectureNotesDescription: [
        "Class notes and notebooks",
        "수업 필기 및 노트"
    ],

    courseTextbooksDescription: [
        "University textbooks and references",
        "대학교 교재 및 참고 도서"
    ],

    pastPapersDescription: [
        "Materials authorized for sharing",
        "공유가 허용된 학습 자료"
    ],

    studyGuidesDescription: [
        "Summaries and revision resources",
        "요약 및 시험 대비 자료"
    ],

    labSuppliesDescription: [
        "Course-related practical equipment",
        "수업 관련 실습 장비"
    ],

    // FEATURED LISTINGS

    hoodieTitle: ["Ewha University Hoodie", "이화여대 후드티"],
    headphonesTitle: ["Wireless Headphones", "무선 헤드폰"],
    calculatorTitle: ["Engineering Calculator", "공학용 계산기"],
    cameraTitle: ["Digital Camera", "디지털 카메라"],
    pythonTitle: ["Python Tutoring", "파이썬 과외"],
    javaTitle: ["Java Programming Tutoring", "자바 프로그래밍 과외"],
    dataStructuresTitle: ["Data Structures Notes", "자료구조 강의 필기"],
    architectureTitle: ["Computer Architecture Notes", "컴퓨터구조 강의 필기"],

    viewAll: ["View all", "전체 보기"],
    cameraCategory: ["Cameras", "카메라"],
    programming: ["Programming", "프로그래밍"],
    computerScience: ["Computer Science", "컴퓨터공학"],

    day: ["day", "일"],
    hour: ["hour", "시간"],
    week: ["week", "주"],
    month: ["month", "개월"],
    session: ["session", "회"],

    // SEARCH PAGE

    searchDiscovery: ["Search & Discovery", "검색 및 탐색"],

    searchIntro: [
        "Find secondhand items, rentals, study materials, and student services within the Ewha community.",
        "이화 커뮤니티에서 중고 물품, 대여 물품, 학습 자료 및 학생 서비스를 찾아보세요."
    ],

    searchPlaceholder: [
        "Enter item title, course code, or keyword...",
        "상품명, 과목 코드 또는 검색어를 입력하세요..."
    ],

    search: ["Search", "검색"],
    listingType: ["Listing Type", "게시글 유형"],
    allTypes: ["All Types", "전체 유형"],
    category: ["Category", "카테고리"],
    allCategories: ["All Categories", "전체 카테고리"],

    price: ["Price (₩)", "가격 (₩)"],
    priceRange: ["Price Range", "가격 범위"],
    min: ["Min", "최소"],
    max: ["Max", "최대"],

    courseCode: ["Course Code / Name", "과목 코드 / 과목명"],

    coursePlaceholder: [
        "e.g. 38403, Python",
        "예: 38403, 파이썬"
    ],

    filters: ["Filters", "필터"],
    applyFilters: ["Apply Filters", "필터 적용"],
    resetFilters: ["Reset Filters", "필터 초기화"],
    reset: ["Reset", "초기화"],
    moreFilters: ["More filters", "추가 필터"],

    condition: ["Condition", "상품 상태"],
    anyCondition: ["Any Condition", "전체 상태"],
    new: ["New", "새 상품"],
    likeNew: ["Like New", "새 상품급"],
    good: ["Good", "상태 좋음"],
    used: ["Used", "사용감 있음"],

    payment: ["Payment", "결제 유형"],
    servicePayment: ["Service Payment", "서비스 이용료"],
    allServices: ["All Services", "전체 서비스"],
    freeServices: ["Free Services", "무료 서비스"],
    paidServices: ["Paid Services", "유료 서비스"],
    free: ["Free", "무료"],
    paid: ["Paid", "유료"],

    sortBy: ["Sort By", "정렬 기준"],
    newest: ["Newest First", "최신순"],
    priceLow: ["Price: Low to High", "가격 낮은 순"],
    priceHigh: ["Price: High to Low", "가격 높은 순"],
    nameAZ: ["Name: A to Z", "이름순"],

    searchResults: ["Search Results", "검색 결과"],
    availableListings: ["Available Listings", "등록된 게시글"],
    noResults: ["No results found", "검색 결과가 없습니다"],

    noResultsDescription: [
        "Try another keyword or change your filters.",
        "다른 검색어를 입력하거나 필터를 변경해 보세요."
    ],

    demoNote: [
        "Note: These are sample listings for the Ewha Market prototype. Real listings will be connected through Firebase later.",
        "안내: 이 게시글은 이화마켓 프로토타입의 예시입니다. 실제 게시글은 추후 Firebase를 통해 연동될 예정입니다."
    ]
};


// ==========================================
// ALL 37 LISTING TRANSLATIONS
// ==========================================

const listingTranslations = {

    // BUY & SELL

    "Used Desk Lamp": "중고 책상 조명",
    "Affordable desk lamp for studying.":
        "공부할 때 사용하기 좋은 저렴한 책상 조명입니다.",

    "Wireless Headphones": "무선 헤드폰",
    "Wireless headphones in good condition.":
        "상태가 좋은 무선 헤드폰입니다.",

    "Ewha University Hoodie": "이화여대 후드티",
    "Comfortable Ewha hoodie, barely worn.":
        "거의 입지 않은 편안한 이화여대 후드티입니다.",

    "Mini Desk Fan": "미니 선풍기",
    "Compact desk fan for your study room.":
        "공부방에서 사용하기 좋은 소형 선풍기입니다.",

    "Cream Knit Cardigan": "크림색 니트 카디건",
    "Soft cream cardigan for autumn.":
        "가을에 입기 좋은 부드러운 크림색 카디건입니다.",

    "Oversized Denim Jacket": "오버핏 데님 재킷",
    "Casual oversized denim jacket.":
        "캐주얼하게 입기 좋은 오버핏 데님 재킷입니다.",

    "Pleated Skirt": "플리츠 스커트",
    "Comfortable pleated skirt for everyday wear.":
        "일상에서 편하게 입을 수 있는 플리츠 스커트입니다.",

    "White Sneakers": "흰색 운동화",
    "Casual sneakers for everyday wear.":
        "일상에서 신기 좋은 캐주얼 운동화입니다.",

    "Canvas Tote Bag": "캔버스 에코백",
    "Lightweight bag for university classes.":
        "대학교 수업에 사용하기 좋은 가벼운 가방입니다.",

    "Makeup Organizer": "화장품 정리함",
    "Convenient organizer for makeup and beauty products.":
        "화장품과 미용 제품을 편리하게 정리할 수 있습니다.",

    "Grey Hoodie": "회색 후드티",
    "Comfortable grey hoodie for campus life.":
        "캠퍼스 생활에 입기 좋은 편안한 회색 후드티입니다.",

    "English Novel": "영어 소설",
    "Secondhand English reading book.":
        "중고 영어 도서입니다.",

    "Board Game": "보드게임",
    "Fun board game to enjoy with friends.":
        "친구들과 함께 즐길 수 있는 재미있는 보드게임입니다.",

    "Yoga Mat": "요가 매트",
    "Exercise mat for home workouts.":
        "홈트레이닝에 사용하기 좋은 운동 매트입니다.",

    "Stationery Set": "문구 세트",
    "Pens and stationery for classes.":
        "수업에 필요한 펜과 문구류입니다.",

    "Free Folder Set": "무료 파일 세트",
    "Free folders for another Ewha student.":
        "이화여대 학생에게 무료로 나눔하는 파일입니다.",

    "Compact Umbrella": "접이식 우산",
    "Convenient umbrella for rainy days on campus.":
        "비 오는 날 캠퍼스에서 사용하기 편리한 우산입니다.",

    // RENT & LEND

    "Engineering Calculator": "공학용 계산기",
    "Scientific calculator for engineering exams.":
        "공학 시험에 사용할 수 있는 공학용 계산기입니다.",

    "Digital Camera": "디지털 카메라",
    "Rent a digital camera for campus events.":
        "교내 행사에 사용할 디지털 카메라를 대여해 보세요.",

    "Linear Algebra Textbook": "선형대수학 교재",
    "Borrow a textbook for your mathematics class.":
        "수학 수업에 필요한 교재를 대여할 수 있습니다.",

    "Scientific Calculator": "공학용 계산기",
    "Calculator available during exam season.":
        "시험 기간에 대여할 수 있는 계산기입니다.",

    "Portable Projector": "휴대용 프로젝터",
    "Useful for group presentations.":
        "팀 발표에 사용하기 좋은 프로젝터입니다.",

    "Camera Tripod": "카메라 삼각대",
    "Tripod available for presentations and filming.":
        "발표 및 촬영에 사용할 수 있는 삼각대입니다.",

    "Puzzle Set": "퍼즐 세트",
    "Borrow a puzzle set to enjoy with friends.":
        "친구들과 함께 즐길 수 있는 퍼즐 세트를 대여해 보세요.",

    // STUDENT SERVICES

    "Python Tutoring": "파이썬 과외",
    "Beginner-friendly Python programming tutoring.":
        "초보자를 위한 파이썬 프로그래밍 과외입니다.",

    "Java Programming Tutoring": "자바 프로그래밍 과외",
    "Learn Java programming and object-oriented concepts.":
        "자바 프로그래밍과 객체지향 프로그래밍 개념을 배워보세요.",

    "Korean-English Language Exchange": "한영 언어 교환",
    "Practice Korean and English together.":
        "한국어와 영어를 함께 연습해 보세요.",

    "Korean-English Translation": "한영 번역",
    "Translation assistance for university students.":
        "대학생을 위한 번역 지원 서비스입니다.",

    "Resume and Portfolio Review": "이력서 및 포트폴리오 검토",
    "Get feedback on your resume and portfolio.":
        "이력서와 포트폴리오에 대한 피드백을 받아보세요.",

    "Computer Science Study Group": "컴퓨터공학 스터디 그룹",
    "Find friends to study programming together.":
        "함께 프로그래밍을 공부할 친구를 찾아보세요.",

    // STUDY MATERIALS

    "Computer Architecture Notes": "컴퓨터구조 강의 필기",
    "Revision notes covering RISC-V and memory hierarchy.":
        "RISC-V와 메모리 계층 구조를 정리한 시험 대비 필기입니다.",

    "Data Structures Notes": "자료구조 강의 필기",
    "Notes on linked lists, trees, graphs and sorting.":
        "연결 리스트, 트리, 그래프 및 정렬을 정리한 필기입니다.",

    "Linear Algebra Notebook": "선형대수학 필기 노트",
    "Handwritten linear algebra revision notes.":
        "손으로 정리한 선형대수학 시험 대비 필기입니다.",

    "Calculus Textbook": "미분적분학 교재",
    "University calculus textbook for mathematics students.":
        "수학을 공부하는 대학생을 위한 미분적분학 교재입니다.",

    "Mathematics Revision Guide": "수학 시험 대비 자료",
    "Revision guide for university mathematics.":
        "대학 수학 시험을 준비하기 위한 학습 자료입니다.",

    "Practice Exam Papers": "시험 연습 문제",
    "Practice exam materials authorized for sharing.":
        "공유가 허용된 시험 연습 자료입니다.",

    "Engineering Breadboard": "공학 실습용 브레드보드",
    "Useful breadboard for engineering laboratory classes.":
        "공학 실험 및 실습 수업에 사용하기 좋은 브레드보드입니다.",

    // COURSE NAMES AND SUBJECTS

    "Engineering Mathematics": "공학수학",
    "Linear Algebra": "선형대수학",
    "Python Programming": "파이썬 프로그래밍",
    "Java Programming": "자바 프로그래밍",
    "Computer Architecture": "컴퓨터구조",
    "Data Structures": "자료구조",
    "Calculus": "미분적분학",
    "Mathematics": "수학",
    "Computer Science": "컴퓨터공학",
    "Languages": "언어",
    "Engineering": "공학",
    "Programming": "프로그래밍",
    "Python": "파이썬",
    "Java": "자바",

    // VALIDATION MESSAGES

    "Please enter a valid price.":
        "올바른 가격을 입력해 주세요.",

    "Price cannot be negative.":
        "가격은 0원 이상이어야 합니다.",

    "Minimum price cannot be greater than maximum price.":
        "최소 가격은 최대 가격보다 높을 수 없습니다."
};


// ==========================================
// ADDITIONAL LABELS
// ==========================================

const extraLabels = {
    "BUY": "중고거래",
    "RENT": "대여",
    "SERVICE": "서비스",
    "SERVICES": "서비스",
    "STUDY MATERIALS": "학습 자료",

    "All": "전체",
    "Fashion": "의류",
    "Furniture": "생활용품",
    "Study": "학습 자료",
    "Language": "언어 교환",
    "Career": "취업 지원",
    "Hobbies": "취미",
    "Sports": "스포츠",

    "Like New": "새 상품급",
    "Like new": "새 상품급",
    "Like-new": "새 상품급",
    "like-new": "새 상품급",
    "New": "새 상품",
    "Good": "상태 좋음",
    "Used": "사용감 있음",

    "Free": "무료",
    "Paid": "유료",
    "free": "무료",
    "paid": "유료",

    "buy": "중고거래",
    "rent": "대여",
    "services": "서비스",
    "notes": "학습 자료",

    "day": "일",
    "hour": "시간",
    "week": "주",
    "month": "개월",
    "session": "회"
};


// ==========================================
// BUILD TRANSLATION DICTIONARIES
// ==========================================

const translations = {
    en: {},
    ko: {}
};

const englishToKorean = new Map();

Object.entries(dictionary).forEach(([key, values]) => {
    translations.en[key] = values[0];
    translations.ko[key] = values[1];

    englishToKorean.set(values[0], values[1]);
});

Object.entries(extraLabels).forEach(([english, korean]) => {
    englishToKorean.set(english, korean);
});

Object.entries(listingTranslations).forEach(([english, korean]) => {
    englishToKorean.set(english, korean);
});


// ==========================================
// SAVED LANGUAGE
// ==========================================

let currentLanguage =
    localStorage.getItem("ewhaLanguage") === "ko"
        ? "ko"
        : "en";


// ==========================================
// BILINGUAL SEARCH HELPER
// ==========================================

function getBilingualSearchText(values) {
    return values
        .filter(Boolean)
        .map(value => {
            const english = String(value);
            const korean =
                englishToKorean.get(english.trim()) || "";

            return `${english} ${korean}`;
        })
        .join(" ");
}


// ==========================================
// STATIC TRANSLATION
// ==========================================

function translateStaticElements() {
    const selected = translations[currentLanguage];

    document.querySelectorAll("[data-i18n]")
        .forEach(element => {
            const key = element.dataset.i18n;

            if (selected[key] !== undefined &&
                element.textContent !== selected[key]) {

                element.textContent = selected[key];
            }
        });

    document.querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {
            const key = element.dataset.i18nPlaceholder;

            if (selected[key] !== undefined) {
                element.placeholder = selected[key];
            }
        });

    document.querySelectorAll("[data-i18n-label]")
        .forEach(element => {
            const key = element.dataset.i18nLabel;

            if (selected[key] !== undefined) {
                element.label = selected[key];
            }
        });
}


// ==========================================
// DYNAMIC TRANSLATION
// ==========================================

const originalText = new WeakMap();

function translateDynamicText(value) {
    if (currentLanguage === "en") {
        return value;
    }

    const text = value.trim();

    const count = text.match(
        /^(\d+)\s+listings?\s+found$/i
    );

    if (count) {
        return `게시글 ${count[1]}개`;
    }

    if (englishToKorean.has(text)) {
        return englishToKorean.get(text);
    }

    // Combined category and course information

    if (text.includes("•")) {
        return text.split("•")
            .map(part => {
                const label = part.trim();

                return englishToKorean.get(label)
                    || label;
            })
            .join(" • ");
    }

    // Rental and service price units

    return value.replace(
        /\/\s*(day|hour|week|month|session)\b/gi,
        (match, unit) =>
            "/ " + extraLabels[unit.toLowerCase()]
    );
}


function translateTextNode(node) {
    const current = node.nodeValue;

    if (!current || !current.trim()) {
        return;
    }

    let record = originalText.get(node);

    if (!record || current !== record.rendered) {
        record = {
            source: current,
            rendered: current
        };
    }

    const translated =
        translateDynamicText(record.source);

    record.rendered = translated;

    originalText.set(node, record);

    if (node.nodeValue !== translated) {
        node.nodeValue = translated;
    }
}


function translateDynamicElements() {
    const elements = document.querySelectorAll(
        "#searchResults, #resultCount, #categoryFilter, #filterError"
    );

    elements.forEach(element => {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT
        );

        let node;

        while ((node = walker.nextNode())) {
            if (!node.parentElement.closest("[data-i18n]")) {
                translateTextNode(node);
            }
        }
    });

    document.querySelectorAll("#categoryFilter optgroup")
        .forEach(group => {
            if (group.dataset.i18nLabel) {
                return;
            }

            if (!group.dataset.originalLabel) {
                group.dataset.originalLabel = group.label;
            }

            const translated = translateDynamicText(
                group.dataset.originalLabel
            );

            if (group.label !== translated) {
                group.label = translated;
            }
        });
}


// ==========================================
// APPLY LANGUAGE
// ==========================================

function applyLanguage(language) {
    currentLanguage = language === "ko" ? "ko" : "en";

    document.documentElement.lang = currentLanguage;

    localStorage.setItem(
        "ewhaLanguage",
        currentLanguage
    );

    translateStaticElements();
    translateDynamicElements();

    const languageButton =
        document.getElementById("langToggle");

    if (languageButton) {
        languageButton.textContent =
            currentLanguage === "en"
                ? "🌐 EN"
                : "🌐 한국어";

        languageButton.title =
            currentLanguage === "en"
                ? "Switch to Korean"
                : "영어로 변경";

        languageButton.setAttribute(
            "aria-label",
            languageButton.title
        );
    }

    if (document.getElementById("searchResults")) {
        document.title =
            translations[currentLanguage].searchDiscovery
            + " - Ewha Market";

    } else if (
        document.body.classList.contains("categories-page")
    ) {
        document.title =
            translations[currentLanguage].categories
            + " - Ewha Market";
    }
}


// ==========================================
// INITIALIZE LANGUAGE TOGGLE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const languageButton =
        document.getElementById("langToggle");

    if (languageButton) {
        languageButton.disabled = false;

        languageButton.addEventListener("click", function () {
            const nextLanguage =
                currentLanguage === "en" ? "ko" : "en";

            applyLanguage(nextLanguage);
        });
    }

    applyLanguage(currentLanguage);

    const observer = new MutationObserver(function () {
        translateStaticElements();
        translateDynamicElements();
    });

    const dynamicSections = [
        "searchResults",
        "resultCount",
        "categoryFilter",
        "filterError"
    ];

    dynamicSections.forEach(id => {
        const element = document.getElementById(id);

        if (element) {
            observer.observe(element, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    });
});