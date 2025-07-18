import React, { useState, useCallback, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoEyeOutline } from 'react-icons/io5';
import { FaStar, FaRegHeart, FaRegComment, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { BsCalendarEvent } from 'react-icons/bs';
import followIcon from '/icons/follow.svg';
import axiosInstance from "@/configs/axiosConfig";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Utility to format time ago for posts
const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
        return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
        return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
};

const countryCurrencyList = [
    { code: "IN", name: "India", currency: { code: "INR", symbol: "₹" } },
    { code: "US", name: "United States", currency: { code: "USD", symbol: "$" } },
    { code: "GB", name: "United Kingdom", currency: { code: "GBP", symbol: "£" } },
    { code: "JP", name: "Japan", currency: { code: "JPY", symbol: "¥" } },
    { code: "AU", name: "Australia", currency: { code: "AUD", symbol: "$" } },
    { code: "CA", name: "Canada", currency: { code: "CAD", symbol: "$" } },
    { code: "CH", name: "Switzerland", currency: { code: "CHF", symbol: "₣" } },
    { code: "CN", name: "China", currency: { code: "CNY", symbol: "¥" } },
    { code: "DE", name: "Germany", currency: { code: "EUR", symbol: "€" } },
    { code: "FR", name: "France", currency: { code: "EUR", symbol: "€" } },
    { code: "IT", name: "Italy", currency: { code: "EUR", symbol: "€" } },
    { code: "ES", name: "Spain", currency: { code: "EUR", symbol: "€" } },
    { code: "BG", name: "Bulgaria", currency: { code: "BGN", symbol: "лв" } },
    { code: "BR", name: "Brazil", currency: { code: "BRL", symbol: "R$" } },
    { code: "CZ", name: "Czech Republic", currency: { code: "CZK", symbol: "Kč" } },
    { code: "DK", name: "Denmark", currency: { code: "DKK", symbol: "kr" } },
    { code: "HK", name: "Hong Kong", currency: { code: "HKD", symbol: "$" } },
    { code: "HU", name: "Hungary", currency: { code: "HUF", symbol: "Ft" } },
    { code: "ID", name: "Indonesia", currency: { code: "IDR", symbol: "Rp" } },
    { code: "IL", name: "Israel", currency: { code: "ILS", symbol: "₪" } },
    { code: "IS", name: "Iceland", currency: { code: "ISK", symbol: "kr" } },
    { code: "KR", name: "South Korea", currency: { code: "KRW", symbol: "₩" } },
    { code: "MX", name: "Mexico", currency: { code: "MXN", symbol: "$" } },
    { code: "MY", name: "Malaysia", currency: { code: "MYR", symbol: "RM" } },
    { code: "NO", name: "Norway", currency: { code: "NOK", symbol: "kr" } },
    { code: "NZ", name: "New Zealand", currency: { code: "NZD", symbol: "$" } },
    { code: "PH", name: "Philippines", currency: { code: "PHP", symbol: "₱" } },
    { code: "PL", name: "Poland", currency: { code: "PLN", symbol: "zł" } },
    { code: "RO", name: "Romania", currency: { code: "RON", symbol: "lei" } },
    { code: "SE", name: "Sweden", currency: { code: "SEK", symbol: "kr" } },
    { code: "SG", name: "Singapore", currency: { code: "SGD", symbol: "$" } },
    { code: "TH", name: "Thailand", currency: { code: "THB", symbol: "฿" } },
    { code: "TR", name: "Turkey", currency: { code: "TRY", symbol: "₺" } },
    { code: "ZA", name: "South Africa", currency: { code: "ZAR", symbol: "R" } },
    { code: "EU", name: "Eurozone", currency: { code: "EUR", symbol: "€" } },
];

