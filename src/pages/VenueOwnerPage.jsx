import React, { useState, useCallback, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoEyeOutline } from 'react-icons/io5';
import { FaStar, FaRegHeart, FaRegComment, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { BsCalendarEvent } from 'react-icons/bs';
import followIcon from '/icons/follow.svg';
import { toast } from 'react-toastify';
import axiosInstance from '@/configs/axiosConfig';

const VenueOwnerPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("reviews");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([
        {
            id: 1,
            userName: "Abuka Henry",
            userType: "Fan/Guest",
            userImage: "/Images/curator-img.png",
            rating: 5,
            comment: "The venue is very condusive, and the attendants there are very friendly. I would gladly recommended this venue to anyone in need of a serene environment to hos his/her next event.",
            additionalComment: "I look forward to being there this weekend for the Weekend Show",
            createdAt: new Date()
        }
        // Add more mock reviews as needed
    ]);
    const [sortBy, setSortBy] = useState('top-rated'); // 'top-rated', 'recent', etc.
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "George Lobko",
            timeAgo: "2 hours ago",
            content: "Hi Everyone, today i was at the most interesting event in the world. It was a great time spent with @Selena @essar and @essar",
            images: [
                "/Images/post.png",
                "/Images/post.png",
                "/Images/post.png",
                "/Images/post.png"
            ],
            views: 3445,
            likes: 34,
            comments: 45,
            isLiked: false
        }
        // Add more mock posts as needed
    ]);
    const [venues, setVenues] = useState([
        {
            id: 1,
            name: "Shinai Event Center",
            location: "12 Lake Avenue, Mumbai, India",
            image: "/Images/venues.png",
            events: 3445,
            likes: "59k",
            comments: "39k"
        },
        // Add more venues as needed
    ]);
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/product-image.png"
        },

        {
            id: 1,
            name: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/product-image.png"
        },

        {
            id: 1,
            name: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/product-image.png"
        },

        {
            id: 1,
            name: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/product-image.png"
        },
        // Add more products as needed
    ]);

    // Calculate counts AFTER state declarations
    const totalPosts = posts.length;
    const totalVenues = venues.length;
    const totalProducts = products.length;

    // Navigation tabs with dynamic counts
    const tabs = [
        { id: "reviews", label: "Reviews/Rating" },
        { id: "posts", label: `Posts (${totalPosts})` },
        { id: "venues", label: `Venues (${totalVenues})` },
        { id: "products", label: `Products (${totalProducts})` }
    ];

    // Mock data (replace with actual data from your backend)
    const venueOwner = {
        name: "Jasmin Eve",
        location: "Lagos, Nigeria",
        followers: "2.3k",
        rating: 4.5,
        reviews: 32,
        description: "Your description goes here"
    };

    const upcomingEvents = [
        {
            _id: 1,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: "25th Jan, 2023",
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/path-to-image.jpg"
        },
        // Add more events as needed
    ];

    // Add new states for posts
    const [postSort, setPostSort] = useState('recent');

    // Add states for image viewer
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    // Calculate average rating
    const calculateAverageRating = useCallback(() => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Round to 1 decimal place
    }, [reviews]);

    // Calculate total number of reviews
    const totalReviews = reviews.length;

    // Function to handle rating selection
    const handleRatingSelect = useCallback((selectedRating) => {
        setRating(selectedRating);
    }, []);

    // Function to handle review submission
    const handleReviewSubmit = useCallback(async () => {
        if (rating === 0) {
            // Show error notification
            alert('Please select a rating');
            return;
        }

        try {
            // This will be replaced with actual API call
            const newReview = {
                id: reviews.length + 1,
                userName: "Current User", // Will come from auth context
                userType: "Guest",
                userImage: "/Images/default-avatar.jpg",
                rating,
                comment: reviewText,
                createdAt: new Date()
            };

            // Add new review to the list
            setReviews(prev => [newReview, ...prev]);

            // Reset form
            setRating(0);
            setReviewText('');

            // Show success notification
            alert('Review submitted successfully');
        } catch (error) {
            // Show error notification
            alert('Failed to submit review');
            console.error('Error submitting review:', error);
        }
    }, [rating, reviewText, reviews]);

    // Function to handle sort change
    const handleSortChange = useCallback((sortValue) => {
        setSortBy(sortValue);
        // Sort reviews based on selected option
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

    // Function to handle post like
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

    // Function to format mentions in text with proper color
    const formatPostContent = useCallback((content) => {
        // Split content into parts by mentions
        const parts = content.split(/(@\w+)/g);
        return (
            <div className="text-gray-400">
                {parts.map((part, index) => {
                    if (part.startsWith('@')) {
                        // Render mention in accent color
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

    // Image viewer handlers
    const openImageViewer = (image) => {
        setSelectedImage(image);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
        setIsImageViewerOpen(false);
    };

    // Posts tab content
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

            {/* Posts List */}
            {posts.map((post) => (
                <div key={post.id} className="bg-[#231D30] rounded-lg p-6">
                    {/* Post Header */}
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

                    {/* Post Content */}
                    <div className="mb-4">
                        {formatPostContent(post.content)}
                    </div>

                    {/* Post Images - Clickable grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {post.images.map((image, index) => (
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

                    {/* Post Stats */}
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

            {/* Image Viewer Modal */}
            <Dialog
                open={isImageViewerOpen}
                onClose={closeImageViewer}
                className="relative z-50"
            >
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

                {/* Full-screen container */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="relative max-w-4xl w-full">
                        {/* Close button */}
                        <button
                            onClick={closeImageViewer}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            ✕
                        </button>

                        {/* Image */}
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

    // Venues tab content
    const renderVenuesContent = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h2 className="text-white text-xl">Venues</h2>
                <select className="w-full sm:w-auto bg-[#231D30] text-gray-400 px-4 py-2 rounded-lg">
                    <option>All venues</option>
                </select>
            </div>

            {/* Venues List */}
            <div className="space-y-4">
                {venues.map((venue) => (
                    <div key={venue.id} className="bg-[#231D30] rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Venue Image */}
                            <img
                                src={venue.image}
                                alt={venue.name}
                                className="w-16 h-16 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                            />

                            {/* Venue Details */}
                            <div className="flex-1 w-full">
                                <h3 className="text-white text-lg font-medium mb-1">
                                    {venue.name}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                    <IoLocationOutline className="w-4 h-4 flex-shrink-0" />
                                    <span className="line-clamp-1">{venue.location}</span>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <BsCalendarEvent className="w-4 h-4 flex-shrink-0" />
                                        <span>{venue.events} Events</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaRegHeart className="w-4 h-4 flex-shrink-0" />
                                        <span>{venue.likes} Likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaRegComment className="w-4 h-4 flex-shrink-0" />
                                        <span>{venue.comments} Comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Products tab content
    const renderProductsContent = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl">Products</h2>
                <select className="bg-[#231D30] text-gray-400 px-4 py-2 rounded-lg">
                    <option>All products</option>
                    <option>In stock</option>
                    <option>Out of stock</option>
                </select>
            </div>

            {/* Products Grid - Horizontal scroll on mobile */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex-none w-[280px] md:w-auto bg-[#1C1D24] rounded-xl overflow-hidden"
                    >
                        <div className="aspect-square relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-white text-xl font-medium mb-3">
                                {product.name}
                            </h3>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[#94A3B8] text-lg">
                                    ${product.price}
                                </span>
                                <span className="text-[#94A3B8]">
                                    Stock: {product.stock}
                                </span>
                            </div>
                            <button className="bg-[#00FFB3] hover:bg-[#00cc8f] transition-colors text-black px-4 py-3 rounded-lg text-base w-full font-medium">
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Function to render content based on active tab
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

                        {/* Reviews List */}
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-[#231D30] rounded-lg p-6">
                                <div className="flex gap-4 mb-4">
                                    <img src={review.userImage} alt="" className="w-12 h-12 rounded-full" />
                                    <div>
                                        <h3 className="text-white font-medium">{review.userName}</h3>
                                        <p className="text-gray-400 text-sm">{review.userType}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-4">{review.comment}</p>
                                {review.additionalComment && (
                                    <p className="text-gray-400 mb-4">
                                        {review.additionalComment}
                                    </p>
                                )}
                                <div className="flex items-center">
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-white ml-1">{review.rating}.0 Ratings</span>
                                </div>
                            </div>
                        ))}

                        {/* Review Input Section */}
                        <div className="bg-[#231D30] rounded-lg p-6">
                            <h3 className="text-white mb-4">Say something about Jasmine Eve</h3>
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
            case "venues":
                return renderVenuesContent();
            case "products":
                return renderProductsContent();
            default:
                return null;
        }
    };

    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);

    useEffect(() => {
        // TODO: Replace with actual fetch logic for venue owner
        // For now, check if current user is following (mock logic)
        const token = localStorage.getItem('accessToken');
        if (token && venueOwner.followers) {
            try {
                const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
                const isCurrentlyFollowing = venueOwner.followers.some(
                    follower => follower._id === currentUserId || follower.user === currentUserId
                );
                setIsFollowing(isCurrentlyFollowing || false);
            } catch (error) {
                setIsFollowing(false);
            }
        }
    }, [venueOwner]);

    const handleFollowToggle = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error('Please login to follow');
            return;
        }
        setIsFollowingLoading(true);
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
            await axiosInstance.post(`/profiles/venue-owner/${venueOwner._id || 1}/${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(!isFollowing);
            // Update followers count locally (mock)
            // In real logic, refetch venue owner data
            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update follow status');
        } finally {
            setIsFollowingLoading(false);
        }
    }, [isFollowing, venueOwner]);

    return (
        <div className="bg-[#0E0F13] min-h-screen text-white font-sen pb-32">
            {/* Back Button */}
            <div className="p-4">
                <button className="text-white hover:text-gray-300">← Back</button>
            </div>

            {/* Main Content Container */}
            <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
                {/* Left Section - Profile and Tab Content */}
                <div className="flex-1">
                    {/* Profile Section */}
                    <div className="relative">
                        {/* Cover Image */}
                        <div className="relative h-48 rounded-t-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1F1B87] to-[#7B1B87] opacity-80"></div>
                            <div className="absolute inset-0 bg-[url('/Images/coverimg.png')] bg-cover bg-center mix-blend-overlay"></div>
                            <button className="absolute right-4 top-4 bg-white hover:bg-gray-100 text-black px-4 py-1 rounded-md text-sm z-10">
                                Change Image
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="relative px-8">
                            {/* Profile Picture */}
                            <div className="absolute left-8 -top-16">
                                <div className="w-32 h-32 rounded-full border-4 border-[#1A1625] overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3087&auto=format&fit=crop"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Profile Content Container */}
                            <div className="pt-20">
                                {/* Profile Info and About Section Container */}
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                                    {/* Left Side - User Info */}
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-2xl text-white font-bold">Jasmin Eve</h1>
                                        <p className="text-[#3FE1B6] text-sm">Venue Owners</p>
                                        <p className="text-gray-400 text-sm">Lagos, Nigeria</p>

                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-white text-sm">2.3k followers</span>
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
                                            className={`w-fit mt-3 bg-[#3FE1B6] text-black px-6 py-1.5 rounded-md text-sm flex items-center gap-2 ${isFollowingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <img src={followIcon} alt="follow" className="w-5 h-5" />
                                            {isFollowingLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                    </div>

                                    {/* Right Side - About Section */}
                                    <div className="mt-8 lg:mt-0 lg:w-1/3">
                                        <h2 className="text-white text-xl">About me</h2>
                                        <p className="text-gray-400 mt-2">Your description goes here</p>
                                    </div>
                                </div>

                                {/* Navigation Tabs */}
                                <div className="relative mt-8 border-b border-gray-700">
                                    {/* Scrollable Container */}
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

                    {/* Tab Content */}
                    <div className="px-4 sm:px-8 mt-8">
                        {renderTabContent()}
                    </div>
                </div>

                {/* Right Section - Fixed Width Content */}
                <div className="w-full lg:w-[380px] space-y-6">
                    {/* Upcoming Performance */}
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <h2 className="text-white text-xl mb-4">Upcoming Performance</h2>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <Link
                                    to={`/event/${event._id}`}
                                    key={event._id}
                                    className="block bg-[#1A1625] rounded-lg p-4 hover:bg-[#1A1625]/70 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img
                                                // src={event.image || "/Images/blogcard.jpg"}
                                                src="/Images/blogcard.jpg"
                                                alt={event.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white text-lg font-medium mb-2">{event.title}</h3>
                                            <div className="space-y-2">
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
                    <div className="bg-[#231D30] rounded-lg p-4 sm:p-6">
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
                    </div>

                    {/* Popular Event Owners */}
                    <div className="bg-[#231D30] rounded-lg p-4 sm:p-6">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueOwnerPage;
