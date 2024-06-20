import { Link, useNavigate } from "react-router-dom";
import Flag from "../assets/images/india.png";
import { useState } from "react";
import { API_LOGIN_URL } from "../constants";
import axios from "axios";
import DotLoader from "./DotLoader";
import ErrorAlert from "./ErrorAlert";

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsError, setFieldsError] = useState({
    phone_number: "",
    password: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setFieldsError({ password: "", phone_number: "" });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_LOGIN_URL, loginData);

      if (response.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem("isLoggedIn", `${true}`);
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setError(undefined);
        navigate("/");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setFieldsError({
            phone_number: error.response.data.phone_number || "",
            password: error.response.data.password || "",
          });
          if (error.response.data.detail) {
            setError(error.response.data.detail);
          } else {
            setError("");
          }
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
      <div className="rounded-t-lg pt-12">
        <div>
          <div className="flex items-center justify-center space-x-4 mt-3"></div>
        </div>
      </div>
      <div className="bg-gray-200 rounded-b-lg py-12 px-4 lg:px-24 shadow-md hover:shadow-lg">
        <h1 className="text-center text-2xl text-black font-light">
          <b>Login to Manma Leathers</b>
        </h1>
        {loading && <DotLoader />}
        <form className="mt-6" onSubmit={handleLogin}>
          <div className="relative mt-3">
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
            {fieldsError["phone_number"] && (
              <span className="text-red-500">
                {fieldsError["phone_number"]}
              </span>
            )}
          </div>
          <div className="relative mt-3">
            <input
              className={`appearance-none border pl-12 ${
                error ? "border-red-500" : "border-gray-500"
              }  shadow-sm focus:shadow-md placeholder-gray-600  transition  rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline`}
              name="password"
              type="password"
              onChange={handleInputChange}
              placeholder="Password"
            />
            <div className="absolute left-0 inset-y-0 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 ml-3 text-gray-800 p-1"
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
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="mt-4 flex items-center text-black">
              <button className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800 whitespace-nowrap"
                >
                  Don't have an account?
                </Link>
              </button>
            </div>
            <div className="mt-4 text-black">
              <button className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 whitespace-nowrap"
                >
                  forgot password?
                </Link>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              type="submit"
              className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default Login;
