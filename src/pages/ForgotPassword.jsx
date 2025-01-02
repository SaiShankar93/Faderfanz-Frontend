import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [password1Hidden, setPassword1Hidden] = useState(true);
  const [password2Hidden, setPassword2Hidden] = useState(true);
  const [otpHidden, setOtpHidden] = useState(true);
  const [isOtpVerified, setOtpVerified] = useState(false);
  //   const { handleError, handleSuccess } = useContext(dataContext);
  const [inputValue, setInputValue] = React.useState({
    email: "",
    password: "",
    rePassword: "",
  });
  const [otp, setOtp] = useState("");

  const { email, password, rePassword } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const ChangePassword = async (e) => {
    e.preventDefault();
    if (otpHidden) {
      sendOtp();
      return;
    }
    if (!otpHidden && !isOtpVerified) {
      verifyOtp();
    }
    // alert("Service Not Available");
  };

  const sendOtp = async (e) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/forgot`, {
        email,
      });
      toast.success("OTP sent successfully to your email");
      setOtpHidden(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async (e) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      toast.success("OTP verified successfully");
      setOtpVerified(true);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/reset`, {
        email,
        password,
      });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <>
      <div className=" w-full flex items-center justify-center py-7 md:py-14 bg-gray-200 dark:bg-black mb-5 ">
        <div className=" w-[400px] h-fit py-7 px-10 flex flex-col items-center rounded-md">
          <form
            onSubmit={ChangePassword}
            className=" flex flex-col  gap-2 w-[90%] "
          >
            <p className=" text-black dark:text-gray-400 font-bold plus-jakarta text-[22px] sm:text-[24px] mb-3 ">
              Forgot Password ?
            </p>
            {!isOtpVerified ? (
              <>
                <div className=" flex flex-col">
                  <label
                    htmlFor="email"
                    className="  font-semibold text-[13px] sm:text-[14px] mb-1"
                  >
                    Enter Email To Receive OTP
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email To Receive OTP"
                    name="email"
                    id="email"
                    autoComplete="off"
                    value={email}
                    onChange={handleOnChange}
                    className=" border border-black dark:bg-white/20 text-black dark:text-white  font-medium outline-none py-2 px-3 rounded-md"
                  />
                </div>
                {!otpHidden && (
                  <>
                    <p className="  text-[13px] mt-2 sm:text-[14.9px] mb-1">
                      Enter OTP
                    </p>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      containerStyle={{
                        color: "black",
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                      inputStyle={{
                        width: "45px",
                        height: "45px",
                        border: "1px solid #000",
                      }}
                      shouldAutoFocus={true}
                      renderSeparator={<span className="  "> </span>}
                      renderInput={(props) => <input {...props} />}
                    />
                  </>
                )}
                <button
                  disabled={!email}
                  type="submit"
                  className=" border-none  disabled:bg-black/50 disabled:text-gray-900 dark:disabled:bg-gray-700 outline-none bg-black dark:bg-white dark:text-black text-white font-semibold mt-3 py-3 px-3 rounded-md"
                >
                  {otpHidden ? "Send OTP" : "Verify OTP"}
                </button>
              </>
            ) : (
              <>
                <div className=" flex flex-col">
                  <label
                    htmlFor="password"
                    className="  font-semibold text-[13px] sm:text-[14px] mb-1"
                  >
                    Enter New Passowrd
                  </label>
                  <div className=" flex items-center relative">
                    <input
                      type={password1Hidden ? "password" : "text"}
                      placeholder="New Password"
                      name="password"
                      id="password"
                      autoComplete="off"
                      value={password}
                      onChange={handleOnChange}
                      className=" w-full border border-black dark:bg-white/20 text-black dark:text-white  font-medium outline-none py-2 px-3 rounded-md"
                    />
                    {password1Hidden ? (
                      <FaEye
                        onClick={() => {
                          setPassword1Hidden(false);
                        }}
                        className=" text-[20px] absolute  right-3 cursor-pointer"
                      />
                    ) : (
                      <FaEyeSlash
                        onClick={() => {
                          setPassword1Hidden(true);
                        }}
                        className=" text-[20px] absolute  right-3 cursor-pointer"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="rePassword"
                    className=" mt-2  font-semibold text-[13px] sm:text-[14px] mb-1"
                  >
                    Confirm New Passowrd
                  </label>
                  <div className=" flex items-center relative">
                    <input
                      type={password2Hidden ? "password" : "text"}
                      placeholder="Confirm Password"
                      name="rePassword"
                      id="rePassword"
                      autoComplete="off"
                      value={rePassword}
                      onChange={handleOnChange}
                      className=" w-full border border-black dark:bg-white/20 text-black dark:text-white  font-medium outline-none py-2 px-3 rounded-md"
                    />
                    {password2Hidden ? (
                      <FaEye
                        onClick={() => {
                          setPassword2Hidden(false);
                        }}
                        className=" text-[20px] absolute  right-3 cursor-pointer"
                      />
                    ) : (
                      <FaEyeSlash
                        onClick={() => {
                          setPassword2Hidden(true);
                        }}
                        className=" text-[20px] absolute  right-3 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <button
                  disabled={
                    password === "" ||
                    rePassword === "" ||
                    password !== rePassword
                  }
                  onClick={resetPassword}
                  className=" border-none  disabled:bg-black/50 disabled:text-gray-900 dark:disabled:bg-gray-700 outline-none bg-black dark:bg-white dark:text-black text-white font-semibold mt-3 py-3 px-3 rounded-md"
                >
                  Submit
                </button>
              </>
            )}
          </form>

          <Link className="  text-sm font-medium mt-5 underline" to="/login">
            Return to Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
