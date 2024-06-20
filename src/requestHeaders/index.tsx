import { useEffect } from "react";
import { checkTokenExpiration } from "../auth";
import { useNavigate } from "react-router-dom";

const RequestHeaders = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Use an asynchronous function to properly handle the promise returned by checkTokenExpiration
    const fetchToken = async () => {
      await checkTokenExpiration(navigate);
    };

    fetchToken();
  }, []);

  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    };
  } else {
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

export default RequestHeaders;
