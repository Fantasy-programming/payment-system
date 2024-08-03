import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (
        status === 401 &&
        (data.error.trim() === "token missing or invalid" ||
          data.error.trim() === "token expired")
      ) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page
      } else {
        console.error("API error:", data.error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
