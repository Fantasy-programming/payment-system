import { ErrorResponse } from "@/services/auth.types";
import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to handle errors
export const handleError = (error: unknown): string => {
  const axiosError = error as AxiosError<ErrorResponse>;

  if (
    axiosError.response &&
    axiosError.response.data &&
    axiosError.response.data.error
  ) {
    return axiosError.response.data.error;
  } else {
    return "An error occurred";
  }
};
