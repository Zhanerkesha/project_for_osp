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
  "use strict";

  const STRINGS = {
    en: {
      // add-item: page
      "additem.title": "➕ Create New Listing",
      "additem.titleEdit": "✏️ Edit Listing",
      "additem.subtitle":
        "Post an item for Buy, Rent, Study Notes, or Student Services",
      "additem.subtitleEdit":
        "Update your listing details and save your changes",

      // add-item: type
      "additem.step1": "1. What are you posting?",
      "additem.typeGroup": "Listing type",
      "type.buy": "Buy & Sell",
      "type.rent": "Rent & Borrow",
      "type.service": "Student Service",
      "type.buy.hint": "Items & study notes",
      "type.rent.hint": "Lend for a day or week",
      "type.service.hint": "Tutoring, language exchange",
      "badge.buy": "Buy",
      "badge.notes": "Notes",
      "badge.rent": "Rent",
      "badge.service": "Service",

      // add-item: basic info
      "additem.step2": "2. Basic information",
      "field.title": "Title",
      "field.title.ph": "e.g. Calculus 9th Edition Textbook",
      "field.category": "Category",
      "field.condition": "Condition",
      "field.condition.select": "Select condition",
      "field.description": "Description",
      "field.description.ph":
        "Describe the item or service: what's included, any damage, rental/return rules, languages, level...",
      "field.courseName": "Course name",
      "field.courseName.ph": "e.g. Calculus I",
      "field.courseCode": "Course code",
      "field.courseCode.ph": "e.g. 36338",
      "field.subject": "Subject",
      "field.subject.ph": "e.g. Mathematics",
      "field.course.help":
        "Optional, but helps students find your listing by course.",
      "field.required": "required",

      // add-item: price
      "additem.step3": "3. Price & availability",
      "field.price": "Price",
      "field.priceUnit": "Price unit",
      "field.free.buy": "This item is free (giveaway)",
      "field.free.rent": "Free to borrow",
      "field.free.service": "This service is free (e.g. language exchange)",
      "field.availability": "Availability",
      "field.availability.ph":
        "e.g. Available now / Mon & Wed afternoons / Until Dec 15",
      "field.location": "Meetup location",
      "field.location.select": "Select a campus spot (optional)",

      // add-item: photo
      "additem.step4": "4. Photo",
      "field.photo.cta": "Click to upload a photo",
      "field.photo.help": "JPG or PNG, up to 5 MB",
      "field.photo.remove": "Remove photo",
      "field.photo.preview": "Selected photo preview",

      // add-item: policy & actions
      "policy.title": "📌 Ewha Market content policy",
      "policy.own":
        "Only post items and study materials you own and are allowed to share.",
      "policy.copyright":
        "No copyrighted textbook copies, lecture slides, or exam papers.",
      "policy.contact":
        "Do not post private contact details. Use Ewha Market chat instead.",
      "policy.agree": "I confirm this listing follows the content policy.",
      "btn.cancel": "Cancel",
      "btn.post": "Post Listing",
      "btn.save": "Save Changes",
      "btn.saving": "Saving…",

      // add-item: messages
      "msg.priceMissing": 'Please enter a price, or tick the "free" box.',
      "msg.photoTooBig":
        "This photo is larger than 5 MB. Please choose a smaller file.",
      "msg.photoType": "Please choose a JPG or PNG image.",
      "msg.fixErrors": "Please fill in the highlighted fields.",
      "msg.saveFailed": "Something went wrong while saving. Please try again.",
      "msg.notFound":
        "This listing could not be found. It may have been deleted.",
      "msg.loginRequired":
        "Please log in with your verified Ewha email to post a listing.",
      "msg.created": "✅ Your listing was posted.",
      "msg.updated": "✅ Your changes were saved.",
      "msg.deleted": "🗑️ Listing deleted.",
      "msg.loadFailed":
        "Could not load your listings. Check your connection and refresh the page.",

      // categories
      "cat.textbooks": "📚 Textbooks & reference books",
      "cat.study_notes": "📝 Student notes & study materials",
      "cat.electronics": "💻 Electronics",
      "cat.clothing": "👕 Clothing & accessories",
      "cat.dorm_essentials": "🛏️ Dorm & household essentials",
      "cat.stationery": "✏️ Stationery & school supplies",
      "cat.other": "📦 Other",
      "cat.calculators": "🧮 Calculators",
      "cat.cameras": "📷 Cameras & photography",
      "cat.study_equipment": "🎧 Study equipment",
      "cat.language_exchange": "🗣️ Language exchange",
      "cat.tutoring": "👩‍🏫 Peer tutoring",
      "cat.study_partner": "🤝 Study partner / mentoring",
      "cat.skill_sharing": "🎨 Skill sharing",

      // price units & conditions
      "unit.once": "one-time",
      "unit.per_day": "per day",
      "unit.per_week": "per week",
      "unit.per_hour": "per hour",
      "unit.session": "per session",
      "price.free": "Free",
      "price.perDay": "/ day",
      "price.perWeek": "/ week",
      "price.perHour": "/ hour",
      "price.perSession": "/ session",
      "cond.New": "New",
      "cond.Like New": "Like New",
      "cond.Good": "Good",
      "cond.Fair": "Fair",

      // my-listings
      "mylist.title": "📋 My Listings",
      "mylist.subtitle":
        "Edit, delete, or mark your Buy, Rent, and Service posts as completed",
      "mylist.new": "➕ New Listing",
      "mylist.filterType": "Filter by listing type",
      "mylist.filterStatus": "Filter by status",
      "mylist.tab.all": "All",
      "mylist.tab.buy": "🛍️ Buy",
      "mylist.tab.rent": "🔄 Rent",
      "mylist.tab.service": "🤝 Services",
      "mylist.status.all": "All statuses",
      "mylist.status.active": "Active",
      "mylist.status.completed": "Completed",
      "mylist.done.buy": "Sold",
      "mylist.done.rent": "Rented",
      "mylist.done.service": "Done",
      "mylist.action.edit": "✏️ Edit",
      "mylist.action.complete.buy": "✔️ Mark sold",
      "mylist.action.complete.rent": "✔️ Mark rented",
      "mylist.action.complete.service": "✔️ Mark done",
      "mylist.action.relist": "↩️ Relist",
      "mylist.action.delete": "Delete listing",
      "mylist.empty.title": "No listings here yet",
      "mylist.empty.text":
        "Sell a textbook, lend a calculator, or offer a language exchange.",
      "mylist.empty.cta": "➕ Create your first listing",
      "mylist.loading": "Loading your listings…",
      "mylist.delete.title": "Delete this listing?",
      "mylist.delete.text":
        '"{title}" will be removed permanently. This cannot be undone.',
      "mylist.delete.confirm": "Delete",

      // time
      "time.justNow": "just now",
      "time.minutes": "{n}m ago",
      "time.hours": "{n}h ago",
      "time.days": "{n}d ago",
      "time.weeks": "{n}w ago",

      // Login page
      "login.eyebrow": "YOUR CAMPUS. YOUR COMMUNITY.",
      "login.heroTitle": "Your Trusted Ewha Campus Marketplace",
      "login.heroDescription":
        "Buy, sell, rent, and share course materials with verified Ewha students.",
      "login.feature1": "Verified Ewha student community",
      "login.feature2": "Second-hand items and course materials",
      "login.feature3": "Buy, sell, rent, and connect on campus",
      "login.title": "Log in",
      "login.tagline": "A campus marketplace exclusively for Ewha students.",
      "login.email": "Ewha email address",
      "login.emailHint":
        "Use your university email (@ewha.ac.kr or @ewhain.net)",
      "login.password": "Password",
      "login.show": "Show",
      "login.hide": "Hide",
      "login.forgot": "Forgot password?",
      "login.resend": "Resend verification email",
      "login.submit": "Log in",
      "login.noAccount": "Don't have an account?",
      "login.createAccount": "Create account",
      "login.back": "Back to Marketplace",
      "login.footer": "Made for Ewha, by Ewha students.",
      "login.loading": "Logging in...",
      "login.error.empty": "Please enter your email and password.",
      "login.error.email": "Please use your Ewha university email.",
      "login.error.unverified":
        "Please verify your email before logging in. Check your inbox.",
      "login.success": "Login successful! Redirecting...",
      "login.error.credentials": "Incorrect email or password.",
      "login.error.attempts": "Too many attempts. Please try again later.",
      "login.error.network": "Network error. Please check your connection.",
      "login.error.general": "Login failed. Please try again.",
      "login.success.verification":
        "Verification email sent. Please check your inbox.",
      "login.error.resend": "Could not resend the email. Please try again.",
      "login.error.emailFirst": "Please enter your email address first.",
      "login.success.reset":
        "If an account exists for this email, we sent a password reset link. Please check your inbox.",
      "login.error.notFound": "No account was found with this email.",
      "login.error.reset": "Could not send the reset email. Please try again.",

      // Page titles
      "login.pageTitle": "Log In - Ewha Market",

      // Register page
      "register.pageTitle": "Create Account - Ewha Market",
      "register.title": "Create account",
      "register.tagline":
        "Join the campus marketplace for verified Ewha students.",
      "register.name": "Full name",
      "register.nickname": "Nickname (shown on your listings)",
      "register.email": "Ewha email address",
      "register.password": "Password",
      "register.passwordHint":
        "At least 8 characters, with a letter and a number.",
      "register.confirm": "Confirm password",
      "register.submit": "Create account",
      "register.loading": "Creating account...",
      "register.haveAccount": "Already have an account?",
      "register.loginLink": "Log in",
      "register.error.empty": "Please fill in all fields.",
      "register.error.name": "Please enter your name (at least 2 characters).",
      "register.error.nickname": "Nickname must be 2-20 characters.",
      "register.error.email":
        "Please use your Ewha university email (@ewha.ac.kr or @ewhain.net).",
      "register.error.weak":
        "Password must be at least 8 characters and include a letter and a number.",
      "register.error.mismatch": "Passwords do not match.",
      "register.error.terms": "Please accept the content policy to continue.",
      "register.error.exists":
        "An account with this email already exists. Try logging in.",
      "register.error.network": "Network error. Please check your connection.",
      "register.error.attempts": "Too many attempts. Please try again later.",
      "register.error.general":
        "Could not create the account. Please try again.",
      "register.studentId": "Student ID",
      "register.studentIdHint":
        "Your Ewha student ID (letters and numbers, 4-15 characters). It is kept private.",
      "register.error.studentId":
        "Please enter a valid student ID (4-15 letters or numbers).",
      "register.error.studentIdTaken": "This student ID is already registered.",
      "register.error.profile":
        "Could not save your profile. Please try again.",
      "nav.login": "👤 Log In",
      "nav.logout": "Log out",
      "login.remember": "Remember me",
      "login.error.emailRequired": "Please enter your email address.",
      "login.error.passwordRequired": "Please enter your password.",
      "register.termsPre": "I agree to the ",
      "register.termsLink": "Terms of Use",
      "register.termsAnd": " and ",
      "register.privacyLink": "Privacy Policy",
      "register.termsPost": ", and I will only post items I own.",
      "register.major": "Major / department (optional)",
      "register.strength.1": "Password strength: too weak",
      "register.strength.2": "Password strength: fair",
      "register.strength.3": "Password strength: good",
      "register.strength.4": "Password strength: strong",
      "register.verify.title": "Check your email",
      "register.verify.text":
        "We sent a verification link to {email}. Open it, then come back here.",
      "register.verify.spam": "Can't find it? Check your spam folder.",
      "register.verify.resend": "Resend email",
      "register.verify.resendIn": "Resend in {s}s",
      "register.verify.sent": "Verification email sent again.",
      "register.verify.done": "I've verified my email",
      "register.verify.notYet":
        "Your email is not verified yet. Please open the link in the email.",
      "register.verify.toLogin": "Back to log in",
      "register.verify.error":
        "Could not send the email. Please try again with the button below.",
      "terms.pageTitle": "Terms of Use - Ewha Market",
      "privacy.pageTitle": "Privacy Policy - Ewha Market",
      "action.pageTitle": "Account action - Ewha Market",
      "action.loading.title": "Please wait…",
      "action.loading.text": "Checking your link…",
      "action.verified.title": "Email verified",
      "action.verified.text": "Your email is verified. You can now log in.",
      "action.invalid.title": "Link not valid",
      "action.invalid.text":
        "This link is invalid or has expired. Request a new one from the log in page.",
      "action.reset.title": "Choose a new password",
      "action.reset.text": "Enter a new password for {email}.",
      "action.reset.newPassword": "New password",
      "action.reset.confirm": "Confirm new password",
      "action.reset.submit": "Save new password",
      "action.reset.saving": "Saving...",
      "action.reset.done.title": "Password updated",
      "action.reset.done.text":
        "Your password was changed. You can now log in with it.",
      "action.recover.title": "Email restored",
      "action.recover.text":
        "Your email address was restored. If you did not request this change, reset your password.",
      "action.toLogin": "Go to log in",
      "action.error.general": "Something went wrong. Please try again.",
      "register.studentType": "Student type",
      "register.type.placeholder": "Select your student type",
      "register.type.degree": "Degree student (undergraduate / graduate)",
      "register.type.exchange": "Exchange student",
      "register.type.nondegree": "Part-time / non-degree student",
      "register.type.language": "Language institute student",
      "register.error.studentType": "Please select your student type.",
      "logout.pageTitle": "Logging out - Ewha Market",
      "logout.text": "Logging you out…",
      "register.success":
        "Account created! We sent a verification email. Please verify it, then log in.",
    },

    ko: {
      "additem.title": "➕ 새 게시물 등록",
      "additem.titleEdit": "✏️ 게시물 수정",
      "additem.subtitle": "판매, 대여, 학습 자료, 학생 서비스를 등록하세요",
      "additem.subtitleEdit": "게시물 정보를 수정하고 저장하세요",

      "additem.step1": "1. 어떤 게시물을 올리나요?",
      "additem.typeGroup": "게시물 유형",
      "type.buy": "판매",
      "type.rent": "대여",
      "type.service": "학생 서비스",
      "type.buy.hint": "물품 및 필기 노트",
      "type.rent.hint": "하루 또는 일주일 단위 대여",
      "type.service.hint": "튜터링, 언어 교환",
      "badge.buy": "판매",
      "badge.notes": "노트",
      "badge.rent": "대여",
      "badge.service": "서비스",

      "additem.step2": "2. 기본 정보",
      "field.title": "제목",
      "field.title.ph": "예: 미적분학 9판 교재",
      "field.category": "카테고리",
      "field.condition": "상태",
      "field.condition.select": "상태 선택",
      "field.description": "설명",
      "field.description.ph":
        "구성품, 손상 여부, 대여/반납 규칙, 언어, 수준 등을 적어주세요...",
      "field.courseName": "과목명",
      "field.courseName.ph": "예: 미적분학 I",
      "field.courseCode": "학수번호",
      "field.courseCode.ph": "예: 36338",
      "field.subject": "분야",
      "field.subject.ph": "예: 수학",
      "field.course.help": "선택 사항이지만, 과목으로 검색할 때 도움이 됩니다.",
      "field.required": "필수",

      "additem.step3": "3. 가격 및 일정",
      "field.price": "가격",
      "field.priceUnit": "가격 단위",
      "field.free.buy": "무료 나눔",
      "field.free.rent": "무료 대여",
      "field.free.service": "무료 서비스 (예: 언어 교환)",
      "field.availability": "가능한 시간",
      "field.availability.ph": "예: 지금 가능 / 월·수 오후 / 12월 15일까지",
      "field.location": "거래 장소",
      "field.location.select": "캠퍼스 장소 선택 (선택 사항)",

      "additem.step4": "4. 사진",
      "field.photo.cta": "클릭하여 사진 업로드",
      "field.photo.help": "JPG 또는 PNG, 최대 5MB",
      "field.photo.remove": "사진 삭제",
      "field.photo.preview": "선택한 사진 미리보기",

      "policy.title": "📌 이화마켓 게시 규칙",
      "policy.own": "본인이 소유하고 공유할 수 있는 물품과 자료만 올려주세요.",
      "policy.copyright":
        "저작권이 있는 교재 복사본, 강의 슬라이드, 시험지는 금지됩니다.",
      "policy.contact": "개인 연락처는 올리지 말고 이화마켓 채팅을 이용하세요.",
      "policy.agree": "이 게시물이 게시 규칙을 준수함을 확인합니다.",
      "btn.cancel": "취소",
      "btn.post": "등록하기",
      "btn.save": "변경사항 저장",
      "btn.saving": "저장 중…",

      "msg.priceMissing": '가격을 입력하거나 "무료"에 체크해주세요.',
      "msg.photoTooBig": "사진이 5MB보다 큽니다. 더 작은 파일을 선택해주세요.",
      "msg.photoType": "JPG 또는 PNG 이미지를 선택해주세요.",
      "msg.fixErrors": "표시된 항목을 입력해주세요.",
      "msg.saveFailed": "저장 중 오류가 발생했습니다. 다시 시도해주세요.",
      "msg.notFound": "게시물을 찾을 수 없습니다. 삭제되었을 수 있습니다.",
      "msg.loginRequired":
        "게시물을 등록하려면 인증된 이화 이메일로 로그인해주세요.",
      "msg.created": "✅ 게시물이 등록되었습니다.",
      "msg.updated": "✅ 변경사항이 저장되었습니다.",
      "msg.deleted": "🗑️ 게시물이 삭제되었습니다.",
      "msg.loadFailed":
        "게시물을 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침해주세요.",

      "cat.textbooks": "📚 교재 및 참고서",
      "cat.study_notes": "📝 필기 노트 및 학습 자료",
      "cat.electronics": "💻 전자기기",
      "cat.clothing": "👕 의류 및 잡화",
      "cat.dorm_essentials": "🛏️ 기숙사 및 생활용품",
      "cat.stationery": "✏️ 문구 및 학용품",
      "cat.other": "📦 기타",
      "cat.calculators": "🧮 계산기",
      "cat.cameras": "📷 카메라 및 촬영 장비",
      "cat.study_equipment": "🎧 학습 용품",
      "cat.language_exchange": "🗣️ 언어 교환",
      "cat.tutoring": "👩‍🏫 튜터링",
      "cat.study_partner": "🤝 스터디 파트너 / 멘토링",
      "cat.skill_sharing": "🎨 재능 공유",

      "unit.once": "1회",
      "unit.per_day": "1일당",
      "unit.per_week": "1주당",
      "unit.per_hour": "1시간당",
      "unit.session": "1회당",
      "price.free": "무료",
      "price.perDay": "/ 일",
      "price.perWeek": "/ 주",
      "price.perHour": "/ 시간",
      "price.perSession": "/ 회",
      "cond.New": "새 상품",
      "cond.Like New": "거의 새 것",
      "cond.Good": "좋음",
      "cond.Fair": "사용감 있음",

      "mylist.title": "📋 내 게시물",
      "mylist.subtitle":
        "판매, 대여, 서비스 게시물을 수정, 삭제하거나 거래 완료로 표시하세요",
      "mylist.new": "➕ 새 게시물",
      "mylist.filterType": "게시물 유형별 보기",
      "mylist.filterStatus": "상태별 보기",
      "mylist.tab.all": "전체",
      "mylist.tab.buy": "🛍️ 판매",
      "mylist.tab.rent": "🔄 대여",
      "mylist.tab.service": "🤝 서비스",
      "mylist.status.all": "모든 상태",
      "mylist.status.active": "진행 중",
      "mylist.status.completed": "완료",
      "mylist.done.buy": "판매 완료",
      "mylist.done.rent": "대여 완료",
      "mylist.done.service": "완료",
      "mylist.action.edit": "✏️ 수정",
      "mylist.action.complete.buy": "✔️ 판매 완료",
      "mylist.action.complete.rent": "✔️ 대여 완료",
      "mylist.action.complete.service": "✔️ 완료 표시",
      "mylist.action.relist": "↩️ 다시 게시",
      "mylist.action.delete": "게시물 삭제",
      "mylist.empty.title": "아직 게시물이 없습니다",
      "mylist.empty.text":
        "교재를 판매하거나, 계산기를 빌려주거나, 언어 교환을 시작해보세요.",
      "mylist.empty.cta": "➕ 첫 게시물 등록하기",
      "mylist.loading": "게시물을 불러오는 중…",
      "mylist.delete.title": "이 게시물을 삭제할까요?",
      "mylist.delete.text":
        '"{title}" 게시물이 영구적으로 삭제됩니다. 되돌릴 수 없습니다.',
      "mylist.delete.confirm": "삭제",

      "time.justNow": "방금 전",
      "time.minutes": "{n}분 전",
      "time.hours": "{n}시간 전",
      "time.days": "{n}일 전",
      "time.weeks": "{n}주 전",
      "login.eyebrow": "우리의 캠퍼스, 우리의 커뮤니티",
      "login.heroTitle": "믿을 수 있는 이화 캠퍼스 마켓플레이스",
      "login.heroDescription":
        "인증된 이화 학생들과 교재와 다양한 물품을 사고팔고, 대여하고 나누세요.",
      "login.feature1": "인증된 이화 학생 커뮤니티",
      "login.feature2": "중고 물품 및 학습 자료",
      "login.feature3": "캠퍼스에서 사고팔고, 대여하고 소통하세요",
      "login.title": "로그인",
      "login.tagline": "이화여대 학생만을 위한 교내 마켓플레이스입니다.",
      "login.email": "이화 이메일 주소",
      "login.emailHint":
        "학교 이메일(@ewha.ac.kr 또는 @ewhain.net)을 사용하세요.",
      "login.password": "비밀번호",
      "login.show": "표시",
      "login.hide": "숨기기",
      "login.forgot": "비밀번호를 잊으셨나요?",
      "login.resend": "인증 이메일 다시 보내기",
      "login.submit": "로그인",
      "login.noAccount": "계정이 없으신가요?",
      "login.createAccount": "회원가입",
      "login.back": "마켓플레이스로 돌아가기",
      "login.footer": "이화인을 위해, 이화인이 만들었습니다.",
      "login.loading": "로그인 중...",
      "login.error.empty": "이메일과 비밀번호를 입력해 주세요.",
      "login.error.email": "이화여자대학교 이메일을 사용해 주세요.",
      "login.error.unverified":
        "로그인하기 전에 이메일 인증을 완료해 주세요. 받은 편지함을 확인해 주세요.",
      "login.success": "로그인 성공! 페이지로 이동합니다...",
      "login.error.credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
      "login.error.attempts":
        "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      "login.error.network":
        "네트워크 오류입니다. 인터넷 연결을 확인해 주세요.",
      "login.error.general": "로그인에 실패했습니다. 다시 시도해 주세요.",
      "login.success.verification":
        "인증 이메일을 보냈습니다. 받은 편지함을 확인해 주세요.",
      "login.error.resend":
        "이메일을 다시 보낼 수 없습니다. 다시 시도해 주세요.",
      "login.error.emailFirst": "먼저 이메일 주소를 입력해 주세요.",
      "login.success.reset":
        "해당 이메일로 가입된 계정이 있다면 비밀번호 재설정 링크를 보냈습니다. 받은 편지함을 확인해 주세요.",
      "login.error.notFound": "해당 이메일로 등록된 계정을 찾을 수 없습니다.",
      "login.error.reset":
        "비밀번호 재설정 이메일을 보낼 수 없습니다. 다시 시도해 주세요.",

      "login.pageTitle": "로그인 - 이화마켓",

      "register.pageTitle": "회원가입 - 이화마켓",
      "register.title": "회원가입",
      "register.tagline":
        "인증된 이화 학생을 위한 교내 마켓플레이스에 가입하세요.",
      "register.name": "이름",
      "register.nickname": "닉네임 (게시글에 표시됩니다)",
      "register.email": "이화 이메일 주소",
      "register.password": "비밀번호",
      "register.passwordHint": "영문과 숫자를 포함해 8자 이상 입력하세요.",
      "register.confirm": "비밀번호 확인",
      "register.submit": "회원가입",
      "register.loading": "계정 만드는 중...",
      "register.haveAccount": "이미 계정이 있으신가요?",
      "register.loginLink": "로그인",
      "register.error.empty": "모든 항목을 입력해 주세요.",
      "register.error.name": "이름을 2자 이상 입력해 주세요.",
      "register.error.nickname": "닉네임은 2~20자로 입력해 주세요.",
      "register.error.email":
        "이화여대 이메일(@ewha.ac.kr 또는 @ewhain.net)을 사용해 주세요.",
      "register.error.weak":
        "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.",
      "register.error.mismatch": "비밀번호가 일치하지 않습니다.",
      "register.error.terms": "계속하려면 게시 규칙에 동의해 주세요.",
      "register.error.exists":
        "이미 이 이메일로 가입된 계정이 있습니다. 로그인해 주세요.",
      "register.error.network":
        "네트워크 오류입니다. 인터넷 연결을 확인해 주세요.",
      "register.error.attempts":
        "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      "register.error.general": "계정을 만들 수 없습니다. 다시 시도해 주세요.",
      "register.studentId": "학번",
      "register.studentIdHint":
        "이화 학번(영문과 숫자, 4~15자)을 입력하세요. 다른 사용자에게 공개되지 않습니다.",
      "register.error.studentId":
        "올바른 학번(영문·숫자 4~15자)을 입력해 주세요.",
      "register.error.studentIdTaken": "이미 등록된 학번입니다.",
      "register.error.profile":
        "프로필을 저장할 수 없습니다. 다시 시도해 주세요.",
      "nav.login": "👤 로그인",
      "nav.logout": "로그아웃",
      "login.remember": "로그인 상태 유지",
      "login.error.emailRequired": "이메일 주소를 입력해 주세요.",
      "login.error.passwordRequired": "비밀번호를 입력해 주세요.",
      "register.termsPre": "",
      "register.termsLink": "이용약관",
      "register.termsAnd": " 및 ",
      "register.privacyLink": "개인정보 처리방침",
      "register.termsPost": "에 동의하며, 본인이 소유한 물품만 등록하겠습니다.",
      "register.major": "전공 / 학과 (선택)",
      "register.strength.1": "비밀번호 강도: 약함",
      "register.strength.2": "비밀번호 강도: 보통",
      "register.strength.3": "비밀번호 강도: 좋음",
      "register.strength.4": "비밀번호 강도: 강함",
      "register.verify.title": "이메일을 확인해 주세요",
      "register.verify.text":
        "{email}(으)로 인증 링크를 보냈습니다. 링크를 연 뒤 이 페이지로 돌아오세요.",
      "register.verify.spam": "메일이 보이지 않나요? 스팸함을 확인해 주세요.",
      "register.verify.resend": "메일 다시 보내기",
      "register.verify.resendIn": "{s}초 후 다시 보내기",
      "register.verify.sent": "인증 메일을 다시 보냈습니다.",
      "register.verify.done": "인증을 완료했어요",
      "register.verify.notYet":
        "아직 이메일이 인증되지 않았습니다. 메일의 링크를 열어 주세요.",
      "register.verify.toLogin": "로그인으로 돌아가기",
      "register.verify.error":
        "메일을 보낼 수 없습니다. 아래 버튼으로 다시 시도해 주세요.",
      "terms.pageTitle": "이용약관 - 이화마켓",
      "privacy.pageTitle": "개인정보 처리방침 - 이화마켓",
      "action.pageTitle": "계정 확인 - 이화마켓",
      "action.loading.title": "잠시만 기다려 주세요…",
      "action.loading.text": "링크를 확인하는 중입니다…",
      "action.verified.title": "이메일 인증 완료",
      "action.verified.text":
        "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.",
      "action.invalid.title": "유효하지 않은 링크",
      "action.invalid.text":
        "링크가 올바르지 않거나 만료되었습니다. 로그인 페이지에서 새 링크를 요청해 주세요.",
      "action.reset.title": "새 비밀번호 설정",
      "action.reset.text": "{email} 계정의 새 비밀번호를 입력하세요.",
      "action.reset.newPassword": "새 비밀번호",
      "action.reset.confirm": "새 비밀번호 확인",
      "action.reset.submit": "새 비밀번호 저장",
      "action.reset.saving": "저장 중...",
      "action.reset.done.title": "비밀번호 변경 완료",
      "action.reset.done.text":
        "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.",
      "action.recover.title": "이메일 복구 완료",
      "action.recover.text":
        "이메일 주소가 복구되었습니다. 변경을 요청하지 않았다면 비밀번호를 재설정하세요.",
      "action.toLogin": "로그인으로 이동",
      "action.error.general": "문제가 발생했습니다. 다시 시도해 주세요.",
      "register.studentType": "학생 유형",
      "register.type.placeholder": "학생 유형을 선택하세요",
      "register.type.degree": "학위과정 학생 (학부 / 대학원)",
      "register.type.exchange": "교환학생",
      "register.type.nondegree": "시간제 / 비학위 학생",
      "register.type.language": "언어교육원 학생",
      "register.error.studentType": "학생 유형을 선택해 주세요.",
      "logout.pageTitle": "로그아웃 - 이화마켓",
      "logout.text": "로그아웃하는 중…",
      "register.success":
        "계정이 만들어졌습니다! 인증 이메일을 보냈으니 인증 후 로그인해 주세요.",
    },
  };

  function currentLang() {
    let lang = "";
    try {
      lang = (localStorage.getItem("lang") || "").toLowerCase();
    } catch (e) {
      lang = "";
    }
    if (!STRINGS[lang]) {
      lang = (
        document.documentElement.getAttribute("lang") || ""
      ).toLowerCase();
    }
    return STRINGS[lang] ? lang : "en";
  }

  // t('time.hours', { n: 3 }) -> "3h ago"
  function t(key, params) {
    const dict = STRINGS[currentLang()];
    let text =
      dict[key] !== undefined
        ? dict[key]
        : STRINGS.en[key] !== undefined
          ? STRINGS.en[key]
          : key;
    if (params) {
      Object.keys(params).forEach(function (name) {
        text = text.split("{" + name + "}").join(params[name]);
      });
    }
    return text;
  }

  function translate(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute(
        "placeholder",
        t(el.getAttribute("data-i18n-placeholder")),
      );
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
  }

  // Re-translate when the shared toggle changes <html lang="...">
  let lastLang = null;
  function onLangMaybeChanged() {
    const lang = currentLang();
    if (lang === lastLang) return;
    lastLang = lang;
    if (document.documentElement.getAttribute("lang") !== lang) {
      document.documentElement.setAttribute("lang", lang);
    }
    translate(document);
    document.dispatchEvent(
      new CustomEvent("ewha:langchange", { detail: { lang: lang } }),
    );
  }

  new MutationObserver(onLangMaybeChanged).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
  window.addEventListener("storage", function (e) {
    if (e.key === "lang") onLangMaybeChanged();
  });

  window.EwhaI18n = {
    t: t,
    translate: translate,
    currentLang: currentLang,
    strings: STRINGS,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onLangMaybeChanged);
  } else {
    onLangMaybeChanged();
  }
})();
