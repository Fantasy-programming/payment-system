const mail = require("../lib/mail");
import { MikronetWelcomeEmail } from "../emails/mikronet-welcome.jsx";
const { render } = require("@react-email/components");

export const sendEmail = async () => {
  const email = render(
    MikronetWelcomeEmail({ firstName: "don", lastName: "carlo" }),
  );
  await mail("cafemelon8@gmail.com", "Welcome to Mikronet", email);
  console.log("Email sent successfully");
};
