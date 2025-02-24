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
        taxNumber: "",
        description: "",
        contactPerson: {
            name: "",
            role: ""
        },
        eventPreference: "",
        expectations: {
            brandExposure: false,
            sales: false,
            increase: false,
            empowerment: false
        },
        products: [
            {
                id: Date.now(),
                name: "",
                price: "",
                image: null
            }
        ]
    });

    // Preview states for uploaded images
    const [previews, setPreviews] = useState({
        businessLogo: null,
        businessBanner: null,
        productImages: {}
    });

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Handle contact person changes
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            contactPerson: {
                ...prev.contactPerson,
                [name]: value
            }
        }));
        if (formErrors[`contactPerson.${name}`]) {
            setFormErrors(prev => ({ ...prev, [`contactPerson.${name}`]: "" }));
        }
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

    // Handle expectations checkboxes
    const handleExpectationChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            expectations: {
                ...prev.expectations,
                [name]: checked
            }
        }));
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

            handleProductChange(productId, 'image', file);
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
        if (!formData.taxNumber.trim()) errors.taxNumber = "Tax number is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        if (!formData.contactPerson.name.trim()) errors["contactPerson.name"] = "Contact name is required";
        if (!formData.contactPerson.role) errors["contactPerson.role"] = "Role is required";
        if (!formData.eventPreference) errors.eventPreference = "Event preference is required";

        // Validate products
        formData.products.forEach((product, index) => {
            if (!product.name.trim()) errors[`product${index}Name`] = "Product name is required";
            if (!product.price.trim()) errors[`product${index}Price`] = "Price is required";
            if (!product.image) errors[`product${index}Image`] = "Product image is required";
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
            formDataToSend.append('taxNumber', formData.taxNumber);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('contactPerson', JSON.stringify(formData.contactPerson));
            formDataToSend.append('eventPreference', formData.eventPreference);
            formDataToSend.append('expectations', JSON.stringify(formData.expectations));

            // Append products
            formData.products.forEach((product, index) => {
                formDataToSend.append(`products[${index}][name]`, product.name);
                formDataToSend.append(`products[${index}][price]`, product.price);
                formDataToSend.append(`products[${index}][image]`, product.image);
            });

            // Here you'll add your API call
            // const response = await axios.post('/api/sponsor/register', formDataToSend);

            toast.success("Registration successful!");
            navigate('/login'); // or wherever you want to redirect after success
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
                                        onChange={handleInputChange}
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
                                        name="taxNumber"
                                        placeholder="Enter your business tax number here"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.taxNumber ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.taxNumber}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.taxNumber && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.taxNumber}</p>
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
                                    onChange={handleInputChange}
                                />
                                {formErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Person Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Contact person</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Contact name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter full name"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors['contactPerson.name'] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.contactPerson.name}
                                        onChange={handleContactChange}
                                    />
                                    {formErrors['contactPerson.name'] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors['contactPerson.name']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors['contactPerson.role'] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.contactPerson.role}
                                        onChange={handleContactChange}
                                    >
                                        <option value="">Choose a role</option>
                                        <option value="owner">Owner</option>
                                        <option value="manager">Manager</option>
                                        <option value="representative">Representative</option>
                                    </select>
                                    {formErrors['contactPerson.role'] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors['contactPerson.role']}</p>
                                    )}
                                </div>
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
                                    name="eventPreference"
                                    className={`w-full p-3 bg-[#1A1B23] rounded-lg border ${formErrors.eventPreference ? 'border-red-500' : 'border-gray-600'
                                        } focus:border-purple-500 focus:outline-none`}
                                    value={formData.eventPreference}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Choose event</option>
                                    <option value="music">Music Events</option>
                                    <option value="sports">Sports Events</option>
                                    <option value="cultural">Cultural Events</option>
                                    <option value="technology">Technology Events</option>
                                </select>
                                {formErrors.eventPreference && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.eventPreference}</p>
                                )}
                            </div>
                        </div>

                        {/* Expectations Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">What are your expectations</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    ['brandExposure', 'Brand Exposure'],
                                    ['sales', 'Sales'],
                                    ['increase', 'Increase'],
                                    ['empowerment', 'Empowerment']
                                ].map(([key, label]) => (
                                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name={key}
                                            checked={formData.expectations[key]}
                                            onChange={handleExpectationChange}
                                            className="w-4 h-4 text-purple-600 border-gray-600 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-gray-400">{label}</span>
                                    </label>
                                ))}
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