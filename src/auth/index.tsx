import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";
import { API_REFRESH_TOKEN_URL } from "../constants";
import { NavigateFunction } from "react-router-dom";

// Define the AuthContext
export const isAccessTokenExpired = (accessToken: string | null): boolean => {
  if (!accessToken) {
    // If there is no access token, consider it expired
    return true;
  }

  try {
    const decodedToken = jwt.decode(accessToken) as JwtPayload;

    // Check if the decoded token exists and has an expiration time
    if (decodedToken && decodedToken.exp) {
      // Get the current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if the expiration time has passed
      return decodedToken.exp < currentTime;
    } else {
      // If the token is malformed or missing expiration, consider it expired
      return true;
    }
  } catch (error) {
    // If there is an error decoding the token, consider it expired
    console.error("Error decoding access token:", error);
    return true;
  }
};

export const handleTokenRefresh = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await axios.post(API_REFRESH_TOKEN_URL, {
      refresh: refreshToken,
    });

    if (response.status === 200) {
      const newAccessToken = response.data.access;
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const checkTokenExpiration = async (navigate: NavigateFunction) => {
  const accessToken = localStorage.getItem("accessToken");
  if (isAccessTokenExpired(accessToken)) {
    // If expired, attempt to refresh the token
    const newAccessToken = await handleTokenRefresh();
    if (!newAccessToken) {
      // If token refresh fails, redirect to login or handle as needed
      navigate("/login");
    }
  }
};
