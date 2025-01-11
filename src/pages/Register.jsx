import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const RegistrationForm = () => {
  const [selectedRole, setSelectedRole] = useState("User"); // Default role set to "User"
  const [formData, setFormData] = useState({}); // State to store all form data
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files : value, // Handle file inputs separately
    });
  };

  const renderFields = () => {
    switch (selectedRole) {
      case "Sponsor":
        return (
          <>
            <InputField
              label="Business Name"
              name="businessName"
              value={formData.businessName || ""}
              onChange={handleChange}
            />
            <InputField
              label="GST Information"
              name="gstInfo"
              value={formData.gstInfo || ""}
              onChange={handleChange}
            />
            <InputField
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson || ""}
              onChange={handleChange}
            />
            <InputField
              label="Bio and Description"
              name="bio"
              value={formData.bio || ""}
              type="textarea"
              onChange={handleChange}
            />
            <InputField
              label="Categories of Events"
              name="categories"
              value={formData.categories || ""}
              onChange={handleChange}
            />
            <InputField
              label="Expectations from Sponsorship"
              name="expectations"
              value={formData.expectations || ""}
              type="textarea"
              onChange={handleChange}
            />
            <FileUploadField
              label="Media Files (logos, banners)"
              name="mediaFiles"
              onChange={handleChange}
            />
          </>
        );

      case "Venue Owner":
        return (
          <>
            <InputField
              label="Venue Name"
              name="venueName"
              value={formData.venueName || ""}
              onChange={handleChange}
            />
            <InputField
              label="Venue Location (Address)"
              name="venueAddress"
              value={formData.venueAddress || ""}
              onChange={handleChange}
            />
            <InputField
              label="GPS Coordinates"
              name="gpsCoordinates"
              value={formData.gpsCoordinates || ""}
              onChange={handleChange}
            />
            <InputField
              label="Venue Management Contact Information"
              name="venueContactInfo"
              value={formData.venueContactInfo || ""}
              onChange={handleChange}
            />
            <InputField
              label="GST Information"
              name="venueGstInfo"
              value={formData.venueGstInfo || ""}
              onChange={handleChange}
            />
            <FileUploadField
              label="Media Files (images of venue, interior)"
              name="venueMedia"
              onChange={handleChange}
            />
            <InputField
              label="Menu Details (if applicable)"
              name="menuDetails"
              value={formData.menuDetails || ""}
              onChange={handleChange}
            />
          </>
        );

      case "Curator/Artist":
        return (
          <>
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
            />
            <InputField
              label="Username/Stage Name"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
            />
            <InputField
              label="Bio and Description"
              name="bio"
              value={formData.bio || ""}
              type="textarea"
              onChange={handleChange}
            />
            <InputField
              label="Social Media Handles"
              name="socialMedia"
              value={formData.socialMedia || ""}
              onChange={handleChange}
            />
            <FileUploadField
              label="Media Files (Images, Videos, Audio)"
              name="artistMedia"
              onChange={handleChange}
            />
          </>
        );

      case "User":
      default:
        return (
          <>
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email || ""}
              type="email"
              onChange={handleChange}
            />
            <InputField
              label="Password"
              name="password"
              value={formData.password || ""}
              type="password"
              onChange={handleChange}
            />
          </>
        );
    }
  };

  const handleSubmit = (e) => {
    navigate("/")
  };

  return (
    <div className=" min-h-screen bg-[#0E0F13] flex flex-col items-center justify-center p-2 pt-20">
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
      <div
        className="max-w-3xl w-full  backdrop-blur-md shadow-lg rounded-lg p-8"
      >
        <h2 className="text-3xl  text-center text-gray-300 mb-6 font-playfair">
          Register
        </h2>

        <div className="mb-6 flex items-center space-x-2">
          <label
            htmlFor="role"
            className="text-base sm:text-lg font-medium text-gray-400"
          >
            Select Role:
          </label>
          <select
            id="role"
            name="role"
            className="w-40 sm:w-64 p-2 sm:p-2 bg-inherit text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onChange={(e) => setSelectedRole(e.target.value)}
            value={selectedRole}
          >
            <option value="User" className="bg-gray-900">User</option>
            <option value="Sponsor" className="bg-gray-900">Sponsor</option>
            <option value="Venue Owner" className="bg-gray-900">Venue Owner</option>
            <option value="Curator/Artist" className="bg-gray-900">Curator/Artist</option>
          </select>
        </div>


        <form className="space-y-4" onSubmit={handleSubmit}>
          {renderFields()}
          <div className="flex justify-between">
            <button
              type="submit"
              className="pt-4 "
            >
              <a href="#_" class="relative px-6 py-3 font-bold text-white rounded-full group">
                <span class="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <span class="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
                <span class="relative">Register</span>
              </a>
            </button>
            <p className="text-gray-400 text-sm pt-4">
              Already have an account?{" "}
              <a href="/login" className="text-white hover:text-gray-300">
                Login
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
  <div className="">
    <label
      htmlFor={name}
      className="block  text-sm font-medium text-gray-400 mb-2"
    >
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        className="w-full p-3 bg-inherit text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#a577e1]"
        rows="4"
        value={value}
        onChange={onChange}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        className="w-full p-3 bg-inherit text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9a5aee]"
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

// Reusable File Upload Field Component
const FileUploadField = ({ label, name, onChange }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-400 mb-2"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type="file"
      multiple
      className="w-full p-3  text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      onChange={onChange}
    />
  </div>
);

export default RegistrationForm;
