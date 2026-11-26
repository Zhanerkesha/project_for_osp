"use strict";

// ==========================================
// EWHA MARKET - DISCOVERY JAVASCRIPT
// ==========================================

(function () {

    // ======================================
    // CATEGORIES PAGE
    // ======================================

    if (document.body.classList.contains("categories-page")) {

        if (window.lucide) {
            window.lucide.createIcons();
        }

        const params = new URLSearchParams(
            window.location.search
        );

        const categoryLinks = {
            books: "search.html?category=books",
            electronics: "search.html?type=buy&category=electronics",
            rent: "search.html?type=rent",
            notes: "search.html?type=notes",
            services: "search.html?type=services"
        };

        const category = params.get("cat");

        if (category && Object.hasOwn(categoryLinks, category)) {
            window.location.replace(categoryLinks[category]);
        }
    }


    // ======================================
    // SEARCH PAGE
    // ======================================

    const searchResults =
        document.getElementById("searchResults");

    if (!searchResults) return;


    // ======================================
    // LISTING DATA STRUCTURE
    // ======================================

    function createListing(
        id,
        title,
        type,
        category,
        condition,
        price,
        priceUnit,
        description,
        image,
        courseName = "",
        courseCode = "",
        subject = "",
        date = "2026-11-17"
    ) {
        return {
            id,
            title,
            type,
            category,
            condition,
            price,
            priceUnit,
            description,
            image,
            courseName,
            courseCode,
            subject,
            date
        };
    }


    // ======================================
    // SAMPLE LISTINGS
    // ======================================

    const listings = [

        // BUY & SELL - 17 LISTINGS

        createListing(
            "demo-1",
            "Used Desk Lamp",
            "buy", "furniture", "used",
            8000, "",
            "Affordable desk lamp for studying.",
            "images/desk-lamp.jpeg"
        ),

        createListing(
            "demo-2",
            "Wireless Headphones",
            "buy", "electronics", "good",
            15000, "",
            "Wireless headphones in good condition.",
            "images/headphones.jpeg"
        ),

        createListing(
            "demo-3",
            "Ewha University Hoodie",
            "buy", "fashion", "like-new",
            12000, "",
            "Comfortable Ewha hoodie, barely worn.",
            "images/hoodie.jpeg"
        ),

        createListing(
            "demo-4",
            "Mini Desk Fan",
            "buy", "electronics", "good",
            8000, "",
            "Compact desk fan for your study room.",
            "images/desk-fan.jpeg"
        ),

        createListing(
            "demo-18",
            "Cream Knit Cardigan",
            "buy", "fashion", "like-new",
            12000, "",
            "Soft cream cardigan for autumn.",
            "images/cream-cardigan.jpeg"
        ),

        createListing(
            "demo-19",
            "Oversized Denim Jacket",
            "buy", "fashion", "good",
            18000, "",
            "Casual oversized denim jacket.",
            "images/denim-jacket.jpeg"
        ),

        createListing(
            "demo-20",
            "Pleated Skirt",
            "buy", "fashion", "like-new",
            15000, "",
            "Comfortable pleated skirt for everyday wear.",
            "images/skirt-pleated.jpeg"
        ),

        createListing(
            "demo-21",
            "White Sneakers",
            "buy", "shoes", "good",
            20000, "",
            "Casual sneakers for everyday wear.",
            "images/white-sneakers.jpeg"
        ),

        createListing(
            "demo-22",
            "Canvas Tote Bag",
            "buy", "accessories", "like-new",
            5000, "",
            "Lightweight bag for university classes.",
            "images/canvas-tote.jpeg"
        ),

        createListing(
            "demo-23",
            "Makeup Organizer",
            "buy", "beauty", "like-new",
            10000, "",
            "Convenient organizer for makeup and beauty products.",
            "images/makeup-organizer.jpeg"
        ),

        createListing(
            "demo-24",
            "Grey Hoodie",
            "buy", "fashion", "good",
            10000, "",
            "Comfortable grey hoodie for campus life.",
            "images/grey-hoodie.jpg"
        ),

        createListing(
            "demo-25",
            "English Novel",
            "buy", "books", "good",
            5000, "",
            "Secondhand English reading book.",
            "images/english-novel.jpeg"
        ),

        createListing(
            "demo-26",
            "Board Game",
            "buy", "hobbies", "like-new",
            7000, "",
            "Fun board game to enjoy with friends.",
            "images/board-game.jpeg"
        ),

        createListing(
            "demo-27",
            "Yoga Mat",
            "buy", "sports", "good",
            10000, "",
            "Exercise mat for home workouts.",
            "images/yoga-mat.jpeg"
        ),

        createListing(
            "demo-28",
            "Stationery Set",
            "buy", "stationery", "new",
            4000, "",
            "Pens and stationery for classes.",
            "images/stationary-set.jpeg"
        ),

        createListing(
            "demo-29",
            "Free Folder Set",
            "buy", "free-items", "good",
            0, "",
            "Free folders for another Ewha student.",
            "images/folder-set.jpeg"
        ),

        createListing(
            "demo-30",
            "Compact Umbrella",
            "buy", "other", "new",
            5000, "",
            "Convenient umbrella for rainy days on campus.",
            "images/umbrella.jpeg"
        ),


        // RENT & LEND - 7 LISTINGS

        createListing(
            "demo-5",
            "Engineering Calculator",
            "rent", "calculators", "like-new",
            2000, "day",
            "Scientific calculator for engineering exams.",
            "images/engineering-calculator.jpeg",
            "Engineering Mathematics",
            "36341",
            "Mathematics"
        ),

        createListing(
            "demo-6",
            "Digital Camera",
            "rent", "cameras", "good",
            8000, "day",
            "Rent a digital camera for campus events.",
            "images/camera.jpeg"
        ),

        createListing(
            "demo-7",
            "Linear Algebra Textbook",
            "rent", "books", "good",
            3000, "day",
            "Borrow a textbook for your mathematics class.",
            "images/linear.jpeg",
            "Linear Algebra",
            "",
            "Mathematics"
        ),

        createListing(
            "demo-31",
            "Scientific Calculator",
            "rent", "calculators", "good",
            1500, "day",
            "Calculator available during exam season.",
            "images/calculator.jpeg"
        ),

        createListing(
            "demo-32",
            "Portable Projector",
            "rent", "cameras", "good",
            5000, "day",
            "Useful for group presentations.",
            "images/projector.jpeg"
        ),

        createListing(
            "demo-33",
            "Camera Tripod",
            "rent", "event-equipment", "good",
            4000, "day",
            "Tripod available for presentations and filming.",
            "images/tripod.jpeg"
        ),

        createListing(
            "demo-34",
            "Puzzle Set",
            "rent", "other", "good",
            1000, "day",
            "Borrow a puzzle set to enjoy with friends.",
            "images/puzzle-set.jpeg"
        ),


        // STUDENT SERVICES - 6 LISTINGS

        createListing(
            "demo-8",
            "Python Tutoring",
            "services", "tutoring", "",
            15000, "hour",
            "Beginner-friendly Python programming tutoring.",
            "images/python-tutoring.jpeg",
            "Python Programming",
            "38403",
            "Computer Science"
        ),

        createListing(
            "demo-9",
            "Java Programming Tutoring",
            "services", "tutoring", "",
            15000, "hour",
            "Learn Java programming and object-oriented concepts.",
            "images/java-tutoring.jpg",
            "Java Programming",
            "35914",
            "Computer Science"
        ),

        createListing(
            "demo-10",
            "Korean-English Language Exchange",
            "services", "language", "",
            0, "",
            "Practice Korean and English together.",
            "images/language-exchange.jpeg",
            "",
            "",
            "Languages"
        ),

        createListing(
            "demo-11",
            "Korean-English Translation",
            "services", "translation", "",
            5000, "",
            "Translation assistance for university students.",
            "images/language-exchange.jpeg",
            "",
            "",
            "Languages"
        ),

        createListing(
            "demo-12",
            "Resume and Portfolio Review",
            "services", "career", "",
            10000, "session",
            "Get feedback on your resume and portfolio.",
            "images/resume-portfolio.jpeg"
        ),

        createListing(
            "demo-35",
            "Computer Science Study Group",
            "services", "study-groups", "",
            0, "",
            "Find friends to study programming together.",
            "images/studygroup.jpg",
            "",
            "",
            "Computer Science"
        ),


        // STUDY MATERIALS - 7 LISTINGS

        createListing(
            "demo-13",
            "Computer Architecture Notes",
            "notes", "study", "good",
            5000, "",
            "Revision notes covering RISC-V and memory hierarchy.",
            "images/comp-architecture.jpeg",
            "Computer Architecture",
            "",
            "Computer Science"
        ),

        createListing(
            "demo-14",
            "Data Structures Notes",
            "notes", "study", "good",
            5000, "",
            "Notes on linked lists, trees, graphs and sorting.",
            "images/data-structure.jpeg",
            "Data Structures",
            "",
            "Computer Science"
        ),

        createListing(
            "demo-15",
            "Linear Algebra Notebook",
            "notes", "study", "good",
            4000, "",
            "Handwritten linear algebra revision notes.",
            "images/linear-algebra.jpg",
            "Linear Algebra",
            "",
            "Mathematics"
        ),

        createListing(
            "demo-16",
            "Calculus Textbook",
            "notes", "books", "good",
            12000, "",
            "University calculus textbook for mathematics students.",
            "images/Calculus_textbook.jpg",
            "Calculus",
            "",
            "Mathematics"
        ),

        createListing(
            "demo-17",
            "Mathematics Revision Guide",
            "notes", "study-guides", "good",
            5000, "",
            "Revision guide for university mathematics.",
            "images/revision-guide.jpeg",
            "Mathematics",
            "",
            "Mathematics"
        ),

        createListing(
            "demo-36",
            "Practice Exam Papers",
            "notes", "past-papers", "good",
            3000, "",
            "Practice exam materials authorized for sharing.",
            "images/practice-question.jpeg"
        ),

        createListing(
            "demo-37",
            "Engineering Breadboard",
            "notes", "lab-supplies", "good",
            8000, "",
            "Useful breadboard for engineering laboratory classes.",
            "images/breadboard.jpeg",
            "",
            "",
            "Engineering"
        )
    ];


    // ======================================
    // CATEGORY OPTIONS
    // ======================================

    const categoriesByType = {

        buy: [
            ["fashion", "Clothes"],
            ["shoes", "Shoes"],
            ["accessories", "Bags & Accessories"],
            ["beauty", "Beauty & Makeup"],
            ["electronics", "Electronics"],
            ["furniture", "Home & Living"],
            ["books", "Books"],
            ["hobbies", "Toys & Hobbies"],
            ["sports", "Sports & Fitness"],
            ["stationery", "Stationery"],
            ["free-items", "Free Items"],
            ["other", "Other"]
        ],

        rent: [
            ["calculators", "Calculators"],
            ["cameras", "Cameras & Electronics"],
            ["books", "Books & Textbooks"],
            ["event-equipment", "Event Equipment"],
            ["other", "Other Rentals"]
        ],

        services: [
            ["tutoring", "Tutoring"],
            ["language", "Language Exchange"],
            ["translation", "Translation"],
            ["career", "Career & Portfolio Help"],
            ["study-groups", "Study Groups"]
        ],

        notes: [
            ["study", "Lecture Notes"],
            ["books", "Course Textbooks"],
            ["past-papers", "Past Papers / Jokbo"],
            ["study-guides", "Study Guides"],
            ["lab-supplies", "Lab & Engineering Supplies"]
        ]
    };


    const typeLabels = {
        buy: "BUY",
        rent: "RENT",
        services: "SERVICE",
        notes: "STUDY MATERIALS"
    };


    const badgeClasses = {
        buy: "badge-buy",
        rent: "badge-rent",
        services: "badge-service",
        notes: "badge-notes"
    };


    const conditionLabels = {
        new: "New",
        "like-new": "Like New",
        good: "Good",
        used: "Used"
    };


    // ======================================
    // HTML ELEMENTS
    // ======================================

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");

    const listingType =
        document.getElementById("listingType");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const conditionFilter =
        document.getElementById("conditionFilter");

    const minPrice =
        document.getElementById("minPrice");

    const maxPrice =
        document.getElementById("maxPrice");

    const courseSearch =
        document.getElementById("courseSearch");

    const paymentFilter =
        document.getElementById("paymentFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const applyButton =
        document.getElementById("applyFilters");

    const resetButton =
        document.getElementById("resetFilters");

    const resultCount =
        document.getElementById("resultCount");

    const emptyState =
        document.getElementById("emptyState");

    const filterError =
        document.getElementById("filterError");

    const conditionGroup =
        document.getElementById("conditionGroup");

    const paymentGroup =
        document.getElementById("paymentGroup");

    const moreFilters =
        document.querySelector(".more-filters");


    // ======================================
    // HELPER FUNCTIONS
    // ======================================

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .trim();
    }


    function formatPrice(listing) {
        if (listing.price === 0) {
            return "Free";
        }

        let price = "₩" +
            listing.price.toLocaleString("en-US");

        if (listing.priceUnit) {
            price += " / " + listing.priceUnit;
        }

        return price;
    }


    function getCategoryLabel(listing) {
        const categories =
            categoriesByType[listing.type] || [];

        const match = categories.find(
            category => category[0] === listing.category
        );

        return match ? match[1] : listing.category;
    }


    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }


    // ======================================
    // UPDATE CATEGORY DROPDOWN
    // ======================================

    function updateCategoryOptions() {
        const selectedType = listingType.value;
        const previousCategory = categoryFilter.value;

        categoryFilter.replaceChildren();

        categoryFilter.add(
            new Option("All Categories", "all")
        );

        let availableCategories = [];

        if (selectedType === "all") {
            const uniqueCategories = new Map();

            Object.values(categoriesByType)
                .forEach(group => {
                    group.forEach(([value, label]) => {
                        if (!uniqueCategories.has(value)) {
                            uniqueCategories.set(value, label);
                        }
                    });
                });

            availableCategories =
                Array.from(uniqueCategories.entries());

        } else {
            availableCategories =
                categoriesByType[selectedType] || [];
        }

        availableCategories.forEach(([value, label]) => {
            categoryFilter.add(
                new Option(label, value)
            );
        });

        const exists = Array.from(categoryFilter.options)
            .some(option => option.value === previousCategory);

        categoryFilter.value =
            exists ? previousCategory : "all";
    }


    // ======================================
    // SHOW RELEVANT FILTERS
    // ======================================

    function updateFilterVisibility() {
        const type = listingType.value;

        const showCondition =
            type !== "services";

        const showPayment =
            type === "services" || type === "all";

        conditionGroup.classList.toggle(
            "hidden",
            !showCondition
        );

        paymentGroup.classList.toggle(
            "hidden",
            !showPayment
        );

        if (!showCondition) {
            conditionFilter.value = "all";
        }

        if (!showPayment) {
            paymentFilter.value = "all";
        }
    }


    // ======================================
    // CREATE LISTING CARD
    // ======================================

    function createListingCard(listing) {
        const card = createElement(
            "a",
            "item-card result-card-link"
        );

        card.href =
            "item-detail.html?id=" +
            encodeURIComponent(listing.id);

        const imageWrapper = createElement(
            "div",
            "item-img-wrap"
        );

        const image = document.createElement("img");

        image.alt = listing.title;
        image.loading = "lazy";

        image.addEventListener("error", function () {
            const fallbackImages = {
                buy: "images/cat-electronics.jpg",
                rent: "images/cat-rent.jpg",
                services: "images/cat-services.jpg",
                notes: "images/cat-notes.jpg"
            };

            if (image.dataset.fallbackUsed) {
                image.remove();
                imageWrapper.style.minHeight = "165px";
                return;
            }

            image.dataset.fallbackUsed = "true";

            image.alt =
                "Category illustration for " + listing.title;

            image.src = fallbackImages[listing.type];
        });

        image.src = listing.image;

        const badge = createElement(
            "span",
            "item-badge " + badgeClasses[listing.type],
            typeLabels[listing.type]
        );

        imageWrapper.append(image, badge);

        const info = createElement(
            "div",
            "item-info"
        );

        const price = createElement(
            "div",
            "item-price",
            formatPrice(listing)
        );

        const title = createElement(
            "h3",
            "item-title",
            listing.title
        );

        const description = createElement(
            "p",
            "item-description",
            listing.description
        );

        info.append(price, title, description);

        // COURSE INFORMATION

        if (listing.courseName || listing.courseCode) {
            const courseText = [
                listing.courseName,
                listing.courseCode
            ].filter(Boolean).join(" • ");

            const course = createElement(
                "p",
                "item-course",
                courseText
            );

            info.appendChild(course);
        }

        // CATEGORY AND CONDITION

        const metaParts = [
            getCategoryLabel(listing)
        ];

        if (listing.condition) {
            metaParts.push(
                conditionLabels[listing.condition] ||
                listing.condition
            );

        } else if (listing.subject) {
            metaParts.push(listing.subject);

        } else if (listing.type === "services") {
            metaParts.push(
                listing.price === 0 ? "Free" : "Paid"
            );
        }

        const meta = createElement(
            "div",
            "item-meta",
            metaParts.join(" • ")
        );

        info.appendChild(meta);

        card.append(imageWrapper, info);

        return card;
    }


    // ======================================
    // RENDER SEARCH RESULTS
    // ======================================

    function renderResults(results) {
        searchResults.replaceChildren();

        resultCount.textContent =
            results.length +
            (results.length === 1
                ? " listing found"
                : " listings found");

        const hasResults = results.length > 0;

        emptyState.classList.toggle(
            "hidden",
            hasResults
        );

        searchResults.classList.toggle(
            "hidden",
            !hasResults
        );

        if (!hasResults) return;

        const fragment =
            document.createDocumentFragment();

        results.forEach(listing => {
            fragment.appendChild(
                createListingCard(listing)
            );
        });

        searchResults.appendChild(fragment);
    }


    // ======================================
    // BILINGUAL KEYWORD SEARCH
    // ======================================

    function matchesKeyword(listing, keyword) {
        if (!keyword) return true;

        const fields = [
            listing.title,
            listing.description,
            listing.type,
            typeLabels[listing.type],
            listing.category,
            getCategoryLabel(listing),
            listing.condition,
            conditionLabels[listing.condition],
            listing.courseName,
            listing.courseCode,
            listing.subject,
            listing.price === 0 ? "free" : "paid"
        ];

        const searchableText = normalize(
            typeof getBilingualSearchText === "function"
                ? getBilingualSearchText(fields)
                : fields.filter(Boolean).join(" ")
        );

        const words = normalize(keyword).split(/\s+/);

        return words.every(
            word => searchableText.includes(word)
        );
    }


    // ======================================
    // BILINGUAL COURSE SEARCH
    // ======================================

    function matchesCourse(listing, keyword) {
        if (!keyword) return true;

        const fields = [
            listing.courseName,
            listing.courseCode,
            listing.subject
        ];

        const courseText = normalize(
            typeof getBilingualSearchText === "function"
                ? getBilingualSearchText(fields)
                : fields.filter(Boolean).join(" ")
        );

        return normalize(keyword)
            .split(/\s+/)
            .every(word => courseText.includes(word));
    }


    // ======================================
    // PRICE VALIDATION
    // ======================================

    function showFilterError(message) {
        filterError.textContent = message;
        filterError.classList.remove("hidden");
    }


    function clearFilterError() {
        filterError.textContent = "";
        filterError.classList.add("hidden");
    }


    function validatePrice(minimum, maximum) {
        clearFilterError();

        if (
            minPrice.validity.badInput ||
            maxPrice.validity.badInput ||
            Number.isNaN(minimum) ||
            Number.isNaN(maximum)
        ) {
            showFilterError(
                "Please enter a valid price."
            );

            return false;
        }

        if (minimum < 0 || maximum < 0) {
            showFilterError(
                "Price cannot be negative."
            );

            return false;
        }

        if (minimum > maximum) {
            showFilterError(
                "Minimum price cannot be greater than maximum price."
            );

            return false;
        }

        return true;
    }


    // ======================================
    // SORTING
    // ======================================

    function sortListings(results) {
        const sorted = [...results];

        switch (sortFilter.value) {

            case "price-low":
                sorted.sort(
                    (a, b) => a.price - b.price
                );
                break;

            case "price-high":
                sorted.sort(
                    (a, b) => b.price - a.price
                );
                break;

            case "name":
                sorted.sort((a, b) => {
                    if (
                        typeof currentLanguage !== "undefined" &&
                        currentLanguage === "ko" &&
                        typeof translateDynamicText === "function"
                    ) {
                        return translateDynamicText(a.title)
                            .localeCompare(
                                translateDynamicText(b.title),
                                "ko"
                            );
                    }

                    return a.title.localeCompare(b.title);
                });
                break;

            case "newest":
            default:
                sorted.sort(
                    (a, b) =>
                        new Date(b.date) - new Date(a.date)
                );
                break;
        }

        return sorted;
    }


    // ======================================
    // APPLY SEARCH AND FILTERS
    // ======================================

    function applyFilters() {
        const keyword = normalize(searchInput.value);

        const type = listingType.value;
        const category = categoryFilter.value;
        const condition = conditionFilter.value;
        const course = normalize(courseSearch.value);
        const payment = paymentFilter.value;

        const minimum =
            minPrice.value === ""
                ? 0
                : Number(minPrice.value);

        const maximum =
            maxPrice.value === ""
                ? Infinity
                : Number(maxPrice.value);

        if (!validatePrice(minimum, maximum)) {
            return;
        }

        const filtered = listings.filter(listing => {

            // KEYWORD

            if (!matchesKeyword(listing, keyword)) {
                return false;
            }

            // LISTING TYPE

            if (
                type !== "all" &&
                listing.type !== type
            ) {
                return false;
            }

            // CATEGORY

            if (
                category !== "all" &&
                listing.category !== category
            ) {
                return false;
            }

            // CONDITION

            if (
                condition !== "all" &&
                listing.condition !== condition
            ) {
                return false;
            }

            // PRICE RANGE

            if (
                listing.price < minimum ||
                listing.price > maximum
            ) {
                return false;
            }

            // COURSE NAME / CODE / SUBJECT

            if (!matchesCourse(listing, course)) {
                return false;
            }

            // SERVICE PAYMENT

            if (payment !== "all") {
                if (listing.type !== "services") {
                    return false;
                }

                if (
                    payment === "free" &&
                    listing.price !== 0
                ) {
                    return false;
                }

                if (
                    payment === "paid" &&
                    listing.price === 0
                ) {
                    return false;
                }
            }

            return true;
        });

        renderResults(
            sortListings(filtered)
        );

        updateURL();
    }


    // ======================================
    // SAVE FILTERS IN URL
    // ======================================

    function updateURL() {
        const params = new URLSearchParams();

        if (searchInput.value.trim()) {
            params.set(
                "q",
                searchInput.value.trim()
            );
        }

        if (listingType.value !== "all") {
            params.set("type", listingType.value);
        }

        if (categoryFilter.value !== "all") {
            params.set("category", categoryFilter.value);
        }

        if (conditionFilter.value !== "all") {
            params.set("condition", conditionFilter.value);
        }

        if (minPrice.value !== "") {
            params.set("min", minPrice.value);
        }

        if (maxPrice.value !== "") {
            params.set("max", maxPrice.value);
        }

        if (courseSearch.value.trim()) {
            params.set(
                "course",
                courseSearch.value.trim()
            );
        }

        if (paymentFilter.value !== "all") {
            params.set("payment", paymentFilter.value);
        }

        if (sortFilter.value !== "newest") {
            params.set("sort", sortFilter.value);
        }

        const query = params.toString();

        const newURL =
            window.location.pathname +
            (query ? "?" + query : "") +
            window.location.hash;

        window.history.replaceState(
            null,
            "",
            newURL
        );
    }


    // ======================================
    // READ FILTERS FROM URL
    // ======================================

    function setSelectValue(select, value) {
        if (!value) return;

        const exists = Array.from(select.options)
            .some(option => option.value === value);

        if (exists) {
            select.value = value;
        }
    }


    function loadURLFilters() {
        const params = new URLSearchParams(
            window.location.search
        );

        searchInput.value =
            params.get("q") || "";

        setSelectValue(
            listingType,
            params.get("type")
        );

        updateCategoryOptions();

        setSelectValue(
            categoryFilter,
            params.get("category")
        );

        setSelectValue(
            conditionFilter,
            params.get("condition")
        );

        minPrice.value =
            params.get("min") || "";

        maxPrice.value =
            params.get("max") || "";

        courseSearch.value =
            params.get("course") || "";

        setSelectValue(
            paymentFilter,
            params.get("payment")
        );

        setSelectValue(
            sortFilter,
            params.get("sort")
        );

        updateFilterVisibility();
    }


    // ======================================
    // RESET FILTERS
    // ======================================

    function resetFilters() {
        searchInput.value = "";

        listingType.value = "all";

        updateCategoryOptions();

        categoryFilter.value = "all";
        conditionFilter.value = "all";

        minPrice.value = "";
        maxPrice.value = "";

        courseSearch.value = "";

        paymentFilter.value = "all";

        sortFilter.value = "newest";

        clearFilterError();

        updateFilterVisibility();

        applyFilters();
    }


    // ======================================
    // EVENT LISTENERS
    // ======================================

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        applyFilters();
    });


    listingType.addEventListener("change", function () {
        updateCategoryOptions();

        updateFilterVisibility();

        applyFilters();
    });


    categoryFilter.addEventListener(
        "change",
        applyFilters
    );


    conditionFilter.addEventListener(
        "change",
        applyFilters
    );


    paymentFilter.addEventListener(
        "change",
        applyFilters
    );


    sortFilter.addEventListener(
        "change",
        applyFilters
    );


    applyButton.addEventListener("click", function (event) {
        event.preventDefault();

        applyFilters();
    });


    resetButton.addEventListener("click", function (event) {
        event.preventDefault();

        resetFilters();
    });


    // ======================================
    // INITIALIZE PAGE
    // ======================================

    updateCategoryOptions();

    loadURLFilters();

    updateFilterVisibility();

    applyFilters();

    if (window.lucide) {
        window.lucide.createIcons();
    }

})();