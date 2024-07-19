"use strict";
const queryInput = document.getElementById("input-query");
const submitBtn = document.getElementById("btn-submit");

const newsContainer = document.getElementById("news-container");

const pageSize = getFromStorage("PAGE_SIZE") || 10;
const prevPageButton = document.getElementById("btn-prev");
const nextPageButton = document.getElementById("btn-next");
const pageNumber = document.getElementById("page-num");

const navPageElement = document.getElementById("nav-page-num");
// const newsContainer = document.getElementById("news-container");

let page = 1;
let totalPage = 0;
let searchKey = "";

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // let searchValue = queryInput.value.replace(/ /g, "%20");
  let searchValue = queryInput.value.trim();
  // let searchValue = queryInput.value;
  console.log(searchValue);
  // console.log(searchValue.replace(/ /g, "%20"));
  if (searchValue === "") {
    alert("Please enter search value!");
  } else {
    searchKey = searchValue;

    // const url = `https://newsapi.org/v2/everything?q=${searchValue}&apiKey=9014bf44cf914fdf87e03f9ac12ad5aa`;
    // console.log(url);
    loadNews(searchKey);
  }
});

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

async function loadNews(searchValue) {
  try {
    const url = `https://newsapi.org/v2/everything?q=${searchValue}&pageSize=${pageSize}&page=${page}&apiKey=9014bf44cf914fdf87e03f9ac12ad5aa`;

    const data = await getNews(url);
    if (data && data.articles) {
      if (data.totalResults === 0) {
        navPageElement.style.display = "none";
        newsContainer.style.display = "none";
        // render(data);
        // setTimeout(alert("There is no result!"), 1000);
        // alert("There is no result!");
        // throw new Error("There is no result!");
        setTimeout(() => {
          alert("There is no result!");
          throw new Error("There is no result!");
        }, 100);
      } else {
        navPageElement.style.display = "block";
        newsContainer.style.display = "block";
        render(data);
        console.log(data);
      }
    }
  } catch (error) {
    console.error("Error:", error);
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

nextPageButton.addEventListener("click", function () {
  if (page < totalPage) {
    page++;
    // console.log(`Page: ${page}`);
    // console.log(`Total page: ${totalPage}`);

    // updateURL(page);

    pageNumber.textContent = page;
    loadNews(searchKey);
  }
});
prevPageButton.addEventListener("click", function () {
  if (page > 1) {
    page--;
    // console.log(`Page: ${page}`);
    // console.log(`Total page: ${totalPage}`);

    // updateURL(page);

    pageNumber.textContent = page;
    loadNews(searchKey);
  }
});
