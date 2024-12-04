/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var styles = {
  page1: 'CSS/page1.css',
  page2: 'CSS/page2.css',
  page3: 'CSS/page3.css'
};
var styleDescriptions = {
  page1: 'Styl Pierwszy',
  page2: 'Styl Drugi',
  page3: 'Styl Trzeci'
};
var currentStyle = 'page1';
function changeStyle(newStyle) {
  if (!styles[newStyle]) {
    console.error("Style ".concat(newStyle, " not found"));
    return;
  }
  var existingLink = document.querySelector('link[data-dynamic-style]');
  if (existingLink) {
    existingLink.remove();
  }
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = styles[newStyle];
  link.setAttribute('data-dynamic-style', 'true');
  document.head.appendChild(link);
  currentStyle = newStyle;
}
function setupNavbar() {
  var navbarLinks = document.querySelectorAll('[data-style-link]');
  navbarLinks.forEach(function (link) {
    var styleKey = link.getAttribute('data-style-link');
    if (styleKey && styles[styleKey]) {
      var anchor = link.querySelector('a');
      if (anchor) {
        anchor.textContent = styleDescriptions[styleKey] || "Styl ".concat(styleKey);
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          changeStyle(styleKey);
        });
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', function () {
  changeStyle(currentStyle);
  setupNavbar();
});
/******/ })()
;