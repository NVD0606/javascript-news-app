"use strict";
const KEY = "USER_ARRAY";
// const userArrNotParse = JSON.parse(getFromStorage(KEY));
const userArr = JSON.parse(getFromStorage(KEY) || "[]").map(parseUser);

console.log(`user array:`, userArr);
// console.log(userArrNotParse);

const usernameInput = document.getElementById("input-username");
const passwordInput = document.getElementById("input-password");
const submitBtn = document.getElementById("btn-submit");

submitBtn.addEventListener("click", (e) => {
  const loginData = getLoginData();

  const validateResult = validate(loginData);
  if (!validateResult.isValid) {
    console.log(validateResult.messages.join("\n"));
  } else {
    handleLogin(userArr, loginData);
  }
});

function handleLogin(userArr, data) {
  if (isValidUser(userArr, data.username, data.password)) {
    console.log("Log in succesfully");
    const currentUser = userArr.find((user) => user.username === data.username);

    console.log(currentUser);
    saveToStorage("CURRENT_USER", currentUser);
    window.location.href = "../index.html";
  } else {
    console.log("Username or password is not valid");
  }
}
function getLoginData() {
  return {
    username: usernameInput.value.trim(),
    password: passwordInput.value.trim(),
  };
}
function validate(data) {
  let messages = [];

  if (!data.username) {
    messages.push("Username is required");
  }
  if (!data.password) {
    messages.push("Password is required");
  }

  return {
    isValid: messages.length === 0,
    messages: messages,
  };
}
function isValidUser(userArr, username, password) {
  let bcrypt = dcodeIO.bcrypt;
  const user = userArr.find((user) => user.username === username);
  if (user) {
    return bcrypt.compareSync(password, user.password);
  }
  return false;
}
