// components.js
// HTML components used in main.js

/**
 * Form HTML
 */
export const form =
`<form id="enter" action="submit">
  <h1 id="form-title">Log In</h1>
  <label for="email">Email</label>
  <input id="form-email" type="email" name="email" autofocus required placeholder="Email">
  <label for="password">Password</label>
  <input id="form-password" type="password" name="password" required placeholder="Password">
  <div id="form-alt"></div>
  <div id="form-error" style="display: none;"></div>
  <div id="form-buttons">
    <input id="form-submit" type="submit" value="Submit">
    <button id="form-get-alt">Sign Up</button>
  </div>
</form>`;

/**
 * Additional HTML for signup form
 */
export const form_alt =
`<label for="name">Name</label>
<input id="form-name" type="text" name="name" placeholder="Your name (optional)">
<label for="username">ID / Username</label>
<input id="form-username" type="text" required placeholder="username">`;

/**
 * Main UI HTML
 */
export const ui =
`<div id="container">
  <div id="nav-container">
    <nav>
      <button id="nav-home" title="Home"><i class="fas fa-home"></i></button>
      <button id="nav-my-profile" title="Your profile"><i class="fas fa-user"></i></button>
      <button id="nav-all" title="All images"><i class="fas fa-asterisk"></i></button>
      <select id="nav-users"></select>
      <button id="nav-log-out" title="Log out"><i class="fas fa-sign-out-alt"></i></button>
    </nav>
    <input id="search" type="text" placeholder="Search">
  </div>
  <div id="top">
    <form id="publish">
      <h1 id="publish-title">Publish</h1>
      <input id="publish-url" type="text" placeholder="Image URL">
      <textarea id="publish-description" placeholder="Description"></textarea>
      <input id="publish-submit" type="submit" value="Submit">
    </form>
  </div>
  <hr>
  <div id="display">
    <div id="search-display">Search query: <div id="search-query"></div></div>
    <div id="info"><hr></div>
    <div id="grid"></div>
  </div>
</div>`;

/**
 * Generator for image HTML element
 * @param {String} author Image author username
 * @param {String} url Image URL
 * @param {String} desc Image description
 */
export const pic = (author, url, desc) => {
  return `<figure class="pic">
            <img src="${url}"
                 title="${url}"
                 alt="Image: ${desc}">
            <hr>
            <figcaption>
              <cite class="author">
                <a href="#" onclick="searchUser('${author}')">${author}</a>
              </cite>
              <blockquote>${desc}</blockquote>
            </figcaption>
          </figure>`;
};

/**
 * Search results info: Number of images.
 * @param {Number} num Number of matched images
 */
export const info_num = (num) => {
  return (num !== 0 ? `${num} images` : "No results.");
};

/**
 * Search results info: Logged-in user profile.
 * @param {User} user
 */
export const info_userprofile = (user) => {
  return `Your profile:<br>
          Username: ${user.username}<br>
          ${user.name !== "" ? `Name: ${user.name}<br>` : ""}
          Following: ${user.following.length}<br>
          Followers: ${user.followers.length}<br>`;
};

/**
 * Search results info: Info for a given user.
 * Includes a Follow/Unfollow button.
 * @param {User} user
 */
export const info_from = (user, isfollowed, followsyou) => {
  return `Profile for ${user.username}:<br>
          ${user.name !== "" ? `Name: ${user.name}<br>` : ""}
          ${followsyou ? `<em>${user.username} follows you.</em><br>` : ""}
          <button id="userprofile-follow" onclick="toggleFollowUser('${user.username}')">${isfollowed ? "Unfollow" : "Follow"}</button><br>
          Following: ${user.following.length}<br>
          Followers: ${user.followers.length}<br>`;
};
