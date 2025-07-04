import axiosInstance from "@/configs/axiosConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GuestRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      lastName: "",
      stageName: "",
      bio: "",
      email: "", // New field
      password: "", // New field
    },
    mediaFiles: {
      images: [],
      // video: null, // Commented out video
    },
  });

  // Preview states for uploaded files
  const [previews, setPreviews] = useState({
    images: [],
    // video: null, // Commented out video
  });

  // Handle personal details changes
  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
    if (formErrors[`personalDetails.${name}`]) {
      setFormErrors((prev) => ({ ...prev, [`personalDetails.${name}`]: "" }));
    }
  };

  // Handle image uploads
  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => ({
            ...prev,
            images: [...prev.images, reader.result],
          }));
        };
        reader.readAsDataURL(file);
      });

      setFormData((prev) => ({
        ...prev,
        mediaFiles: {
          ...prev.mediaFiles,
          images: [...prev.mediaFiles.images, ...validFiles],
        },
      }));
    }
  };

  // Handle video upload - Commented out
  /*
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit for video
        toast.error("Video file size should be less than 100MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          video: reader.result,
        }));
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({
        ...prev,
        mediaFiles: {
          ...prev.mediaFiles,
          video: file,
        },
      }));
    }
  };
  */

  // Remove image
  const handleRemoveImage = (index) => {
    setPreviews((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setFormData((prev) => ({
      ...prev,
      mediaFiles: {
        ...prev.mediaFiles,
        images: prev.mediaFiles.images.filter((_, i) => i !== index),
      },
    }));
  };

  // Remove video - Commented out
  /*
  const handleRemoveVideo = () => {
    setPreviews((prev) => ({
      ...prev,
      video: null,
    }));
    setFormData((prev) => ({
      ...prev,
      mediaFiles: {
        ...prev.mediaFiles,
        video: null,
      },
    }));
  };
  */

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.personalDetails.firstName.trim()) {
      errors["personalDetails.firstName"] = "First name is required";
    }
    if (!formData.personalDetails.lastName.trim()) {
      errors["personalDetails.lastName"] = "Last name is required";
    }
    if (!formData.personalDetails.stageName.trim()) {
      errors["personalDetails.stageName"] = "Stage name is required";
    }
    if (!formData.personalDetails.bio.trim()) {
      errors["personalDetails.bio"] = "Bio/Description is required";
    }
    if (!formData.personalDetails.email.trim()) {
      errors["personalDetails.email"] = "Email is required";
    }
    if (!formData.personalDetails.password.trim()) {
      errors["personalDetails.password"] = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Append personal details
      Object.entries(formData.personalDetails).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append images
      formData.mediaFiles.images.forEach((image, index) => {
        formDataToSend.append(`image`, image);
      });

      // Append video if exists - Commented out
      /*
      if (formData.mediaFiles.video) {
        formDataToSend.append("video", formData.mediaFiles.video);
      }
      */

      // Here you'll add your API call
      const response = await axiosInstance.post(
        "/auth/register/guest",
        formDataToSend
      );

      if (response.data.guest) {
        toast.success("Registration successful!");
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.guest));
        navigate("/suggestions");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E2E] text-white p-8 relative overflow-hidden">
      {/* Background gradient SVG */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <img
          src="/Images/bg-grad-sponsor.svg"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto font-sen relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/register")}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Register as a Guest/Fan
        </button>

        {/* Add blur container around the form */}
        <div className="backdrop-blur-md bg-[#1E1E2E]/70 rounded-lg p-8 shadow-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Personal details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors["personalDetails.firstName"]
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.personalDetails.firstName}
                    onChange={handlePersonalDetailsChange}
                  />
                  {formErrors["personalDetails.firstName"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors["personalDetails.firstName"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name here"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors["personalDetails.lastName"]
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.personalDetails.lastName}
                    onChange={handlePersonalDetailsChange}
                  />
                  {formErrors["personalDetails.lastName"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors["personalDetails.lastName"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Stage name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="stageName"
                    placeholder="Enter stage name here"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors["personalDetails.stageName"]
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.personalDetails.stageName}
                    onChange={handlePersonalDetailsChange}
                  />
                  {formErrors["personalDetails.stageName"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors["personalDetails.stageName"]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio/Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  placeholder="Enter your bio/description here"
                  rows="4"
                  className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                    formErrors["personalDetails.bio"]
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:border-purple-500 focus:outline-none`}
                  value={formData.personalDetails.bio}
                  onChange={handlePersonalDetailsChange}
                />
                {formErrors["personalDetails.bio"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors["personalDetails.bio"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                    formErrors["personalDetails.email"]
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:border-purple-500 focus:outline-none`}
                  value={formData.personalDetails.email}
                  onChange={handlePersonalDetailsChange}
                />
                {formErrors["personalDetails.email"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors["personalDetails.email"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                    formErrors["personalDetails.password"]
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:border-purple-500 focus:outline-none`}
                  value={formData.personalDetails.password}
                  onChange={handlePersonalDetailsChange}
                />
                {formErrors["personalDetails.password"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors["personalDetails.password"]}
                  </p>
                )}
              </div>
            </div>

            {/* Upload Media Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Images</h2>
              <p className="text-sm text-gray-400">
                Upload multiple images to showcase yourself (Max 5MB per image)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Images */}
                {previews.images.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Image Upload Button */}
                <label className={` aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-all duration-200 hover:bg-gray-800/20 ${
                  previews.images.length >= 1 ? "hidden" : ""
                }`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagesUpload}
                  />
                  <img
                    src="/Images/img-upload.svg"
                    alt="upload"
                    className="w-12 h-12 mb-2"
                  />
                  <span className="text-xs text-[#00FFB3]">Upload Images</span>
                  <span className="text-xs text-gray-400 mt-1">(Max 5MB each)</span>
                </label>
              </div>

              {/* Video Preview - Commented out */}
              {/*
              {previews.video && (
                <div className="relative mt-4">
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={previews.video}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-32 px-6 py-3 bg-[#00FFB3] text-black font-medium rounded-lg 
              ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#00FFB3]/90"
              } 
              transition-colors`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestRegistration;
