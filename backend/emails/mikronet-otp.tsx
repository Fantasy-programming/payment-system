import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MikronetOTPProps {
  loginCode?: string;
}

const baseUrl = process.env.LIVE_URL;

export const MikronetOTPEmail = ({ loginCode }: MikronetOTPProps) => (
  <Html>
    <Head />
    <Preview>Reset password OTP code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Password</Heading>
        <Text style={{ ...text, marginBottom: "14px" }}>
          copy and paste this one time passcode to reset your password:
        </Text>
        <code style={code}>{loginCode}</code>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t try to login, you can safely ignore this email.
        </Text>
        <Img
          src={`${baseUrl}/Mikronet.png`}
          width="40"
          height="40"
          alt="Mikronet's Logo"
          style={{
            transform: "scale(1.8)",
          }}
        />
        <Text style={footer}>
          <Link
            href="https://notion.so"
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            Mikronet
          </Link>
          , the trusthworhty isp
          <br />
          for all your internet needs.
        </Text>
      </Container>
    </Body>
  </Html>
);

MikronetOTPEmail.PreviewProps = {
  loginCode: "020202",
} as MikronetOTPProps;

export default MikronetOTPEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0px 10px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
  fontFamily: "monospace",
  fontSize: "18px",
};
