import axiosInstance from "@/configs/axiosConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CuratorRegistration = () => {
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
        images: []
    });

    // Preview states for uploaded images
    const [previews, setPreviews] = useState([]);

    // Handle personal details changes
    const handlePersonalDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            personalDetails: {
                ...prev.personalDetails,
                [name]: value
            }
        }));
        if (formErrors[`personalDetails.${name}`]) {
            setFormErrors(prev => ({ ...prev, [`personalDetails.${name}`]: "" }));
        }
    };

    // Handle image uploads
    const handleImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const validFiles = files.filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`${file.name} is too large (max 5MB)`);
                    return false;
                }
                return true;
            });

            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...validFiles]
            }));
        }
    };

    // Remove image
    const handleRemoveImage = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

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
        if (formData.images.length === 0) {
            errors.images = "At least one image is required";
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
            formData.images.forEach((image, index) => {
                formDataToSend.append(`media`, image);
            });
            console.log([...formDataToSend.entries()]); // Debugging
            // Here you'll add your API call
            const response = await axiosInstance.post('/auth/register/curator', formDataToSend);
            console.log(response)
            if(response.data.curator){
                toast.success("Registration successful!");
                localStorage.setItem("accessToken", response.data.token);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.curator));
                navigate('/suggestions'); 
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error)

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
                    onClick={() => navigate('/register')}
                    className="flex items-center text-gray-400 hover:text-white mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Register as a Curator/Event Manager/Artist/Dj
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
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["personalDetails.firstName"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.personalDetails.firstName}
                                        onChange={handlePersonalDetailsChange}
                                    />
                                    {formErrors["personalDetails.firstName"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["personalDetails.firstName"]}</p>
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
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["personalDetails.lastName"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.personalDetails.lastName}
                                        onChange={handlePersonalDetailsChange}
                                    />
                                    {formErrors["personalDetails.lastName"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["personalDetails.lastName"]}</p>
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
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["personalDetails.stageName"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.personalDetails.stageName}
                                        onChange={handlePersonalDetailsChange}
                                    />
                                    {formErrors["personalDetails.stageName"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["personalDetails.stageName"]}</p>
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
                                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["personalDetails.bio"] ? 'border-red-500' : 'border-gray-600'
                                        } focus:border-purple-500 focus:outline-none`}
                                    value={formData.personalDetails.bio}
                                    onChange={handlePersonalDetailsChange}
                                />
                                {formErrors["personalDetails.bio"] && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors["personalDetails.bio"]}</p>
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
                                        formErrors["personalDetails.email"] ? "border-red-500" : "border-gray-600"
                                    } focus:border-purple-500 focus:outline-none`}
                                    value={formData.personalDetails.email}
                                    onChange={handlePersonalDetailsChange}
                                />
                                {formErrors["personalDetails.email"] && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors["personalDetails.email"]}</p>
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
                                        formErrors["personalDetails.password"] ? "border-red-500" : "border-gray-600"
                                    } focus:border-purple-500 focus:outline-none`}
                                    value={formData.personalDetails.password}
                                    onChange={handlePersonalDetailsChange}
                                />
                                {formErrors["personalDetails.password"] && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors["personalDetails.password"]}</p>
                                )}
                            </div>
                        </div>

                        {/* Upload Images Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Upload images</h2>
                            <p className="text-sm text-gray-400">Upload images Showcasing your event venue</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}

                                <label className={`     aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-all duration-200 hover:bg-gray-800/20 ${
                                    previews.length >= 1 ? "hidden" : ""
                                }`}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImagesUpload}
                                    />
                                    <img src="/Images/img-upload.svg" alt="upload" className="w-12 h-12 mb-2" />
                                </label>
                            </div>
                            {formErrors.images && (
                                <p className="text-red-500 text-sm">{formErrors.images}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-32 px-6 py-3 bg-[#00FFB3] text-black font-medium rounded-lg 
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00FFB3]/90'} 
                  transition-colors`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CuratorRegistration;