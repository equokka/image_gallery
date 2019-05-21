// public.js
// Javascript exposed to the page (for inline onclick events)
/* eslint-disable no-unused-vars */

/**
 * Searches for "from:username" where username is a given username.
 * @param {String} username
 */
const searchUser = username => {
  // Replace contents of search input with from:username
  $("#search").val(`from:${username}`);

  // Search for that.
  $("#search").trigger("input");
};

/**
 * Toggles whether or not the currently logged-in user follows the given username.
 * @param {String} username
 */
const toggleFollowUser = username => {
  // Check if we're following this person
  if (window.app.currentUser.following.some(u => u === username)) {
    // We're following them, so we unfollow:
    window.app.unfollow(
      window.app.users.find(u => u.username === username).email
    );
  } else {
    // We're not following them, so we follow:
    window.app.follow(
      window.app.users.find(u => u.username === username).email
    );
  }

  // Refresh page by triggering search()
  $("#search").trigger("input");
};
