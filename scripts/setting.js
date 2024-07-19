"use strict";
const pageSizeInput = document.getElementById("input-page-size");
const categoryInput = document.getElementById("input-category");
const submitBtn = document.getElementById("btn-submit");

pageSizeInput.value = getFromStorage("PAGE_SIZE");
categoryInput.value = getFromStorage("CATEGORY");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!pageSizeInput.value || Number.parseInt(pageSizeInput.value) <= 0) {
    alert("Page size is not valid!!!");
    return;
  }
  const pageSize = Number.parseInt(pageSizeInput.value);

  const category = categoryInput.value;
  console.log(pageSize);
  console.log(category);

  saveToStorage("PAGE_SIZE", pageSize);
  saveToStorage("CATEGORY", category);
  alert("Successful setting!!!");
});
// console.log(typeof "x" === "string");
