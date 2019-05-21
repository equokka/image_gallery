// main.js
// Main application UI and event logic

import { App } from "./core.js";
import * as COMPONENT from "./components.js";

// Instantiate App
window.app = new App();

// Variable for the form state (login/signup)
let FORM_STATE;

// HTML node we use often
const $main = $("main");

/**
 * Initializes the form by appending it to <main>, and attaching event handlers.
 */
const formInit = () => {
  // Reset the form state
  FORM_STATE = "login";

  // Inject form HTML
  $main.append(COMPONENT.form);

  // Set event handlers
  $("#form-get-alt").click(e => formAltToggle(e));
  $("form#enter").submit(e => formSubmit(e));
};

/**
 * Toggles presence of signup elements and signup text
 * @param {JQuery.ClickEvent} e
 */
const formAltToggle = (e) => {
  // Prevent default behavior of form>button
  e.preventDefault();

  // Elements
  const
    $alt   = $("#form-alt"),
    $title = $("#form-title"),
    $btn   = $("#form-get-alt");

  // What state are we on?
  if (FORM_STATE === "login") {
    // Set to signup
    FORM_STATE = "signup";

    // Inject signup form elements
    $alt.append(COMPONENT.form_alt);

    // Change text appropriately
    $title.text("Sign Up");
    $btn.text("Log In");

  } else {
    // Change to login
    FORM_STATE = "login";

    // Remove signup form elements
    $alt.empty();

    // Change text appropriately
    $title.text("Log In");
    $btn.text("Sign Up");
  }
};

/**
 * Handles form submit event.
 * Form can only be submitted if all required elements are filled in.
 * @param {JQuery.ClickEvent} e
 */
const formSubmit = (e) => {
  // Prevent default submit input behavior
  e.preventDefault();

  // Form values
  const
    $email = $("#form-email").val(),
    $pass = $("#form-password").val(),
    $name = $("#form-name").val(),
    $user = $("#form-username").val();

  if (FORM_STATE === "login") {
    // Attempt to log in:
    window.app.logIn(
      $email, $pass,
      // Success and failure handlers:
      uiInit, msg => formDisplayError(msg)
    );
  } else {
    // Attempt to sign up:
    window.app.signUp($email, $pass, $name, $user,
      // Successful signup:
      () => {
        window.app.currentUser = $email;
        uiInit();
      },
      // Failed to sign up:
      msg => formDisplayError(msg)
    );
  }
};

let c_error;
/**
 * Displays an error message in the login form for 5 seconds
 * @param {String} msg Error message
 */
const formDisplayError = msg => {
  // Stop timer for previous error if there is any
  clearTimeout(c_error);

  // Inject error message and fade it in
  $("#form-error").text(msg).fadeIn();

  // Set timer of 5 seconds to fade message out
  c_error = setTimeout(() => $("#form-error").fadeOut(), 5 * 1000);
};

/**
 * Initializes main UI by appending it to <main>.
 */
const uiInit = () => {
  // Clear $main
  $main.empty();

  // Inject UI HTML
  $main.append(COMPONENT.ui);

  // Display default images
  search();

  // User selection dropdown
  $("#nav-users").append("<option value=\"none\">Users</option>");
  window.app.users.forEach(u => {
    $("#nav-users").append(
      `<option onlick="searchUser('${u.username}')"
               value="${u.username}">${u.username}</option>`
    );
  });
  $("#nav-users").click(() => {
    let value = $("#nav-users option:selected").val();

    // Replace contents of search input with from:selected_username
    if (value !== "none") {
      $("#search").val(`from:${value}`);
      // Search for that
      search($("#search").val());
    }

    // Clear it
    $("#nav-users").val("none");
  });

  // Home button
  $("#nav-home").click(e => {
    // Prevent default behavior of form>button
    e.preventDefault();

    // Clear search
    $("#search").val("");
    search($("#search").val());
  });

  // Wildcard button
  $("#nav-all").click(e => {
    // Prevent default behavior of form>button
    e.preventDefault();

    // Search for *
    $("#search").val("*");
    search($("#search").val());
  });

  // Logout button
  $("#nav-log-out").click(e => {
    // Prevent default behavior of form>button
    e.preventDefault();

    // Clear $main
    $main.empty();

    // Log current user out
    window.app.logOut();

    // Init login form
    formInit();
  });

  // Search input: As you type it search()es the value.
  $("#search").on("input", () => search($("#search").val()));

  // My profile button
  $("#nav-my-profile").click(e => {
    // Prevent default behavior of form>button
    e.preventDefault();

    // Replace contents of search input with from:current_username
    $("#search").val(`from:${window.app.currentUser.username}`);

    // Search for that
    search($("#search").val());
  });

  // Submit button
  $("#publish-submit").click(e => {
    // Prevent default submit input behavior
    e.preventDefault();

    // Add the image to App instance
    window.app.addPic(
      $("#publish-url").val(),
      $("#publish-description").val()
    );

    // Update search results
    search($("#search").val());

    // Clear publish inputs
    $("#publish-url").val("");
    $("#publish-description").val("");
  });
};


