import { useState, useEffect } from "react";
import {
  API_REGISTER_URL,
  API_REGISTER_USER_ADDRESS_URL,
  API_REGISTER_USER_URL,
  API_SEND_OTP_URL,
  API_VERIFY_OTP_URL,
} from "../constants";
import axios from "axios";
import Flag from "../assets/images/india.png";
import Spinner from "./Spinner";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import SuccessPNG from "../assets/images/success.png";
import { Link } from "react-router-dom";
import DotLoader from "./DotLoader";
import stepSuccess from "../assets/images/success.png";

function Registration() {
  const [registrationData, setRegistrationData] = useState({
    phone_number: "",
    otp: "",
    email: "",
    password: "",
    re_password: "",
    profile_picture: null as File | null,
    first_name: "",
    last_name: "",
    date_of_birth: "",
    landmark: "",
    city: "",
    state: "",
    apartment_number: "",
    street_address: "",
    pin_code: "",
  });

  const states = ["Karnataka", "Andra Pradesh"];
  const [showOtpField, setShowOtpField] = useState(false);
  const [showDataField, setShowDataField] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [profile, setProfile] = useState<boolean>(false);
  const [address, setAddress] = useState<boolean>(false);
  const [registered, setRegistered] = useState<boolean>(false);
  const [step, setStep] = useState({
    count: 1,
    title: "Validate Your Identity",
  });
  const [userModelId, setuserModelId] = useState("");
  const [fieldsError, setFieldsError] = useState({
    phone_number: "",
    otp: "",
    email: "",
    password: "",
    re_password: "",
    profile_picture: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    landmark: "",
    city: "",
    state: "",
    apartment_number: "",
    street_address: "",
    user: "",
    pin_code: "",
  });

  useEffect(() => {
    // Clear success and error messages after 5 seconds
    const timeout = setTimeout(() => {
      setSuccess(undefined);
      setError(undefined);
    }, 8000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [success, error]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleSendOtp = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payloadSend = { phone_number: registrationData["phone_number"] };
      const response = await axios.post(API_SEND_OTP_URL, payloadSend);

      if (response.status === 200) {
        if (response.data.status === "success") {
          setShowOtpField(true);
          setSuccess(response.data.message);
        }
      } else {
        console.error("Sending OTP failed:", response.data);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error during OTP send:", error);
      setError("Error during OTP send");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payloadVerify = {
        phone_number: registrationData["phone_number"],
        otp: registrationData["otp"],
      };
      const response = await axios.post(API_VERIFY_OTP_URL, payloadVerify);

      if (response.status === 200) {
        if (response.data.status === "success") {
          setSuccess(response.data.message);
          setShowOtpField(false);
          setShowDataField(true);
          setVerified(true);
          setStep({
            count: 2,
            title: "Set Up Your Account",
          });
          console.log("OTP Verification Success");
        } else {
          console.error("OTP verification failed:", response.data);
          setError(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("Error during OTP verification");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payloadRegister = {
        phone_number: registrationData["phone_number"],
        email: registrationData["email"],
        password: registrationData["password"],
        re_password: registrationData["re_password"],
      };
      const response = await axios.post(API_REGISTER_URL, payloadRegister);

      if (response.status === 201) {
        setShowDataField(false);
        setSuccess("Details saved successfully");
        setProfile(true);
        setuserModelId(response.data.id);
        setStep({
          count: 3,
          title: "Personalize Your Profile",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setFieldsError({
            ...fieldsError,
            email: error.response.data.email || "",
            password: error.response.data.password || "",
            re_password: error.response.data.re_password || "",
            profile_picture: error.response.data.profile_picture || "",
          });
          setError(error.response.data.phone_number || "");
        } else {
          // Handle other types of errors (e.g., network errors)
          console.error("An error occurred:", error.message);
          setError("An error occurred check your connection");
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleRegisterProfile = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payloadRegisterProfile = new FormData();
      payloadRegisterProfile.append("user", userModelId);
      payloadRegisterProfile.append(
        "first_name",
        registrationData["first_name"]
      );
      payloadRegisterProfile.append("last_name", registrationData["last_name"]);
      payloadRegisterProfile.append(
        "date_of_birth",
        registrationData["date_of_birth"]
      );
      if (registrationData.profile_picture) {
        payloadRegisterProfile.append(
          "profile_picture",
          registrationData.profile_picture
        );
      } else {
        payloadRegisterProfile.append("profile_picture", "");
      }

      const response = await axios.post(
        API_REGISTER_USER_URL,
        payloadRegisterProfile
      );

      if (response.status === 201) {
        setSuccess("Details saved successfully");
        setAddress(true);
        setProfile(false);
        setStep({
          count: 4,
          title: "Provide Location Indivation",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setFieldsError({
            ...fieldsError,
            date_of_birth: error.response.data.date_of_birth || "",
            first_name: error.response.data.first_name || "",
            last_name: error.response.data.last_name || "",
            profile_picture: error.response.data.profile_picture || "",
          });
          setError(error.response.data.phone_number || "");
        } else {
          // Handle other types of errors (e.g., network errors)
          console.error("An error occurred:", error.message);
          setError("An error occurred check your connection");
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleRegisterAddress = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payloadRegisterProfile = new FormData();
      payloadRegisterProfile.append("user", userModelId);
      payloadRegisterProfile.append(
        "apartment_number",
        registrationData["apartment_number"]
      );
      payloadRegisterProfile.append("city", registrationData["city"]);
      payloadRegisterProfile.append("state", registrationData["state"]);
      payloadRegisterProfile.append("pin_code", registrationData["pin_code"]);
      payloadRegisterProfile.append("landmark", registrationData["landmark"]);
      payloadRegisterProfile.append(
        "street_address",
        registrationData["street_address"]
      );

      const response = await axios.post(
        API_REGISTER_USER_ADDRESS_URL,
        payloadRegisterProfile
      );

      if (response.status === 201) {
        setProfile(false);
        setFieldsError({
          ...fieldsError,
          apartment_number: "",
          street_address: "",
          landmark: "",
          state: "",
          city: "",
          pin_code: "",
        });
        setAddress(false);
        setSuccess("Registration Completed Successfully!!");
        setRegistered(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setFieldsError({
            ...fieldsError,
            apartment_number: error.response.data.apartment_number || "",
            street_address: error.response.data.street_address || "",
            landmark: error.response.data.landmark || "",
            state: error.response.data.state || "",
            city: error.response.data.city || "",
            pin_code: error.response.data.pin_code || "",
          });
          setError(error.response.data.phone_number || "");
        } else {
          // Handle other types of errors (e.g., network errors)
          console.error("An error occurred:", error.message);
          setError("An error occurred check your connection");
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && <SuccessAlert msg={success} />}
      {error && <ErrorAlert error={error} />}
      <div className="rounded-t-lg pt-12">
        <div>
          <div className="flex items-center justify-center space-x-4 mt-3"></div>
        </div>
      </div>

      {!registered && (
        <div className="bg-gray-200 rounded-b-lg py-12 px-4 lg:m-36 lg:mt-1 sm:m-4 xs:m-4 lg:px-24 xl:px-32 shadow-md hover:shadow-lg relative">
          {" "}
          <h1 className="text-center text-2xl text-black font-light">
            <b>Register to Manma Leathers</b>
          </h1>
          {loading && <DotLoader />}
          <div className="p-4 space-y-2">
            <h3 className="text-base font-semibold">
              Step {step.count}of 4: {step.title}
            </h3>
            <div className="flex max-w-xs  mt-4">
              {Array.from({ length: 4 }, (_, index) => (
                <>
                  <span
                    className={`text-black ${index == 0 ? " hidden " : ""}`}
                  >
                    &mdash;&mdash;
                  </span>
                  <span
                    key={index}
                    className={`w-8 h-8 text-white text-center rounded-full border ${
                      index + 1 <= step.count
                        ? "border-blue-500 bg-blue-500"
                        : "border-blue-500 bg-white"
                    }`}
                  >
                    {index + 1 < step.count && (
                      <img
                        className="object-fit"
                        src={stepSuccess}
                        alt={`${index + 1}`}
                      />
                    )}
                  </span>
                </>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="relative mt-3">
              <input
                className="appearance-none border pl-12 border-gray-500 placeholder-gray-700 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                name="phone_number"
                type="tel"
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
              <div className="absolute left-0 inset-y-0 flex items-center">
                <img
                  style={{ width: "60%" }}
                  className="p-2"
                  src={Flag}
                  alt=""
                />
              </div>
            </div>
            {!showOtpField && !verified && (
              <div className="flex items-center justify-center mt-8">
                <button
                  onClick={handleSendOtp}
                  type="submit"
                  className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transdiv hover:-translate-y-0.5"
                >
                  Get OTP
                </button>
              </div>
            )}

            {showOtpField && (
              <div className="relative mt-3">
                <div className="absolute left-0 inset-y-0 flex items-center">
                  <p className="p-2 text-black">OTP</p>
                </div>
                <input
                  className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  onChange={handleInputChange}
                />
              </div>
            )}

            {showOtpField && (
              <div className="mt-4 flex items-center">
                <button
                  onClick={handleSendOtp}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Resend OTP
                </button>
              </div>
            )}
            {loading && <Spinner />}
            {/* ... (other fields and buttons) */}
            {showOtpField && !verified && (
              <div className="flex items-center justify-center mt-8">
                <button
                  onClick={handleVerifyOtp}
                  className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transdiv hover:-translate-y-0.5"
                >
                  Verify
                </button>
              </div>
            )}
            {showDataField && (
              <>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="email"
                    type="email"
                    placeholder="Enter email address (optional)"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-900 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  {fieldsError["email"] && (
                    <span className="text-red-500">{fieldsError["email"]}</span>
                  )}
                </div>
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
                    <span className="text-red-500">
                      {fieldsError["password"]}
                    </span>
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
                    onClick={handleRegister}
                    className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transdiv hover:-translate-y-0.5"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {profile && (
              <>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="first_name"
                    type="text"
                    placeholder="Enter First Name"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-900 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  {fieldsError["first_name"] && (
                    <span className="text-red-500">
                      {fieldsError["first_name"]}
                    </span>
                  )}
                </div>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="last_name"
                    type="text"
                    placeholder="Enter Last Name"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-900 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  {fieldsError["last_name"] && (
                    <span className="text-red-500">
                      {fieldsError["last_name"]}
                    </span>
                  )}
                </div>
                <div className="relative mt-3">
                  <p className="text-black font-bold">Birthday (optional)</p>
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="date_of_birth"
                    type="date"
                    placeholder="Date of Birth"
                    onChange={handleInputChange}
                  />

                  {fieldsError["date_of_birth"] && (
                    <span className="text-red-500">
                      {fieldsError["date_of_birth"]}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center mt-8">
                  <button
                    onClick={handleRegisterProfile}
                    className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transdiv hover:-translate-y-0.5"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {address && (
              <>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="apartment_number"
                    type="text"
                    placeholder="Enter Building Name / NO"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-900 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  {fieldsError["apartment_number"] && (
                    <span className="text-red-500">
                      {fieldsError["apartment_number"]}
                    </span>
                  )}
                </div>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="street_address"
                    type="text"
                    placeholder="Enter Street Address"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-900 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  {fieldsError["street_address"] && (
                    <span className="text-red-500">
                      {fieldsError["street_address"]}
                    </span>
                  )}
                </div>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="landmark"
                    type="text"
                    placeholder="Enter Lankmark Address (optional)"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-900 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  {fieldsError["landmark"] && (
                    <span className="text-red-500">
                      {fieldsError["landmark"]}
                    </span>
                  )}
                </div>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="city"
                    type="text"
                    placeholder="Enter City Name"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-900 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  {fieldsError["city"] && (
                    <span className="text-red-500">{fieldsError["city"]}</span>
                  )}
                </div>
                <div className="relative mt-3">
                  <select
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="state"
                    value={registrationData.state}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected>
                      Select your state
                    </option>
                    {states.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <p className="text-black font-bold p-3"></p>
                  </div>
                  {fieldsError["state"] && (
                    <span className="text-red-500">{fieldsError["state"]}</span>
                  )}
                </div>
                <div className="relative mt-3">
                  <input
                    className="appearance-none border pl-12 placeholder-gray-700 border-gray-500 shadow-sm focus:shadow-md focus:placeholder-gray-600 transition rounded-md w-full py-3 text-black leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                    name="pin_code"
                    type="text"
                    placeholder="Enter Pincode"
                    onChange={handleInputChange}
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    <p className="text-black font-bold p-3"></p>
                  </div>
                  {fieldsError["pin_code"] && (
                    <span className="text-red-500">
                      {fieldsError["pin_code"]}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center mt-8">
                  <button
                    onClick={handleRegisterAddress}
                    className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transdiv hover:-translate-y-0.5"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {registered && (
        <div className="flex flex-col items-center bg-gray-200 rounded-b-lg py-12 px-4 lg:px-24 shadow-md hover:shadow-lg">
          <h1 className="text-center text-2xl sm:text-3xl text-success font-400">
            <b>Registeration Completed!!</b>
          </h1>
          <div className="center">
            <img
              style={{ width: "100px", marginTop: "6%" }}
              src={SuccessPNG}
              alt=""
            />
          </div>
          <h2 className="text-center text-xl text-black font-light">
            <b>Thank you for registering ManmaLethers</b>
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

export default Registration;
