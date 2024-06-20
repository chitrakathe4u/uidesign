import axios from "axios";
import { useState } from "react";
import { API_RESET_CONFIRM_PASSWORD_URL } from "../constants";
import ErrorAlert from "./ErrorAlert";
import DotLoader from "./DotLoader";
import SuccessAlert from "./SuccessAlert";
import { Link, useParams } from "react-router-dom";
import SuccessPNG from "../assets/images/success.png";

function PasswordResetConfirm() {
  const { uidb, token } = useParams();
  const [passwords, setPasswords] = useState({
    password: "",
    re_password: "",
  });
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsError, setFieldsError] = useState({
    password: "",
    re_password: "",
    error: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handlePasswordReset = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_RESET_CONFIRM_PASSWORD_URL}${uidb}/${token}/`,
        { ...passwords }
      );

      if (response.status === 200) {
        setSuccess(response.data.message);
        setError(undefined);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          console.log(error.response);
          setFieldsError({
            password: error.response.data.password || "",
            error: error.response.data.error || "",
            re_password: error.response.data.re_password || "",
          });
          // Display the specific server-side error, if available
          if (error.response.data.password) {
            setError(error.response.data.password);
          } else if (error.response.data.error) {
            setError(error.response.data.error);
          } else if (error.response.data.re_password) {
            setError(error.response.data.re_password);
          }
        } else if (error.response.status === 401) {
          setError("Unauthorized - Check your credentials");
        } else if (error.response.status === 500) {
          setError("Internal Server Error - Something went wrong");
        } else {
          setError(
            `An unexpected error occurred with status: ${error.response.status}`
          );
        }
      } else if (error.request) {
        setError("No response received from the server");
      } else {
        console.error("Error during password reset:", error.message);
        setError("Password reset failed - Something went wrong");
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
      {!success && (
        <div className="bg-gray-200 rounded-b-lg py-12 px-4 lg:px-24 shadow-md hover:shadow-lg">
          <h1 className="text-center text-2xl text-black font-light">
            <b>Reset Password Link</b>
          </h1>
          {loading && <DotLoader />}

          <form className="mt-6" onSubmit={handlePasswordReset}>
            <div className="relative mt-3">
              <input
                className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                name="password"
                type="password"
                placeholder="Enter Password"
                onChange={handleInputChange}
              />
              <div className="absolute left-0 inset-y-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 ml-3 text-gray-900 p-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
              </div>
              {fieldsError["password"] && (
                <span className="text-red-500">{fieldsError["password"]}</span>
              )}
            </div>
            <div className="relative mt-3">
              <input
                className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                name="re_password"
                type="password"
                placeholder="Confirm Password"
                onChange={handleInputChange}
              />
              <div className="absolute left-0 inset-y-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 ml-3 text-gray-900 p-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
              </div>
              {fieldsError["re_password"] && (
                <span className="text-red-500">
                  {fieldsError["re_password"]}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center mt-8">
              <button
                onClick={handlePasswordReset}
                className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      )}
      {success && (
        <div className="flex flex-col items-center bg-gray-200 rounded-b-lg py-12 px-4 lg:px-24 shadow-md hover:shadow-lg">
          <h1 className="text-center text-2xl sm:text-3xl text-success font-400">
            <b>Password Reset Successful!!</b>
          </h1>
          <div className="center">
            <img
              style={{ width: "100px", marginTop: "6%" }}
              src={SuccessPNG}
              alt=""
            />
          </div>
          <h2 className="text-center text-xl text-black font-light">
            <b>use your new password while login</b>
          </h2>
          <button
            type="button"
            className="mt-5 p-3 text-white bg-blue-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <Link to="/login">Click here to Login</Link>
          </button>
        </div>
      )}
    </>
  );
}

export default PasswordResetConfirm;
