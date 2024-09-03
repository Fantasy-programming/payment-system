/**
 * Generates a random password of a specified length.
 * The password will contain at least one lowercase letter, one uppercase letter, one number, and one special character.
 * The rest of the password will be made up of a random mix of these types of characters.
 * The order of characters in the password is also randomized.
 *
 * @param length - The desired length of the password.
 * @returns The generated password.
 */

export function generatePassword(length: number) {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const allChars = lowerCase + upperCase + numbers + specialChars;

  let password = "";

  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to ensure the order of characters is random
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  return password;
}