const SponserPage = () => {
  const {id} = useParams();

    const [loading, setLoading] = useState(true);
    const [sponsor, setSponsor] = useState({
        rating: 0,
        eventsSponsoredCount: 0,
        followers: [],
        followersCount: 0,
        _id: "",
        email: "",
        businessName: "",
        taxIdentificationNumber: "",
        description: "",
        contactName: "",
        role: "",
        preferredEvents: [],
        sponsorshipExpectations: [],
        products: [],
        createdAt: "",
        posts: [],
        eventsSponsored: []
    });

    // Mock data for UI development
    const mockSponsor = {
        name: "Dj Kazi",
        location: "Lagos, Nigeria",
        followers: "2.3k",
        rating: 4.5,
        reviews: 32,
        description: "Your description goes here"
    };

    const [activeTab, setActiveTab] = useState("reviews");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('top-rated');
    const [posts, setPosts] = useState([]);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageViewerImages, setImageViewerImages] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [likeLoading, setLikeLoading] = useState({});
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [following, setFollowing] = useState([]);
    const [sponsoredEvents, setSponsoredEvents] = useState([]);
    const [products, setProducts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const [userCurrency, setUserCurrency] = useState({ code: "INR", symbol: "₹" });
    const [exchangeRate, setExchangeRate] = useState(1); // Default for INR base currency
    const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
    const [country, setCountry] = useState(() => localStorage.getItem("country") || "India");

    useEffect(() => {
        const fetchSponsor = async () => {
            setLoading(true);
            try {
                // Fetch sponsor profile (includes reviews)
                const res = await axiosInstance.get(`/management/sponsors/${id}`);
                if (res.data) {
                    console.log(res.data);
                    setSponsor(res.data);
                    setReviews(res.data.reviews || []);
                    setSponsoredEvents(res.data.eventsSponsored || []);
                    
                    // Check if current user is following this sponsor
                    const token = localStorage.getItem('accessToken');
                    if (token) {
                        try {
                            const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
                            const isCurrentlyFollowing = res.data.followers?.some(
                                follower => follower._id === currentUserId || follower.user === currentUserId
                            );
                            setIsFollowing(isCurrentlyFollowing || false);
                        } catch (error) {
                            console.error('Error checking follow status:', error);
                            setIsFollowing(false);
                        }
                    }
                    
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching sponsor:', error);
                setLoading(false);
            }
        };
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axiosInstance.get(`/profiles/sponsor/${id}/posts`, { headers });
                const postsArr = Array.isArray(res.data.posts) ? res.data.posts : [];
                if (postsArr.length > 0) {
                    const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;
                    const normalizedPosts = postsArr.map(post => {
                        const isLiked = (post.likes || []).some(like =>
                            like.user === currentUserId || like.user?._id === currentUserId
                        );
                        return {
                            ...post,
                            id: post._id || post.id,
                            author: post.author?.businessName || post.author?.name || post.author?.firstName || 'Sponsor',
                            timeAgo: formatTimeAgo(new Date(post.createdAt)),
                            content: post.text || post.content || '',
                            images: (post.images || []).map(img =>
                                img.startsWith('http') ? img : `${import.meta.env.VITE_SERVER_URL}${img}`
                            ),
                            likes: Array.isArray(post.likes) ? post.likes.length : (post.likes || 0),
                            comments: post.comments || [],
                            isLiked,
                        };
                    });
                    setPosts(normalizedPosts);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                setPosts([]);
            }
        };
        const fetchUpcomingEvents = async () => {
            try {
                let response;
                try {
                    response = await axiosInstance.get('/events');
                    if (response.data && response.data.success) {
                        setUpcomingEvents(response.data.data);
                        return;
                    }
                } catch (error) {
                    try {
                        response = await axiosInstance.get('/events/all');
                        if (response.data && response.data.success) {
                            setUpcomingEvents(response.data.data);
                            return;
                        }
                    } catch (error2) {
                        try {
                            response = await axiosInstance.get('/events?category=all&status=upcoming');
                            if (response.data && response.data.success) {
                                setUpcomingEvents(response.data.data);
                                return;
                            }
                        } catch (error3) {
                            // fallback
                        }
                    }
                }
            } catch (error) {}
        };
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axiosInstance.get(`/profiles/sponsor/${id}/products`, { headers });
                if (res.data && res.data.success) {
                    setProducts(res.data.products || []);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            }
        };
        const fetchSuggestions = async () => {
            try {
                const response = await axiosInstance.get('trending/curators');
                setSuggestions(response.data.data || []);
            } catch (error) {}
        };
        const getLocation = async () => {
            try {
                const res = await fetch("https://ipapi.co/json");
                const data = await res.json();
                const countryData = countryCurrencyList.find(c => c.code === data.country_code);
                if (countryData) {
                    setCountry(countryData.name);
                    setUserCurrency(countryData.currency);
                    localStorage.setItem("country", countryData.name);
                } else {
                    // Default to India if country not found in list
                    const india = countryCurrencyList.find(c => c.code === "IN");
                    setCountry(india.name);
                    setUserCurrency(india.currency);
                    localStorage.setItem("country", india.name);
                }
            } catch (error) {
                console.error("Error getting location:", error);
                // Default to India on error
                const india = countryCurrencyList.find(c => c.code === "IN");
                setCountry(india.name);
                setUserCurrency(india.currency);
                localStorage.setItem("country", india.name);
            }
        };

        const getExchangeRate = async () => {
            try {
                setExchangeRateLoading(true);
                if (userCurrency.code === "INR") {
                    // Base currency is INR, no conversion needed
                    setExchangeRate(1);
                } else {
                    // Convert from INR to other currencies using frankfurter API
                    const res = await fetch(`https://api.frankfurter.app/latest?amount=1&from=INR&to=${userCurrency.code}`);
                    const data = await res.json();
                    if (data.rates && data.rates[userCurrency.code]) {
                        setExchangeRate(data.rates[userCurrency.code]);
                    } else {
                        // Fallback to approximate rates if currency not supported by API
                        const fallbackRates = {
                            USD: 0.012, // 1 INR ≈ 0.012 USD
                            EUR: 0.011, // 1 INR ≈ 0.011 EUR
                            GBP: 0.0095, // 1 INR ≈ 0.0095 GBP
                            AUD: 0.018, // 1 INR ≈ 0.018 AUD
                            CAD: 0.016, // 1 INR ≈ 0.016 CAD
                            SGD: 0.016, // 1 INR ≈ 0.016 SGD
                            AED: 0.044, // 1 INR ≈ 0.044 AED
                        };
                        setExchangeRate(fallbackRates[userCurrency.code] || 1);
                    }
                }
            } catch (error) {
                console.error("Error getting exchange rate:", error);
                setExchangeRate(1);
            } finally {
                setExchangeRateLoading(false);
            }
        };

        fetchSponsor();
        fetchPosts();
        fetchUpcomingEvents();
        fetchProducts();
        fetchSuggestions();
        
        if (!localStorage.getItem("country")) {
            getLocation();
        } else {
            // Set currency based on stored country
            const countryData = countryCurrencyList.find(c => c.name === country);
            if (countryData) {
                setUserCurrency(countryData.currency);
            } else {
                // Default to India if stored country not found in list
                const india = countryCurrencyList.find(c => c.code === "IN");
                setCountry(india.name);
                setUserCurrency(india.currency);
                localStorage.setItem("country", india.name);
            }
        }
        getExchangeRate();
    }, [id, userCurrency.code, country]);

    const totalPosts = posts.length;
    const totalSponsoredEvents = sponsoredEvents.length;
    const totalProducts = products.length;
    const tabs = [
        { id: "reviews", label: "Reviews/Rating" },
        { id: "posts", label: `Posts (${totalPosts})` },
        { id: "sponsoredEvents", label: `Events Sponsored (${totalSponsoredEvents})` },
        { id: "products", label: `Products (${totalProducts})` }
    ];

    const [postSort, setPostSort] = useState('recent');

    const calculateAverageRating = useCallback(() => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    }, [reviews]);

    const totalReviews = reviews.length;

    const handleFollowToggle = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error('Please login to follow');
            return;
        }

        setIsFollowingLoading(true);
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
            await axiosInstance.post(`/profiles/sponsor/${id}/${endpoint}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIsFollowing(!isFollowing);
            
            // Update follower count locally
            setSponsor(prev => ({
                ...prev,
                followersCount: isFollowing 
                    ? (prev.followersCount || 0) - 1 
                    : (prev.followersCount || 0) + 1
            }));

            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
        } catch (error) {
            console.error('Error toggling follow:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to follow');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update follow status');
            }
        } finally {
            setIsFollowingLoading(false);
        }
    }, [isFollowing, id]);

    const handleRatingSelect = useCallback((selectedRating) => {
        setRating(selectedRating);
    }, []);

    const handleReviewSubmit = useCallback(async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (!reviewText.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error('Please login to add a review');
            return;
        }

        try {
            // Add review to sponsor
            const res = await axiosInstance.post(`/profiles/sponsor/${id}/review`, {
                rating,
                comment: reviewText
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data && res.data.reviews) {
                setReviews(res.data.reviews.reverse()); // Most recent first
            }
            setRating(0);
            setReviewText('');
            toast.success('Review submitted successfully');
        } catch (error) {
            console.error('Error submitting review:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to add a review');
            } else {
                toast.error(error.response?.data?.message || 'Failed to submit review');
            }
        }
    }, [rating, reviewText, id]);

    const handleSortChange = useCallback((sortValue) => {
        setSortBy(sortValue);
        const sortedReviews = [...reviews].sort((a, b) => {
            switch (sortValue) {
                case 'recent':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'top-rated':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });
        setReviews(sortedReviews);
    }, [reviews]);

    const handleLikePost = useCallback(async (postId) => {
        setLikeLoading(prev => ({ ...prev, [postId]: true }));
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to like posts');
                setLikeLoading(prev => ({ ...prev, [postId]: false }));
                return;
            }
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                } : post
            ));
            const res = await axiosInstance.post(`/profiles/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.data) {
                const updatedPost = res.data.data;
                const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
                const isLiked = (updatedPost.likes || []).some(like =>
                    like.user === currentUserId || like.user?._id === currentUserId
                );
                setPosts(prevPosts => prevPosts.map(post =>
                    post.id === postId ? {
                        ...post,
                        isLiked,
                        likes: Array.isArray(updatedPost.likes) ? updatedPost.likes.length : (updatedPost.likes || 0)
                    } : post
                ));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to like post');
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes + 1 : post.likes - 1
                } : post
            ));
        } finally {
            setLikeLoading(prev => ({ ...prev, [postId]: false }));
        }
    }, []);

    const handleCommentInput = (postId, value) => {
        setCommentInputs(prev => ({ ...prev, [postId]: value }));
    };

    const handleAddComment = useCallback(async (postId) => {
        const commentText = commentInputs[postId]?.trim();
        if (!commentText) return;
        setCommentLoading(prev => ({ ...prev, [postId]: true }));
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to comment');
                setCommentLoading(prev => ({ ...prev, [postId]: false }));
                return;
            }
            const optimisticComment = {
                _id: `temp_${Date.now()}`,
                user: { name: 'You' },
                text: commentText,
                createdAt: new Date().toISOString()
            };
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? {
                    ...post,
                    comments: [...(post.comments || []), optimisticComment]
                } : post
            ));
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
            const res = await axiosInstance.post(`/profiles/posts/${postId}/comment`, { text: commentText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.data) {
                setPosts(prevPosts => prevPosts.map(post =>
                    post.id === postId ? {
                        ...post,
                        comments: res.data.data
                    } : post
                ));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post comment');
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? {
                    ...post,
                    comments: (post.comments || []).filter(c => !c._id?.startsWith('temp_'))
                } : post
            ));
        } finally {
            setCommentLoading(prev => ({ ...prev, [postId]: false }));
        }
    }, [commentInputs]);

    const openImageViewer = (images, index) => {
        setImageViewerImages(images);
        setSelectedImage(images[index]);
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setIsImageViewerOpen(false);
        setSelectedImage(null);
        setSelectedImageIndex(0);
        setImageViewerImages([]);
    };

    const navigateImage = (direction) => {
        if (!imageViewerImages.length) return;
        let newIndex;
        if (direction === 'next') {
            newIndex = (selectedImageIndex + 1) % imageViewerImages.length;
        } else {
            newIndex = selectedImageIndex === 0 ? imageViewerImages.length - 1 : selectedImageIndex - 1;
        }
        setSelectedImageIndex(newIndex);
        setSelectedImage(imageViewerImages[newIndex]);
    };

    const handleOpenPostModal = (post) => {
        setSelectedPost(post);
        setCurrentImageIndex(0);
        setIsPostModalOpen(true);
    };

    const handleClosePostModal = () => {
        setIsPostModalOpen(false);
        setSelectedPost(null);
        setCurrentImageIndex(0);
    };

    const handleFollow = async (userId) => {
        try {
            const response = await axiosInstance.post(`profiles/curator/${userId}/follow`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            toast.success('Followed successfully');
            setFollowing(prev => [...prev, { _id: userId }]);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to follow user');
        }
    };

    const formatPostContent = useCallback((content) => {
        const parts = content.split(/(@\w+)/g);
        return (
            <div className="text-gray-400">
                {parts.map((part, index) => {
                    if (part.startsWith('@')) {
                        return (
                            <span key={index} className="text-[#3FE1B6]">
                                {part}
                            </span>
                        );
                    }
                    return part;
                })}
            </div>
        );
    }, []);

    const renderPostsContent = () => (
        <div className="space-y-6">
            {posts.map((post) => (
                <div key={post.id} className="bg-[#231D30] rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img
                                    src={post.author?.profileImage ? `${import.meta.env.VITE_SERVER_URL}${post.author.profileImage}` : "/Images/default-avatar.jpg"}
                                    alt={post.author?.name || post.author || 'Sponsor'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{post.author?.name || post.author || 'Sponsor'}</h3>
                                <p className="text-gray-400 text-sm">{post.timeAgo}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        {formatPostContent(post.content)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {post.images && post.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => openImageViewer(post.images, index)}
                                className="relative overflow-hidden rounded-lg group"
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1.5 hover:text-[#3FE1B6] transition-colors ${likeLoading[post.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={likeLoading[post.id]}
                        >
                            {post.isLiked ? (
                                <FaHeart className="w-4 h-4 text-[#3FE1B6]" />
                            ) : (
                                <FaRegHeart className="w-4 h-4" />
                            )}
                            <span className={post.isLiked ? "text-[#3FE1B6]" : ""}>
                                {post.likes} Like
                            </span>
                        </button>
                        <button
                            className="flex items-center gap-1.5 hover:text-[#3FE1B6] transition-colors"
                            onClick={() => handleOpenPostModal(post)}
                        >
                            <FaRegComment className="w-4 h-4" />
                            <span>{Array.isArray(post.comments) ? post.comments.length : 0} Comment</span>
                        </button>
                    </div>
                </div>
            ))}

            {/* Post Modal */}
            <Dialog
                open={isPostModalOpen}
                onClose={handleClosePostModal}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-[#231D30] rounded-lg w-full max-w-full md:max-w-4xl h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedPost?.author?.profileImage ? `${import.meta.env.VITE_SERVER_URL}${selectedPost.author.profileImage}` : "/Images/default-avatar.jpg"}
                                    alt={selectedPost?.author?.name || 'User'}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h3 className="text-white font-medium m-0">
                                        {selectedPost?.author?.name || 'User'}
                                    </h3>
                                    <p className="text-white/60 text-sm">{selectedPost?.timeAgo}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClosePostModal}
                                className="text-white/60 hover:text-white"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </div>
                        {/* Content */}
                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            {/* Left side - Images */}
                            <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[200px] max-h-[300px] md:max-h-none">
                                {selectedPost?.images && selectedPost.images.length > 0 ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={selectedPost.images[currentImageIndex]}
                                            alt={`Post ${currentImageIndex + 1}`}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.src = "/Images/post.png";
                                            }}
                                        />
                                        {selectedPost.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setCurrentImageIndex(prev =>
                                                        prev === 0 ? selectedPost.images.length - 1 : prev - 1
                                                    )}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setCurrentImageIndex(prev =>
                                                        prev === selectedPost.images.length - 1 ? 0 : prev + 1
                                                    )}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                    {selectedPost.images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                                index === currentImageIndex
                                                                    ? 'bg-white'
                                                                    : 'bg-white/50 hover:bg-white/70'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                                                    {currentImageIndex + 1} / {selectedPost.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-white/60 text-center">
                                        <p>No image</p>
                                    </div>
                                )}
                            </div>
                            {/* Right side - Comments and actions */}
                            <div className="w-full md:w-1/2 flex flex-col">
                                <div className="p-4 border-b border-white/10">
                                    <div className="flex gap-2">
                                        <span className="text-white font-medium">
                                            {selectedPost?.author?.name || 'User'}
                                        </span>
                                        <span className="text-white/80">
                                            {selectedPost?.content}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-4">
                                        {Array.isArray(selectedPost?.comments) && selectedPost.comments.map((comment) => (
                                            <div key={comment._id} className="flex gap-3">
                                                <img
                                                    src={comment.user?.profileImage || "/Images/default-avatar.jpg"}
                                                    alt={comment.name || comment.user?.name || 'User'}
                                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-white text-sm font-medium">
                                                            {comment.name || comment.user?.name || 'User'}
                                                        </span>
                                                        <span className="text-white/40 text-xs">
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/80 text-sm">
                                                        {comment.text || comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 border-t border-white/10">
                                    <div className="flex gap-3">
                                        <img
                                            src={sponsor?.businessLogo ? `${import.meta.env.VITE_SERVER_URL}${sponsor.businessLogo}` : "/Images/default-avatar.jpg"}
                                            alt="Your profile"
                                            className="w-8 h-8 rounded-full flex-shrink-0"
                                        />
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={commentInputs[selectedPost?.id] || ''}
                                                onChange={e => handleCommentInput(selectedPost?.id, e.target.value)}
                                                placeholder="Add a comment..."
                                                className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-sm"
                                                onKeyPress={e => {
                                                    if (e.key === 'Enter') {
                                                        handleAddComment(selectedPost?.id);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddComment(selectedPost?.id)}
                                                disabled={!commentInputs[selectedPost?.id]?.trim() || commentLoading[selectedPost?.id]}
                                                className={`text-sm font-medium ${
                                                    commentInputs[selectedPost?.id]?.trim() && !commentLoading[selectedPost?.id]
                                                        ? 'text-[#3FE1B6] hover:text-[#2fcfa4]'
                                                        : 'text-white/40'
                                                }`}
                                            >
                                                {commentLoading[selectedPost?.id] ? '...' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Image Viewer Modal */}
            <Dialog
                open={isImageViewerOpen}
                onClose={closeImageViewer}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={closeImageViewer}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                            <span className="text-2xl">✕</span>
                        </button>
                        {imageViewerImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => navigateImage('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
                                >
                                    <span className="text-4xl">‹</span>
                                </button>
                                <button
                                    onClick={() => navigateImage('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
                                >
                                    <span className="text-4xl">›</span>
                                </button>
                            </>
                        )}
                        <div className="relative max-w-5xl w-full mx-4">
                            <img
                                src={selectedImage}
                                alt="Enlarged view"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                            {imageViewerImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImageIndex(index);
                                        setSelectedImage(imageViewerImages[index]);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${index === selectedImageIndex
                                        ? 'bg-[#3FE1B6] w-4'
                                        : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );

    const renderSponsoredEventsContent = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h2 className="text-white text-xl">Events Sponsored</h2>
                <select className="w-full sm:w-auto bg-[#231D30] text-gray-400 px-4 py-2 rounded-lg">
                    <option>All events</option>
                </select>
            </div>

            <div className="space-y-4">
                {sponsoredEvents.length > 0 ? sponsoredEvents.map((event) => (
                    <Link to={`/event/${event._id}`} key={event._id} className="block bg-[#231D30] rounded-lg p-4 hover:bg-[#1A1625]/70 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <img
                                src={event.image || event.images?.[0] || "/Images/venues.png"}
                                alt={event.title || event.name}
                                className="w-16 h-16 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                            />

                            <div className="flex-1 w-full">
                                <h3 className="text-white text-lg font-medium mb-1">
                                    {event.title || event.name}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                    <IoLocationOutline className="w-4 h-4 flex-shrink-0" />
                                    <span className="line-clamp-1">
                                        {event.location?.address || event.location || "Location not specified"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <BsCalendarEvent className="w-4 h-4 flex-shrink-0" />
                                        <span>{new Date(event.startDate || event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaRegHeart className="w-4 h-4 flex-shrink-0" />
                                        <span>{event.likes || event.likesCount || 0} Likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaRegComment className="w-4 h-4 flex-shrink-0" />
                                        <span>{event.comments || event.commentsCount || 0} Comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )) : (
                    <div className="text-center text-gray-400 py-8">
                        <p>No sponsored events available</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderProductsContent = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="flex flex-col gap-1">
                    <h2 className="text-white text-xl">Products</h2>
                    <p className="text-gray-400 text-sm">
                        {exchangeRateLoading ? (
                            <span className="animate-pulse">Loading prices for your location...</span>
                        ) : (
                            `Prices shown in ${userCurrency.code} • ${country}`
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? products.map((product, index) => (
                    <div key={product._id || index} className="bg-[#231D30] rounded-lg overflow-hidden hover:bg-[#1A1625]/70 transition-colors">
                        <div className="relative">
                            <img
                                src={product.image ? `${import.meta.env.VITE_SERVER_URL}/${product.image.replace(/\\/g, '/')}` : "/Images/product-image.png"}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.target.src = "/Images/product-image.png";
                                }}
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-white text-lg font-medium mb-2 line-clamp-2">
                                {product.name}
                            </h3>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[#3FE1B6] text-xl font-bold">
                                        {exchangeRateLoading ? (
                                            <span className="animate-pulse">Loading...</span>
                                        ) : (
                                            `${userCurrency.symbol}${(product.price * exchangeRate).toFixed(2)}`
                                        )}
                                    </span>
                                    {userCurrency.code !== "INR" && !exchangeRateLoading && (
                                        <span className="text-gray-400 text-sm">
                                            ~₹{product.price.toFixed(2)} INR
                                        </span>
                                    )}
                                </div>
                                {/* <button className="bg-[#3FE1B6] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2fcfa4] transition-colors">
                                    View Details
                                </button> */}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center text-gray-400 py-8">
                        <p>No products available</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case "reviews":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-white text-xl">Reviews</h2>
                            <select
                                className="bg-[#231D30] text-gray-400 px-4 py-2 rounded-lg border border-gray-700"
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="top-rated">Top rated</option>
                                <option value="recent">Most recent</option>
                            </select>
                        </div>

                        {reviews.length > 0 ? reviews.map((review, index) => (
                            <div key={review._id || index} className="bg-[#231D30] rounded-lg p-6">
                                <div className="flex gap-4 mb-4">
                                    <img 
                                        src={review.reviewer?.profileImage || review.userImage || "/Images/default-avatar.jpg"} 
                                        alt="Reviewer" 
                                        className="w-12 h-12 rounded-full object-cover" 
                                    />
                                    <div>
                                        <h3 className="text-white font-medium">
                                            {review.reviewerName || 
                                             review.userName || 
                                             (review.reviewer ? `${review.reviewer.firstName} ${review.reviewer.lastName}` : 'Anonymous')}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {review.reviewerRole || review.userType || 'User'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-4">{review.comment}</p>
                                {review.additionalComment && (
                                    <p className="text-gray-400 mb-4">
                                        {review.additionalComment}
                                    </p>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-yellow-400">★</span>
                                        <span className="text-white ml-1">{review.rating} Rating</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-400 py-8">
                                <p>No reviews yet</p>
                            </div>
                        )}

                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h3 className="text-white mb-4">
                                Say something about {sponsor.businessName || sponsor.contactName || 'this sponsor'}
                            </h3>
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRatingSelect(star)}
                                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Any feedback? (optional)"
                                className="w-full bg-[#1A1625] text-gray-400 rounded-lg p-4 min-h-[100px] mb-4"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleReviewSubmit}
                                    className="bg-[#3FE1B6] text-black px-8 py-2 rounded-md hover:bg-[#2fcfa4] transition-colors"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case "posts":
                return renderPostsContent();
            case "sponsoredEvents":
                return renderSponsoredEventsContent();
            case "products":
                return renderProductsContent();
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#0E0F13] min-h-screen text-white font-sen pb-32">
            <div className="p-4 pl-16">
                <button className="text-white hover:text-gray-300">← Back</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
                <div className="flex-1">
                    <div className="relative">
                        <div className="relative px-8">
                            <div className="absolute left-8 -top-25">
                                <div className="w-32 h-32 rounded-full border-4 border-[#1A1625] overflow-hidden">
                                    <img
                                        src={sponsor.businessLogo ? `${import.meta.env.VITE_SERVER_URL}/${sponsor.businessLogo}` : "/Images/default-avatar.jpg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="pt-36">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-2xl text-white font-bold">{sponsor.businessName || mockSponsor.name}</h1>
                                        <p className="text-[#3FE1B6] text-sm">Sponsor</p>
                                        <p className="text-gray-400 text-sm">
                                            {sponsor.location?.address ? 
                                                `${sponsor.location.address}, ${sponsor.location.city || ''}, ${sponsor.location.state || ''}` : 
                                                mockSponsor.location
                                            }
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-white text-sm">{sponsor.followers?.length || 0} followers</span>
                                            <span className="text-gray-400">•</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">⭐</span>
                                                <span className="text-white text-sm">
                                                    {calculateAverageRating()} rating ({totalReviews} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleFollowToggle}
                                            disabled={isFollowingLoading}
                                            className={`w-fit mt-3 px-6 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${
                                                isFollowing 
                                                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                                                    : 'bg-[#3FE1B6] text-black hover:bg-[#2fcfa4]'
                                            } ${isFollowingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <img src={followIcon} alt="follow" className="w-5 h-5" />
                                            {isFollowingLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                    </div>

                                    <div className="mt-8 lg:mt-0 lg:w-1/3">
                                        <h2 className="text-white text-xl">About me</h2>
                                        <p className="text-gray-400 mt-2">{sponsor.description || mockSponsor.description}</p>
                                        {sponsor.preferredEvents && sponsor.preferredEvents.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="text-white text-sm font-medium mb-2">Preferred Events:</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {sponsor.preferredEvents.map((event, index) => (
                                                        <span key={index} className="bg-[#3FE1B6] text-black px-2 py-1 rounded text-xs">
                                                            {event}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="relative mt-8 border-b border-gray-700">
                                    <div className="flex overflow-x-auto scrollbar-hide pb-2">
                                        <div className="flex gap-8 min-w-max px-4 sm:px-0">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`pb-2 whitespace-nowrap ${activeTab === tab.id
                                                        ? "text-[#3FE1B6] border-b-2 border-[#3FE1B6]"
                                                        : "text-gray-400"
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 sm:px-8 mt-8">
                        {renderTabContent()}
                    </div>
                </div>

                {/* Right Sidebar - match profile page */}
                <div className="hidden lg:block w-full lg:w-[380px] space-y-6">
                    {/* Upcoming Events */}
                    <div className="rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl">Upcoming Events</h2>
                            <Link to="/events/all/all" className="text-[#00FFB2] text-sm">See more</Link>
                        </div>
                        <div className="space-y-4">
                            {upcomingEvents && upcomingEvents.length > 0 ? (
                                upcomingEvents.slice(0, 2).map(event => (
                                    <Link
                                        to={`/event/${event._id || event.id}`}
                                        key={event._id || event.id}
                                        className="block border border-white/10 rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-[#2A2C37] transition-colors"
                                    >
                                        <img
                                            src={event.banner?.url ? `${import.meta.env.VITE_SERVER_URL}${event.banner.url}` : event.image || "/Images/post.png"}
                                            alt={event.title}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white text-lg font-medium mb-2 m-0">{event.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                                <IoLocationOutline className="w-4 h-4" />
                                                <span>{event.location?.address || event.location || "Location TBD"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                                <IoCalendarOutline className="w-4 h-4" />
                                                <span>{event.startDate ? new Date(event.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : event.date || "Date TBD"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                                <IoTimeOutline className="w-4 h-4" />
                                                <span>{event.startDate && event.endDate ? `${new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : event.time || "Time TBD"}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-2">
                                                <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                                                <span className="text-[#C5FF32] text-sm">{event.stats?.interested || event.interested || 0} interested</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-400 text-sm">No upcoming events</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl">Suggestions</h2>
                            <Link to="/suggestions" className="text-gray-400 text-sm hover:text-[#00FFB2]">See All</Link>
                        </div>
                        <div className="space-y-4">
                            {suggestions.filter(s => !following.some(f => f._id === s._id)).map((suggestion) => (
                                <div
                                    key={suggestion._id}
                                    className="flex items-center justify-between hover:bg-[#2A2C37] transition-colors rounded-lg p-2"
                                >
                                    <Link 
                                        to={`/curator/${suggestion._id}`}
                                        className="flex items-center gap-3 flex-grow"
                                    >
                                        <img src={suggestion.images?.[0] ? `${import.meta.env.VITE_SERVER_URL}${suggestion.images[0]}` : "/Images/default-avatar.jpg"} alt={suggestion.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h3 className="text-white m-0">{suggestion.firstName} {suggestion.lastName}</h3>
                                            <div className="flex items-center border border-white/10 rounded-2xl py-1 px-3 max-w-fit">
                                                <span className="text-yellow-400 text-sm">★</span>
                                                <span className="text-gray-400 text-sm ml-1">{suggestion.averageRating || 0}</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <button className="bg-[#3FE1B6] text-black px-4 py-1 rounded-2xl text-sm hover:bg-[#3FE1B6]/90" onClick={e => { e.stopPropagation(); handleFollow(suggestion._id); }}>
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SponserPage;
