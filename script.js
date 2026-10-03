const API_KEY = "7ca3c128c1644bdd8d59277b88c8e70a";


// ============================
// ELEMENTS
// ============================

const newsContainer = document.getElementById("news-container");

const menuBtn = document.getElementById("menu-btn");

const sideMenu = document.getElementById("side-menu");

const searchInput = document.getElementById("search-input");

const searchBtn = document.getElementById("search-btn");

const pageHeading = document.getElementById("page-heading");


// ============================
// MENU OPEN / CLOSE
// ============================

menuBtn.addEventListener("click", function () {

    sideMenu.classList.toggle("active");


    // Change ☰ to ✕
    if (sideMenu.classList.contains("active")) {

        menuBtn.innerHTML = "✕";

    } else {

        menuBtn.innerHTML = "☰";

    }

});


// ============================
// DISPLAY NEWS
// ============================

function displayNews(articles) {

    newsContainer.innerHTML = "";


    if (!articles || articles.length === 0) {

        newsContainer.innerHTML = `
            <h2>No news found.</h2>
        `;

        return;
    }


    articles.forEach(article => {

        const newsCard = document.createElement("div");

        newsCard.classList.add("news-card");


        newsCard.innerHTML = `

            <img
                src="${article.urlToImage || "https://via.placeholder.com/400x200"}"
                alt="News Image"
            >

            <div class="news-content">

                <h2>
                    ${article.title}
                </h2>

                <p>
                    ${article.description || "No description available."}
                </p>

                <p class="source">
                    <strong>Source:</strong>
                    ${article.source?.name || "Unknown"}
                </p>

                <a
                    href="${article.url}"
                    target="_blank"
                >
                    Read More
                </a>

            </div>

        `;


        newsContainer.appendChild(newsCard);

    });

}


// ============================
// LOAD GENERAL NEWS
// ============================

function loadGeneralNews() {

    pageHeading.innerText = "Latest News";

    const API_URL =
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;


    fetch(API_URL)

        .then(response => response.json())

        .then(data => {

            displayNews(data.articles);

        })

        .catch(error => {

            console.log(error);

            newsContainer.innerHTML =
                "<h2>❌ Unable to load news</h2>";

        });

}


// ============================
// LOAD CATEGORY NEWS
// ============================

function loadCategoryNews(category) {

    pageHeading.innerText =
        category.charAt(0).toUpperCase() + category.slice(1);


    let query = category;


    // Better search terms

    if (category === "wars") {

        query = "war OR conflict OR military";

    }


    if (category === "geopolitics") {

        query =
            "geopolitics OR international relations OR diplomacy";

    }


    if (category === "politics") {

        query =
            "politics OR government OR election";

    }


    if (category === "education") {

        query =
            "education OR schools OR universities";

    }


    const API_URL =
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${API_KEY}`;


    newsContainer.innerHTML =
        "<h2>Loading news...</h2>";


    fetch(API_URL)

        .then(response => response.json())

        .then(data => {

            displayNews(data.articles);

        })

        .catch(error => {

            console.log(error);

            newsContainer.innerHTML =
                "<h2>❌ Unable to load news</h2>";

        });

}


// ============================
// CATEGORY BUTTONS
// ============================

const categoryButtons =
    document.querySelectorAll(".category-bar button");


categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        const category =
            button.getAttribute("data-category");


        if (category === "general") {

            loadGeneralNews();

        } else {

            loadCategoryNews(category);

        }

    });

});


// ============================
// SEARCH NEWS
// ============================
function searchNews() {

    const searchText = searchInput.value.trim();

    // If search box is empty
    if (searchText === "") {

        pageHeading.innerText = "Please enter a keyword";

        newsContainer.innerHTML = `
            <h2>🔍 Please enter something to search</h2>
        `;

        return;
    }


    // Show search heading
    pageHeading.innerText = `Search Results for "${searchText}"`;

    // Show loading message
    newsContainer.innerHTML = `
        <h2>Loading news...</h2>
    `;


    // News API search
    const API_URL =
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchText)}&language=en&sortBy=relevancy&pageSize=30&apiKey=${API_KEY}`;


    fetch(API_URL)

        .then(response => response.json())

        .then(data => {

            // Check if articles were found
            if (
                data.status !== "ok" ||
                !data.articles ||
                data.articles.length === 0
            ) {

                newsContainer.innerHTML = `
                    <div class="no-result">
                        <h2>❌ Result Not Found</h2>

                        <p>
                            No news found related to 
                            "<strong>${searchText}</strong>"
                        </p>
                    </div>
                `;

                return;
            }


            // Display matching news
            displayNews(data.articles);

        })

        .catch(error => {

            console.log(error);

            newsContainer.innerHTML = `
                <div class="no-result">

                    <h2>❌ Something went wrong</h2>

                    <p>
                        Please try searching again.
                    </p>

                </div>
            `;

        });

}
// Search button

searchBtn.addEventListener("click", searchNews);


// Search using Enter key

searchInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchNews();

    }

});


// ============================
// INITIAL NEWS
// ============================

loadGeneralNews();