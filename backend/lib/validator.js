const EMAILREGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSREGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

/**
 * Validate email address
 * @param {string} email
 * @returns {boolean} true if email is valid, false otherwise
 */

export function validateEmail(email) {
  return EMAILREGEX.test(email);
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {boolean} true if password is strong, false otherwise
 */

export function validatePassword(password) {
  return PASSREGEX.test(password);
}
