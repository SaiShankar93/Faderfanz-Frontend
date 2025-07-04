import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../configs/axiosConfig";

const VendorRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [equipmentInventory, setEquipmentInventory] = useState([
    {
      name: "",
      category: "",
      brand: "",
      quantity_available: "",
      unit_price: "",
      rental_type: "Daily",
      description: ""
    }
  ]);

  const [formData, setFormData] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone_number: "",
    password: "",
    gst_number: "",
    alternate_contact: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India"
    },
    gps_location: {
      lat: "",
      lng: ""
    },
    services_offered: [],
    pricing_model: "Daily",
    available_regions: [],
    bio_description: "",
    terms_accepted: false
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [equipmentImages, setEquipmentImages] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [equipmentPreviews, setEquipmentPreviews] = useState([]);
  const MEDIA_MAX = 10;
  const EQUIP_MAX = 20;

  const serviceOptions = [
    "Sound Equipment",
    "Lighting Equipment", 
    "Stage Setup",
    "Audio Visual",
    "Catering",
    "Decoration",
    "Photography",
    "Videography",
    "Security",
    "Transportation"
  ];

  const regionOptions = [
    "Mumbai", "Pune", "Delhi", "Bangalore", "Chennai", "Hyderabad", 
    "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Indore"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
    if (formErrors[`address.${name}`]) {
      setFormErrors(prev => ({ ...prev, [`address.${name}`]: "" }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      gps_location: {
        ...prev.gps_location,
        [name]: value
      }
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(service)
        ? prev.services_offered.filter(s => s !== service)
        : [...prev.services_offered, service]
    }));
  };

  const handleRegionToggle = (region) => {
    setFormData(prev => ({
      ...prev,
      available_regions: prev.available_regions.includes(region)
        ? prev.available_regions.filter(r => r !== region)
        : [...prev.available_regions, region]
    }));
  };

  const handleEquipmentChange = (index, field, value) => {
    const updatedEquipment = [...equipmentInventory];
    updatedEquipment[index] = {
      ...updatedEquipment[index],
      [field]: value
    };
    setEquipmentInventory(updatedEquipment);
  };

  const addEquipment = () => {
    setEquipmentInventory([
      ...equipmentInventory,
      {
        name: "",
        category: "",
        brand: "",
        quantity_available: "",
        unit_price: "",
        rental_type: "Daily",
        description: ""
      }
    ]);
  };

  const removeEquipment = (index) => {
    if (equipmentInventory.length > 1) {
      setEquipmentInventory(equipmentInventory.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'media') {
      if (mediaFiles.length + files.length > MEDIA_MAX) {
        toast.error(`You can upload up to ${MEDIA_MAX} media images.`);
        return;
      }
      setMediaFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    } else if (type === 'equipment') {
      if (equipmentImages.length + files.length > EQUIP_MAX) {
        toast.error(`You can upload up to ${EQUIP_MAX} equipment images.`);
        return;
      }
      setEquipmentImages(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEquipmentPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveMediaImage = (index) => {
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveEquipmentImage = (index) => {
    setEquipmentPreviews(prev => prev.filter((_, i) => i !== index));
    setEquipmentImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.business_name.trim()) errors.business_name = "Business name is required";
    if (!formData.owner_name.trim()) errors.owner_name = "Owner name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone_number.trim()) errors.phone_number = "Phone number is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    if (!formData.gst_number.trim()) errors.gst_number = "GST number is required";
    if (!formData.address.street.trim()) errors["address.street"] = "Street address is required";
    if (!formData.address.city.trim()) errors["address.city"] = "City is required";
    if (!formData.address.state.trim()) errors["address.state"] = "State is required";
    if (!formData.address.pincode.trim()) errors["address.pincode"] = "Pincode is required";
    if (formData.services_offered.length === 0) errors.services_offered = "At least one service must be selected";
    if (formData.available_regions.length === 0) errors.available_regions = "At least one region must be selected";
    if (!formData.bio_description.trim()) errors.bio_description = "Bio description is required";
    if (!formData.terms_accepted) errors.terms_accepted = "You must accept the terms and conditions";

    // Validate equipment inventory
    equipmentInventory.forEach((equipment, index) => {
      if (!equipment.name.trim()) errors[`equipment${index}Name`] = "Equipment name is required";
      if (!equipment.category.trim()) errors[`equipment${index}Category`] = "Category is required";
      if (!equipment.brand.trim()) errors[`equipment${index}Brand`] = "Brand is required";
      if (!equipment.quantity_available) errors[`equipment${index}Quantity`] = "Quantity is required";
      if (!equipment.unit_price) errors[`equipment${index}Price`] = "Unit price is required";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Basic information
      formDataToSend.append('business_name', formData.business_name);
      formDataToSend.append('owner_name', formData.owner_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('gst_number', formData.gst_number);
      formDataToSend.append('alternate_contact', formData.alternate_contact);
      formDataToSend.append('address', JSON.stringify(formData.address));
      formDataToSend.append('gps_location', JSON.stringify(formData.gps_location));
      formDataToSend.append('services_offered', JSON.stringify(formData.services_offered));
      formDataToSend.append('equipment_inventory', JSON.stringify(equipmentInventory));
      formDataToSend.append('pricing_model', formData.pricing_model);
      formDataToSend.append('available_regions', JSON.stringify(formData.available_regions));
      formDataToSend.append('bio_description', formData.bio_description);
      formDataToSend.append('terms_accepted', formData.terms_accepted);

      // Media files
      mediaFiles.forEach(file => {
        formDataToSend.append('mediaFiles', file);
      });

      equipmentImages.forEach(file => {
        formDataToSend.append('equipmentImages', file);
      });

      const response = await axiosInstance.post("/auth/register/vendor", formDataToSend);

      if (response.data.vendor) {
        toast.success("Registration successful!");
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.vendor));
        navigate("/suggestions");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
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

      <div className="max-w-6xl mx-auto font-sen relative z-10">
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
          Register as Vendor
        </button>

        {/* Add blur container around the form */}
        <div className="backdrop-blur-md bg-[#1E1E2E]/70 rounded-lg p-8 shadow-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    placeholder="Enter your business name"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors.business_name ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.business_name}
                    onChange={handleInputChange}
                  />
                  {formErrors.business_name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.business_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="owner_name"
                    placeholder="Enter owner name"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors.owner_name ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.owner_name}
                    onChange={handleInputChange}
                  />
                  {formErrors.owner_name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.owner_name}</p>
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
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors.email ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="+91-9876543210"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors.phone_number ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                  {formErrors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      className={`w-full p-3 pr-12 bg-[#1A1B23]/80 rounded-lg border ${
                        formErrors.password ? "border-red-500" : "border-gray-600"
                      } focus:border-purple-500 focus:outline-none`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    GST Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gst_number"
                    placeholder="22AAAAA0000A1Z5"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors.gst_number ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.gst_number}
                    onChange={handleInputChange}
                  />
                  {formErrors.gst_number && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.gst_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Alternate Contact
                  </label>
                  <input
                    type="tel"
                    name="alternate_contact"
                    placeholder="+91-9876543211"
                    className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    value={formData.alternate_contact}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Address Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    placeholder="123 Main Street"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors["address.street"] ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.address.street}
                    onChange={handleAddressChange}
                  />
                  {formErrors["address.street"] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors["address.street"]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors["address.city"] ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.address.city}
                    onChange={handleAddressChange}
                  />
                  {formErrors["address.city"] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors["address.city"]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Maharashtra"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors["address.state"] ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.address.state}
                    onChange={handleAddressChange}
                  />
                  {formErrors["address.state"] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors["address.state"]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="400001"
                    className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                      formErrors["address.pincode"] ? "border-red-500" : "border-gray-600"
                    } focus:border-purple-500 focus:outline-none`}
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                  />
                  {formErrors["address.pincode"] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors["address.pincode"]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="India"
                    className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            </div>

            {/* GPS Location Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">GPS Location (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    placeholder="19.076"
                    className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    value={formData.gps_location.lat}
                    onChange={handleLocationChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    placeholder="72.8777"
                    className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    value={formData.gps_location.lng}
                    onChange={handleLocationChange}
                  />
                </div>
              </div>
            </div>

            {/* Services Offered Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Services Offered <span className="text-red-500">*</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services_offered.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="w-4 h-4 text-purple-600 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
              {formErrors.services_offered && (
                <p className="text-red-500 text-sm mt-1">{formErrors.services_offered}</p>
              )}
            </div>

            {/* Available Regions Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Available Regions <span className="text-red-500">*</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {regionOptions.map((region) => (
                  <label key={region} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available_regions.includes(region)}
                      onChange={() => handleRegionToggle(region)}
                      className="w-4 h-4 text-purple-600 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">{region}</span>
                  </label>
                ))}
              </div>
              {formErrors.available_regions && (
                <p className="text-red-500 text-sm mt-1">{formErrors.available_regions}</p>
              )}
            </div>

            {/* Pricing Model Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Pricing Model</h2>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Default Pricing Model
                </label>
                <select
                  name="pricing_model"
                  className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  value={formData.pricing_model}
                  onChange={handleInputChange}
                >
                  <option value="Daily">Daily</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Bio Description Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Bio Description <span className="text-red-500">*</span></h2>
              <div>
                <textarea
                  name="bio_description"
                  placeholder="Describe your business, services, and what makes you unique..."
                  rows="4"
                  className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                    formErrors.bio_description ? "border-red-500" : "border-gray-600"
                  } focus:border-purple-500 focus:outline-none`}
                  value={formData.bio_description}
                  onChange={handleInputChange}
                />
                {formErrors.bio_description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.bio_description}</p>
                )}
              </div>
            </div>

            {/* Equipment Inventory Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Equipment Inventory</h2>
              {equipmentInventory.map((equipment, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Equipment {index + 1}</h3>
                    {equipmentInventory.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEquipment(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Equipment Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Professional Speakers"
                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                          formErrors[`equipment${index}Name`] ? "border-red-500" : "border-gray-600"
                        } focus:border-purple-500 focus:outline-none`}
                        value={equipment.name}
                        onChange={(e) => handleEquipmentChange(index, "name", e.target.value)}
                      />
                      {formErrors[`equipment${index}Name`] && (
                        <p className="text-red-500 text-sm mt-1">{formErrors[`equipment${index}Name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Sound"
                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                          formErrors[`equipment${index}Category`] ? "border-red-500" : "border-gray-600"
                        } focus:border-purple-500 focus:outline-none`}
                        value={equipment.category}
                        onChange={(e) => handleEquipmentChange(index, "category", e.target.value)}
                      />
                      {formErrors[`equipment${index}Category`] && (
                        <p className="text-red-500 text-sm mt-1">{formErrors[`equipment${index}Category`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Brand <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="JBL"
                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                          formErrors[`equipment${index}Brand`] ? "border-red-500" : "border-gray-600"
                        } focus:border-purple-500 focus:outline-none`}
                        value={equipment.brand}
                        onChange={(e) => handleEquipmentChange(index, "brand", e.target.value)}
                      />
                      {formErrors[`equipment${index}Brand`] && (
                        <p className="text-red-500 text-sm mt-1">{formErrors[`equipment${index}Brand`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Quantity Available <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                          formErrors[`equipment${index}Quantity`] ? "border-red-500" : "border-gray-600"
                        } focus:border-purple-500 focus:outline-none`}
                        value={equipment.quantity_available}
                        onChange={(e) => handleEquipmentChange(index, "quantity_available", e.target.value)}
                      />
                      {formErrors[`equipment${index}Quantity`] && (
                        <p className="text-red-500 text-sm mt-1">{formErrors[`equipment${index}Quantity`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Unit Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="5000"
                        className={`w-full p-3 bg-[#1A1B23]/80 rounded-lg border ${
                          formErrors[`equipment${index}Price`] ? "border-red-500" : "border-gray-600"
                        } focus:border-purple-500 focus:outline-none`}
                        value={equipment.unit_price}
                        onChange={(e) => handleEquipmentChange(index, "unit_price", e.target.value)}
                      />
                      {formErrors[`equipment${index}Price`] && (
                        <p className="text-red-500 text-sm mt-1">{formErrors[`equipment${index}Price`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Rental Type
                      </label>
                      <select
                        className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                        value={equipment.rental_type}
                        onChange={(e) => handleEquipmentChange(index, "rental_type", e.target.value)}
                      >
                        <option value="Daily">Daily</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="High-quality professional speakers"
                        rows="2"
                        className="w-full p-3 bg-[#1A1B23]/80 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                        value={equipment.description}
                        onChange={(e) => handleEquipmentChange(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addEquipment}
                className="text-[#00FFB3] hover:text-[#00FFB3]/80 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Equipment
              </button>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Media Upload</h2>
              <div className="flex gap-4 mb-2">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square w-40 h-40 group self-start">
                    <img
                      src={preview}
                      alt={`Business Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMediaImage(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {mediaPreviews.length < MEDIA_MAX && (
                  <label className="aspect-square w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-all duration-200 hover:bg-gray-800/20 self-start">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, 'media')}
                    />
                    <img src="/Images/img-upload.svg" alt="upload" className="w-16 h-16 mb-2" />
                    <span className="text-xs text-[#00FFB3]">Upload Images</span>
                    <span className="text-xs text-gray-400 mt-1">(Max 5MB each, {MEDIA_MAX} max)</span>
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload images of your business, equipment, or previous work</p>
            </div>

            {/* Equipment Images Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Equipment Images</h2>
              <div className="flex  gap-4 mb-2">
                {equipmentPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square w-40 h-40 group self-start">
                    <img
                      src={preview}
                      alt={`Equipment Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipmentImage(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {equipmentPreviews.length < EQUIP_MAX && (
                  <label className="aspect-square w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-all duration-200 hover:bg-gray-800/20 self-start">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, 'equipment')}
                    />
                    <img src="/Images/img-upload.svg" alt="upload" className="w-16 h-16 mb-2" />
                    <span className="text-xs text-[#00FFB3]">Upload Images</span>
                    <span className="text-xs text-gray-400 mt-1">(Max 5MB each, {EQUIP_MAX} max)</span>
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload images of your equipment inventory</p>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms_accepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, terms_accepted: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-gray-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I accept the terms and conditions <span className="text-red-500">*</span>
                </label>
              </div>
              {formErrors.terms_accepted && (
                <p className="text-red-500 text-sm">{formErrors.terms_accepted}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-32 px-6 py-3 bg-[#00FFB3] text-black font-medium rounded-lg 
                ${isSubmitting
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

export default VendorRegistration; 