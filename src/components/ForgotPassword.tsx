import axios from "axios";
import { useEffect, useState } from "react";
import { API_RESET_PASSWORD_URL } from "../constants";
import ErrorAlert from "./ErrorAlert";
import DotLoader from "./DotLoader";
import Flag from "../assets/images/india.png";
import SuccessAlert from "./SuccessAlert";

function ForgotPassword() {
  const [phoneNumber, setphoneNumber] = useState({
    phone_number: "",
  });
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(undefined);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [error]);

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setphoneNumber(value);
  };

  const handlePasswordReset = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_RESET_PASSWORD_URL, {
        phone_number: phoneNumber,
      });

      if (response.status === 200) {
        setSuccess(response.data.message);
        setError(undefined);
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError(error.response.data.phone_number.phone_number);
          console.log(error.response.data.phone_number.phone_number);
        } else if (status === 401) {
          setError("Unauthorized - Check your credentials");
        } else if (status === 500) {
          setError("Internal Server Error - Something went wrong");
        } else {
          setError(`An unexpected error occurred with status: ${status}`);
        }
      } else if (error.request) {
        setError("No response received from the server");
      } else {
        console.error("Error during login:", error.message);
        setError("Login failed - Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <ErrorAlert error={error} />}
      {success && <SuccessAlert msg={success} />}
      <div className="rounded-t-lg pt-12">
        <div>
          <div className="flex items-center justify-center space-x-4 mt-3"></div>
        </div>
      </div>
      <div className="bg-gray-200 rounded-b-lg py-12 px-4 lg:px-24 shadow-md hover:shadow-lg">
        <h1 className="text-center text-2xl text-black font-light">
          <b>Reset Password Link</b>
        </h1>
        {loading && <DotLoader />}
        <form className="mt-6" onSubmit={handlePasswordReset}>
          <div className="relative m-8">
            <input
              className={`appearance-none border pl-12 ${
                error ? "border-red-500" : "border-gray-500"
              } shadow-sm focus:shadow-md placeholder-gray-600  transition  rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline`}
              name="phone_number"
              type="tel"
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <div className="absolute left-0 inset-y-0 flex items-center">
              <img style={{ width: "60%" }} className="p-2" src={Flag} alt="" />
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              type="submit"
              className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              send link
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
