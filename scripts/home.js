"use strict";
const loginModal = document.getElementById("login-modal");
const mainContent = document.getElementById("main-content");
const messageElement = document.getElementById("welcome-message");
const logoutBtn = document.getElementById("btn-logout");

const currentUser = getFromStorage("CURRENT_USER");
console.log(currentUser);
const isLogin = Boolean(currentUser);
console.log(`Is login: ${isLogin}`);
if (isLogin) {
  loginModal.style.display = "none";
  const user = parseUser(JSON.parse(currentUser));
  messageElement.textContent = `Welcome ${user.firstName} ${user.lastName}!!!`;
} else {
  mainContent.style.display = "none";
}
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("CURRENT_USER");
  window.location.href = "pages/login.html";
});
