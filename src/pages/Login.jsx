import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "@/configs/axiosConfig";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({}); // State to store all form data
  const [isPassVisible, setIsPassVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files : value, // Handle file inputs separately
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const response = await axiosInstance.post("/login", formData);
    // console.log(response.json())
    // navigate("/");
    try {
      // The backend login route is /auth/login
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.data && response.data.token) {
        // Upon successful login, save the token and user data to localStorage
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Notify the user of success
        // toast.success("Login successful!"); // You can add a toast notification here if you like

        // Navigate to the profile page
        navigate("/profile");
      } else {
        // Handle cases where login is not successful but doesn't throw an error
        console.error("Login failed:", response.data.message);
        // toast.error(response.data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      // Handle errors, e.g., show a notification to the user
      console.error("An error occurred during login:", error.response?.data?.message || error.message);
      // toast.error(error.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F13] flex items-center justify-center px-4 py-6 relative">
      {/* Decorative Glassmorphism Effect */}
      <svg
        className="fixed top-0 right-0 z-[0] pointer-events-none"
        width="536"
        height="1071"
        viewBox="0 0 536 1071"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_1_3190)">
          <circle cx="535.5" cy="535.5" r="207.5" fill="#8B33FE" fillOpacity="0.4" />
        </g>
        <defs>
          <filter
            id="filter0_f_1_3190"
            x="0"
            y="0"
            width="1071"
            height="1071"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="164" result="effect1_foregroundBlur_1_3190" />
          </filter>
        </defs>
      </svg>

      <div className="absolute top-0 right-0 left-0 h-full bg-gradient-to-br from-[#8b33fe66] to-[#ff5a8a33] opacity-30 blur-[200px] z-0"></div>

      <div className="relative z-10 w-full max-w-xl backdrop-blur-lg  border border-gray-700 shadow-2xl rounded-3xl p-10 space-y-6">
        <h2 className="text-4xl font-bold text-center text-gray-200 mb-6 font-playfair">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />

          {/* Password Field */}
          <div className="relative">
            <InputField
              label="Password"
              name="password"
              type={isPassVisible ? "text" : "password"}
              value={formData.password || ""}
              onChange={handleChange}
            />
            {isPassVisible ? (
              <FaEye
                onClick={() => setIsPassVisible(false)}
                className="absolute text-gray-400 right-4 bottom-[3px] transform -translate-y-1/2 text-[21px] cursor-pointer hover:text-purple-400"
              />
            ) : (
              <FaEyeSlash
                onClick={() => setIsPassVisible(true)}
                className="absolute text-gray-400 right-4 bottom-[3px] transform -translate-y-1/2 text-[21px] cursor-pointer hover:text-purple-400"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="pt-4 "
            >
              <a href="#_" class="relative px-6 py-3 font-bold text-white rounded-full group">
                <span class="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <span class="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
                <span class="relative">Login</span>
              </a>
            </button>
            <p className="text-gray-400 text-sm pt-4">
              New User?{" "}
              <a href="/register" className="text-white hover:text-gray-300">
                Register
              </a>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-300 tracking-wide"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-inherit text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
    />
  </div>
);

export default RegistrationForm;
