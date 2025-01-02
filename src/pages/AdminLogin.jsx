import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  RiAppleFill,
  RiFacebookBoxFill,
  RiFacebookCircleFill,
  RiGoogleFill,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isPswdVisible, setIsPswdVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/local/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(res.data);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUserLoggedIn(true);
        toast.success("Admin Login Successful");
        navigate("/admindashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.response.data);
      toast.error("Error Logging in");
    }
  };

  const loginWithGoogle = () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/auth/google/callback`,
      "_self"
    );
  };

  const loginWithFacebook = () => {
    window.open(`${import.meta.env.VITE_SERVER_URL}/auth/facebook`, "_self");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className=" w-full h-full flex items-center justify-center ">
      <div>
        <div className=" flex flex-col ">
          <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mt-5 ">
            Admin Login
          </h4>
          <div className="  md:mt-2 ">
            <div className=" w-full col-span-2">
              <label
                className=" text-[#7A7A7A] dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="email"
              >
                Email Address*
              </label>
              <input
                autoComplete="off"
                name="email"
                id="email"
                type="email"
                value={email}
                required
                className=" w-[100%] 2xl:w-[100%] border-[1.4px] border-[#999999] p-2 bg-transparent text-[#7A7A7A] dark:text-gray-400 text-[14.4px]"
                placeholder="Company Name"
                onChange={onChange}
              />
            </div>
          </div>
          <div className=" md:mt-2 ">
            <div className=" w-full col-span-2 flex flex-col">
              <label
                className=" text-[#7A7A7A] dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="password"
              >
                Password*
              </label>
              <div className=" relative flex items-center justify-center">
                <input
                  autoComplete="off"
                  name="password"
                  id="password"
                  required
                  type={isPswdVisible ? "text" : "password"}
                  value={password}
                  className=" w-[100%] 2xl:w-[100%] border-[1.4px] border-[#999999] p-2 bg-transparent text-[#7A7A7A] dark:text-gray-400 text-[14.4px]"
                  placeholder="Password"
                  onChange={onChange}
                />
                {!isPswdVisible ? (
                  <FaEye
                    onClick={() => {
                      setIsPswdVisible(true);
                    }}
                    className=" absolute text-[#999999] right-2 text-[21px] cursor-pointer"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => {
                      setIsPswdVisible(false);
                    }}
                    className=" absolute text-[#999999]  right-2 text-[21px] cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div className=" flex items-center justify-between">
            <div className=" flex items-center gap-2 ">
              <input
                autoComplete="off"
                name="State*"
                id="State*"
                type="checkbox"
                className=" border-[1.4px] border-[#999999] p-2 bg-transparent text-[#7A7A7A] dark:text-gray-400 text-[14.4px]"
                placeholder="State*"
              />
              <label
                className=" text-[#7A7A7A] dark:text-gray-400 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                htmlFor="State*"
              >
                Remember me
              </label>
            </div>
            <Link to="/forgot-password">
              <p className=" text-[12px] md:text-[13px] 2xl:text-[14.4px] text-[#7A7A7A] dark:text-gray-400">
                Forgot pasword?
              </p>
            </Link>
          </div>
          <button
            disabled={email === "" || password === ""}
            className=" bg-[#363F4D] disabled:bg-gray-400 disabled:text-gray-600 px-4 py-2.5 font-medium uppercase text-[11.2px] md:text-[13px] text-white mt-5 "
            type="submit"
            onClick={onSubmit}
          >
            Login
          </button>
          <p className="font-[400] mt-1.5 mb-3 text-right w-full text-[12px] md:text-[14px]">
            Don't have an account ?
            <Link to="/admin-register" className=" font-semibold underline">
              Register
            </Link>
          </p>
          <div className=" flex items-center gap-1 my-3">
            <span className=" h-[1px] flex-grow bg-black"></span>
            <span className=" font-[600] plus-jakarta w-max text-[12px] md:text-[14px] ">
              or use one of these options
            </span>
            <span className=" h-[1px] flex-grow bg-black"></span>
          </div>
          <div className=" flex items-center justify-center gap-5 mb-5 ">
            <RiFacebookCircleFill
              className="text-[#363F4D] text-[36px] md:text-[45px] py-2 cursor-pointer border border-black dark:text-gray-500"
              onClick={loginWithFacebook}
            />

            <RiGoogleFill
              className="text-[#363F4D] text-[36px] md:text-[45px] py-2 cursor-pointer border border-black dark:text-gray-500"
              onClick={loginWithGoogle}
            />
            <RiAppleFill className="text-[#363F4D] text-[36px] md:text-[45px] py-2 cursor-pointer border border-black dark:text-gray-500 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
