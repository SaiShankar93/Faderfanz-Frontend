import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

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
        website: '',
        company: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: '',
        pincode: '',
        profileImage: null
    });

    const [emailData, setEmailData] = useState({
        currentEmail: 'andreagomes@example.com',
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
            // TODO: Replace with actual API call
            // const response = await api.get(`/users/${userId}`);
            // setProfileData(response.data);

            // Simulated data
            setProfileData({
                firstName: '',
                lastName: '',
                website: '',
                company: '',
                phoneNumber: '',
                address: '',
                city: '',
                country: '',
                pincode: ''
            });
        } catch (error) {
            toast.error('Failed to fetch user data');
        } finally {
            setIsLoading(false);
        }
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
            // TODO: Replace with actual API call
            // const formData = new FormData();
            // Object.keys(profileData).forEach(key => formData.append(key, profileData[key]));
            // await api.put('/users/profile', formData);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        if (emailData.newEmail !== emailData.confirmEmail) {
            toast.error('New emails do not match');
            return;
        }
        try {
            setIsLoading(true);
            // TODO: Replace with actual API call
            // await api.put('/users/email', emailData);
            toast.success('Email updated successfully');
        } catch (error) {
            toast.error('Failed to update email');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        try {
            setIsLoading(true);
            // TODO: Replace with actual API call
            // await api.put('/users/password', passwordData);
            toast.success('Password updated successfully');
        } catch (error) {
            toast.error('Failed to update password');
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
                                                src={previewImage || "/Images/default-avatar.jpg"}
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
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">First Name:</label>
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                            placeholder="Enter first name"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Last Name:</label>
                                        <input
                                            type="text"
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                            placeholder="Enter last name"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Website:</label>
                                        <input
                                            type="url"
                                            value={profileData.website}
                                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                            placeholder="Enter website"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Company:</label>
                                        <input
                                            type="text"
                                            value={profileData.company}
                                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
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
                                            value={profileData.phoneNumber}
                                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                            placeholder="Enter phone number"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Address:</label>
                                        <input
                                            type="text"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            placeholder="Enter Address"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Town/City:</label>
                                        <input
                                            type="text"
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                            placeholder="Enter Town/City"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Country:</label>
                                        <input
                                            type="text"
                                            value={profileData.country}
                                            onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                            placeholder="Enter Country"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Pincode:</label>
                                        <input
                                            type="text"
                                            value={profileData.pincode}
                                            onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                                            placeholder="Enter Pincode"
                                            className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                        />
                                    </div>
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
                        <div className="space-y-6">
                            <h2 className="text-white/90 text-xl font-medium">Change Email</h2>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-white/60 text-sm mb-2">Current Email:</p>
                                    <p className="text-white/90">{emailData.currentEmail}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-2">New Email:</p>
                                    <input
                                        type="email"
                                        value={emailData.newEmail}
                                        onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                                        placeholder="Enter new email"
                                        className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-2">Confirm Email:</p>
                                    <input
                                        type="email"
                                        value={emailData.confirmEmail}
                                        onChange={(e) => setEmailData({ ...emailData, confirmEmail: e.target.value })}
                                        placeholder="Enter again"
                                        className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleEmailUpdate}
                                    disabled={isLoading}
                                    className="bg-[#00FFB2] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#00FFB2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save New Email
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="space-y-6">
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
                                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">New Password:</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                placeholder="Enter new password"
                                                className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Confirm Password:</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                placeholder="Confirm new password"
                                                className="w-full bg-[#1E1B33] text-white/90 rounded-lg px-4 py-3 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-4 mt-8">
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordForm(false)}
                                            className="px-8 py-3 rounded-lg font-medium border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-[#00FFB2] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#00FFB2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Save Password
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings; 