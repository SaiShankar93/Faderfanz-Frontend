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
    const [reviewText, setReviewText] = useState('');    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('top-rated');
    const [posts, setPosts] = useState([]);
    const [sponsoredEvents, setSponsoredEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);

    useEffect(() => {
        const fetchSponsor = async () => {
            try {
                // Fetch sponsor profile (includes reviews)
                const res = await axiosInstance.get(`/management/sponsors/${id}`);
                if (res.data) {
                    console.log(res.data);
                    setSponsor(res.data);
                    setReviews(res.data.reviews || []);
                    setPosts(res.data.posts || []);
                    setSponsoredEvents(res.data.eventsSponsored || []);
                    setUpcomingEvents(res.data.eventsSponsored || []); // Using same data for upcoming events
                    
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
        fetchSponsor();
    }, [id]);

    const totalPosts = posts.length;
    const totalSponsoredEvents = sponsoredEvents.length;
    const tabs = [
        { id: "reviews", label: "Reviews/Rating" },
        { id: "posts", label: `Posts (${totalPosts})` },
        { id: "sponsoredEvents", label: `Events Sponsored (${totalSponsoredEvents})` }
    ];

    const [postSort, setPostSort] = useState('recent');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);    const calculateAverageRating = useCallback(() => {
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
    }, []);    const handleReviewSubmit = useCallback(async () => {
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
    }, [reviews]);    const handlePostLike = useCallback((postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === postId || post.id === postId) {
                    return {
                        ...post,
                        likes: post.isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
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

    const openImageViewer = (image) => {
        setSelectedImage(image);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
        setIsImageViewerOpen(false);
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
            </div>            {posts.length > 0 ? posts.map((post, index) => (
                <div key={post._id || index} className="bg-[#231D30] rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img
                                    src={post.authorImage || post.author?.profileImage || "/Images/default-avatar.jpg"}
                                    alt={post.author?.name || post.author || "Author"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{post.author?.name || post.author || "Unknown Author"}</h3>
                                <p className="text-gray-400 text-sm">{post.timeAgo || new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 text-xl">•••</button>
                    </div>

                    <div className="mb-4">
                        {formatPostContent(post.content || post.text || post.description || "")}
                    </div>

                    {(post.images && post.images.length > 0) || (post.media && post.media.length > 0) && (
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {(post.images || post.media || []).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => openImageViewer(image)}
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
                    )}

                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1.5">
                            <IoEyeOutline className="w-4 h-4" />
                            <span>{post.views || 0}</span>
                        </div>
                        <button
                            onClick={() => handlePostLike(post._id || index)}
                            className="flex items-center gap-1.5 hover:text-[#3FE1B6] transition-colors"
                        >
                            {post.isLiked ? (
                                <FaHeart className="w-4 h-4 text-[#3FE1B6]" />
                            ) : (
                                <FaRegHeart className="w-4 h-4" />
                            )}
                            <span className={post.isLiked ? "text-[#3FE1B6]" : ""}>
                                {post.likes || 0} Like
                            </span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-[#3FE1B6] transition-colors">
                            <FaRegComment className="w-4 h-4" />
                            <span>{post.comments?.length || post.comments || 0} Comment</span>
                        </button>
                    </div>
                </div>
            )) : (
                <div className="text-center text-gray-400 py-8">
                    <p>No posts available</p>
                </div>
            )}

            <Dialog
                open={isImageViewerOpen}
                onClose={closeImageViewer}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="relative max-w-4xl w-full">
                        <button
                            onClick={closeImageViewer}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            ✕
                        </button>

                        <img
                            src={selectedImage}
                            alt="Enlarged view"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
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
            </div>            <div className="space-y-4">
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
                        </div>                        {reviews.length > 0 ? reviews.map((review, index) => (
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
                        )}                        <div className="bg-[#231D30] rounded-lg p-6">
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
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#0E0F13] min-h-screen text-white font-sen pb-32">
            <div className="p-4">
                <button className="text-white hover:text-gray-300">← Back</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
                <div className="flex-1">
                    <div className="relative">
                                                    <div className="relative h-48 rounded-t-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1F1B87] to-[#7B1B87] opacity-80"></div>
                            <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay" 
                                 style={{ backgroundImage: `url(${sponsor.businessBanner ? `/api/${sponsor.businessBanner}` : '/Images/coverimg.png'})` }}>
                            </div>
                            <button className="absolute right-4 top-4 bg-white hover:bg-gray-100 text-black px-4 py-1 rounded-md text-sm z-10">
                                Change Image
                            </button>
                        </div>

                        <div className="relative px-8">
                            <div className="absolute left-8 -top-16">
                                <div className="w-32 h-32 rounded-full border-4 border-[#1A1625] overflow-hidden">
                                    <img
                                        src={sponsor.businessLogo ? `${import.meta.env.VITE_SERVER_URL}/${sponsor.businessLogo}` : "/Images/default-avatar.jpg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="pt-20">
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

                <div className="w-full lg:w-[380px] space-y-6">
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <h2 className="text-white text-xl mb-4">Upcoming Performance</h2>                        <div className="space-y-4">
                            {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                                <Link
                                    to={`/event/${event._id}`}
                                    key={event._id}
                                    className="block bg-[#1A1625] rounded-lg p-4 hover:bg-[#1A1625]/70 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img
                                                src={event.image || event.images?.[0] || "/Images/blogcard.jpg"}
                                                alt={event.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white text-lg font-medium mb-2">{event.title || event.name}</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoLocationOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{event.location?.address || event.location || "Location not specified"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoCalendarOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{new Date(event.startDate || event.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoTimeOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{new Date(event.startDate || event.date).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                                                    <span className="text-[#C5FF32] text-sm">{event.interestedCount || event.attendeesCount || 0} interested</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="text-center text-gray-400 py-4">
                                    <p>No upcoming events</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className="bg-[#231D30] rounded-lg p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl">Suggestions</h2>
                            <a href="#" className="text-gray-400 text-sm">See All</a>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src="/Images/default-avatar.jpg" alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h3 className="text-white">Nick Ramsy</h3>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 text-sm">★</span>
                                                <span className="text-gray-400 text-sm ml-1">4.6</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-[#3FE1B6] text-black px-4 py-1 rounded-md text-sm">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* <div className="bg-[#231D30] rounded-lg p-4 sm:p-6">
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
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default SponserPage;
