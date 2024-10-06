import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import type { IUser } from "../types/user.type";

interface MikronetReminderProps {
  user?: IUser;
}

const baseUrl = process.env.LIVE_URL;

export const MikronetReminderEmail = ({ user }: MikronetReminderProps) => (
  <Html>
    <Head />
    <Preview>Your Mikronet subsciption ends soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`${baseUrl}/Mikronet.png`}
            width="40"
            height="40"
            alt="Mikronet's Logo"
            style={{
              transform: "scale(1.5)",
            }}
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            Hi {user?.firstName} {user?.lastName}, this is a friendly reminder
            to renew your Mikronet subscription. Your subscription will end in 2
            days exaclty.
          </Text>
          <Button style={button} href={baseUrl}>
            Renew your Mikronet Subscription
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            We'll be here to help you with any step along the way. You can find
            answers to most questions and get in touch with us on our{" "}
            <Link style={anchor} href="mailto:cafemelon8@gmail.com">
              support email
            </Link>
            .
          </Text>
          <Text style={paragraph}>— The Mikronet team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Mikronet, 24 Blohum Rd, Dzorwulu, Accra, Ghana
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

MikronetReminderEmail.PreviewProps = {
  user: {
    firstName: "John",
    lastName: "Doe",
  },
} as MikronetReminderProps;

export default MikronetReminderEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#f8b697",
};

const button = {
  backgroundColor: "#36b4ce",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
