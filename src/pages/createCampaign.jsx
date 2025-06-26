import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/configs/axiosConfig';
import { toast } from 'react-toastify';
import FileUpload from '@/assets/svgs/FileUpload';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event: '',
    goal: '',
    startDate: '',
    endDate: '',
    category: '',
    rewards: [
      {
        name: '',
        description: '',
        minimumDonation: ''
      }
    ]
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const { data } = await axiosInstance.get('/events');
      if (data.success) {
        setEvents(data.data);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setEventsLoading(false);
    }
  };

  // Helper function to format location object
  const formatLocation = (location) => {
    if (!location) return '';
    if (typeof location === 'string') return location;
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    
    return parts.length > 0 ? parts.join(', ') : 'Location details available';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRewardChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards.map((reward, i) => 
        i === index ? { ...reward, [field]: value } : reward
      )
    }));
  };

  const addReward = () => {
    setFormData(prev => ({
      ...prev,
      rewards: [
        ...prev.rewards,
        {
          name: '',
          description: '',
          minimumDonation: ''
        }
      ]
    }));
  };

  const removeReward = (index) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('event', formData.event);
      formDataToSend.append('goal', Number(formData.goal));
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('rewards', JSON.stringify(formData.rewards.map(reward => ({
        name: reward.name,
        description: reward.description,
        minimumDonation: Number(reward.minimumDonation)
      }))));
      
      if (selectedFile) {
        formDataToSend.append('banner', selectedFile);
      }

      const { data } = await axiosInstance.post('/crowdfunding', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.campaign) {
        toast.success('Campaign created successfully');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0E0F13] min-h-screen flex flex-col items-center md:p-16 p-2 text-white font-sen">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8">Create a New Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-[#96A1AE] rounded-lg h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-[#20222A] transition-colors relative overflow-hidden">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
              accept="image/*"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Campaign banner"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                    <p className="text-white text-sm">Click to change image</p>
                  </div>
                </div>
              ) : (
                <>
                  <FileUpload />
                  <p className="text-[#96A1AE] text-lg font-sen mt-2">
                    Drag and drop your banner image here
                  </p>
                  <p className="text-[#2FE2AF] mt-2 underline font-sen">
                    or browse for image
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Campaign Details */}
          <div className="bg-[#1A1C23] p-8 rounded-xl border border-[#2D2F36] space-y-6">
            <h2 className="text-white text-2xl font-semibold">Campaign Details</h2>

            <div>
              <label className="block text-sm text-white mb-2">Campaign Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter campaign title"
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
                placeholder="Describe your campaign"
                className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF] h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Select Event *</label>
              <select
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                required
                disabled={eventsLoading}
              >
                <option value="">
                  {eventsLoading ? 'Loading events...' : 'Select an event'}
                </option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {formData.event && (
                <div className="mt-2 p-3 bg-[#2A2D35] rounded-lg border border-[#3A3D45]">
                  {(() => {
                    const selectedEvent = events.find(event => event.id === formData.event);
                    if (!selectedEvent) return null;
                    
                    return (
                      <div className="text-sm text-[#96A1AE]">
                        <p className="font-semibold text-white">{selectedEvent.title || 'Event Title'}</p>
                        <p className="truncate">{selectedEvent.description || 'No description available'}</p>
                        <p className="mt-1">
                          <span className="text-[#2FE2AF]">Date:</span> {
                            selectedEvent.startDate && selectedEvent.endDate 
                              ? `${new Date(selectedEvent.startDate).toLocaleDateString()} - ${new Date(selectedEvent.endDate).toLocaleDateString()}`
                              : 'Date not available'
                          }
                        </p>
                        {selectedEvent.location && (
                          <p>
                            <span className="text-[#2FE2AF]">Location:</span> {formatLocation(selectedEvent.location)}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                required
              >
                <option value="">Select a category</option>
                <option value="charity">Charity</option>
                <option value="creative">Creative</option>
                <option value="emergency">Emergency</option>
                <option value="community">Community</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Funding Goal ($) *</label>
              <input
                type="number"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="Enter funding goal"
                className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white mb-2">Start Date *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                  required
                />
              </div>
            </div>

            {/* Rewards Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-lg font-semibold">Rewards</h3>
                <button
                  type="button"
                  onClick={addReward}
                  className="text-[#2FE2AF] hover:text-[#24C89D]"
                >
                  + Add Reward
                </button>
              </div>

              {formData.rewards.map((reward, index) => (
                <div key={index} className="bg-[#1F1F1F] p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-semibold">Reward {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeReward(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-white mb-2">Reward Name *</label>
                    <input
                      type="text"
                      value={reward.name}
                      onChange={(e) => handleRewardChange(index, 'name', e.target.value)}
                      placeholder="Enter reward name"
                      className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white mb-2">Description *</label>
                    <textarea
                      value={reward.description}
                      onChange={(e) => handleRewardChange(index, 'description', e.target.value)}
                      placeholder="Describe the reward"
                      className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white mb-2">Minimum Donation ($) *</label>
                    <input
                      type="number"
                      value={reward.minimumDonation}
                      onChange={(e) => handleRewardChange(index, 'minimumDonation', e.target.value)}
                      placeholder="Enter minimum donation amount"
                      className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2FE2AF] text-[#0F172A] px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#24C89D] transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
