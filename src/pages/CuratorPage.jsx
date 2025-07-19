import React, { useState, useCallback, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { FaInstagram, FaTwitter, FaFacebook, FaStar, FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoEyeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { BsCalendarEvent } from 'react-icons/bs';
import followIcon from '/icons/follow.svg';
import { useParams } from "react-router-dom";
import axiosInstance from "@/configs/axiosConfig";
import { toast } from 'react-toastify';

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

const CuratorPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("reviews");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [curator, setCurator] = useState({
        _id: "",
        email: "",
        firstName: "",
        lastName: "",
        stageName: "",
        bio: "",
        images: [],
        followers: [],
        followingCount: 0,
        averageRating: 0,
        totalRatings: 0,
        role: "curator",
        posts: [],
        ratings: [],
        createdAt: "",
        updatedAt: ""
    });
    const { id } = useParams();
    const [reviews, setReviews] = useState([
    ]);
    const [sortBy, setSortBy] = useState('top-rated');
    const [posts, setPosts] = useState([]);
    const [commentInputs, setCommentInputs] = useState({}); // { [postId]: commentText }
    const [commentLoading, setCommentLoading] = useState({}); // { [postId]: boolean }
    const [likeLoading, setLikeLoading] = useState({}); // { [postId]: boolean }
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageViewerImages, setImageViewerImages] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [following, setFollowing] = useState([]); // For filtering suggestions
    const [interestedEvents, setInterestedEvents] = useState(new Set());
    const [interestLoading, setInterestLoading] = useState({});
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchCurator = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get(`management/curators/${id}`);
                if (data) {
                    setCurator(data);
                    // Set reviews from API response
                    setReviews(data.reviews || []);
                    // Check if current user is following this curator
                    const token = localStorage.getItem('accessToken');
                    if (token && data.followers) {
                        try {
                            const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
                            const isCurrentlyFollowing = data.followers.some(
                                follower => follower._id === currentUserId || follower.user === currentUserId
                            );
                            setIsFollowing(isCurrentlyFollowing || false);
                        } catch (error) {
                            setIsFollowing(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching curator:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axiosInstance.get(`/profiles/curator/${id}/posts`, { headers });
                console.log(res.data, 'res.data');
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
                            author: post.author?.stageName || post.author?.name || post.author?.firstName || 'Curator',
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
                    console.log(normalizedPosts, 'normalizedPosts');
                    setPosts(normalizedPosts);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error('Error fetching curator posts:', error);
            }
        };
        // Fetch upcoming events (profile logic)
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
                            console.error('All events API attempts failed:', error3);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching upcoming events:', error);
            }
        };
        // Fetch suggestions (profile logic)
        const fetchSuggestions = async () => {
            try {
                const response = await axiosInstance.get('trending/curators');
                setSuggestions(response.data.data || []);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };
        // Get current user data
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUserData({ _id: decoded.id, role: decoded.role });
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        fetchCurator();
        fetchPosts();
        fetchUpcomingEvents();
        fetchSuggestions();
    }, [id]);

    // const curator = {
    //     name: "DJ Kazi",
    //     type: "Curator",
    //     location: "Lagos, Nigeria",
    //     followers: "2.3k",
    //     rating: 4.5,
    //     reviews: 32,
    //     description: "Your description goes here",
    //     socialLinks: {
    //         instagram: "#",
    //         twitter: "#",
    //         facebook: "#"
    //     }
    // };

    const calculateAverageRating = useCallback(() => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    }, [reviews]);

    const totalReviews = reviews.length;

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
            // Add review to curator
            const res = await axiosInstance.post(`/profiles/curator/${id}/review`, {
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

    const handlePostLike = useCallback((postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                        isLiked: !post.isLiked
                    };
                }
                return post;
            })
        );
    }, []);

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

    const handleFollowToggle = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error('Please login to follow');
            return;
        }
        setIsFollowingLoading(true);
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
            await axiosInstance.post(`/profiles/curator/${id}/${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(!isFollowing);
            setCurator(prev => ({
                ...prev,
                followers: isFollowing
                    ? (prev.followers || []).filter(f => f._id !== id && f.user !== id)
                    : [...(prev.followers || []), { _id: id }]
            }));
            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update follow status');
        } finally {
            setIsFollowingLoading(false);
        }
    }, [isFollowing, id]);

    const handleLikePost = useCallback(async (postId) => {
        setLikeLoading(prev => ({ ...prev, [postId]: true }));
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to like posts');
                setLikeLoading(prev => ({ ...prev, [postId]: false }));
                return;
            }
            // Optimistic update
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                } : post
            ));
            // API call
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
            // Revert optimistic update
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
            // Optimistic UI
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
            // API call
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
            // Revert optimistic UI
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
            const response = await axiosInstance.post(`profiles/curator/${userId}/follow`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.data) {
                toast.success('Followed successfully');
                // Update suggestions to remove the followed user
                setSuggestions(prev => prev.filter(s => s._id !== userId));
            }
        } catch (error) {
            console.error('Error following curator:', error);
            toast.error('Failed to follow curator');
        }
    };

    // Check if user is interested in an event
    const isUserInterestedInEvent = (event) => {
        if (!userData) return false;
        
        // Check if the event has an interested array
        if (event.interested && Array.isArray(event.interested)) {
            const isInterested = event.interested.some(interest => 
                interest.user === userData._id || interest.user === userData.id
            );
            return isInterested;
        }
        
        // Fallback to interestedEvents set
        return interestedEvents.has(event._id || event.id);
    };

    // Event interest toggle functionality
    const handleEventInterestToggle = async (eventId) => {
        try {
            setInterestLoading(prev => ({ ...prev, [eventId]: true }));
            
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to mark events as interested');
                return;
            }

            const response = await axiosInstance.post(`/events/${eventId}/interest`);
            
            if (response.data) {
                const { isInterested, totalInterested } = response.data;
                
                // Update interested events set
                setInterestedEvents(prev => {
                    const newSet = new Set(prev);
                    if (isInterested) {
                        newSet.add(eventId);
                    } else {
                        newSet.delete(eventId);
                    }
                    return newSet;
                });
                
                // Update the event's interested count in upcoming events
                setUpcomingEvents(prev => prev.map(event => {
                    if (event._id === eventId || event.id === eventId) {
                        // If the API returns the updated interested array, use it
                        if (response.data.interested && Array.isArray(response.data.interested)) {
                            return { ...event, interested: response.data.interested };
                        }
                        // Otherwise, manually update the array
                        const currentInterested = event.interested || [];
                        const updatedInterested = isInterested 
                            ? [...currentInterested, { user: userData._id, userModel: userData.role }]
                            : currentInterested.filter(interest => interest.user !== userData._id);
                        return { ...event, interested: updatedInterested };
                    }
                    return event;
                }));
                
                toast.success(isInterested ? 'Marked as interested!' : 'Removed from interested!');
            }
        } catch (error) {
            console.error('Error toggling event interest:', error);
            toast.error(error.response?.data?.message || 'Failed to toggle interest status');
        } finally {
            setInterestLoading(prev => ({ ...prev, [eventId]: false }));
        }
    };

    const renderReviewsContent = () => (
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
                <h3 className="text-white mb-4">Say something about {curator.stageName || `${curator.firstName} ${curator.lastName}`}</h3>
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
                    placeholder="Any feedback? (required)"
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

    const renderPostsContent = () => (
        <div className="space-y-6">
            {posts.map((post) => (
                <div key={post.id} className="bg-[#231D30] rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img
                                    src={post.author?.profileImage ? `${import.meta.env.VITE_SERVER_URL}${post.author.profileImage}` : "/Images/default-avatar.jpg"}
                                    alt={post.author?.name || post.author || 'Curator'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{post.author?.name || post.author || 'Curator'}</h3>
                                <p className="text-gray-400 text-sm">{post.timeAgo}</p>
                            </div>
                        </div>
                        {/* 3-dot menu icon removed */}
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
                        {/* Eye (views) icon removed */}
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
                    {/* Comments and add comment input removed from here */}
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
                                        {/* Current Image */}
                                        <img
                                            src={selectedPost.images[currentImageIndex]}
                                            alt={`Post ${currentImageIndex + 1}`}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.src = "/Images/post.png";
                                            }}
                                        />
                                        {/* Navigation Arrows - Only show if multiple images */}
                                        {selectedPost.images.length > 1 && (
                                            <>
                                                {/* Previous Button */}
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
                                                {/* Next Button */}
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
                                                {/* Image Indicators */}
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
                                                {/* Image Counter */}
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
                                {/* Post content */}
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
                                {/* Comments */}
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
                                {/* Add comment */}
                                <div className="p-4 border-t border-white/10">
                                    <div className="flex gap-3">
                                        <img
                                            src={curator?.images?.[0] ? `${import.meta.env.VITE_SERVER_URL}${curator.images[0]}` : "/Images/default-avatar.jpg"}
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

    const renderTabContent = () => {
        switch (activeTab) {
            case "reviews":
                return renderReviewsContent();
            case "posts":
                return renderPostsContent();
            default:
                return null;
        }
    };

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    return (
        <div className="bg-[#0E0F13] min-h-screen text-white font-sen pb-32">
            <div className="p-4">
                <button className="text-white hover:text-gray-300">← Back</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8 pb-8">
                <div className="flex-1">
                    <div className="relative">
                        <div className="relative h-48 rounded-t-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1F1B87] to-[#7B1B87] opacity-80"></div>
                            <div className="absolute inset-0 bg-[url('/Images/coverimg.png')] bg-cover bg-center mix-blend-overlay"></div>
                            {/* <button className="absolute right-4 top-4 bg-white hover:bg-gray-100 text-black px-4 py-1 rounded-md text-sm z-10">
                                Change Image
                            </button> */}
                        </div>

                        <div className="relative px-8">
                            <div className="absolute left-8 -top-16">
                                <div className="w-32 h-32 rounded-full border-4 border-[#1A1625] overflow-hidden">
                                    <img
                                        src={`${import.meta.env.VITE_SERVER_URL}${curator.images[0]}` || "/Images/default-avatar.jpg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="pt-20">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-2xl text-white font-bold">{curator.stageName || `${curator.firstName} ${curator.lastName}`}</h1>
                                        <p className="text-[#3FE1B6] text-sm">{curator.role}</p>
                                        <p className="text-gray-400 text-sm">{curator.location}</p>

                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-white text-sm">{curator.followers?.length || 0} followers</span>
                                            <span className="text-gray-400">•</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">⭐</span>
                                                <span className="text-white text-sm">
                                                    {curator.averageRating || 0} rating ({curator.totalRatings || 0} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={handleFollowToggle}
                                                disabled={isFollowingLoading}
                                                className={`w-fit bg-[#3FE1B6] text-black px-6 py-1.5 rounded-md text-sm flex items-center gap-2 ${isFollowingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <img src={followIcon} alt="follow" className="w-5 h-5" />
                                                {isFollowingLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 lg:mt-0 lg:w-1/3">
                                        <h2 className="text-white text-xl">About me</h2>
                                        <p className="text-gray-400 mt-2">{curator.bio}</p>
                                    </div>
                                </div>

                                <div className="relative mt-8 border-b border-gray-700">
                                    <div className="flex overflow-x-auto scrollbar-hide pb-2">
                                        <div className="flex gap-8 min-w-max px-4 sm:px-0">
                                            {[
                                                { id: "reviews", label: "Reviews/Rating" },
                                                { id: "posts", label: "Posts" }
                                            ].map((tab) => (
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
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleEventInterestToggle(event._id || event.id);
                                                    }}
                                                    disabled={interestLoading[event._id || event.id]}
                                                    className="flex items-center gap-1 hover:scale-105 transition-transform disabled:opacity-50"
                                                >
                                                    {isUserInterestedInEvent(event) ? (
                                                        <FaStar className="w-4 h-4 text-[#C5FF32]" />
                                                    ) : (
                                                        <FaStar className="w-4 h-4 text-[#7c7d7b] hover:text-[#C5FF32] transition-colors" />
                                                    )}
                                                    <span className="text-[#C5FF32] text-sm">
                                                        {Array.isArray(event?.interested) ? event.interested.length : (event?.interested || 0)} interested
                                                    </span>
                                                </button>
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

export default CuratorPage;
