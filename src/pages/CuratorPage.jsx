import React, { useState, useCallback } from "react";
import { EventCard } from "../components/EventCard";
import { FaInstagram, FaTwitter, FaFacebook, FaStar, FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoEyeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { BsCalendarEvent } from 'react-icons/bs';
import followIcon from '/icons/follow.svg';

const CuratorPage = () => {
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
            comment: "DJ Kazi is a master of the turntables, effortlessly blending beats and creating an electrifying atmosphere wherever they perform. Their music selection is always on point, keeping the crowd engaged and energized.",
            additionalComment: "I look forward to being there this weekend for the Weekend Show",
            createdAt: new Date()
        }
    ]);
    const [sortBy, setSortBy] = useState('top-rated');
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "DJ Kazi",
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
    ]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    const curator = {
        name: "DJ Kazi",
        type: "Curator",
        location: "Lagos, Nigeria",
        followers: "2.3k",
        rating: 4.5,
        reviews: 32,
        description: "Your description goes here",
        socialLinks: {
            instagram: "#",
            twitter: "#",
            facebook: "#"
        }
    };

    const upcomingEvents = [
        {
            _id: 1,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: "25th Jan, 2023",
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/Images/blogcard.jpg"
        },
        {
            _id: 2,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: "25th Jan, 2023",
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/Images/blogcard.jpg"
        }
    ];

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
            alert('Please select a rating');
            return;
        }

        try {
            const newReview = {
                id: reviews.length + 1,
                userName: "Current User",
                userType: "Guest",
                userImage: "/Images/default-avatar.jpg",
                rating,
                comment: reviewText,
                createdAt: new Date()
            };

            setReviews(prev => [newReview, ...prev]);
            setRating(0);
            setReviewText('');
            alert('Review submitted successfully');
        } catch (error) {
            alert('Failed to submit review');
            console.error('Error submitting review:', error);
        }
    }, [rating, reviewText, reviews]);

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
            newIndex = (selectedImageIndex + 1) % posts[0].images.length;
        } else {
            newIndex = selectedImageIndex - 1;
            if (newIndex < 0) newIndex = posts[0].images.length - 1;
        }
        setSelectedImageIndex(newIndex);
        setSelectedImage(posts[0].images[newIndex]);
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

            <div className="bg-[#231D30] rounded-lg p-6">
                <h3 className="text-white mb-4">Say something about {curator.name}</h3>
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

    const renderPostsContent = () => (
        <div className="space-y-6">
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
                        </div>

                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                            {posts[0].images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImageIndex(index);
                                        setSelectedImage(posts[0].images[index]);
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
                            <button className="absolute right-4 top-4 bg-white hover:bg-gray-100 text-black px-4 py-1 rounded-md text-sm z-10">
                                Change Image
                            </button>
                        </div>

                        <div className="relative px-8">
                            <div className="absolute left-8 -top-16">
                                <div className="w-32 h-32 rounded-full border-4 border-[#1A1625] overflow-hidden">
                                    <img
                                        src={curator.profilePhoto || "/Images/default-avatar.jpg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="pt-20">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-2xl text-white font-bold">{curator.name}</h1>
                                        <p className="text-[#3FE1B6] text-sm">{curator.type}</p>
                                        <p className="text-gray-400 text-sm">{curator.location}</p>

                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-white text-sm">{curator.followers} followers</span>
                                            <span className="text-gray-400">•</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">⭐</span>
                                                <span className="text-white text-sm">
                                                    {calculateAverageRating()} rating ({totalReviews} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-3">
                                            <button className="w-fit bg-[#3FE1B6] text-black px-6 py-1.5 rounded-md text-sm flex items-center gap-2">
                                                <img src={followIcon} alt="follow" className="w-5 h-5" />
                                                Follow
                                            </button>
                                            {/* <button className="w-fit bg-[#3FE1B6] text-black px-6 py-1.5 rounded-md text-sm">
                                                More
                                            </button> */}
                                        </div>
                                    </div>

                                    <div className="mt-8 lg:mt-0 lg:w-1/3">
                                        <h2 className="text-white text-xl">About me</h2>
                                        <p className="text-gray-400 mt-2">{curator.description}</p>
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

                <div className="w-full lg:w-[380px] space-y-6">
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
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

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

export default CuratorPage;
