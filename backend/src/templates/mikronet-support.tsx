import {
  Body,
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

interface MikronetSupportProps {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  message?: string;
  reason?: "support" | "transfer";
}

const baseUrl = process.env.LIVE_URL;

export const MikronetSupportEmail = ({
  name,
  email,
  phone,
  address,
  message,
  reason,
}: MikronetSupportProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Mikronet!</Preview>
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
            The user {name?.toLowerCase()} with the email address{" "}
            <Link style={anchor} href={`mailto:${email}`}>
              {email}
            </Link>{" "}
            and the phone number{" "}
            <Link style={anchor} href={`tel:${phone}`}>
              {phone}
            </Link>
            , living at {address} has requested{" "}
            {reason === "support" ? "support" : "help for a transfer"}. See
            below the {reason === "support" ? "message" : "new address"}
          </Text>
          <Hr style={hr} />
          <code style={paragraph}>{message}</code>
          <Hr style={hr} />
          <Text style={paragraph}>
            Try to reach out to the user as soon as possible to resolve the
            issue.
          </Text>
          <Text style={paragraph}>— mikronet system</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Mikronet, 24 Blohum Rd, Dzorwulu, Accra, Ghana
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

MikronetSupportEmail.PreviewProps = {
  name: "John Does",
  reason: "transfer",
  phone: "233 123 456 789",
  email: "cafe@gmail.com",
  address: "24 Blohum Rd, Dzorwulu, Accra, Ghana",
  message: "I need help with my account",
} as MikronetSupportProps;

export default MikronetSupportEmail;

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

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
