import React, { useState, useCallback, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoEyeOutline } from 'react-icons/io5';
import { FaStar, FaRegHeart, FaRegComment, FaHeart } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { BsCalendarEvent } from 'react-icons/bs';
import followIcon from '/icons/follow.svg';
import axiosInstance from "@/configs/axiosConfig";
import toast from "react-hot-toast";

// Define available tabs
const tabs = [
    { id: "reviews", label: "Reviews" },
    { id: "gallery", label: "Gallery" }
];

const EventVenuePage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("reviews");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('top-rated');
    const [posts, setPosts] = useState([]);
    const [events, setEvents] = useState([]);
    const [venue, setVenue] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [postSort, setPostSort] = useState('recent');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [amenities, setAmenities] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalEvents, setTotalEvents] = useState(0);
    
    // Helper function to handle image URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/Images/post.png";
        
        // Check if it's already a full URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // If it's a relative path starting with /
        if (imagePath.startsWith('/')) {
            return `${import.meta.env.VITE_SERVER_URL || ''}${imagePath}`;
        }
        
        // If it's a relative path without /
        return `${import.meta.env.VITE_SERVER_URL || ''}/${imagePath}`;
    };
    
    // Fetch venue data
    const fetchVenueData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/venues/${id}`);
            
            // Store venue data
            setVenue(response.data);
            console.log("Venue data:", response.data);
            
            // Set amenities if available
            if (response.data.amenities && Array.isArray(response.data.amenities)) {
                setAmenities(response.data.amenities);
            }
            
            // Handle reviews
            if (response.data.reviews && Array.isArray(response.data.reviews)) {
                const formattedReviews = response.data.reviews.map(review => ({
                    id: review._id,
                    userName: review.reviewerName || 'Anonymous',
                    userType: review.reviewerRole || 'Guest',
                    userImage: review.reviewer?.profileImage ? getImageUrl(review.reviewer.profileImage) : "/Images/default-avatar.jpg",
                    rating: review.rating,
                    comment: review.comment,
                    additionalComment: review.additionalComment || '',
                    createdAt: new Date(review.createdAt)
                }));
                
                const sortedReviews = sortReviews(formattedReviews, sortBy);
                setReviews(sortedReviews);
            }
            
            // Handle gallery images - first check gallery photos
            if (response.data.gallery && response.data.gallery.photos && response.data.gallery.photos.length > 0) {
                // Format gallery images for the UI
                const formattedGalleryImages = response.data.gallery.photos.map(photo => ({
                    id: photo._id,
                    url: getImageUrl(photo.url),
                    caption: photo.caption || '',
                    likes: photo.likes || 0,
                    views: photo.views || 0
                }));
                
                setGalleryImages(formattedGalleryImages);
            } 
            // If no gallery photos but venue has images array, use those
            else if (response.data.images && Array.isArray(response.data.images) && response.data.images.length > 0) {
                const formattedGalleryImages = response.data.images.map((imageUrl, index) => ({
                    id: `image-${index}`,
                    url: getImageUrl(imageUrl),
                    caption: '',
                    likes: 0,
                    views: 0
                }));
                
                setGalleryImages(formattedGalleryImages);
            } else {
                // No images available
                setGalleryImages([]);
            }
            
        } catch (error) {
            console.error("Error fetching venue data:", error);
            toast.error("Failed to fetch venue details");
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch venue reviews
    const fetchVenueReviews = async () => {
        try {
            // If we already have reviews from the venue data, skip this request
            if (reviews.length > 0) return;
            
            const response = await axiosInstance.get(`/venues/${id}/reviews`);
            if (response.data && response.data.reviews && Array.isArray(response.data.reviews)) {
                const formattedReviews = response.data.reviews.map(review => ({
                    id: review._id,
                    userName: review.reviewerName || 'Anonymous',
                    userType: review.reviewerRole || 'Guest',
                    userImage: review.reviewer?.profileImage ? getImageUrl(review.reviewer.profileImage) : "/Images/default-avatar.jpg",
                    rating: review.rating,
                    comment: review.comment,
                    additionalComment: review.additionalComment || '',
                    createdAt: new Date(review.createdAt)
                }));
                
                const sortedReviews = sortReviews(formattedReviews, sortBy);
                setReviews(sortedReviews);
            }
        } catch (error) {
            console.error("Error fetching venue reviews:", error);
            toast.error("Failed to fetch venue reviews");
        }
    };
    
    // Fetch venue events
    const fetchVenueEvents = async () => {
        try {
            // We need to query events by venue
            const response = await axiosInstance.get(`/events?venue=${id}`);
            
            if (response.data && Array.isArray(response.data)) {
                const formattedEvents = response.data.map(event => ({
                    _id: event._id,
                    title: event.title,
                    location: event.location?.address || "Location not specified",
                    date: new Date(event.startDate).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                    }),
                    time: `${event.startTime || '00:00'} - ${event.endTime || '00:00'}`,
                    interested: event.interested?.length || 0,
                    image: event.images && event.images.length > 0 
                        ? getImageUrl(event.images[0]) 
                        : "/Images/venues.png"
                }));
                
                setEvents(formattedEvents);
                setUpcomingEvents(formattedEvents.filter(event => 
                    new Date(event.date) >= new Date()).slice(0, 3)
                );
            }
        } catch (error) {
            console.error("Error fetching venue events:", error);
            toast.error("Failed to fetch events for this venue");
        }
    };
    
    // Fetch venue owner posts (if applicable)
    const fetchVenuePosts = async () => {
        try {
            if (venue && venue.owner) {
                const ownerId = venue.owner._id;
                // Get venue owner profile which includes posts
                const response = await axiosInstance.get(`/profiles/venue-owner/${ownerId}`);
                
                if (response.data && response.data.feed) {
                    const formattedPosts = response.data.feed.map(post => ({
                        id: post._id,
                        author: response.data.firstName + ' ' + response.data.lastName || "Venue Owner",
                        timeAgo: formatTimeAgo(new Date(post.createdAt)),
                        content: post.content,
                        images: post.images && post.images.length > 0 
                            ? post.images.map(img => getImageUrl(img)) 
                            : ["/Images/post.png"],
                        views: post.views || 0,
                        likes: post.likes?.length || 0,
                        comments: post.comments?.length || 0,
                        isLiked: post.likes?.includes(post.currentUserId) || false
                    }));
                    
                    setPosts(formattedPosts);
                }
            }
        } catch (error) {
            console.error("Error fetching venue owner posts:", error);
        }
    };
    
    // Format time ago for posts
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
    
    // Sort reviews function
    const sortReviews = (reviewsToSort, sortValue) => {
        return [...reviewsToSort].sort((a, b) => {
            switch (sortValue) {
                case 'recent':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'top-rated':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });
    };
    
    // Handle follow/unfollow venue owner
    const handleFollowToggle = async () => {
        try {
            if (!venue || !venue.owner) return;
            
            const endpoint = isFollowing 
                ? `/profiles/venue-owner/${venue.owner._id}/unfollow`
                : `/profiles/venue-owner/${venue.owner._id}/follow`;
                
            await axiosInstance.post(endpoint);
            
            setIsFollowing(!isFollowing);
            toast.success(isFollowing ? "Unfollowed successfully" : "Following successfully");
            
        } catch (error) {
            console.error("Error toggling follow status:", error);
            toast.error("Failed to update follow status");
        }
    };
    
    // Load data when component mounts or when venue ID changes
    useEffect(() => {
        if (id) {
            fetchVenueData();
        }
    }, [id]);
    
    // Once venue data is loaded, fetch related data
    useEffect(() => {
        if (venue) {
            fetchVenueReviews();
            fetchVenueEvents();
            fetchVenuePosts();
            setLoading(false);
        }
    }, [venue]);
    
    // Update totals when posts or events change
    useEffect(() => {
        setTotalPosts(posts.length);
        setTotalEvents(events.length);
    }, [posts, events]);
    
    // Update when sort option changes
    useEffect(() => {
        if (reviews.length > 0) {
            setReviews(sortReviews([...reviews], sortBy));
        }
    }, [sortBy]);

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
        
        if (!reviewText || reviewText.trim() === '') {
            toast.error('Please enter a review comment');
            return;
        }

        try {
            // Make API call to submit review
            const response = await axiosInstance.post(`/venues/${id}/review`, {
                rating,
                comment: reviewText
            });
            
            if (response.data) {
                // Get user info from the response or use defaults
                const user = response.data.reviewer || {};
                
                const newReview = {
                    id: response.data._id,
                    userName: user.firstName ? `${user.firstName} ${user.lastName || ''}` : "You",
                    userType: user.role || "Guest",
                    userImage: user.profileImage ? getImageUrl(user.profileImage) : "/Images/default-avatar.jpg",
                    rating,
                    comment: reviewText,
                    createdAt: new Date()
                };

                setReviews(prev => [newReview, ...prev]);
                setRating(0);
                setReviewText('');
                toast.success('Review submitted successfully');
            }
        } catch (error) {
            toast.error('Failed to submit review');
            console.error('Error submitting review:', error);
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

    const handlePostLike = useCallback(async (postId) => {
        try {
            // Make API call to like/unlike post
            await axiosInstance.post(`/profiles/posts/${postId}/like`);
            
            // Update local state for immediate UI feedback
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
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to like post");
        }
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

    const openImageViewer = (image, index) => {
        setSelectedImage(image);
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
        setIsImageViewerOpen(false);
    };

    const navigateImage = (direction) => {
        let newIndex;
        if (direction === 'next') {
            newIndex = (selectedImageIndex + 1) % galleryImages.length;
        } else {
            newIndex = selectedImageIndex - 1;
            if (newIndex < 0) newIndex = galleryImages.length - 1;
        }
        setSelectedImageIndex(newIndex);
        setSelectedImage(galleryImages[newIndex].url);
    };

    const renderPostsContent = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl">Posts</h2>
                <select
                    className="bg-[#231D30] text-gray-400 px-4 py-2 rounded-lg"
                    value={postSort}
                    onChange={(e) => setPostSort(e.target.value)}
                >
                    <option value="recent">Most recent</option>
                    <option value="popular">Most popular</option>
                </select>
            </div>

            {posts.map((post) => (
                <div key={post.id} className="bg-[#231D30] rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img
                                    src="/Images/default-avatar.jpg"
                                    alt={post.author}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{post.author}</h3>
                                <p className="text-gray-400 text-sm">{post.timeAgo}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 text-xl">•••</button>
                    </div>

                    <div className="mb-4">
                        {formatPostContent(post.content)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {post.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => openImageViewer(image, index)}
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
                        <div className="flex items-center gap-1.5">
                            <IoEyeOutline className="w-4 h-4" />
                            <span>{post.views}</span>
                        </div>
                        <button
                            onClick={() => handlePostLike(post.id)}
                            className="flex items-center gap-1.5 hover:text-[#3FE1B6] transition-colors"
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
                        <button className="flex items-center gap-1.5 hover:text-[#3FE1B6] transition-colors">
                            <FaRegComment className="w-4 h-4" />
                            <span>{post.comments} Comment</span>
                        </button>
                    </div>
                </div>
            ))}

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

                        <div className="relative max-w-5xl w-full mx-4">
                            <img
                                src={selectedImage}
                                alt="Enlarged view"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-8 text-white">
                                <div className="flex items-center gap-2">
                                    <IoEyeOutline className="w-5 h-5" />
                                    <span>{galleryImages[selectedImageIndex]?.views}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaHeart className="w-5 h-5" />
                                    <span>{galleryImages[selectedImageIndex]?.likes}</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                            {galleryImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImageIndex(index);
                                        setSelectedImage(galleryImages[index].url);
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

    const renderEventsContent = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h2 className="text-white text-xl">Events</h2>
                <select className="w-full sm:w-auto bg-[#231D30] text-gray-400 px-4 py-2 rounded-lg">
                    <option>All events</option>
                    <option>Upcoming</option>
                    <option>Past</option>
                </select>
            </div>

            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event._id} className="bg-[#231D30] rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-16 h-16 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                                />

                                <div className="flex-1 w-full">
                                    <h3 className="text-white text-lg font-medium mb-1">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                        <IoLocationOutline className="w-4 h-4 flex-shrink-0" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 text-sm">
                                        <div className="flex items-center gap-2">
                                            <IoCalendarOutline className="w-4 h-4 flex-shrink-0" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <IoTimeOutline className="w-4 h-4 flex-shrink-0" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                                            <span className="text-[#C5FF32]">{event.interested} interested</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#231D30] rounded-lg p-6 text-center">
                        <p className="text-gray-400">No events available for this venue</p>
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

                        <div className="bg-[#231D30] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="text-5xl font-bold text-white">{calculateAverageRating()}</div>
                                    <div>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= calculateAverageRating() ? "text-[#3FE1B6]" : "text-gray-600"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-sm">{totalReviews} reviews</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-white">Leave a review</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => handleRatingSelect(star)}
                                                className="focus:outline-none"
                                            >
                                                <FaStar
                                                    className={`w-6 h-6 ${star <= rating ? "text-[#3FE1B6]" : "text-gray-600"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Write your review here..."
                                        className="w-full bg-[#372D4C] text-white p-4 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#3FE1B6]"
                                    />
                                    <button
                                        onClick={handleReviewSubmit}
                                        className="bg-[#3FE1B6] text-[#231D30] font-medium px-6 py-2 rounded-lg hover:bg-[#2fd1a4] transition-colors mt-2"
                                    >
                                        Submit Review
                                    </button>
                                </div>

                                <div className="mt-8 space-y-6">
                                    {reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex gap-3">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                                            <img
                                                                src={review.userImage}
                                                                alt={review.userName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-medium">{review.userName}</h4>
                                                            <p className="text-gray-400 text-sm">{review.userType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <FaStar
                                                                key={star}
                                                                className={`w-4 h-4 ${star <= review.rating ? "text-[#3FE1B6]" : "text-gray-600"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 mb-2">{review.comment}</p>
                                                {review.additionalComment && (
                                                    <p className="text-gray-500 text-sm italic">{review.additionalComment}</p>
                                                )}
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-gray-400">No reviews yet. Be the first to leave a review!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "gallery":
                return (
                    <div className="space-y-6">
                        <h2 className="text-white text-xl">Photo Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {galleryImages.length > 0 ? (
                                galleryImages.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => openImageViewer(image.url, index)}
                                        className="relative rounded-lg overflow-hidden group aspect-square"
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                            <div className="flex items-center gap-4 text-white">
                                                <div className="flex items-center gap-1">
                                                    <IoEyeOutline className="w-4 h-4" />
                                                    <span>{image.views}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaHeart className="w-4 h-4" />
                                                    <span>{image.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-400">No gallery images available</p>
                                </div>
                            )}
                        </div>

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

                                    <div className="relative max-w-5xl w-full mx-4">
                                        <img
                                            src={selectedImage}
                                            alt="Enlarged view"
                                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                        />

                                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-8 text-white">
                                            <div className="flex items-center gap-2">
                                                <IoEyeOutline className="w-5 h-5" />
                                                <span>{galleryImages[selectedImageIndex]?.views}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaHeart className="w-5 h-5" />
                                                <span>{galleryImages[selectedImageIndex]?.likes}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                                        {galleryImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSelectedImageIndex(index);
                                                    setSelectedImage(galleryImages[index].url);
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
            case "posts":
                return renderPostsContent();
            case "events":
                return renderEventsContent();
            default:
                return null;
        }
    };

    // Return the main component
    return (
        <div className="min-h-screen bg-[#1A1625] text-white">
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3FE1B6]"></div>
                </div>
            ) : venue ? (
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div className="bg-[#231D30] rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                                        <h1 className="text-2xl sm:text-3xl font-semibold text-white">{venue.name}</h1>
                                        <div className="flex items-center gap-2">
                                            <div className="text-[#3FE1B6] flex items-center">
                                                <FaStar className="mr-1 text-[#3FE1B6]" />
                                                <span className="font-semibold">{calculateAverageRating()}</span>
                                                <span className="text-gray-400 text-sm ml-1">({totalReviews} reviews)</span>
                                            </div>
                                            <button
                                                onClick={handleFollowToggle}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                                                    isFollowing
                                                        ? "bg-[#3FE1B6]/20 text-[#3FE1B6]"
                                                        : "bg-[#372D4C] text-gray-300"
                                                }`}
                                            >
                                                <img src={followIcon} alt="Follow" className="w-4 h-4" />
                                                <span>{isFollowing ? "Following" : "Follow"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 mb-8">{venue.description}</p>

                                    {/* Amenities Section */}
                                    {amenities.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-white text-lg mb-3">Amenities</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {amenities.map((amenity, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="bg-[#372D4C] text-gray-300 px-3 py-1 rounded-lg text-sm"
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">                                            <div className="flex flex-col lg:flex-row gap-6 items-start">
                                            <div className="flex items-start gap-2 flex-1">
                                                <img src="/icons/location-icon.svg" alt="Location Icon" className="w-5 h-5 mt-1" />
                                                <p className="text-gray-400 text-lg">
                                                    {venue.location ? 
                                                        `${venue.location.address}, ${venue.location.city}, ${venue.location.state}, ${venue.location.country} ${venue.location.postalCode || ''}` : 
                                                        "Location not specified"}
                                                </p>
                                            </div>
                                            <div className="w-full lg:w-[350px] h-[200px]">
                                                {venue.location && venue.location.gpsCoordinates && 
                                                 venue.location.gpsCoordinates.latitude && 
                                                 venue.location.gpsCoordinates.longitude ? (
                                                    <iframe
                                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${venue.location.gpsCoordinates.latitude},${venue.location.gpsCoordinates.longitude}`}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        title="Venue Location Map"
                                                    ></iframe>
                                                ) : (
                                                    <iframe
                                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                                                            venue.location ? 
                                                                `${venue.location.address}, ${venue.location.city}, ${venue.location.state}, ${venue.location.country}` : 
                                                                venue.name
                                                        )}`}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        title="Venue Location Map"
                                                    ></iframe>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative mt-8 border-b border-gray-700">
                                    <div className="flex overflow-x-auto scrollbar-hide pb-2">
                                        <div className="flex gap-8 min-w-max px-4 sm:px-0">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`pb-2 whitespace-nowrap ${
                                                        activeTab === tab.id
                                                            ? "text-[#3FE1B6] border-b-2 border-[#3FE1B6]"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setActiveTab("posts")}
                                                className={`pb-2 whitespace-nowrap ${
                                                    activeTab === "posts"
                                                        ? "text-[#3FE1B6] border-b-2 border-[#3FE1B6]"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                Posts {totalPosts > 0 && `(${totalPosts})`}
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("events")}
                                                className={`pb-2 whitespace-nowrap ${
                                                    activeTab === "events"
                                                        ? "text-[#3FE1B6] border-b-2 border-[#3FE1B6]"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                Events {totalEvents > 0 && `(${totalEvents})`}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 sm:px-8 mt-8">
                        {renderTabContent()}
                    </div>

                    <div className="w-full lg:w-[380px] space-y-6 mt-8">
                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h2 className="text-white text-xl mb-4">Capacity</h2>
                            <p className="text-[#3FE1B6] text-3xl font-bold">{venue.capacity}</p>
                            <p className="text-gray-400 mt-1">Maximum guests</p>
                        </div>

                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h2 className="text-white text-xl mb-4">Upcoming Events</h2>
                            <div className="space-y-4">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map((event) => (
                                        <Link
                                            key={event._id}
                                            to={`/events/${event._id}`}
                                            className="group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium group-hover:text-[#3FE1B6] transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                        <BsCalendarEvent className="w-3 h-3" />
                                                        <span>{event.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4">No upcoming events</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h2 className="text-white text-xl mb-4">Contact</h2>
                            {venue.contactInformation ? (
                                <div className="space-y-4">
                                    {venue.contactInformation.phone && (
                                        <div className="flex items-start gap-3">
                                            <img
                                                src="/icons/phone-icon.svg"
                                                alt="Phone"
                                                className="w-5 h-5 mt-0.5"
                                            />
                                            <div>
                                                <p className="text-gray-400">Phone</p>
                                                <a
                                                    href={`tel:${venue.contactInformation.phone}`}
                                                    className="text-white hover:text-[#3FE1B6] transition-colors"
                                                >
                                                    {venue.contactInformation.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {venue.contactInformation.email && (
                                        <div className="flex items-start gap-3">
                                            <img
                                                src="/icons/email-icon.svg"
                                                alt="Email"
                                                className="w-5 h-5 mt-0.5"
                                            />
                                            <div>
                                                <p className="text-gray-400">Email</p>
                                                <a
                                                    href={`mailto:${venue.contactInformation.email}`}
                                                    className="text-white hover:text-[#3FE1B6] transition-colors"
                                                >
                                                    {venue.contactInformation.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {venue.contactInformation.website && (
                                        <div className="flex items-start gap-3">
                                            <img
                                                src="/icons/website-icon.svg"
                                                alt="Website"
                                                className="w-5 h-5 mt-0.5"
                                            />
                                            <div>
                                                <p className="text-gray-400">Website</p>
                                                <a
                                                    href={venue.contactInformation.website.startsWith('http') ? 
                                                        venue.contactInformation.website : 
                                                        `https://${venue.contactInformation.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white hover:text-[#3FE1B6] transition-colors"
                                                >
                                                    {venue.contactInformation.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-400">No contact information available</p>
                            )}
                        </div>

                        {/* Venue availability calendar section */}
                        {venue.availabilityCalendar && venue.availabilityCalendar.length > 0 && (
                            <div className="bg-[#231D30] rounded-lg p-6">
                                <h2 className="text-white text-xl mb-4">Availability</h2>
                                <div className="space-y-3">
                                    {venue.availabilityCalendar.map((availability, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 border-b border-gray-700 last:border-0">
                                            <div>
                                                <p className="text-white">
                                                    {new Date(availability.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    {availability.isAvailable ? 'Available' : 'Not Available'}
                                                </p>
                                            </div>
                                            {availability.price && availability.isAvailable && (
                                                <p className="text-[#3FE1B6] font-medium">
                                                    ${availability.price.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h2 className="text-white text-xl mb-4">Social Media</h2>
                            <div className="flex items-center justify-center gap-6">
                                <a
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#372D4C] text-white hover:bg-[#3FE1B6] hover:text-[#231D30] transition-colors"
                                >
                                    <FaFacebook className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#372D4C] text-white hover:bg-[#3FE1B6] hover:text-[#231D30] transition-colors"
                                >
                                    <FaTwitter className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#372D4C] text-white hover:bg-[#3FE1B6] hover:text-[#231D30] transition-colors"
                                >
                                    <FaInstagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Venue not found</h2>
                        <p className="text-gray-400 mb-6">The venue you're looking for doesn't exist or has been removed.</p>
                        <Link to="/venues" className="px-6 py-3 bg-[#3FE1B6] text-[#231D30] rounded-lg font-medium hover:bg-[#2fd1a4] transition-colors">
                            Browse Venues
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventVenuePage;