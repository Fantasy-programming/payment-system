import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MikronetReceiptProps {
  name: string;
}

const baseUrl = process.env.LIVE_URL;

export const MikronetReceiptEmail = ({ name }: MikronetReceiptProps) => (
  <Html>
    <Head />
    <Preview>Mikronet Subscription Receipt</Preview>
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
            Dear {name}, thank you for your subscription. Your account will be
            activated soon. See attached your receipt.
          </Text>
          <Text style={paragraph}>— Mikronet Team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Mikronet, 24 Blohum Rd, Dzorwulu, Accra, Ghana
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

MikronetReceiptEmail.PreviewProps = {
  name: "John Doe",
} as MikronetReceiptProps;

export default MikronetReceiptEmail;

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

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
