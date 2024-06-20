import axios from "axios";
import { refreshTokens } from "./tokenService";
// import { useNavigate } from "react-router-dom";

const authenticatedAxios = axios.create();

authenticatedAxios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // Check if the access token is expired or not available
    if (!accessToken) {
      const newAccessToken = await refreshTokens();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return config;
    }

    // Set the Authorization header with the access token
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authenticatedAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshTokens();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh error
        console.error("Refresh token failed:", refreshError);

        // Check if the refresh token itself is invalid or expired
        if ((refreshError as any)?.response?.status === 401) {
          // Redirect to login page
          console.error("Refresh token is invalid or expired.");
          window.location.href = "/login";
        }

        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export default authenticatedAxios;
