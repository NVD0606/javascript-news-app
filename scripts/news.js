"use strict";
const api_key = "9014bf44cf914fdf87e03f9ac12ad5aa";
const country = "us";
//The category you want to get headlines for. Possible options: business, entertainment, general, health, science, sports, technology
const category = getFromStorage("CATEGORY") || "science";
const pageSize = getFromStorage("PAGE_SIZE") || 10;
let page = 1;
let totalPage = 0;

const cache = {};

const newsContainer = document.getElementById("news-container");
const prevPageButton = document.getElementById("btn-prev");
const nextPageButton = document.getElementById("btn-next");
const pageNumber = document.getElementById("page-num");

const loadingIndicator = document.getElementById("loading");

// const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${api_key}`;

async function getNews(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching news:", error.message);
  }
}

function render(json) {
  const articles = json.articles;
  console.log(json.totalResults);
  totalPage = Math.ceil(json.totalResults / pageSize);

  nextPageButton.style.visibility = page === totalPage ? "hidden" : "visible";
  prevPageButton.style.visibility = page === 1 ? "hidden" : "visible";

  newsContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();
  articles.forEach((article) => {
    // const placeHolderImageUrl = "https://placehold.co/800x450";
    if (article.title === "[Removed]") return;
    const placeHolderImageUrl = "../img/800x450_ffffff_cccccc.jpg";
    const imageUrl = article.urlToImage
      ? article.urlToImage
      : placeHolderImageUrl;

    const description = article.description
      ? article.description
      : "No description available.";
    const title = article.title || "No title available";
    const div = document.createElement("div");
    const url = article.url || "#";

    const html = `
        <div class="card flex-row flex-wrap">
					<div class="card mb-3" style="">
						<div class="row no-gutters">
							<div class="col-md-4">
								<img src="${imageUrl}"
									class="card-img"
									alt="${title}">
							</div>
							<div class="col-md-8">
								<div class="card-body">
									<h5 class="card-title">${title}</h5>
									<p class="card-text">${description}</p>
									<a href="${url}"
										class="btn btn-primary" target="_blank">View</a>
								</div>
							</div>
						</div>
					</div>
				</div>
  `;
    // div.innerHTML = html;
    // newsContainer.append(div);
    div.innerHTML = html;
    fragment.appendChild(div);
    // newsContainer.insertAdjacentHTML("beforeend", html);
  });
  newsContainer.appendChild(fragment);
}

// (async () => {
//   try {
//     const data = await getNews(url);
//     if (data && data.articles) render(data);
//   } catch (error) {
//     console.error("Error rendering news:", error);
//   }
// })();
async function loadNews() {
  if (cache[page]) {
    render(cache[page]);
  } else {
    try {
      loadingIndicator.style.display = "block";
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${api_key}`;

      const data = await getNews(url);
      if (data && data.articles) {
        cache[page] = data;
        render(data);
      }
    } catch (error) {
      console.error("Error rendering news:", error);
    } finally {
      loadingIndicator.style.display = "none";
    }
  }
}

page = getPageFromURL(); // Initialize the page from the URL
pageNumber.textContent = page;

loadNews();

nextPageButton.addEventListener("click", function () {
  if (page < totalPage) {
    page++;
    // console.log(`Page: ${page}`);
    // console.log(`Total page: ${totalPage}`);

    updateURL(page);

    pageNumber.textContent = page;
    loadNews();
  }
});
prevPageButton.addEventListener("click", function () {
  if (page > 1) {
    page--;
    // console.log(`Page: ${page}`);
    // console.log(`Total page: ${totalPage}`);

    updateURL(page);

    pageNumber.textContent = page;
    loadNews();
  }
});

// Get the current page number from the URL
function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("page")) || 1;
}

// Update the URL with the current page number
function updateURL(page) {
  const params = new URLSearchParams(window.location.search);
  params.set("page", page);
  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
}
