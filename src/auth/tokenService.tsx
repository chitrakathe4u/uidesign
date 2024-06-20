// tokenService.ts

import axios from "axios";
import { API_REFRESH_TOKEN_URL } from "../constants";
// import { useNavigate } from "react-router-dom";

interface RefreshTokensResponse {
  access: string;
}

export async function refreshTokens() {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const response = await axios.post<RefreshTokensResponse>(
      API_REFRESH_TOKEN_URL,
      {
        refresh: refreshToken,
      }
    );
    const newAccessToken = response.data.access;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (refreshError) {
    if (
      (refreshError as any)?.response?.status === 401 ||
      (refreshError as any)?.response?.status === 400
    ) {
      // Redirect to login page
      console.error("Refresh token is invalid or expired.");
      // Use the correct path for your login page
      window.location.href = "/login";
    }

    throw refreshError;
  }
}
