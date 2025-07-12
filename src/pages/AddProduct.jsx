import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MainAppContext } from "@/context/MainContext";
import axiosInstance from "@/configs/axiosConfig";
import { IoCloudUploadOutline } from "react-icons/io5";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useContext(MainAppContext);
  const [loading, setLoading] = useState(false);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    productImage: null,
    relatedEvent: ""
  });
  const [events, setEvents] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData(prev => ({
        ...prev,
        productImage: file
      }));
    }
  };

  // Fetch user's events for product linking
  const fetchUserEvents = async () => {
    if (!user) return;
    
    setFetchingEvents(true);
    try {
      const response = await axiosInstance.get('/profiles/me');
      if (response.data && response.data.success) {
        const userEvents = response.data.data.events || [];
        setEvents(userEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setFetchingEvents(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'sponsor') {
      toast.error('Only sponsors can create products');
      return;
    }

    if (!productData.name || !productData.price || !productData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock || 0);
      formData.append('category', productData.category || 'General');

      // Add related event if selected
      if (productData.relatedEvent) {
        formData.append('relatedEvent', productData.relatedEvent);
      }

      // Add product image
      if (productData.productImage) {
        formData.append('productImage', productData.productImage);
      }

      const response = await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.message === 'Product created successfully') {
        toast.success('Product created successfully!');
        navigate('/profile');
      } else {
        toast.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchUserEvents();
  }, [user]);

  if (!user || user.role !== 'sponsor') {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Access Denied</div>
          <div className="text-gray-400 mb-4">Only sponsors can create products</div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-[#00FFB2] text-black px-6 py-2 rounded-lg hover:bg-[#00FFB2]/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#231D30] rounded-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-medium">Create New Product</h1>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none resize-none"
                placeholder="Describe your product..."
                required
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Category
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Automotive">Automotive</option>
                <option value="Health">Health</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Related Event */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Link to Event (Optional)
              </label>
              <select
                name="relatedEvent"
                value={productData.relatedEvent}
                onChange={handleInputChange}
                className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                disabled={fetchingEvents}
              >
                <option value="">No event linked</option>
                {fetchingEvents ? (
                  <option value="" disabled>Loading events...</option>
                ) : (
                  events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title || event.name} - {new Date(event.startDate || event.date).toLocaleDateString()}
                    </option>
                  ))
                )}
              </select>
              <p className="text-gray-500 text-xs mt-1">
                Link this product to an event you created or sponsor
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Product Image
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#00FFB2] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <IoCloudUploadOutline className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">
                    Click to upload image or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>
              
              {/* Image Preview */}
              {productData.productImage && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">
                    Selected Image:
                  </p>
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(productData.productImage)}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProductData(prev => ({
                          ...prev,
                          productImage: null
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 bg-transparent border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#00FFB2] text-black px-6 py-3 rounded-lg hover:bg-[#00FFB2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 