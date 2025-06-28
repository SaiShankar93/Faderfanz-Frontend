import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaShare, FaStar, FaRegHeart, FaRegComment, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoEyeOutline } from 'react-icons/io5';
import { BsCalendarEvent, BsNewspaper } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { RiFileList2Line, RiSettings4Line } from 'react-icons/ri';
import { MdEvent, MdPhotoLibrary } from 'react-icons/md';
import { Dialog, Menu } from '@headlessui/react';
import { CuratorCard } from "../components/CuratorCard";
import { VenueOwnerCard } from "../components/VenueOwnerCard";
import { toast } from 'react-hot-toast';
import axiosInstance from "@/configs/axiosConfig";

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Navigation and UI States
    const [activeTab, setActiveTab] = useState("recent");
    const [selectedNav, setSelectedNav] = useState("news_feed");
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

    // Core API Data States
    const [userData, setUserData] = useState(null);
    const [venues, setVenues] = useState([]);
    const [products, setProducts] = useState([]);
    const [events, setEvents] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({});

    // Additional data states
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [mediaItems, setMediaItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Loading and Error States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI Control States
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [isFileInputVisible, setIsFileInputVisible] = useState(false);
    const [isImageInputVisible, setIsImageInputVisible] = useState(false);
    const [isMapInputVisible, setIsMapInputVisible] = useState(false);
    const [postVisibility, setPostVisibility] = useState('public');
    const [selectedFavTab, setSelectedFavTab] = useState('events');
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [showAllCurators, setShowAllCurators] = useState(false);
    const [showAllSponsors, setShowAllSponsors] = useState(false);
    const [selectedEventTab, setSelectedEventTab] = useState('upcoming');
    const [showAllMyEvents, setShowAllMyEvents] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        location: '',
        date: { month: '', days: '' },
        time: '',
        isFree: false,
        image: ''
    });
    const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productEditFormData, setProductEditFormData] = useState({
        title: '',
        price: 0,
        stock: 0,
        image: '',
        description: '',
        category: ''
    });
    const [selectedUserType, setSelectedUserType] = useState('all_users');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFollowTab, setSelectedFollowTab] = useState('followers');
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showAllFollowers, setShowAllFollowers] = useState(false);
    const [followLoading, setFollowLoading] = useState({});
    const [selectedMediaTab, setSelectedMediaTab] = useState('images');
    const [showAllMedia, setShowAllMedia] = useState(false);

    // Share Post State
    const [newPost, setNewPost] = useState({
        content: '',
        files: [],
        images: [],
        location: '',
        visibility: 'public'
    });

    // Refs for file inputs
    const fileInputRef = React.useRef(null);
    const imageInputRef = React.useRef(null);

    // API call to fetch user profile data
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No authentication token found');
                navigate('/login');
                return;
            }

            // The interceptor now handles the Authorization header automatically
            const response = await axiosInstance.get('/profiles/me');

            console.log('Profile response:', response.data);

            if (response.data && response.data.success) {
                const { profile, venues: venuesData, events: eventsData, products: productsData,
                    blogPosts: blogPostsData, reviews: reviewsData, stats: statsData,
                    followers: followersData, following: followingData, favorites: favoritesData,
                    feed: feedData, sponsoredEvents: sponsoredEventsData } = response.data.data;

                setUserData(profile);
                // console.log("Profile Data Received:", profile);
                setStats(statsData || {});
                setReviews(reviewsData || []);

                // Normalize posts from the backend to have a 'content' property and full image URLs
                const normalizedPosts = (feedData || []).map(post => ({
                    ...post,
                    content: post.text, // Ensure 'content' property exists
                    images: (post.images || []).map(img =>
                        img.startsWith('http') ? img : `${import.meta.env.VITE_SERVER_URL}/${img}`
                    )
                }));
                setPosts(normalizedPosts);

                setFollowers(followersData || []);
                setFollowing(followingData || []);
                setFavorites(favoritesData || []);

                if (venuesData) setVenues(venuesData);
                if (productsData) setProducts(productsData);
                // For sponsors, use sponsoredEvents if present
                if (profile?.role === 'sponsor' && sponsoredEventsData) {
                    setEvents(sponsoredEventsData);
                } else if (eventsData) {
                    setEvents(eventsData);
                }
                if (blogPostsData) setBlogPosts(blogPostsData);

                // Set default suggestions (can be replaced with API call later)
                setSuggestions([
                    { id: 1, name: "DJ Kazi", rating: 4.8, image: "/Images/curator-img.png" },
                    { id: 2, name: "Event Pro", rating: 4.6, image: "/Images/curator-img.png" },
                    { id: 3, name: "Music Master", rating: 4.9, image: "/Images/curator-img.png" }
                ]);

                // Set default media items (can be replaced with API call later)
                setMediaItems([
                    { id: 1, type: 'image', url: '/Images/post.png', views: 1200, likes: 45 },
                    { id: 2, type: 'video', url: '/Images/post.png', thumbnail: '/Images/post.png', views: 800, likes: 32 },
                    { id: 3, type: 'image', url: '/Images/post.png', views: 950, likes: 28 }
                ]);
            } else {
                setError('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError(error.response?.data?.message || 'Failed to load profile');

            if (error.response?.status === 401) {
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Dynamic navigation items based on user role
    const getNavItems = () => {
        if (!userData) return [];

        const userStats = stats || {};

        const baseItems = [
            { id: 'news_feed', label: 'News Feed', icon: BsNewspaper },
            // { id: 'favorites', label: 'My Favourites', icon: AiOutlineHeart, count: userStats.favorites || favorites.length } // COMMENTED OUT
        ];

        if (userData.role === 'venueOwner') {
            return [
                ...baseItems,
                { id: 'venues', label: 'My Venues', icon: MdEvent, count: userStats.venues || venues.length },
                { id: 'events', label: 'My Events', icon: MdEvent, count: userStats.events || events.length },
                { id: 'followers', label: 'Followers', icon: FaShare, count: userStats.followers || followers.length },
                // { id: 'media', label: 'Media', icon: MdPhotoLibrary }, // MEDIA TAB COMMENTED OUT FOR NOW
                { id: 'settings', label: 'Settings', icon: RiSettings4Line }
            ];
        } else if (userData.role === 'sponsor') {
            return [
                ...baseItems,
                { id: 'products', label: 'My Products', icon: RiFileList2Line, count: userStats.products || products.length },
                { id: 'events', label: 'Sponsored Events', icon: MdEvent, count: userStats.events || events.length },
                { id: 'followers', label: 'Followers', icon: FaShare, count: userStats.followers || followers.length },
                // { id: 'media', label: 'Media', icon: MdPhotoLibrary }, // MEDIA TAB COMMENTED OUT FOR NOW
                { id: 'settings', label: 'Settings', icon: RiSettings4Line }
            ];
        } else if (userData.role === 'curator') {
            return [
                ...baseItems,
                { id: 'events', label: 'My Events', icon: MdEvent, count: userStats.events || events.length },
                { id: 'followers', label: 'Followers', icon: FaShare, count: userStats.followers || followers.length },
                // { id: 'media', label: 'Media', icon: MdPhotoLibrary }, // MEDIA TAB COMMENTED OUT FOR NOW
                { id: 'settings', label: 'Settings', icon: RiSettings4Line }
            ];
        } else {
            // Guest user
            return [
                ...baseItems,
                { id: 'followers', label: 'Followers', icon: FaShare, count: userStats.followers || followers.length },
                { id: 'settings', label: 'Settings', icon: RiSettings4Line }
            ];
        }
    };

    // Post Actions
    const handleLikePost = useCallback((postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                    : post
            )
        );
    }, []);

    const handleCommentPost = useCallback((postId) => {
        // Implement comment functionality
    }, []);

    // File handling functions
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewPost(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));
        setIsFileInputVisible(false);
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setNewPost(prev => ({
            ...prev,
            images: [...prev.images, ...imageUrls]
        }));
        setIsImageInputVisible(false);
    };

    const handleLocationInput = (location) => {
        setNewPost(prev => ({
            ...prev,
            location
        }));
    };

    const handleRemoveFile = (index, type) => {
        setNewPost(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handleSharePost = useCallback(async () => {
        if (!newPost.content.trim() && !newPost.images.length && !newPost.files.length) return;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to share a post');
                return;
            }

            // Create FormData for file uploads
            const formData = new FormData();
            formData.append('text', newPost.content);
            formData.append('visibility', newPost.visibility);

            if (newPost.location) {
                formData.append('location', newPost.location);
            }

            // Add images
            newPost.images.forEach((image, index) => {
                if (image instanceof File) {
                    formData.append('images', image);
                }
            });

            // Add files
            newPost.files.forEach((file, index) => {
                formData.append('files', file);
            });

            // API call to create post - interceptor handles Authorization and Content-Type
            const response = await axiosInstance.post('/profiles/posts', formData, {
                headers: {
                    // The interceptor handles Authorization, but we still need multipart/form-data here
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.success) {
                const newPostFromServer = response.data.data;

                const postForState = {
                    ...newPostFromServer,
                    content: newPostFromServer.text,
                    author: newPostFromServer.author,
                    timeAgo: "Just now",
                    views: 0,
                    likes: newPostFromServer.likes?.length || 0,
                    comments: newPostFromServer.comments?.length || 0,
                    isLiked: false,
                    images: (newPostFromServer.images || []).map(img =>
                        `${import.meta.env.VITE_SERVER_URL}/${img}`
                    ),
                    files: newPost.files,
                    location: newPost.location
                };

                setPosts(prev => [postForState, ...prev]);

                setNewPost({
                    content: '',
                    files: [],
                    images: [],
                    location: '',
                    visibility: 'public'
                });
                setIsFileInputVisible(false);
                setIsImageInputVisible(false);
                setIsMapInputVisible(false);

                toast.success('Post shared successfully!');
            }
        } catch (error) {
            console.error('Error sharing post:', error);
            toast.error(error.response?.data?.message || 'Failed to share post');
        }
    }, [newPost, userData]);

    const formatPostContent = useCallback((content) => {
        if (!content) return null; // <-- FIX: Handle posts with no text
        return content.split(' ').map((word, index) => {
            if (word.startsWith('@')) {
                return (
                    <span key={index} className="text-[#00FFB2] cursor-pointer hover:underline">
                        {word}{' '}
                    </span>
                );
            }
            return word + ' ';
        });
    }, []);

    // Image viewer functions
    const openImageViewer = (image, index) => {
        setSelectedImage(image);
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setIsImageViewerOpen(false);
        setSelectedImage(null);
        setSelectedImageIndex(0);
    };

    const navigateImage = (direction) => {
        const currentPost = posts.find(post => post.images && post.images.includes(selectedImage));
        if (!currentPost || !currentPost.images) return;

        const currentIndex = currentPost.images.indexOf(selectedImage);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % currentPost.images.length;
        } else {
            newIndex = currentIndex === 0 ? currentPost.images.length - 1 : currentIndex - 1;
        }

        setSelectedImage(currentPost.images[newIndex]);
        setSelectedImageIndex(newIndex);
    };

    // Event management functions
    const handleEditEvent = (event) => {
        setEventToEdit(event);
        setEditFormData({
            title: event.title,
            location: event.location,
            date: event.date,
            time: event.time,
            isFree: event.isFree,
            image: event.image
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateEvent = async () => {
        try {
            // API call to update event would go here
            setEvents(prev =>
                prev.map(event =>
                    event.id === eventToEdit.id
                        ? { ...event, ...editFormData }
                        : event
                )
            );
            setIsEditModalOpen(false);
            toast.success('Event updated successfully!');
        } catch (error) {
            toast.error('Failed to update event');
        }
    };

    const handleDeleteEvent = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            // API call to delete event would go here
            setEvents(prev => prev.filter(event => event.id !== eventToDelete.id));
            setIsDeleteModalOpen(false);
            toast.success('Event deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    // Product management functions
    const handleEditProduct = (product) => {
        setProductToEdit(product);
        setProductEditFormData({
            title: product.title || product.name,
            price: product.price,
            stock: product.stock,
            image: '', // Only set if a new file is selected
            description: product.description,
            category: product.category || ''
        });
        setIsProductEditModalOpen(true);
    };

    const handleUpdateProduct = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to update product');
                return;
            }

            let formData;
            let isMultipart = false;
            // If the image is a File (new upload), use FormData
            if (productEditFormData.image && productEditFormData.image instanceof File) {
                formData = new FormData();
                formData.append('name', productEditFormData.title);
                formData.append('price', productEditFormData.price);
                formData.append('stock', productEditFormData.stock);
                formData.append('description', productEditFormData.description);
                formData.append('category', productEditFormData.category);
                formData.append('productImage', productEditFormData.image);
                isMultipart = true;
            } else {
                // Otherwise, send as JSON, but do NOT send images/image field
                formData = {
                    name: productEditFormData.title,
                    price: productEditFormData.price,
                    stock: productEditFormData.stock,
                    description: productEditFormData.description,
                    category: productEditFormData.category
                };
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            if (isMultipart) {
                config.headers['Content-Type'] = 'multipart/form-data';
            }

            const productId = productToEdit._id || productToEdit.id;
            await axiosInstance.put(`/products/${productId}`, formData, config);

            setIsProductEditModalOpen(false);
            toast.success('Product updated successfully!');
            // Refresh products from backend
            fetchUserProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    // Follow functionality
    const handleFollowToggle = async (userId, currentList) => {
        setFollowLoading(prev => ({ ...prev, [userId]: true }));
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to follow/unfollow');
                return;
            }

            // Determine if we're following this user
            const isCurrentlyFollowing = following.some(user => user._id === userId || user.id === userId);
            const endpoint = isCurrentlyFollowing ? 'unfollow' : 'follow';

            // Get user role from the list
            const targetUser = (currentList === 'followers' ? followers : following)
                .find(user => user._id === userId || user.id === userId);

            if (!targetUser) {
                toast.error('User not found');
                return;
            }

            // API call for follow/unfollow - interceptor handles Authorization
            const response = await axiosInstance.post(`/profiles/${targetUser.role}/${userId}/${endpoint}`);

            if (response.data && response.data.success) {
                // Update the appropriate list
                if (currentList === 'followers') {
                    // This is a follower, so we're following them
                    if (isCurrentlyFollowing) {
                        setFollowing(prev => prev.filter(user => user._id !== userId && user.id !== userId));
                    } else {
                        setFollowing(prev => [...prev, targetUser]);
                    }
                } else {
                    // This is someone we're following
                    if (isCurrentlyFollowing) {
                        setFollowing(prev => prev.filter(user => user._id !== userId && user.id !== userId));
                    } else {
                        setFollowing(prev => [...prev, targetUser]);
                    }
                }

                toast.success(isCurrentlyFollowing ? 'Unfollowed successfully' : 'Followed successfully');
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            toast.error(error.response?.data?.message || 'Failed to update follow status');
        } finally {
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    // Filter users function
    const filterUsers = (users) => {
        return users.filter(user => {
            const matchesType = selectedUserType === 'all_users' || user.type === selectedUserType;
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesSearch;
        });
    };

    // Format date for events
    const formatEventDate = (dateString) => {
        if (!dateString) return { month: 'JAN', days: '1' };

        try {
            const date = new Date(dateString);
            const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const day = date.getDate();
            return { month, days: day.toString() };
        } catch (error) {
            return { month: 'JAN', days: '1' };
        }
    };

    // Main content renderer based on selected navigation
    const renderMainContent = () => {
        switch (selectedNav) {
            case 'news_feed':
                return (
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-white text-xl md:text-2xl font-medium">Welcome back,</h1>
                                <p className="text-gray-400 text-sm md:text-base">{userData.name}</p>
                            </div>
                            <div className="relative w-full sm:w-auto">
                                {/* <button
                                    onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                                    className="w-full sm:w-auto bg-[#00FFB2] text-black px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 text-sm md:text-base"
                                >
                                    Create new
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button> */}

                                {isCreateMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-full sm:w-48 bg-[#231D30] rounded-lg shadow-lg py-2 z-10">
                                        <button className="w-full text-left px-4 py-2 text-sm md:text-base text-white hover:bg-[#1E1B33]">
                                            Create Post
                                        </button>
                                        {(userData.role === 'curator' || userData.role === 'venueOwner') && (
                                            <button className="w-full text-left px-4 py-2 text-sm md:text-base text-white hover:bg-[#1E1B33]">
                                                Create Event
                                            </button>
                                        )}
                                        {userData.role === 'sponsor' && (
                                            <button className="w-full text-left px-4 py-2 text-sm md:text-base text-white hover:bg-[#1E1B33]">
                                                Create Product
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-white text-lg md:text-xl font-medium mb-4">Feeds</h2>
                            <div className="flex gap-4 md:gap-6 border-b border-white/10 overflow-x-auto pb-2 md:pb-0">
                                {['Recent', 'Friends', 'Popular'].map((tab) => (
                                    <button
                                        key={tab.toLowerCase()}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`pb-2 relative whitespace-nowrap text-sm md:text-base ${activeTab === tab.toLowerCase()
                                            ? 'text-[#00FFB2]'
                                            : 'text-white/60'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab.toLowerCase() && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Share Something Box and Posts */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Share Something Box */}
                            <div className="bg-[#231D30] rounded-lg p-3 md:p-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <img
                                        src={userData?.profileImage ? `${import.meta.env.VITE_SERVER_URL}/${userData.profileImage}` : "/Images/default-avatar.jpg"}
                                        alt="Profile"
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                                    />
                                    <input
                                        type="text"
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        placeholder="Share something"
                                        className="flex-1 bg-transparent text-white/60 text-sm md:text-base outline-none"
                                    />
                                </div>

                                {/* Preview area for selected files/images */}
                                {(newPost.files.length > 0 || newPost.images.length > 0 || newPost.location) && (
                                    <div className="mt-3 md:mt-4 space-y-2">
                                        {newPost.images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {newPost.images.map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={image}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-24 md:h-32 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveFile(index, 'images')}
                                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {newPost.files.length > 0 && (
                                            <div className="space-y-2">
                                                {newPost.files.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-[#1A1625] p-2 rounded-lg">
                                                        <span className="text-white/60 text-sm md:text-base truncate">{file.name}</span>
                                                        <button
                                                            onClick={() => handleRemoveFile(index, 'files')}
                                                            className="text-white/60 hover:text-white ml-2"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {newPost.location && (
                                            <div className="flex items-center justify-between bg-[#1A1625] p-2 rounded-lg">
                                                <span className="text-white/60 text-sm md:text-base">{newPost.location}</span>
                                                <button
                                                    onClick={() => handleLocationInput('')}
                                                    className="text-white/60 hover:text-white ml-2"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-wrap justify-between mt-3 md:mt-4">
                                    <div className="flex flex-wrap gap-3 md:gap-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            multiple
                                        />
                                        {/* <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`text-sm md:text-base text-white/60 hover:text-white ${newPost.files.length > 0 ? 'text-[#00FFB2]' : ''}`}
                                        >
                                            File
                                        </button>
                                        <input
                                            type="file"
                                            ref={imageInputRef}
                                            onChange={handleImageSelect}
                                            accept="image/*"
                                            className="hidden"
                                            multiple
                                        />
                                        <button
                                            onClick={() => imageInputRef.current?.click()}
                                            className={`text-sm md:text-base text-white/60 hover:text-white ${newPost.images.length > 0 ? 'text-[#00FFB2]' : ''}`}
                                        >
                                            Image
                                        </button>
                                        <button
                                            onClick={() => setIsMapInputVisible(!isMapInputVisible)}
                                            className={`text-sm md:text-base text-white/60 hover:text-white ${newPost.location ? 'text-[#00FFB2]' : ''}`}
                                        >
                                            Map
                                        </button> */}
                                        {/* <div className="relative">
                                            <button
                                                onClick={() => setPostVisibility(postVisibility === 'public' ? 'private' : 'public')}
                                                className="text-sm md:text-base text-white/60 hover:text-white flex items-center gap-1"
                                            >
                                                {postVisibility === 'public' ? 'Public' : 'Private'}
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div> */}
                                    </div>
                                    <button
                                        onClick={handleSharePost}
                                        className="bg-[#00FFB2] text-black px-4 py-1 rounded-lg text-sm md:text-base hover:bg-[#00FFB2]/90"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>

                            {/* Posts List */}
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.id || post._id} className="bg-[#231D30] rounded-lg p-4 md:p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <img
                                                    src={post.author?.profileImage ? `${import.meta.env.VITE_SERVER_URL}/${post.author.profileImage}` : "/Images/default-avatar.jpg"}
                                                    alt={post.author?.name || 'User'}
                                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                                                />
                                                <div>
                                                    <h3 className="text-white text-sm md:text-base font-medium">{post.author?.name || 'User'}</h3>
                                                    <p className="text-white/60 text-xs md:text-sm">{post.timeAgo}</p>
                                                </div>
                                            </div>
                                            <button className="text-white/60 hover:text-white">•••</button>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-sm md:text-base text-white/80">
                                                {formatPostContent(post.content)}
                                            </div>
                                        </div>

                                        {post.images && (
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                {post.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => openImageViewer(image, index)}
                                                        className="relative overflow-hidden rounded-lg group"
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`Post ${index + 1}`}
                                                            className="w-full h-32 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 md:gap-6 text-white/60 text-sm md:text-base">
                                            {/* <div className="flex items-center gap-1 md:gap-2">
                                                <IoEyeOutline className="w-4 h-4 md:w-5 md:h-5" />
                                                <span>{post.views}</span>
                                            </div> */}
                                            <button
                                                onClick={() => handleLikePost(post.id)}
                                                className="flex items-center gap-1 md:gap-2 hover:text-[#00FFB2]"
                                            >
                                                {post.isLiked ? (
                                                    <AiFillHeart className="w-4 h-4 md:w-5 md:h-5 text-[#00FFB2]" />
                                                ) : (
                                                    <AiOutlineHeart className="w-4 h-4 md:w-5 md:h-5" />
                                                )}
                                                <span className={post.isLiked ? "text-[#00FFB2]" : ""}>
                                                    {post.likes} Like
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => handleCommentPost(post.id)}
                                                className="flex items-center gap-1 md:gap-2 hover:text-[#00FFB2]"
                                            >
                                                <FaRegComment className="w-4 h-4 md:w-5 md:h-5" />
                                                <span>{post.comments} Comment</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-[#231D30] rounded-lg p-8 text-center">
                                    <p className="text-white/60 text-lg">No posts yet</p>
                                    <p className="text-white/40 text-sm mt-2">Share your first post to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'favorites':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">My Favourites</h2>
                        </div>

                        <div className="flex gap-6 border-b border-white/10">
                            <button
                                onClick={() => setSelectedFavTab('events')}
                                className={`pb-2 relative ${selectedFavTab === 'events' ? 'text-[#00FFB2]' : 'text-white/60'}`}
                            >
                                Events
                                {selectedFavTab === 'events' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedFavTab('curators')}
                                className={`pb-2 relative ${selectedFavTab === 'curators' ? 'text-[#00FFB2]' : 'text-white/60'}`}
                            >
                                Curators
                                {selectedFavTab === 'curators' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedFavTab('sponsors')}
                                className={`pb-2 relative ${selectedFavTab === 'sponsors' ? 'text-[#00FFB2]' : 'text-white/60'}`}
                            >
                                Sponsors
                                {selectedFavTab === 'sponsors' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                )}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {favorites.length > 0 ? (
                                favorites.map((favorite) => (
                                    <div key={favorite._id || favorite.id} className="bg-[#231D30] rounded-lg p-4">
                                        <div className="flex gap-4">
                                            <div className="relative w-[200px] h-[200px] flex-shrink-0">
                                                <img
                                                    src={favorite.image || "/Images/post.png"}
                                                    alt={favorite.title || favorite.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white text-xl font-medium">{favorite.title || favorite.name}</h3>
                                                <p className="text-gray-400 mt-2">{favorite.location || favorite.description}</p>
                                                {favorite.date && (
                                                    <p className="text-gray-400 mt-1">{favorite.date}</p>
                                                )}
                                                {favorite.rating && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < Math.floor(favorite.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-white text-sm">{favorite.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-[#231D30] rounded-lg p-8 text-center">
                                    <p className="text-white/60 text-lg">No favorites yet</p>
                                    <p className="text-white/40 text-sm mt-2">Start adding items to your favorites!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'events':
                const title = userData.role === 'sponsor' ? 'Sponsored Events' : 'My Events';
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">{title}</h2>
                        </div>

                        <div className="flex gap-6 border-b border-white/10">
                            <button
                                onClick={() => setSelectedEventTab('upcoming')}
                                className={`pb-2 relative ${selectedEventTab === 'upcoming' ? 'text-[#00FFB2]' : 'text-white/60'}`}
                            >
                                Upcoming
                                {selectedEventTab === 'upcoming' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedEventTab('past')}
                                className={`pb-2 relative ${selectedEventTab === 'past' ? 'text-[#00FFB2]' : 'text-white/60'}`}
                            >
                                Past
                                {selectedEventTab === 'past' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                )}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {events.length > 0 ? (
                                events
                                    .filter(event => {
                                        const eventDate = new Date(event.startDate || event.date);
                                        const isUpcoming = eventDate > new Date();
                                        return selectedEventTab === 'upcoming' ? isUpcoming : !isUpcoming;
                                    })
                                    .slice(0, showAllMyEvents ? events.length : 6)
                                    .map((event) => (
                                        <div key={event._id || event.id} className="bg-[#231D30] rounded-lg p-4">
                                            <div className="flex gap-4">
                                                <div className="relative w-[200px] h-[200px] flex-shrink-0">
                                                    <img
                                                        src={
                                                            event.images?.[0]
                                                                ? (event.images[0].startsWith('http')
                                                                    ? event.images[0]
                                                                    : `${import.meta.env.VITE_SERVER_URL}/${event.images[0].replace(/^\\|^\//, '').replace(/\\/g, '/')}`)
                                                                : (event.image
                                                                    ? (event.image.startsWith('http')
                                                                        ? event.image
                                                                        : `${import.meta.env.VITE_SERVER_URL}/${event.image.replace(/^\\|^\//, '').replace(/\\/g, '/')}`)
                                                                    : "/Images/post.png")
                                                        }
                                                        alt={event.title || event.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    {event.isFree && (
                                                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                                            FREE
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-white text-xl font-medium">{event.title || event.name}</h3>
                                                        {userData.role !== 'sponsor' && (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleEditEvent(event)}
                                                                    className="bg-[#00FFB2] text-black px-4 py-2 rounded-lg hover:bg-[#00FFB2]/90 transition-colors text-sm"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteEvent(event)}
                                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <IoLocationOutline className="w-5 h-5 text-gray-400" />
                                                            <span className="text-white">
                                                                {event.venue?.location?.address || event.location?.address || event.location || 'Location TBD'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <IoCalendarOutline className="w-5 h-5 text-gray-400" />
                                                            <span className="text-white">
                                                                {event.startDate ? new Date(event.startDate).toLocaleDateString() : event.date || 'Date TBD'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <IoTimeOutline className="w-5 h-5 text-gray-400" />
                                                            <span className="text-white">
                                                                {event.startTime && event.endTime
                                                                    ? `${event.startTime} - ${event.endTime}`
                                                                    : event.time || 'Time TBD'
                                                                }
                                                            </span>
                                                        </div>
                                                        {event.attendeesCount !== undefined && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400">Interested:</span>
                                                                <span className="text-white">{event.attendeesCount || event.interested || 0}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="bg-[#231D30] rounded-lg p-8 text-center">
                                    <p className="text-white/60 text-lg">No events yet</p>
                                    <p className="text-white/40 text-sm mt-2">
                                        {userData.role === 'sponsor'
                                            ? 'Start sponsoring events to see them here!'
                                            : 'Create your first event to get started!'
                                        }
                                    </p>
                                </div>
                            )}

                            {events.length > 6 && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => setShowAllMyEvents(!showAllMyEvents)}
                                        className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                    >
                                        {showAllMyEvents ? 'Show Less' : 'See More'}
                                        {!showAllMyEvents && (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'venues':
                if (userData.role !== 'venueOwner') return null;
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">My Venues</h2>
                        </div>

                        <div className="space-y-4">
                            {venues.length > 0 ? (
                                venues.map((venueData) => {
                                    const venue = venueData.venue || venueData;
                                    const venueEvents = venueData.events || [];

                                    return (
                                        <div key={venue._id} className="bg-[#231D30] rounded-lg p-4">
                                            <div className="flex gap-4">
                                                <div className="relative w-[200px] h-[200px] flex-shrink-0">
                                                    <img
                                                        src={
                                                            venue.gallery?.photos?.[0]?.url
                                                                ? (venue.gallery.photos[0].url.startsWith('http')
                                                                    ? venue.gallery.photos[0].url
                                                                    : `${import.meta.env.VITE_SERVER_URL}/${venue.gallery.photos[0].url.replace(/\\/g, '/')}`)
                                                                : (venue.venueImage?.[0]
                                                                    ? (venue.venueImage[0].startsWith('http')
                                                                        ? venue.venueImage[0]
                                                                        : `${import.meta.env.VITE_SERVER_URL}/${venue.venueImage[0].replace(/\\/g, '/')}`)
                                                                    : "/Images/post.png")
                                                        }
                                                        alt={venue.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-white text-xl font-medium">{venue.name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <button className="bg-[#00FFB2] text-black px-4 py-2 rounded-lg hover:bg-[#00FFB2]/90 transition-colors text-sm">
                                                                Edit Venue
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <IoLocationOutline className="w-5 h-5 text-gray-400" />
                                                            <span className="text-white">
                                                                {venue.location?.address}, {venue.location?.city}, {venue.location?.state}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400">Capacity:</span>
                                                            <span className="text-white">{venue.capacity}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400">Events Hosted:</span>
                                                            <span className="text-white">{venueEvents.length}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400">Amenities:</span>
                                                            <span className="text-white">{venue.amenities?.join(', ') || 'None listed'}</span>
                                                        </div>
                                                        {venue.description && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-gray-400">Description:</span>
                                                                <span className="text-white">{venue.description}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-[#231D30] rounded-lg p-8 text-center">
                                    <p className="text-white/60 text-lg">No venues yet</p>
                                    <p className="text-white/40 text-sm mt-2">Add your first venue to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'products':
                if (userData.role !== 'sponsor') return null;
                const displayedProducts = showAllProducts ? products : products.slice(0, 3);

                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">My Products</h2>
                        </div>

                        <div className="space-y-4">
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map((product) => (
                                    <div key={product._id || product.id} className="bg-[#231D30] rounded-lg p-4">
                                        <div className="flex gap-4">
                                            <div className="relative w-[200px] h-[200px] flex-shrink-0">
                                                <img
                                                    src={product.images?.[0]
                                                        ? (product.images[0].startsWith('http')
                                                            ? product.images[0]
                                                            : `${import.meta.env.VITE_SERVER_URL}/${product.images[0].replace(/\\/g, '/')}`)
                                                        : (product.image
                                                            ? (product.image.startsWith('http')
                                                                ? product.image
                                                                : `${import.meta.env.VITE_SERVER_URL}/${product.image.replace(/\\/g, '/')}`)
                                                            : "/Images/post.png")}
                                                    alt={product.name || product.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-white text-xl font-medium">{product.name || product.title}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditProduct(product)}
                                                            className="bg-[#00FFB2] text-black px-8 py-2 rounded-lg hover:bg-[#00FFB2]/90 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400">Price:</span>
                                                        <span className="text-white">${product.price}</span>
                                                    </div>
                                                    {product.stock !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400">Stock:</span>
                                                            <span className="text-white">{product.stock}</span>
                                                        </div>
                                                    )}
                                                    {product.description && (
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-gray-400">Description:</span>
                                                            <span className="text-white">{product.description}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-[#231D30] rounded-lg p-8 text-center">
                                    <p className="text-white/60 text-lg">No products yet</p>
                                    <p className="text-white/40 text-sm mt-2">Create your first product to get started!</p>
                                </div>
                            )}
                        </div>

                        {products.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowAllProducts(!showAllProducts)}
                                    className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                >
                                    {showAllProducts ? 'Show Less' : 'See More'}
                                    {!showAllProducts && (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'followers':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">Followers & Following</h2>
                        </div>

                        <div className="flex gap-6 border-b border-white/10">
                            <button
                                onClick={() => setSelectedFollowTab('followers')}
                                className={`pb-2 relative ${selectedFollowTab === 'followers' ? 'text-[#00FFB2]' : 'text-white/60'}`}
                            >
                                Followers ({followers.length})
                                {selectedFollowTab === 'followers' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedFollowTab('following')}
                                className={`pb-2 relative ${selectedFollowTab === 'following' ? 'text-[#00FFB2]' : 'text-white/60'}`}
                            >
                                Following ({following.length})
                                {selectedFollowTab === 'following' && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                )}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(selectedFollowTab === 'followers' ? followers : following).length > 0 ? (
                                (selectedFollowTab === 'followers' ? followers : following).map((user) => (
                                    <div key={user._id || user.id} className="bg-[#231D30] rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={user.image ? `${import.meta.env.VITE_SERVER_URL}/${user.image}` : "/Images/default-avatar.jpg"}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="text-white font-medium">{user.name}</h3>
                                                <p className="text-gray-400 text-sm capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/${user.role}/${user._id || user.id}`)}
                                            className="bg-[#00FFB2] text-black px-4 py-2 rounded-lg hover:bg-[#00FFB2]/90 transition-colors"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-[#231D30] rounded-lg p-8 text-center">
                                    <p className="text-white/60 text-lg">
                                        No {selectedFollowTab} yet
                                    </p>
                                    <p className="text-white/40 text-sm mt-2">
                                        {selectedFollowTab === 'followers'
                                            ? 'Start engaging with others to gain followers!'
                                            : 'Start following other users to see them here!'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'media':
                // MEDIA TAB COMMENTED OUT - not rendered for now
                return null;

            case 'settings':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">Settings</h2>
                        </div>

                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h3 className="text-white text-xl font-medium mb-4">Profile Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={userData?.firstName && userData?.lastName
                                            ? `${userData.firstName} ${userData.lastName}`
                                            : userData?.businessName || userData?.venueName || userData?.stageName || 'N/A'
                                        }
                                        className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={userData?.email || 'N/A'}
                                        className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={userData?.role === 'venueOwner' ? 'Venue Owner' : userData?.role || 'N/A'}
                                        className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                        readOnly
                                    />
                                </div>
                                {userData?.bio && (
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Bio</label>
                                        <textarea
                                            value={userData.bio}
                                            rows="3"
                                            className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                            readOnly
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h3 className="text-white text-xl font-medium mb-4">Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#00FFB2]">{stats?.followers || followers.length}</div>
                                    <div className="text-gray-400 text-sm">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#00FFB2]">{stats?.following || following.length}</div>
                                    <div className="text-gray-400 text-sm">Following</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#00FFB2]">{stats?.events || events.length}</div>
                                    <div className="text-gray-400 text-sm">Events</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#00FFB2]">{stats?.rating ? stats.rating.toFixed(1) : '0.0'}</div>
                                    <div className="text-gray-400 text-sm">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-[#231D30] rounded-lg p-8 text-center">
                        <p className="text-white/60 text-lg">Content not available</p>
                    </div>
                );
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
                <div className="text-white text-xl">Loading profile...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Error loading profile</div>
                    <div className="text-gray-400 mb-4">{error}</div>
                    <button
                        onClick={fetchUserProfile}
                        className="bg-[#00FFB2] text-black px-6 py-2 rounded-lg hover:bg-[#00FFB2]/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Show no data state
    if (!userData) {
        return (
            <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
                <div className="text-white text-xl">No profile data found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1E1B33] p-4 md:p-6 font-sen">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr_380px] gap-4 md:gap-6">
                {/* Left Sidebar */}
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="bg-[#231D30] rounded-lg p-4 text-center">
                        <img
                            src={userData?.profileImage ? `${import.meta.env.VITE_SERVER_URL}/${userData.profileImage}` : "/Images/default-avatar.jpg"}
                            alt="Profile"
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-2"
                        />
                        <h2 className="text-white font-medium">
                            {userData?.firstName && userData?.lastName
                                ? `${userData.firstName} ${userData.lastName}`
                                : userData?.businessName || userData?.venueName || userData?.stageName || 'User'
                            }
                        </h2>
                        <p className="text-gray-400 text-sm capitalize">
                            {userData?.role === 'venueOwner' ? 'Venue Owner' : userData?.role || 'User'}
                        </p>
                        {userData?.bio && (
                            <p className="text-gray-500 text-xs mt-2 line-clamp-2">{userData.bio}</p>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                        {getNavItems().map(item => {
                            const Icon = item.icon;
                            return (
                                item.id === 'settings' ? (
                                    <Link
                                        key={item.id}
                                        to="/settings"
                                        className={`w-full flex items-center gap-3 p-2 md:p-3 rounded-lg text-sm md:text-base text-white/80 hover:bg-[#231D30]`}
                                    >
                                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="flex-1 text-left">{item.label}</span>
                                    </Link>
                                ) : (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedNav(item.id)}
                                        className={`w-full flex items-center gap-3 p-2 md:p-3 rounded-lg text-sm md:text-base ${selectedNav === item.id
                                            ? 'bg-[#00FFB2] text-black font-medium'
                                            : 'text-white/80 hover:bg-[#231D30]'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${selectedNav === item.id ? 'text-black' : ''}`} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.count && (
                                            <span className={`text-xs md:text-sm ${selectedNav === item.id ? 'text-black' : 'text-white/60'}`}>
                                                ({item.count})
                                            </span>
                                        )}
                                    </button>
                                )
                            );
                        })}
                        
                        {/* Create Event Option for Curators and Venue Owners */}
                        {(userData.role === 'curator' || userData.role === 'venueOwner') && (
                            <Link
                                to="/create-event"
                                className="w-full flex items-center gap-3 p-2 md:p-3 rounded-lg text-sm md:text-base text-white/80 hover:bg-[#231D30]"
                            >
                                <MdEvent className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="flex-1 text-left">Create Event</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4 md:space-y-6">
                    {renderMainContent()}
                </div>

                {/* Right Sidebar - Hidden on mobile, visible on large screens */}
                <div className="hidden lg:block w-full space-y-6">
                    {/* Upcoming Events */}
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <h2 className="text-white text-xl mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {events.filter(event => event.status === 'upcoming').map((event) => (
                                <Link
                                    key={event._id}
                                    to={`/event/${event._id}`}
                                    className="block bg-[#1A1625] rounded-lg p-4 hover:bg-[#1A1625]/70 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white text-lg font-medium mb-2">{event.title}</h3>
                                            <div className="space-y-2 mt-2">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoLocationOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoCalendarOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{event.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoTimeOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                                                    <span className="text-[#C5FF32] text-sm">{event.interested} interested</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl">Suggestions</h2>
                            <Link to="/suggestions" className="text-gray-400 text-sm hover:text-[#00FFB2]">
                                See All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={suggestion.image}
                                            alt={suggestion.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <h3 className="text-white">{suggestion.name}</h3>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 text-sm">★</span>
                                                <span className="text-gray-400 text-sm ml-1">{suggestion.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-[#3FE1B6] text-black px-4 py-1 rounded-md text-sm hover:bg-[#3FE1B6]/90">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Event Owners */}
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <h2 className="text-white text-xl mb-4">Popular Event Owners</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 1, image: '/Images/Crowdcard.png', link: '/venue/:id' },
                                { id: 2, image: '/Images/Crowdcard.png', link: '/venue/:id' },
                                { id: 3, image: '/Images/Crowdcard.png', link: '/venue/:id' },
                                { id: 4, image: '/Images/Crowdcard.png', link: '/venue/:id' }
                            ].map((owner) => (
                                <Link
                                    key={owner.id}
                                    to={owner.link}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <img
                                            src={owner.image}
                                            alt="Event Owner"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Viewer Dialog */}
            <Dialog
                open={isImageViewerOpen}
                onClose={closeImageViewer}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={closeImageViewer}
                            className="absolute top-2 md:top-4 right-2 md:right-4 text-white hover:text-gray-300 z-10"
                        >
                            <span className="text-xl md:text-2xl">✕</span>
                        </button>

                        <button
                            onClick={() => navigateImage('prev')}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
                        >
                            <span className="text-2xl md:text-4xl">‹</span>
                        </button>

                        <button
                            onClick={() => navigateImage('next')}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
                        >
                            <span className="text-2xl md:text-4xl">›</span>
                        </button>

                        <div className="relative max-w-5xl w-full mx-2 md:mx-4">
                            <img
                                src={selectedImage}
                                alt="Enlarged view"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>

                        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-1 md:gap-2">
                            {posts.find(post => post.images?.some(img => img === selectedImage))?.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImageIndex(index);
                                        setSelectedImage(posts.find(post => post.images?.some(img => img === selectedImage)).images[index]);
                                    }}
                                    className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all ${index === selectedImageIndex
                                        ? 'bg-[#00FFB2] w-3 md:w-4'
                                        : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-[#231D30] rounded-lg p-6 md:p-8 w-full max-w-md">
                        <Dialog.Title className="text-white text-lg md:text-xl font-medium mb-4">
                            Confirm Deletion
                        </Dialog.Title>
                        <Dialog.Description className="text-white/60 text-sm md:text-base mb-4">
                            Are you sure you want to delete this item? This action cannot be undone.
                        </Dialog.Description>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-transparent text-white border border-white/20 px-4 py-2 rounded-lg text-sm md:text-base hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm md:text-base hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Edit Event Modal */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-[#231D30] rounded-lg p-6 md:p-8 w-full max-w-md">
                        <Dialog.Title className="text-white text-lg md:text-xl font-medium mb-4">
                            Edit Event
                        </Dialog.Title>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Location</label>
                                <input
                                    type="text"
                                    value={editFormData.location}
                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={editFormData.date}
                                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                        className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Time</label>
                                    <input
                                        type="time"
                                        value={editFormData.time}
                                        onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                                        className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setEditFormData({ ...editFormData, image: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editFormData.isFree}
                                    onChange={() => setEditFormData({ ...editFormData, isFree: !editFormData.isFree })}
                                    className="w-5 h-5 text-[#00FFB2] rounded-lg focus:ring-0"
                                />
                                <label className="text-white/80 text-sm cursor-pointer">
                                    This event is free
                                </label>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-transparent text-white border border-white/20 px-4 py-2 rounded-lg text-sm md:text-base hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateEvent}
                                className="bg-[#00FFB2] text-black px-4 py-2 rounded-lg text-sm md:text-base hover:bg-[#00FFB2]/90"
                            >
                                Update Event
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Edit Product Modal */}
            <Dialog
                open={isProductEditModalOpen}
                onClose={() => setIsProductEditModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-[#231D30] rounded-lg p-6 md:p-8 w-full max-w-md">
                        <Dialog.Title className="text-white text-lg md:text-xl font-medium mb-4">
                            Edit Product
                        </Dialog.Title>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Title</label>
                                <input
                                    type="text"
                                    value={productEditFormData.title}
                                    onChange={(e) => setProductEditFormData({ ...productEditFormData, title: e.target.value })}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Price</label>
                                <input
                                    type="number"
                                    value={productEditFormData.price}
                                    onChange={(e) => setProductEditFormData({ ...productEditFormData, price: e.target.value })}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Stock</label>
                                <input
                                    type="number"
                                    value={productEditFormData.stock}
                                    onChange={(e) => setProductEditFormData({ ...productEditFormData, stock: e.target.value })}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setProductEditFormData({ ...productEditFormData, image: file });
                                        }
                                    }}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Description</label>
                                <textarea
                                    value={productEditFormData.description}
                                    onChange={(e) => setProductEditFormData({ ...productEditFormData, description: e.target.value })}
                                    rows="3"
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Category</label>
                                <input
                                    type="text"
                                    value={productEditFormData.category}
                                    onChange={e => setProductEditFormData({ ...productEditFormData, category: e.target.value })}
                                    className="w-full bg-[#1A1625] text-white p-3 rounded-lg border border-white/10 focus:border-[#00FFB2] outline-none"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setIsProductEditModalOpen(false)}
                                className="bg-transparent text-white border border-white/20 px-4 py-2 rounded-lg text-sm md:text-base hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProduct}
                                className="bg-[#00FFB2] text-black px-4 py-2 rounded-lg text-sm md:text-base hover:bg-[#00FFB2]/90"
                            >
                                Update Product
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default UserProfile;