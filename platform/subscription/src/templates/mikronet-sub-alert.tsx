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
import type { IFullTransaction } from "../types/transaction.type";

interface MikronetSubAlertProps {
  transaction: IFullTransaction;
}

const baseUrl = process.env.LIVE_URL;

export const MikronetSubAlertEmail = ({
  transaction,
}: MikronetSubAlertProps) => (
  <Html>
    <Head />
    <Preview>Request for Activation</Preview>
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
            The user {transaction?.user?.firstName?.toLowerCase()}{" "}
            {transaction?.user?.lastName?.toLowerCase()} has purchased a
            subscription. Please proceed with the activation protocol. See below
            the activation details:
          </Text>
          <Hr style={hr} />
          <code style={paragraph}>
            Plan: {transaction?.product?.name} <br />
            Duration: {transaction?.duration} <br />
            RouterID: {transaction?.user?.routerID} <br />
            Zone: {transaction?.user?.zone} <br />
            startDate: {transaction?.startDate?.toString()} <br />
            endDate: {transaction?.endDate?.toString()} <br />
          </code>
          <Hr style={hr} />
          <Text style={paragraph}>
            Proceed with account activation as soon as possible.
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

MikronetSubAlertEmail.PreviewProps = {} as MikronetSubAlertProps;

export default MikronetSubAlertEmail;

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
