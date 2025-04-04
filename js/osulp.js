/**
 * @file
 * OSULP behaviors.
 */
// (function (Drupal) {
//   "use strict";

//   Drupal.behaviors.osulp = {
//     attach(context, settings) {
//       console.log("It works!");
//     },
//   };
// })(Drupal);

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

// functions for when user clicks on first select list (searches)
function handleSearchLocChange(locElem){
  handleSearchFacet();
  tooMuchLogic(locElem);
  inputPlaceholder();
}

// When the location changes, we need to hide/show the search method (keyword/exact)
function tooMuchLogic(locElem) {
  // Hide and show first
  // Elem to hide/show
  const methodElem = document.getElementById("osulp-search-facet-wrapper");
  const advancedElem = document.getElementById("osulp-advanced-search");
  // Value to determine hide/show
  const locValue = locElem.value;
  // Values to show on
  const showValues = ["cat", "cr"];
  // Hide if location isn't one to show search method
  const hide = !showValues.includes(locValue);
  // Hide/show
  methodElem.classList.toggle("d-none", hide);
  advancedElem.classList.toggle("d-none", hide);
}

// When the location changes or the facet changes, we need different placeholder text
function inputPlaceholder(){
  // get the search location element
  const $searchLocation = document.getElementById("osulp-search-loc");
  // get the value from the search location
  const searchVal = $searchLocation.value;
  // get the facet element
  const $searchFacet = document.getElementById("osulp-search-facet");
  // get the value from the facet
  const searchFaceValue = $searchFacet.value;

  // Placeholder text logic
  let osulpSearchInputPlaceholder = "type here"; //default, just in case
  // Get the location
  switch (searchVal) {
    case "cat":{
      osulpSearchInputPlaceholder = "explore 1Search for books & articles";
    }
    break;
    case "cr":{
      if (searchFaceValue == "course_code"){
        osulpSearchInputPlaceholder = "KIN 481";
      }else{
        osulpSearchInputPlaceholder = "";
      }
    }
    break;
    case "jour":
      osulpSearchInputPlaceholder = "";
    break;
    case "web":
      osulpSearchInputPlaceholder = "";
    break;
    case "rg":
      osulpSearchInputPlaceholder = "";
    break;
    case "tad":
      osulpSearchInputPlaceholder = "";
    break;
    case "arc":
      osulpSearchInputPlaceholder = "";
    break;
  }
  //document.getElementById("osulp-search-query").placeholder = osulpSearchInputPlaceholder; 
  document.getElementById("osulp-search-query").setAttribute("placeholder", osulpSearchInputPlaceholder); 
}

// when the location is catalog, then hide 'course' number option
function handleSearchFacet(){

  // get element that we're messing with
  const $searchLocation = document.getElementById("osulp-search-loc");
  // get the value from the element
  const searchVal = $searchLocation.value;
  //debugger;

  // get element we're messing with
  const $courseNumber = document.getElementById("course-code");
  

  // if the serach location is cat then course number scope is hidden 
  if (searchVal == "cat"){
  //$courseNumber.setAttribute("disabled","");
  $courseNumber.classList.add("d-none");
  };

  if (searchVal == "cr"){
    //$courseNumber.removeAttribute("disabled","");
    $courseNumber.classList.remove("d-none");
  }
}


// Builds the url that each case submits to

function handleSearchSubmit(formElem) {
  const locElem = formElem.querySelector("#osulp-search-loc");
  const methodElem = formElem.querySelector("#osulp-search-facet");
  const queryElem = formElem.querySelector("#osulp-search-query");
  // Blank values to set at end of method
  let formAction = ""; // Where the search will send us
  let inputs = {}; // Hidden key/values to send w/ search

  // Handle each special case depending on the search location
  switch (locElem.value) {
    case "cat": // Catalog search
      formAction = "https://search.library.oregonstate.edu/discovery/search";
      inputs = {
          vid: "01ALLIANCE_OSU:OSU",
          tab: "Everything",
          search_scope: "OSU_Everything_Profile",
          // query: "any," + methodElem.value + "," + queryElem.value,
          query: `any,${methodElem.value},${queryElem.value}`
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
        // query: "any," + methodElem.value + "," + queryElem.value,
        query: `any,${methodElem.value},${queryElem.value}`
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
        q: queryElem.value,
      };
      break;

    case "cr": // Course Reserves search
      formAction = "https://search.library.oregonstate.edu/discovery/search";
      // extra logic for 'course code', since it doesn't follow the same url pattern
      if (methodElem.value === "course_code"){
        inputs = {
          vid: "01ALLIANCE_OSU:OSU",
          tab: "CourseReserves",
          search_scope: "CourseReserves",
          //query: methodElem.value + ",contains," + queryElem.value,
          query: `${methodElem.value},contains,${queryElem.value}`
        };
      } else {
      inputs = {
        vid: "01ALLIANCE_OSU:OSU",
        tab: "CourseReserves",
        search_scope: "CourseReserves",
        //query: "any," + methodElem.value + "," + queryElem.value,
        query: `any,${methodElem.value},${queryElem.value}`
      };
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
        p: "core/search",
        q: queryElem.value,
        content: 1,
      };
      break;
  }
  console.log(inputs);
  debugger
  // Set the search location
  formElem.action = formAction;
  // Add the search params
  hashToHiddenInputs(inputs, formElem);
}

/**
 * Convert a hash to hidden form elements for submission of hidden values
 */
function hashToHiddenInputs(hash, formElem) {
  document.querySelectorAll(".search-temp-hidden").forEach((e) => e.remove());

  for ([key, value] of Object.entries(hash)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;

    input.classList.add("search-temp-hidden");

    console.log(input);
    // Append the input to the form
    formElem.appendChild(input);
  }
}
/* End Search Bar */
