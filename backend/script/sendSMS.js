const mail = require("../lib/mail");
import Email from "../emails/mikronet-welcome";
const { render } = require("@react-email/components");

const test = async () => {
  const email = render(Email({ firstName: "don", lastName: "carlo" }));
  await mail("cafemelon8@gmail.com", "Welcome to Mikronet", email);
  console.log("Email sent successfully");
};

module.exports = test;
