import { Paystack } from "paystack-sdk";
import config from "./config";
import logger from "./logger";

const paystack = new Paystack(config.PAYSTACK_SECRET_KEY);

export async function getPaymentMethod(transactionReference) {
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
      logger.error("Transaction not found or verification failed");
    }
  } catch (error) {
    logger.error("Error fetching transaction details:", error);
  }
}
