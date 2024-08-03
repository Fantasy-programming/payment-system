import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
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

export const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (!decodedToken.exp) return true;

    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formattedDate = format(date, "MMMM dd, yyyy");
  return formattedDate;
};

export function timeAgo(datestr: string) {
  const date = new Date(datestr);
  const seconds: number = Math.floor(
    (new Date().getTime() - date.getTime()) / 1000,
  );

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }
  return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
}
