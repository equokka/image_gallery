// core.js
// Application logic.

/**
 * Main application object
 */
export class App {
  /**
   * Creates a new instance of App.
   */
  constructor() {
    this.app_strings = {
      "email_invalid": "Insert a valid email",
      "email_taken": "Sorry, that email is already taken",
      "signup_while_signedin": "log out first before you create a new account",
      "signup_success": "Thank you for your registration, welcome!",
      "exit": "You left the program, bye",
      "no_account": "We don’t have that account",
      "password_incorrect": "The password is incorrect",
      "duplicate_login": "You are already logged in",
      "login_success": "Welcome, %name.",
      "declined": "Sorry, you have to be logged in to use that functionality",
      "logout_success": "You logged out, see you later",
      "user_not_found": "That user does not exist",
      "follow_success": "You now follow %name",
      "search_fail": "We have no results for that query",
      "unknown_command": "We don’t have that option",
      // ---
      "prompt": "Insert your command.",
      "undefined": "Passed undefined, stopping.",
      "new_name": "Insert your name:",
      "new_email": "Insert your email:",
      "new_password": "Insert your password:",
      "login_email": "Email:",
      "login_password": "Password:",
      "follow_email": "Email of whom you want to follow:",
      "search_email": "Email you wanna search for:"
    };
    this.users = [];
    this.currentUserEmail = null;
    this.pics = [];
  }

  /**
   * User instance of the current user.
   * If you assign an email (string) to this, it changes the current user to one of that email.
   */
  get currentUser() { return this.getUser(this.currentUserEmail); }
  set currentUser(email) { this.currentUserEmail = email; }

  /**
   * Attempts to log in user with given email and password.
   *
   * @param {String} email User email.
   * @param {String} password User password.
   * @param {Function?} success Callback function for a successful login.
   * @param {Function?} failure Callback function for a failed login. Passes in a single argument with an error message.
   */
  logIn(email, password, success = () => {}, failure = () => {}) {
    // Does the user exist?
    if (this.hasUser(email)) {
      // Is the password correct?
      if (this.getUser(email).password === password) {
        this.currentUser = email;
        success();
      } else failure("Incorrect password.");
    } else failure("User does not exist.");
  }

  /**
   * Attempts to create a new user.
   * @param {String} email User email.
   * @param {String} password User password.
   * @param {String} name User's actual name.
   * @param {String} username Username.
   * @param {Function?} success Callback function for a successful signup.
   * @param {Function?} failure Callback function for a failed signup. Passes in a single argument with an error message.
   */
  signUp(email, password, name, username,
    success = () => {}, failure = () => {}) {
    // All usernames are forced to lowercase
    username = username.toLowerCase();

    // Is there already a user with that email?
    if (!this.hasUser(email)) {
      // Is there already a user with that username?
      if (!this.users.some(e => e.username === username)) {
        this.users.push(new AppUser(email, password, name, username));
        success();
      } else failure("Username already in use.");
    } else failure("Email already in use.");
  }

  /**
   * Logs out current user.
   */
  logOut() { this.currentUser = null; }

  /**
   * Returns a User or undefined if the user does not exist.
   * @param {String} email User's email
   * @return {AppUser} AppUser object.
   */
  getUser(email) {
    return this.users.find(u => u.email === email);
  }

  /**
   * Returns a User or undefined if the user does not exist.
   * @param {String} username User's username
   * @return {AppUser} AppUser object.
   */
  getUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  /**
   * True if a user with given email exists, false otherwise.
   * @param {String} email User's email
   */
  hasUser(email) {
    if (this.getUser(email)) return true;
    return false;
  }

  /**
   * Follow user with given email with currently logged-in account.
   * @param {String} email
   */
  follow(email) {
    let user = this.getUser(email);
    this.currentUser.following.push(user.username);
    user.followers.push(this.currentUser.username);
  }

  /**
   * Unfollow user with given email with currently logged-in account.
   * @param {String} email
   */
  unfollow(email) {
    let user = this.getUser(email);
    this.currentUser.following.splice(this.currentUser.following.indexOf(user.username), 1);
    user.followers.splice(user.followers.indexOf(this.currentUser.username), 1);
  }

  /**
   * Add picture as current user.
   * @param {String} url URL to the picture
   * @param {String?} desc Description of the picture
   */
  addPic(url, desc = "") {
    // Make sure someone is logged in
    if (!this.currentUser) throw new Error();

    // Unshift the image into the array.
    // Unshifting means the pictures end up ordered newest to oldest
    this.pics.unshift({
      author: this.currentUser.username,
      url: url,
      desc: desc
    });
  }
}

/**
 * Represents a user.
 */
export class AppUser {
  /**
   * Creates a user.
   */
  constructor(email, password, realname, username) {
    this.email = email;
    this.password = password;
    this.name = realname;
    this.username = username;
    this.following = [];
    this.followers = [];
  }
}
