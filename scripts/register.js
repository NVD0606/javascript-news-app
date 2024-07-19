"use strict";
const KEY = "USER_ARRAY";
// saveToStorage(KEY, [
//   {
//     firstName: "Dominic",
//     lastName: "Peredhil",
//     username: "DomPed@1102",
//     password: "1",
//   },
// ]);
const userArr = JSON.parse(getFromStorage(KEY) || "[]").map(parseUser);
console.log(`user array:`, userArr);

const firstNameInput = document.getElementById("input-firstname");
const lastNameInput = document.getElementById("input-lastname");
const usernameInput = document.getElementById("input-username");
const passwordInput = document.getElementById("input-password");
const passwordConfirmInput = document.getElementById("input-password-confirm");
const submitBtn = document.getElementById("btn-submit");

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = getFormData();
  const validationResult = validate(formData, userArr);

  if (!validationResult.isValid) {
    console.log(validationResult.messages.join("\n"));
  } else {
    registerUser(userArr, formData);

    console.log("Validation successful!");
    window.location.href = "../pages/login.html";
  }
});

function getFormData() {
  return {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    username: usernameInput.value.trim(),
    password: passwordInput.value.trim(),
    passwordConfirm: passwordConfirmInput.value.trim(),
  };
}
function validate(data, userArr) {
  let messages = [];
  if (!data.firstName) {
    messages.push("Firstname is required");
  }
  if (!data.lastName) {
    messages.push("Lastname is required");
  }
  if (!data.username) {
    messages.push("Username is required");
  }
  // if (!data.password || data.password.length < 8) {
  //   messages.push("Password must be at least 8 characters long");
  // }
  if (data.password !== data.passwordConfirm) {
    messages.push("Password do not match");
  }
  if (isExistedUser(userArr, data.username)) {
    messages.push("Username already exists");
  }

  return {
    isValid: messages.length === 0,
    messages: messages,
  };
}
function isExistedUser(userArr, username) {
  return userArr.some((user) => user.username === username);
}
function registerUser(userArr, data) {
  let bcrypt = dcodeIO.bcrypt;
  const user = new User(
    data.firstName,
    data.lastName,
    data.username,
    bcrypt.hashSync(data.password, 10)
  );
  // console.log(user);
  userArr.push(user);
  // console.log(userArr);
  saveToStorage(KEY, userArr);
}
