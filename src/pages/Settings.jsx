import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/configs/axiosConfig'; // Import your axios instance

const Settings = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    const [activeTab, setActiveTab] = useState('account_info');
    const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    // Form states
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        website: '',
        company: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: '',
        pincode: '',
        profileImage: null,
        stageName: '',
        businessName: '',
        venueName: '',
        role: '',
        location: {
            address: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            landmark: '',
            coordinates: {
                latitude: '',
                longitude: '',
            },
        },
    });

    const [emailData, setEmailData] = useState({
        currentEmail: '',
        newEmail: '',
        confirmEmail: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // File upload state
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch user data
        fetchUserData(user.id);
    }, [navigate]);

    const fetchUserData = async (userId) => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/profiles/me');
            if (data.success) {
                const userProfile = data.data.profile;
                setProfileData({
                    firstName: userProfile.firstName || '',
                    lastName: userProfile.lastName || '',
                    bio: userProfile.bio || '',
                    website: userProfile.website || '',
                    company: userProfile.company || '',
                    phoneNumber: userProfile.phoneNumber || '',
                    address: userProfile.address || '',
                    city: userProfile.city || '',
                    country: userProfile.country || '',
                    pincode: userProfile.pincode || '',
                    stageName: userProfile.stageName || '',
                    businessName: userProfile.businessName || '',
                    venueName: userProfile.venueName || '',
                    role: userProfile.role || '',
                    location: userProfile.location || {
                        address: '',
                        city: '',
                        state: '',
                        country: '',
                        postalCode: '',
                        landmark: '',
                        coordinates: {
                            latitude: '',
                            longitude: '',
                        },
                    },
                });
                setEmailData(prev => ({ ...prev, currentEmail: userProfile.email }));
                setPreviewImage(userProfile.profileImage || userProfile.image);
            } else {
                toast.error('Could not fetch profile data.');
            }
        } catch (error) {
            toast.error('Failed to fetch user data. Please login again.');
            console.error("Fetch user data error:", error);
            // navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData({ ...profileData, profileImage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const formData = new FormData();
            // Append all fields to formData, including the image if it's a file
            Object.keys(profileData).forEach(key => {
                if (key === 'profileImage' && profileData[key] instanceof File) {
                    formData.append(key, profileData[key]);
                } else if (key !== 'profileImage') {
                    formData.append(key, profileData[key]);
                }
            });

            await axiosInstance.put('/profiles/me/details', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailInputChange = (e) => {
        const { name, value } = e.target;
        setEmailData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        if (emailData.newEmail !== emailData.confirmEmail) {
            toast.error('New emails do not match');
            return;
        }
        try {
            setIsLoading(true);
            // Use the current email from profileData or emailData
            const oldEmail = emailData.currentEmail || profileData.email;
            const newEmail = emailData.newEmail;
            await axiosInstance.put('/auth/change-email', { oldEmail, newEmail });
            toast.success('Email updated successfully. Please verify your new email.');
            setEmailData(prev => ({ ...prev, currentEmail: newEmail, newEmail: '', confirmEmail: '' }));
            // Optionally, refetch user data to update UI
            fetchUserData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update email');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        try {
            setIsLoading(true);
            await axiosInstance.put('/auth/change-password', {
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'account_info', label: 'Account Info' },
        { id: 'change_email', label: 'Change Email' },
        { id: 'password', label: 'Password' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E1B33] to-[#2B1D44] p-4 md:p-6 font-sen">
            {/* Header */}
            <div className="max-w-[1400px] mx-auto mb-6 flex justify-between items-center">
                <h1 className="text-white/90 text-2xl font-medium">Account Settings</h1>
                <div className="relative">
                    <button
                        onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2B1D44]/50 text-white/60"
                    >
                        <span className="text-sm">{selectedLocation}</span>
                        <IoChevronDown className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isLocationDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#2B1D44] rounded-lg shadow-lg py-2 z-10">
                            {['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'].map((location) => (
                                <button
                                    key={location}
                                    onClick={() => {
                                        setSelectedLocation(location);
                                        setIsLocationDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-white/60 hover:bg-[#1E1B33]/50"
                                >
                                    {location}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                {/* Left Sidebar */}
                <div className="space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (tab.id === 'password') {
                                    setShowPasswordForm(false);
                                }
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-[#00FFB2] text-black font-medium'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="bg-[#2B1D44]/50 backdrop-blur-sm rounded-lg p-6">
                    {activeTab === 'account_info' && (
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <h2 className="text-white/90 text-xl font-medium">Account Information</h2>

                            {/* Profile Photo */}
                            <div className="space-y-4">
                                <h3 className="text-white/80 text-lg">Profile Photo</h3>
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-[#1E1B33] overflow-hidden">
                                            <img
                                                src={previewImage ? (previewImage.startsWith('blob:') ? previewImage : `${import.meta.env.VITE_SERVER_URL}/${previewImage}`) : "/Images/default-avatar.jpg"}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-[#00FFB2] p-2 rounded-full cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProfileImageChange}
                                                className="hidden"
                                            />
                                            <img
                                                src="/icons/camera.svg"
                                                alt="Change photo"
                                                className="w-4 h-4"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Information */}
                            <div className="space-y-4">
                                <h3 className="text-white/80 text-lg">Profile Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {profileData.role === 'sponsor' ? (
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Business Name:</label>
                                            <input
                                                type="text"
                                                name="businessName"
                                                value={profileData.businessName}
                                                onChange={handleProfileInputChange}
                                                placeholder="Enter business name"
                                                className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">First Name:</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={profileData.firstName}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter first name"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Last Name:</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={profileData.lastName}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter last name"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Website:</label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={profileData.website}
                                            onChange={handleProfileInputChange}
                                            placeholder="Enter website"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Company:</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={profileData.company}
                                            onChange={handleProfileInputChange}
                                            placeholder="Enter company name"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-4">
                                <h3 className="text-white/80 text-lg">Contact Details</h3>
                                <p className="text-white/40 text-sm">These details are private and only used to contact you for ticketing or prizes.</p>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Phone Number:</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={profileData.phoneNumber}
                                            onChange={handleProfileInputChange}
                                            placeholder="Enter phone number"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    {profileData.role === 'sponsor' ? (
                                        <>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Address:</label>
                                                <input
                                                    type="text"
                                                    name="location.address"
                                                    value={profileData.location.address}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Address"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">City:</label>
                                                <input
                                                    type="text"
                                                    name="location.city"
                                                    value={profileData.location.city}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Town/City"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">State:</label>
                                                <input
                                                    type="text"
                                                    name="location.state"
                                                    value={profileData.location.state}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter State"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Country:</label>
                                                <input
                                                    type="text"
                                                    name="location.country"
                                                    value={profileData.location.country}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Country"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Postal Code:</label>
                                                <input
                                                    type="text"
                                                    name="location.postalCode"
                                                    value={profileData.location.postalCode}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Postal Code"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Landmark:</label>
                                                <input
                                                    type="text"
                                                    name="location.landmark"
                                                    value={profileData.location.landmark}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Landmark"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Latitude:</label>
                                                <input
                                                    type="text"
                                                    name="location.latitude"
                                                    value={profileData.location.coordinates.latitude}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Latitude"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Longitude:</label>
                                                <input
                                                    type="text"
                                                    name="location.longitude"
                                                    value={profileData.location.coordinates.longitude}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Longitude"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Address:</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={profileData.address}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Address"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Town/City:</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={profileData.city}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Town/City"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Country:</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={profileData.country}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Country"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Pincode:</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={profileData.pincode}
                                                    onChange={handleProfileInputChange}
                                                    placeholder="Enter Pincode"
                                                    className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#00FFB2] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#00FFB2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save my Profile
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'change_email' && (
                        <form onSubmit={handleEmailUpdate} className="space-y-6">
                            <h2 className="text-white/90 text-xl font-medium">Change Email</h2>
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Current Email:</label>
                                <input type="email" value={emailData.currentEmail} className="w-full bg-[#1E1B33] text-white/60 rounded-lg px-4 py-3" readOnly />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-2">New Email:</label>
                                <input type="email" name="newEmail" value={emailData.newEmail} onChange={handleEmailInputChange} placeholder="Enter new email" className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none" required />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Confirm Email:</label>
                                <input type="email" name="confirmEmail" value={emailData.confirmEmail} onChange={handleEmailInputChange} placeholder="Enter again" className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none" required />
                            </div>
                            <button type="submit" disabled={isLoading} className="bg-[#00FFB2] text-black font-medium py-3 px-6 rounded-lg">{isLoading ? 'Saving...' : 'Save New Email'}</button>
                        </form>
                    )}

                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <h2 className="text-white/90 text-xl font-medium">Set Password</h2>
                            {!showPasswordForm ? (
                                <>
                                    <p className="text-white/60">A password has not been set for your account</p>
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={() => setShowPasswordForm(true)}
                                            className="bg-[#00FFB2] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#00FFB2]/90 transition-colors"
                                        >
                                            Set Password
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Current Password:</label>
                                        <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} placeholder="Enter current password" className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">New Password:</label>
                                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} placeholder="Enter new password" className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Confirm Password:</label>
                                        <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} placeholder="Enter again" className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none" required />
                                    </div>
                                    <button type="submit" disabled={isLoading} className="bg-[#00FFB2] text-black font-medium py-3 px-6 rounded-lg">{isLoading ? 'Saving...' : 'Set Password'}</button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings; 