import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VenueOwnerRegistration = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [hasMenuItems, setHasMenuItems] = useState(false);

    const [formData, setFormData] = useState({
        venueDetails: {
            venueName: "",
            address: "",
            gstInfo: ""
        },
        images: [],
        contactInfo: {
            phone: "",
            email: "",
            website: ""
        },
        menuProducts: [
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
        venueImages: [],
        menuImages: {}
    });

    // Handle venue details changes
    const handleVenueDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            venueDetails: {
                ...prev.venueDetails,
                [name]: value
            }
        }));
        if (formErrors[`venueDetails.${name}`]) {
            setFormErrors(prev => ({ ...prev, [`venueDetails.${name}`]: "" }));
        }
    };

    // Handle contact information changes
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                [name]: value
            }
        }));
        if (formErrors[`contactInfo.${name}`]) {
            setFormErrors(prev => ({ ...prev, [`contactInfo.${name}`]: "" }));
        }
    };

    // Handle venue images upload
    const handleVenueImagesUpload = (e) => {
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
                    setPreviews(prev => ({
                        ...prev,
                        venueImages: [...prev.venueImages, reader.result]
                    }));
                };
                reader.readAsDataURL(file);
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...validFiles]
            }));
        }
    };

    // Handle menu product changes
    const handleProductChange = (productId, field, value) => {
        setFormData(prev => ({
            ...prev,
            menuProducts: prev.menuProducts.map(product =>
                product.id === productId
                    ? { ...product, [field]: value }
                    : product
            )
        }));
    };

    // Handle menu product image upload
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
                    menuImages: {
                        ...prev.menuImages,
                        [productId]: reader.result
                    }
                }));
            };
            reader.readAsDataURL(file);

            handleProductChange(productId, 'image', file);
        }
    };

    // Add new menu product
    const handleAddProduct = () => {
        setFormData(prev => ({
            ...prev,
            menuProducts: [
                ...prev.menuProducts,
                {
                    id: Date.now(),
                    name: "",
                    price: "",
                    image: null
                }
            ]
        }));
    };

    // Remove menu product
    const handleRemoveProduct = (productId) => {
        setFormData(prev => ({
            ...prev,
            menuProducts: prev.menuProducts.filter(product => product.id !== productId)
        }));
        setPreviews(prev => {
            const { [productId]: removed, ...rest } = prev.menuImages;
            return {
                ...prev,
                menuImages: rest
            };
        });
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        if (!formData.venueDetails.venueName.trim()) errors["venueDetails.venueName"] = "Venue name is required";
        if (!formData.venueDetails.address.trim()) errors["venueDetails.address"] = "Address is required";
        if (!formData.venueDetails.gstInfo.trim()) errors["venueDetails.gstInfo"] = "GST information is required";
        if (formData.images.length === 0) errors.images = "At least one venue image is required";
        if (!formData.contactInfo.phone.trim()) errors["contactInfo.phone"] = "Phone number is required";
        if (!formData.contactInfo.email.trim()) errors["contactInfo.email"] = "Email is required";

        if (hasMenuItems) {
            formData.menuProducts.forEach((product, index) => {
                if (!product.name.trim()) errors[`product${index}Name`] = "Product name is required";
                if (!product.price.trim()) errors[`product${index}Price`] = "Price is required";
                if (!product.image) errors[`product${index}Image`] = "Product image is required";
            });
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

            // Append venue details
            Object.entries(formData.venueDetails).forEach(([key, value]) => {
                formDataToSend.append(`venueDetails[${key}]`, value);
            });

            // Append venue images
            formData.images.forEach((image, index) => {
                formDataToSend.append(`images[${index}]`, image);
            });

            // Append contact information
            Object.entries(formData.contactInfo).forEach(([key, value]) => {
                formDataToSend.append(`contactInfo[${key}]`, value);
            });

            // Append menu products if exists
            if (hasMenuItems) {
                formData.menuProducts.forEach((product, index) => {
                    formDataToSend.append(`menuProducts[${index}][name]`, product.name);
                    formDataToSend.append(`menuProducts[${index}][price]`, product.price);
                    formDataToSend.append(`menuProducts[${index}][image]`, product.image);
                });
            }

            // Here you'll add your API call
            // const response = await axios.post('/api/venue/register', formDataToSend);

            toast.success("Registration successful!");
            navigate('/login');
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
                    Register as Venue Owner
                </button>

                {/* Add blur container around the form */}
                <div className="backdrop-blur-md bg-[#1E1E2E]/70 rounded-lg p-8 shadow-xl border border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Venue Details Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Venue details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Venue name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="venueName"
                                        placeholder="Enter your business name"
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["venueDetails.venueName"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.venueDetails.venueName}
                                        onChange={handleVenueDetailsChange}
                                    />
                                    {formErrors["venueDetails.venueName"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["venueDetails.venueName"]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Address/Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Enter address here"
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["venueDetails.address"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.venueDetails.address}
                                        onChange={handleVenueDetailsChange}
                                    />
                                    {formErrors["venueDetails.address"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["venueDetails.address"]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        GST Information <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="gstInfo"
                                        placeholder="Tax information here"
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["venueDetails.gstInfo"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.venueDetails.gstInfo}
                                        onChange={handleVenueDetailsChange}
                                    />
                                    {formErrors["venueDetails.gstInfo"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["venueDetails.gstInfo"]}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Upload Images Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Upload images</h2>
                            <p className="text-sm text-gray-400">Upload images Showcasing your event venue</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previews.venueImages.map((preview, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img
                                            src={preview}
                                            alt={`Venue preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                ))}

                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleVenueImagesUpload}
                                    />
                                    <img src="/Images/img-upload.svg" alt="upload" className="w-12 h-12 mb-2" />
                                </label>
                            </div>
                            {formErrors.images && (
                                <p className="text-red-500 text-sm">{formErrors.images}</p>
                            )}
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Contact phone number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter phone number here"
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["contactInfo.phone"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.contactInfo.phone}
                                        onChange={handleContactChange}
                                    />
                                    {formErrors["contactInfo.phone"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["contactInfo.phone"]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email here"
                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors["contactInfo.email"] ? 'border-red-500' : 'border-gray-600'
                                            } focus:border-purple-500 focus:outline-none`}
                                        value={formData.contactInfo.email}
                                        onChange={handleContactChange}
                                    />
                                    {formErrors["contactInfo.email"] && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors["contactInfo.email"]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Website (optional)
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        placeholder="Enter website here"
                                        className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                        value={formData.contactInfo.website}
                                        onChange={handleContactChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Menu Products Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasMenu"
                                    checked={hasMenuItems}
                                    onChange={(e) => setHasMenuItems(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 border-gray-600 rounded focus:ring-purple-500"
                                />
                                <label htmlFor="hasMenu" className="text-sm text-gray-400">
                                    I have menu items to display
                                </label>
                            </div>

                            {hasMenuItems && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold">Upload your menu product</h2>
                                    {formData.menuProducts.map((product, index) => (
                                        <div key={product.id} className="relative space-y-4 p-4 border border-gray-700 rounded-lg bg-[#1A1B23]/80">
                                            {formData.menuProducts.length > 1 && (
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
                                                        placeholder="Choose event"
                                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors[`product${index}Name`] ? 'border-red-500' : 'border-gray-600'
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
                                                        placeholder="Choose event"
                                                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${formErrors[`product${index}Price`] ? 'border-red-500' : 'border-gray-600'
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
                                                        } rounded-lg bg-[#1A1B23]/80 cursor-pointer hover:border-purple-500`}>
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
                                                            {previews.menuImages[product.id] ? (
                                                                <img
                                                                    src={previews.menuImages[product.id]}
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

export default VenueOwnerRegistration; 