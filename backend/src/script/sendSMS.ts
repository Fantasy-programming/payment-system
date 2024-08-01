import { sendMail } from "../lib/mail";
import { render } from "@react-email/components";
import { MikronetWelcomeEmail } from "../templates/mikronet-welcome";

export const sendEmail = async () => {
  const email = render(
    MikronetWelcomeEmail({ firstName: "don", lastName: "carlo" }),
  );

  await sendMail("cafemelon8@gmail.com", "Welcome to Mikronet", email);
  console.log("Email sent successfully");
};
