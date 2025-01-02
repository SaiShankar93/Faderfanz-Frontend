import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { currency } = useContext(AppContext);
  const [confirmPswd, setConfirmPswd] = useState("");
  const [isPswd1Visible, setIsPswd1Visible] = useState(false);
  const [isPswd2Visible, setIsPswd2Visible] = useState(false);
  const [isChecked, setIsChecked] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    category: "",
    role: "admin",
  });

  const { name, email, phone, password, category, role } = formData;

  const onChange = (e) => {
    if (e.target.name === "category") {
      // If the changed input is the category select element
      setFormData({ ...formData, category: e.target.value });
    } else {
      // For other input fields, update formData as usual
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/local/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(res.data);
      if (res.data.user) {
        toast.success(res.data.message);
        navigate("/admin-login");
      }
    } catch (err) {
      console.error("Registration Error:", err.response.data);
      toast.error("Registration Error");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" w-full">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]    dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
          Admin Register
        </h2>
        <div className=" flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">Admin Register</span>
        </div>
      </div>

      <div className=" md:px-[2%] xl:px-[8%] flex flex-col md:m-8 mb-14 ">
        <div className=" m-8 md:m-0 ">
          <div className=" flex flex-col ">
            <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mb-1.5 ">
              Admin Registration Form
            </h4>

            <div className=" grid grid-cols-2 md:mt-2 ">
              <div className=" w-full flex flex-col col-span-2">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mt-2 mb-1 "
                  htmlFor="username"
                >
                  User Name*
                </label>
                <input
                  autoComplete="off"
                  required
                  name="name"
                  id="username"
                  type="text"
                  className=" sm:w-[90%] 2xl:w-[93%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="User Name"
                  value={name}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2 sm:w-[90%] 2xl:w-[93%] gap-10 xl:gap-[13%] md:mt-2 ">
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mt-2 mb-1 "
                  htmlFor="email"
                >
                  Email Address*
                </label>
                <input
                  autoComplete="off"
                  required
                  name="email"
                  id="email"
                  type="email"
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Email"
                  value={email}
                  onChange={onChange}
                />
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mt-2 mb-1 "
                  htmlFor="phone"
                >
                  Phone no*
                </label>
                <input
                  autoComplete="off"
                  required
                  name="phone"
                  id="phone"
                  type="number"
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Phone No."
                  value={phone}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className=" flex flex-col sm:grid grid-cols-2 sm:w-[90%] 2xl:w-[93%] sm:gap-10 xl:gap-[13%] md:mt-2 ">
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mt-2 mb-1 "
                  htmlFor="password"
                >
                  Password*
                </label>
                <div className=" relative flex items-center justify-center">
                  <input
                    autoComplete="off"
                    required
                    name="password"
                    id="password"
                    type={isPswd1Visible ? "text" : "password"}
                    className=" border-[1.4px] w-full border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                  />
                  {!isPswd1Visible ? (
                    <FaEye
                      onClick={() => {
                        setIsPswd1Visible(true);
                      }}
                      className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => {
                        setIsPswd1Visible(false);
                      }}
                      className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                    />
                  )}
                </div>
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mt-2 mb-1 "
                  htmlFor="re-password"
                >
                  Reenter Password*
                </label>
                <div className=" relative flex items-center justify-center">
                  <input
                    autoComplete="off"
                    required
                    name="re-password"
                    id="re-password"
                    type={isPswd2Visible ? "text" : "password"}
                    value={confirmPswd}
                    onChange={(e) => setConfirmPswd(e.target.value)}
                    className=" border-[1.4px] w-full border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                    placeholder="Reenter Password"
                  />
                  {!isPswd2Visible ? (
                    <FaEye
                      onClick={() => {
                        setIsPswd2Visible(true);
                      }}
                      className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => {
                        setIsPswd2Visible(false);
                      }}
                      className=" absolute right-2 text-[21px] cursor-pointer text-[#999999] "
                    />
                  )}
                </div>
              </div>
            </div>

            {/* <div className=" sm:w-[90%] 2xl:w-[93%] grid grid-cols-2 gap-4 md:gap-10 xl:gap-[13%] md:mt-2 mt-2 mb-1 ">
              <div className=" w-full flex flex-col col-span-2 ">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mt-2 mb-1 "
                  htmlFor="Address"
                >
                  Vendor Category *
                </label>
                <select
                  className=" w-[100%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  value={category}
                  onChange={onChange}
                  name="category"
                >
                  <option value="Home Furniture">Home Furniture</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
            </div> */}

            <div className=" sm:grid  mt-6 ">
              <div className=" flex items-center gap-2 ">
                <input
                  autoComplete="off"
                  required
                  name="State*"
                  id="State*"
                  type="checkbox"
                  onChange={() => {
                    setIsChecked(!isChecked);
                  }}
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State*"
                />
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mt-2 mb-1 "
                  htmlFor="State*"
                >
                  Your personal data will be used to support your experience
                  throughout this website
                </label>
              </div>
            </div>
            <button
              disabled={
                email === "" ||
                password === "" ||
                name === "" ||
                phone === "" ||
                password === "" ||
                confirmPswd !== password ||
                !isChecked
              }
              className=" bg-[#FF4800] disabled:bg-gray-400 disabled:text-gray-600 w-fit  px-4 py-2.5 font-medium uppercase text-[13px] text-white mt-6 "
              onClick={onSubmit}
            >
              Register
            </button>
            <p className="font-[400] mt-1.5 mb-3 w-full text-[12px] md:text-[14px]">
              Already have an account ?
              <Link to="/admin-login" className=" font-semibold underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