/**
 * Update #grid with images that match the given query.
 * If the query contains `from:username`, it will show pictures from that user.
 * If the query contains `*`, it will show all pictures.
 * The query is then be further filtered by any other words you type in.
 * @param {String?} query
 */
const search = (query = "") => {
  // Update query text display above #grid
  let t = query.trim();
  if (t === "") t = "None";
  $("#search-query").text(t);

  // Clear grid
  $("#grid").empty();

  // Keep pictures in this variable as they are filtered.
  let pics;

  // Check for special search terms:

  // Regular expressions for from:username and wildcard
  const r_from = /from:([^\s]+)/,
    r_wild = /(\W|^)\*(\W|$)/;

  // Test regexps against the given query
  let from = false,
    wild = false;

  // Wildcard
  if (r_wild.test(query)) wild = true;
  // from:user
  if (r_from.test(query)) from = r_from.exec(query)[1];
  // Note here that this only checks the first ocurrence
  // We don't care about any other ocurrences of from:user.

  // Check if we started with an empty query
  let empty = false;
  if (query === "") empty = true;

  // Get an array of every single space-separated word in the query,
  // minus anything matching r_from and r_wild.
  query = query
    // Remove instances of r_from in query
    .replace(r_from, "")
    // Remove instances of the wildcard in query
    .replace(r_wild, "")
    // Trim string
    .trim()
    // Set it to lowercase
    .toLowerCase()
    // Split it into an array on spaces
    .split(" ");

  // Filter search results:
  // If we have a wildcard in the query...
  if (wild) {
    // Do not filter anything
    pics = window.app.pics;
    // And ignore from:user, it doesn't matter
  }
  // If there is no wildcard in the query...
  // and there is a from:user in the query...
  else if (from) {
    // Filter for pictures matching the user
    pics = window.app.pics.filter(pic => pic.author === from);
  // and there is nothing in the query...
  } else if (empty) {
    // Filter for pictures from the logged-in user and the people they follow
    pics = window.app.pics.filter(pic => {
      if (pic.author === window.app.currentUser.username ||
              window.app.currentUser.following.some(u => u === pic.author)
      ) return true;
      return false;
    });
  } else {
    // Do not filter anything
    pics = window.app.pics;
  }

  // Filter resulting pictures down using the remaining query words:
  query.forEach(word => {
    pics = pics.filter(pic => pic.desc.indexOf(word) > -1);
  });

  // Info displayed above results goes here
  let $info = $("#info");

  // Clear it
  $info.empty();

  // Display info based on search query:
  if (wild) {
    // Display number of pictures in $info
    $info.append(COMPONENT.info_num(pics.length));
  } else if (from) {
    if (from === window.app.currentUser.username) {
      // Display regular user profile page
      $info.append(COMPONENT.info_userprofile(window.app.currentUser));
    } else if (window.app.users.some(e => e.username === from)) {
      // Display stats and interaction buttons for the user in from:user
      $info.append(COMPONENT.info_from(
        window.app.users.find(u => u.username === from),
        window.app.currentUser.following.some(u => u === from),
        window.app.getUserByUsername(from).following.some(
          u => u === window.app.currentUser.username
        )
      ));
    } else {
      $info.append("No such user.");
    }
  } else if (empty) {
    // Display regular user profile page
    $info.append(COMPONENT.info_userprofile(window.app.currentUser));
  } else {
    // Display stats for regular search
    $info.append(COMPONENT.info_num(pics.length));
  }

  // Add the pictures to #grid
  pics.forEach(e => $("#grid").append(COMPONENT.pic(e.author, e.url, e.desc)));
};

// When ready, show the signup form.
$.ready.then(formInit);
