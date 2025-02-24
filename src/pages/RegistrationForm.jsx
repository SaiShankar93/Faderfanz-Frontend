import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelectionModal from "../components/RoleSelectionModal";

const RegistrationForm = () => {
  const [showRoleModal, setShowRoleModal] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [selectedRole, setSelectedRole] = useState(null);

  // Show role selection modal when component mounts
  useEffect(() => {
    setShowRoleModal(true);
  }, []);

  // Role options matching the design
  const roleOptions = [
    {
      id: "sponsor",
      title: "Sponsor",
      description: "Become a sponsor"
    },
    {
      id: "venue-owner",
      title: "Venue Owner",
      description: "Register as a venue owner"
    },
    {
      id: "curator",
      title: "Curator",
      description: "Register as an event manager, artist, DJ etc."
    },
    {
      id: "guest",
      title: "Guest/Fans",
      description: "Register as a fan/guest"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/register/role");
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    switch (selectedRole) {
      case "sponsor":
        navigate("/register/sponsor");
        break;
      case "venue-owner":
        navigate("/register/venue-owner");
        break;
      case "curator":
        navigate("/register/curator");
        break;
      case "guest":
        navigate("/register/guest");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F13] flex items-center justify-center px-4 py-6 relative">
      {/* Background effects */}
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

      {/* Show role selection modal by default */}
      {showRoleModal && <RoleSelectionModal />}

      {/* Left Section - Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/Images/gaming-event.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#1E1E2E]">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex items-center gap-4 mb-8">
            <img src="/kazi_logo.jpeg" alt="Kazi Culture" className="w-12 h-12 rounded" />
            <h1 className="text-2xl text-white font-sen">Kazi Culture</h1>
          </div>

          <h2 className="text-3xl font-semibold text-white mb-8">Sign Up to Kazi Culture</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">FULL NAME</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your name"
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-[#00FFB3] focus:outline-none"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-[#00FFB3] focus:outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">PASSWORD</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-[#00FFB3] focus:outline-none"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Enter your password"
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-[#00FFB3] focus:outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00FFB3] text-black font-medium rounded-lg hover:bg-[#00FFB3]/90 transition-colors"
            >
              Sign Up
            </button>

            <div className="text-center">
              <p className="text-gray-400">Or</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 bg-black border border-gray-800 rounded-lg text-white hover:bg-gray-900"
              >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                <span>Sign up with Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 bg-black border border-gray-800 rounded-lg text-white hover:bg-gray-900"
              >
                <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
                <span>Sign up with Apple</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
