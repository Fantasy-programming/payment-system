import axios, { AxiosInstance } from "axios";
import { isTokenExpired } from "@/lib/utils";
import { AuthResponse } from "@/services/auth.types";

let refreshTokenPromise: Promise<string> | null = null;

const createAPI = (
  refreshTokenFn: () => Promise<string>,
  logoutFn: () => void,
): AxiosInstance => {
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
          const newToken = await refreshTokenFn();
          config.headers["Authorization"] = `Bearer ${newToken}`;
        } else {
          config.headers["Authorization"] = `Bearer ${parsedUser.token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response) {
        const { status, data } = error.response;

        if (
          status === 401 &&
          data.error.trim() === "token missing or invalid" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            if (!refreshTokenPromise) {
              refreshTokenPromise = refreshTokenFn();
            }
            const newToken = await refreshTokenPromise;
            refreshTokenPromise = null;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            logoutFn();
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    },
  );

  return api;
};

export let api: AxiosInstance;

export const initAPI = (
  refreshTokenFn: () => Promise<string>,
  logoutFn: () => void,
) => {
  api = createAPI(refreshTokenFn, logoutFn);
};
