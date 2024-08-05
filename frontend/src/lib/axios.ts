import axios from "axios";
import { isTokenExpired } from "@/lib/utils";
import { AuthResponse } from "@/services/auth.types";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.defaults.headers.common["Content-Type"] = "application/json";

api.interceptors.request.use(
  async (config) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: AuthResponse = JSON.parse(storedUser);

      if (isTokenExpired(parsedUser.token)) {
        const { data } = await api.post<AuthResponse>("/auth/refresh");
        const store = JSON.stringify(data);
        localStorage.setItem("user", store);

        config.headers["Authorization"] = `Bearer ${data?.token}`;

        return config;
      }

      config.headers["Authorization"] = `Bearer ${parsedUser?.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

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
