/**
 * @file
 * OSULP behaviors.
 */
(function (Drupal) {

  'use strict';

  Drupal.behaviors.osulp = {
    attach (context, settings) {

      console.log('It works!');

    }
  };

} (Drupal));

/* Search Bar */
function handleSearchLocChange(elem) {
  methodElem = document.getElementById("osulp-search-method");
  locValue = elem.value;
  showValues = ["cat", "cr"];
  show = showValues.includes(locValue);

  methodElem.classList.toggle("d-none", !show);
}
document.addEventListener("DOMContentLoaded", function () {
  handleSearchLocChange(document.getElementById("osulp-search-loc"));
});
