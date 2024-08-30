import { formatDate } from "@/lib/utils";
import { Transaction } from "@/services/transaction.types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
  },
  subheader: {
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  logo: {
    transform: "scale(1.5)",
    width: 50,
    height: 50,
    marginBottom: 20,
  },
});

// Receipt component
const PDFReceipt = ({ orderData }: { orderData: Transaction }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.row}>
          <View>
            <Text style={styles.header}>Order {orderData.trxRef}</Text>
            <Text style={styles.subheader}>
              Date: {formatDate(orderData.createdAt)}
            </Text>
          </View>
          <Image
            style={styles.logo}
            src="/Mikronet.png" // Replace with your logo path
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Order Details</Text>
        <View style={styles.row}>
          <Text>
            {orderData.product.name} data plan x {orderData.duration} month
          </Text>
          <Text>¢{orderData.finalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Subtotal</Text>
          <Text>¢{orderData.product.price.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Tax</Text>
          <Text>¢00.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Total</Text>
          <Text style={styles.bold}>¢{orderData.finalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Address</Text>

        {orderData.user.address.split(",").map((line, index) => (
          <Text key={index}>{line}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Billing Information</Text>
        <Text>Same as home address</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Customer Information</Text>
        <View style={styles.row}>
          <Text>Customer:</Text>
          <Text>
            {orderData.user?.lastName} {orderData.user?.firstName}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>Email:</Text>
          <Text>{orderData.user.email}</Text>
        </View>
        <View style={styles.row}>
          <Text>Phone:</Text>
          <Text>{orderData.user?.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Payment Information</Text>
        <View style={styles.row}>
          <Text>{orderData?.medium}</Text>
          <Text>
            {orderData?.medium === "Visa"
              ? "**** **** **** 4532"
              : orderData?.user?.phone}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFReceipt;
