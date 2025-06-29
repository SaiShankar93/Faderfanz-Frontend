import axiosInstance from "@/configs/axiosConfig";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const SponsorRegistration = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        businessLogo: null,
        businessBanner: null,
        businessName: "",
        taxIdentificationNumber: "",
        description: "",
        contactName: "",
        preferredEvents: "",
        sponsorshipExpectations: [],
        products: [
            {
                id: Date.now(),
                name: "",
                price: ""
            }
        ],
        email: "",
        password: "",
        role: "",
        facebook: "",
        instagram: "",
        twitter: "",
        location: {
            address: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            landmark: "",
            // coordinates: {
            //     latitude: "",
            //     longitude: ""
            // }
        }
    });

    // Preview states for uploaded images
    const [previews, setPreviews] = useState({
        businessLogo: null,
        businessBanner: null,
        productImages: {}
    });

    // Handle text input changes
    const handleInputChange = (e, nestedField = null) => {
        const { name, value } = e.target;

        if (nestedField) {
            setFormData(prev => ({
                ...prev,
                [nestedField]: {
                    ...prev[nestedField],
                    [name.split('.')[1]]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Handle expectations checkboxes
    const handleExpectationChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            sponsorshipExpectations: checked
                ? [...prev.sponsorshipExpectations, name]
                : prev.sponsorshipExpectations.filter(exp => exp !== name)
        }));
    };

    // Handle file uploads with preview
    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({
                    ...prev,
                    [field]: reader.result
                }));
            };
            reader.readAsDataURL(file);

            setFormData(prev => ({
                ...prev,
                [field]: file
            }));
            if (formErrors[field]) {
                setFormErrors(prev => ({ ...prev, [field]: "" }));
            }
        }
    };

    // Handle product changes
    const handleProductChange = (productId, field, value) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map(product =>
                product.id === productId
                    ? { ...product, [field]: value }
                    : product
            )
        }));
    };

    // Handle product image upload
    const handleProductImageUpload = (productId, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({
                    ...prev,
                    productImages: {
                        ...prev.productImages,
                        [productId]: reader.result
                    }
                }));
            };
            reader.readAsDataURL(file);

            // Store the actual file in formData
            setFormData(prev => ({
                ...prev,
                products: prev.products.map(product =>
                    product.id === productId
                        ? { ...product, image: file }
                        : product
                )
            }));
        }
    };

    // Add new product field
    const handleAddProduct = () => {
        setFormData(prev => ({
            ...prev,
            products: [
                ...prev.products,
                {
                    id: Date.now(),
                    name: "",
                    price: "",
                    image: null
                }
            ]
        }));
    };

    // Remove product field
    const handleRemoveProduct = (productId) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter(product => product.id !== productId)
        }));
        // Clean up preview
        setPreviews(prev => {
            const { [productId]: removed, ...rest } = prev.productImages;
            return {
                ...prev,
                productImages: rest
            };
        });
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        if (!formData.businessLogo) errors.businessLogo = "Business logo is required";
        if (!formData.businessBanner) errors.businessBanner = "Business banner is required";
        if (!formData.businessName.trim()) errors.businessName = "Business name is required";
        if (!formData.taxIdentificationNumber.trim()) errors.taxIdentificationNumber = "Tax identification number is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        if (!formData.contactName.trim()) errors.contactName = "Contact name is required";
        if (!formData.preferredEvents) errors.preferredEvents = "Preferred events is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (!formData.password.trim()) errors.password = "Password is required";
        if (!formData.role) errors.role = "Role is required";
        
        // Validate social media fields
        if (!formData.facebook.trim()) errors.facebook = "Facebook URL is required";
        if (!formData.instagram.trim()) errors.instagram = "Instagram URL is required";
        if (!formData.twitter.trim()) errors.twitter = "Twitter URL is required";

        // Validate products
        formData.products.forEach((product, index) => {
            if (!product.name.trim()) errors[`product${index}Name`] = "Product name is required";
            if (!product.price.trim()) errors[`product${index}Price`] = "Price is required";
        });

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
            formDataToSend.append('businessLogo', formData.businessLogo);
            formDataToSend.append('businessBanner', formData.businessBanner);
            formDataToSend.append('businessName', formData.businessName);
            formDataToSend.append('taxIdentificationNumber', formData.taxIdentificationNumber);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('contactName', formData.contactName);
            formDataToSend.append('preferredEvents', formData.preferredEvents);
            formDataToSend.append('sponsorshipExpectations', "Brand Exposure");
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('role', formData.role);
            formDataToSend.append('facebook', formData.facebook);
            formDataToSend.append('instagram', formData.instagram);
            formDataToSend.append('twitter', formData.twitter);

            // Flatten location fields for FormData
            const loc = formData.location;
            formDataToSend.append('location[address]', loc.address);
            formDataToSend.append('location[city]', loc.city);
            formDataToSend.append('location[state]', loc.state);
            formDataToSend.append('location[country]', loc.country);
            formDataToSend.append('location[postalCode]', loc.postalCode);
            formDataToSend.append('location[landmark]', loc.landmark);
            // Ensure latitude/longitude are numbers
            // formDataToSend.append('location[coordinates][latitude]', parseFloat(loc.coordinates.latitude));
            // formDataToSend.append('location[coordinates][longitude]', parseFloat(loc.coordinates.longitude));

            // Append products
            formDataToSend.append('products', JSON.stringify(formData.products));

            // Append product images as File objects
            formData.products.forEach((product, index) => {
                if (product.image) {
                    formDataToSend.append('productImages', product.image);
                }
            });

            console.log(Object.fromEntries(formDataToSend));
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/register/sponsor`, formDataToSend);

            if (data.sponsor) {
                toast.success("Registration successful!");
                navigate("/login");
            } else {
                toast.error(data.message);
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
                    onClick={() => navigate('/register')}
                    className="flex items-center text-gray-400 hover:text-white mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Register as a Sponsor
                </button>

                {/* Add blur container around the form */}
                <div className="backdrop-blur-md bg-[#1E1E2E]/70 rounded-lg p-8 shadow-xl border border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* File Upload Section with updated icons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Business Logo Upload */}
                            <div className="relative">
                                <div className={`flex flex-col items-center justify-center h-40 border-2 border-dashed 
                                    ${formErrors.businessLogo ? 'border-red-500' : 'border-gray-600'} 
                                    rounded-lg bg-[#1A1B23]/80 backdrop-blur-sm cursor-pointer hover:border-purple-500 transition-all`}
                                >
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'businessLogo')}
                                        className="hidden"
                                        id="businessLogo"
                                        accept="image/*"
                                    />
                                    <label htmlFor="businessLogo" className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                                        {previews.businessLogo ? (
                                            <img src={previews.businessLogo} alt="Logo preview" className="h-full w-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <img src="/Images/img-upload.svg" alt="upload" className="w-12 h-12 mb-2" />
                                                <span className="text-gray-400">Upload Business Logo</span>
                                                <span className="text-xs text-[#00FFB3] mt-1">Choose file</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {formErrors.businessLogo && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.businessLogo}</p>
                                )}
                            </div>

                            {/* Business Banner Upload */}
                            <div className="relative">
                                <div className={`flex flex-col items-center justify-center h-40 border-2 border-dashed 
                                    ${formErrors.businessBanner ? 'border-red-500' : 'border-gray-600'} 
                                    rounded-lg bg-[#1A1B23]/80 backdrop-blur-sm cursor-pointer hover:border-purple-500 transition-all`}
                                >
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'businessBanner')}
                                        className="hidden"
                                        id="businessBanner"
                                        accept="image/*"
                                    />
                                    <label htmlFor="businessBanner" className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                                        {previews.businessBanner ? (
                                            <img src={previews.businessBanner} alt="Banner preview" className="h-full w-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <img src="/Images/img-upload.svg" alt="upload" className="w-12 h-12 mb-2" />
                                                <span className="text-gray-400">Upload Business Banner</span>
                                                <span className="text-xs text-[#00FFB3] mt-1">Choose file</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {formErrors.businessBanner && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.businessBanner}</p>
                                )}
                            </div>
                        </div>

                        {/* Business Details Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Business details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Business name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        placeholder="Enter your business name"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.businessName ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                    {formErrors.businessName && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.businessName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tax Identification Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="taxIdentificationNumber"
                                        placeholder="Enter your business tax number here"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.taxIdentificationNumber ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.taxIdentificationNumber}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                    {formErrors.taxIdentificationNumber && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.taxIdentificationNumber}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Enter your business description here"
                                    rows="4"
                                    className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.description ? 'border-red-500' : 'border-gray-600'
                                        } focus:border-purple-500 focus:outline-none`}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                {formErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Person Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Contact name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        placeholder="Enter full name"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.contactName ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.contactName}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                    {formErrors.contactName && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.contactName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.password ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                    {formErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.role ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.role}
                                        onChange={(e) => handleInputChange(e)}
                                    >
                                        <option value="">Choose a role</option>
                                        <option value="owner">Owner</option>
                                        <option value="manager">Manager</option>
                                        <option value="representative">Representative</option>
                                    </select>
                                    {formErrors.role && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                                    )}
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Facebook <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="facebook"
                                        placeholder="Enter Facebook profile URL"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.facebook ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:outline-none`}
                                        value={formData.facebook}
                                        onChange={(e) => handleInputChange(e)}
                                        required
                                    />
                                    {formErrors.facebook && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.facebook}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Instagram <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="instagram"
                                        placeholder="Enter Instagram profile URL"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.instagram ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:outline-none`}
                                        value={formData.instagram}
                                        onChange={(e) => handleInputChange(e)}
                                        required
                                    />
                                    {formErrors.instagram && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.instagram}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Twitter <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="twitter"
                                        placeholder="Enter Twitter profile URL"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.twitter ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:outline-none`}
                                        value={formData.twitter}
                                        onChange={(e) => handleInputChange(e)}
                                        required
                                    />
                                    {formErrors.twitter && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.twitter}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Location Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location.address"
                                        placeholder="Enter street address"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors['location.address'] ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:outline-none`}
                                        value={formData.location.address}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                    {formErrors['location.address'] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors['location.address']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location.city"
                                        placeholder="Enter city"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors['location.city'] ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:outline-none`}
                                        value={formData.location.city}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                    {formErrors['location.city'] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors['location.city']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location.state"
                                        placeholder="Enter state"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors['location.state'] ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:outline-none`}
                                        value={formData.location.state}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                    {formErrors['location.state'] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors['location.state']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Country <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location.country"
                                        placeholder="Enter country"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors['location.country'] ? 'border-red-500' : 'border-gray-600'} focus:border-purple-500 focus:outline-none`}
                                        value={formData.location.country}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                    {formErrors['location.country'] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors['location.country']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="location.postalCode"
                                        placeholder="Enter postal code"
                                        className="w-full p-3 bg-[#1A1B23] rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                        value={formData.location.postalCode}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Landmark
                                    </label>
                                    <input
                                        type="text"
                                        name="location.landmark"
                                        placeholder="Enter nearby landmark"
                                        className="w-full p-3 bg-[#1A1B23] rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                        value={formData.location.landmark}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="location.coordinates.latitude"
                                        placeholder="Enter latitude"
                                        className="w-full p-3 bg-[#1A1B23] rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                        value={formData.location.coordinates.latitude}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="location.coordinates.longitude"
                                        placeholder="Enter longitude"
                                        className="w-full p-3 bg-[#1A1B23] rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                        value={formData.location.coordinates.longitude}
                                        onChange={(e) => handleInputChange(e, 'location')}
                                    />
                                </div> */}
                            </div>
                        </div>

                        {/* Event Preferences Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">What type of event are you interested in?</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Choose your preferred event? <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="preferredEvents"
                                    className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.preferredEvents ? 'border-red-500' : 'border-gray-600'
                                        } focus:border-purple-500 focus:outline-none`}
                                    value={formData.preferredEvents}
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    <option value="">Choose event</option>
                                    <option value="Music Events">Music Events</option>
                                    <option value="Sports Events">Sports Events</option>
                                    <option value="Cultural Events">Cultural Events</option>
                                    <option value="Technology Events">Technology Events</option>
                                </select>
                                {formErrors.preferredEvents && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.preferredEvents}</p>
                                )}
                            </div>
                        </div>

                        {/* Products Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Upload your product</h2>
                            {formData.products.map((product, index) => (
                                <div key={product.id} className="relative space-y-4 p-4 border border-gray-700 rounded-lg bg-[#1A1B23]/80 backdrop-blur-sm">
                                    {formData.products.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(product.id)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Product name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter product name"
                                                className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors[`product${index}Name`] ? 'border-red-500' : 'border-gray-600'
                                                    } focus:border-purple-500 focus:outline-none`}
                                                value={product.name}
                                                onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                                            />
                                            {formErrors[`product${index}Name`] && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors[`product${index}Name`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter price"
                                                className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors[`product${index}Price`] ? 'border-red-500' : 'border-gray-600'
                                                    } focus:border-purple-500 focus:outline-none`}
                                                value={product.price}
                                                onChange={(e) => handleProductChange(product.id, 'price', e.target.value)}
                                            />
                                            {formErrors[`product${index}Price`] && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors[`product${index}Price`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Product image <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative h-32 border-2 border-dashed ${formErrors[`product${index}Image`] ? 'border-red-500' : 'border-gray-600'
                                                } rounded-lg bg-[#1A1B23]/80 backdrop-blur-sm cursor-pointer hover:border-purple-500`}>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id={`product-image-${product.id}`}
                                                    accept="image/*"
                                                    onChange={(e) => handleProductImageUpload(product.id, e)}
                                                />
                                                <label
                                                    htmlFor={`product-image-${product.id}`}
                                                    className="flex items-center justify-center h-full cursor-pointer"
                                                >
                                                    {previews.productImages[product.id] ? (
                                                        <img
                                                            src={previews.productImages[product.id]}
                                                            alt="Product preview"
                                                            className="h-full w-full object-contain rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="text-center">
                                                            <img src="/Images/img-upload.svg" alt="upload" className="mx-auto h-12 w-12 mb-2" />
                                                            <span className="text-xs text-[#00FFB3]">Choose image</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                            {formErrors[`product${index}Image`] && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors[`product${index}Image`]}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddProduct}
                                className="text-[#00FFB3] hover:text-[#00FFB3]/80 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add another product
                            </button>
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

export default SponsorRegistration; 