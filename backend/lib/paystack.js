const { Paystack } = require("paystack-sdk");
const config = require("./config");

const paystack = new Paystack(config.PAYSTACK_SECRET_KEY);

async function getPaymentMethod(transactionReference) {
  try {
    const response = await paystack.transaction.verify(transactionReference);
    if (response.status) {
      const transaction = response.data;
      let medium = transaction.channel; // e.g., 'card', 'bank', 'ussd'

      if (medium === "mobile_money") {
        medium = "Mobile Money";
      }

      if (medium === "card") {
        medium = "Visa";
      }

      return medium;
    } else {
      console.log("Transaction not found or verification failed");
    }
  } catch (error) {
    console.error("Error fetching transaction details:", error);
  }
}

module.exports = { getPaymentMethod };
