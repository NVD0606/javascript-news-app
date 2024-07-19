"use strict";
function getFromStorage(key) {
  // return localStorage.getItem(key) || "[]";
  return localStorage.getItem(key);
}
function saveToStorage(key, value) {
  if (typeof value === "string") {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
