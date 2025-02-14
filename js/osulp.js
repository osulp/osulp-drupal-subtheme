/**
 * @file
 * OSULP behaviors.
 */
(function (Drupal) {
  "use strict";

  Drupal.behaviors.osulp = {
    attach(context, settings) {
      console.log("It works!");
    },
  };
})(Drupal);

/* Search Bar */
/**
 * The concept here is to make the search form a dummy form w/ no native HTML function and adding search params on submission.
 * This is done by setting the form `action` and all input `name` values to empty strings,
 * then populating the form `action` and adding hidden input `name` values based on the location (first) dropdown via the onsubmission handler.
 */

// When the DOM is accessible, we need to update the search bar for consistent display
document.addEventListener("DOMContentLoaded", function () {
  handleSearchLocChange(document.getElementById("osulp-search-loc"));
});

// When the location changes, we might need to hide/show the search method (keyword/exact)
function handleSearchLocChange(locElem) {
  // Elem to hide/show
  methodElem = document.getElementById("osulp-search-method-wrapper");
  // Value to determine hide/show
  formElem = locElem.closest("form");
  locValue = locElem.value;
  // Values to show on
  showValues = ["cat", "cr"];
  // Hide if location isn't one to show search method
  hide = !showValues.includes(locValue);

  // Hide/show
  methodElem.classList.toggle("d-none", hide);
}

function handleSearchSubmit(formElem) {
  locElem = formElem.querySelector("#osulp-search-loc");
  methodElem = formElem.querySelector("#osulp-search-method");
  queryElem = formElem.querySelector("#osulp-search-query");
  // Blank values to set at end of method
  formAction = ""; // Where the search will send us
  inputs = {}; // Hidden key/values to send w/ search

  // Handle each special case depending on the search location
  switch (locElem.value) {
    case "cat": // Catalog search
      formAction = "https://search.library.oregonstate.edu/discovery/search";
      inputs = {
        vid: "01ALLIANCE_OSU:OSU",
        tab: "Everything",
        search_scope: "OSU_Everything_Profile",
        query: "any," + methodElem.value + "," + queryElem.value,
      };
      break;
    case "web": // Website search
      formAction = "/search";
      inputs = {
        search_api_fulltext: queryElem.value,
      };
      break;
    case "jour": // Journal search
      formAction = "https://search.library.oregonstate.edu/discovery/jsearch";
      inputs = {
        vid: "01ALLIANCE_OSU:OSU",
        tab: "jsearch_slot",
        query: "any," + methodElem.value + "," + queryElem.value,
      };

      break;
    case "tad": // Theses and Dissertations search
      // We need to add two elements of the same name so lets hack one in before we add the second
      inputs = {
        "f_inclusive[resource_type_sim][]": "Masters Thesis",
      };
      hashToHiddenInputs(inputs, formElem);

      formAction = "https://ir.library.oregonstate.edu/catalog";
      inputs = {
        "f_inclusive[resource_type_sim][]": "Dissertation",
      };
      break;
    case "cr": // Course Reserves search
      formAction = "https://search.library.oregonstate.edu/discovery/search";
      inputs = {
        vid: "01ALLIANCE_OSU:OSU",
        tab: "CourseReserves",
        search_scope: "CourseReserves",
        query: "any," + methodElem.value + "," + queryElem.value,
      };
      break;
    case "rg": // Research Guides search
      formAction = "https://guides.library.oregonstate.edu/srch.php";
      inputs = {
        q: queryElem.value,
      };
      break;
    case "arc": // SCARC search "Archival Guides"
      formAction = "https://scarc.library.oregonstate.edu/findingaids/index.php";
      inputs = {
        q: queryElem.value,
        content: 1,
      };
      break;
  }
  // Set the search location
  formElem.action = formAction;
  // Add the search params
  hashToHiddenInputs(inputs, formElem);
}

/**
 * Convert a hash to hidden form elements for submission of hidden values
 */
function hashToHiddenInputs(hash, formElem) {
  for ([key, value] of Object.entries(hash)) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;

    console.log(input);
    // Append the input to the form
    formElem.appendChild(input);
  }
}
/* End Search Bar */
