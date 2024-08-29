import logger from "../logger";

import { Paystack } from "paystack-sdk";
import { PAYSTACK_SECRET_KEY } from "../env";
import { InternalError } from "../utils/errors";

const paystack = new Paystack(PAYSTACK_SECRET_KEY || "");

/**
 * Asynchronously retrieves the payment method for a specified transaction.
 *
 * @param {string} transactionReference - The paystack reference of the transaction.
 * @returns  A promise that resolves with the payment method ("Mobile Money" or "Visa").
 * @throws {InternalError} If there is an error in the process */

export async function getPaymentMethod(transactionReference: string) {
  try {
    const response = await paystack.transaction.verify(transactionReference);

    if (!response.status) {
      logger.error("Transaction not found or verification failed");
      throw new InternalError("Transaction not found or verification failed");
    }

    return response?.data?.channel === "mobile_money" ? "Mobile Money" : "Visa";
  } catch (error) {
    logger.error("Error fetching transaction details:", error);
    throw new InternalError("Internal server error");
  }
}
