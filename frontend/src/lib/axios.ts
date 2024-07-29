import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 && data.error.trim() === "token missing or invalid") {
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
