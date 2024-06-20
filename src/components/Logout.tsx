// Logout.js
import { API_LOGOUT_URL } from "../constants";
import authenticatedAxios from "../auth/axiosInterceptors";

const Logout = async () => {
  try {
    console.log(
      "Before refreshing token:",
      localStorage.getItem("refreshToken")
    );
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("refreshToken", refreshToken);
    localStorage.clear();
    const response = await authenticatedAxios.post(API_LOGOUT_URL, {
      refresh_token: refreshToken,
    });
    if (response.data.status === "success") {
      console.log(response.data);
      window.location.href = "/";
    }
  } catch (error) {
    console.log("logout failed", error);
  }
};

export default Logout;
