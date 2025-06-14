import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/configs/axiosConfig';
import { toast } from 'react-toastify';
import FileUpload from '@/assets/svgs/FileUpload';
import axios from 'axios';

const CreateVenue = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: 'Demo Venue',
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: 'demo',
      gpsCoordinates: {
        latitude: '37.774929',
        longitude: '-122.419416'
      }
    },
    capacity: '50',
    amenities: [],
    description: 'This is a demo venue description',
    contactInformation: {
      email: 'demo@gmail.com',
      phone: '0123456789',
      website: 'https://demo.com'
    }
  });

  const commonAmenities = [
    'Parking',
    'WiFi',
    'Catering',
    'Bar',
    'Stage',
    'Sound System',
    'Projector',
    'Air Conditioning',
    'Wheelchair Access',
    'Restrooms',
    'Dressing Rooms',
    'Kitchen',
    'Outdoor Space',
    'Security'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else if (name.startsWith('contactInformation.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInformation: {
          ...prev.contactInformation,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Check if adding these files would exceed the limit (let's say 5 images max)
    if (selectedFiles.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    const validFiles = files.filter(file => {
      // Check file type (only allow images)
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      // Create preview URLs for new files
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]); // Clean up the object URL
      return newUrls.filter((_, i) => i !== index);
    });
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', JSON.stringify(formData.location));
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('contactInformation', JSON.stringify(formData.contactInformation));
      
      // Append all selected files
      selectedFiles.forEach((file, index) => {
        formDataToSend.append('venueImages', file);
      });

      const { data } = await axiosInstance.post('/venues', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (data.venue) {
        toast.success('Venue created successfully');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to create venue');
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      toast.error(error.response?.data?.message || 'Failed to create venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0E0F13] min-h-screen flex flex-col items-center md:p-16 p-2 text-white font-sen">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8">Create a New Venue</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#96A1AE] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#20222A] transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                accept="image/*"
                multiple
              />
              <label htmlFor="fileInput" className="cursor-pointer text-center">
                <FileUpload />
                <p className="text-[#96A1AE] text-lg font-sen mt-2">
                  Drag and drop your images here to upload
                </p>
                <p className="text-[#2FE2AF] mt-2 underline font-sen">
                  or browse for images
                </p>
                <p className="text-[#96A1AE] text-sm mt-2">
                  (Maximum 5 images, 5MB each)
                </p>
              </label>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Venue preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Venue Details */}
          <div className="bg-[#1A1C23] p-8 rounded-xl border border-[#2D2F36] space-y-6">
            <h2 className="text-white text-2xl font-semibold">Venue Details</h2>

            <div>
              <label className="block text-sm text-white mb-2">Venue Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter venue name"
                className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Capacity *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Enter venue capacity"
                className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your venue"
                className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF] h-32"
                required
              />
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
                <input
                  type="text"
                  name="location.postalCode"
                  value={formData.location.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {commonAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="form-checkbox h-5 w-5 text-[#2FE2AF] rounded border-[#2D2F36] bg-[#1F1F1F] focus:ring-[#2FE2AF]"
                    />
                    <span className="text-white">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="contactInformation.email"
                  value={formData.contactInformation.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
                <input
                  type="tel"
                  name="contactInformation.phone"
                  value={formData.contactInformation.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
                <input
                  type="url"
                  name="contactInformation.website"
                  value={formData.contactInformation.website}
                  onChange={handleChange}
                  placeholder="Website"
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2FE2AF] text-[#0F172A] px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#24C89D] transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Venue'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVenue;
