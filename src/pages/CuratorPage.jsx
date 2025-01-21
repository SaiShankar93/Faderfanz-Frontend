import React, { useState, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { FaInstagram, FaTwitter, FaFacebook, FaStar, FaPlus, FaTimes, FaCalendarAlt, FaCommentAlt, FaLinkedin, FaCalendarCheck, FaComments } from "react-icons/fa";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ColorThief from 'colorthief';

const CuratorPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events'); // ['events', 'reviews', 'pitches']
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showPitchForm, setShowPitchForm] = useState(false);
    const [profileColors, setProfileColors] = useState([]);

    // State for reviews and pitches
    const [reviews, setReviews] = useState([
        {
            _id: "1",
            eventName: "Winter Music Festival",
            rating: 5,
            review: "Amazing atmosphere and perfect sound setup!",
            date: "2024-01-15",
            media: ["image1.jpg", "video1.mp4"]
        },
        // ... other initial reviews
    ]);

    const [pitches, setPitches] = useState([
        {
            _id: "1",
            title: "Neon Nights 2024",
            description: "A fusion of electronic and classical music",
            requiredFunding: "₹500,000",
            currentFunding: "₹200,000",
            deadline: "2024-06-01",
            status: "funding"
        },
        // ... other initial pitches
    ]);

    const [newReview, setNewReview] = useState({
        reviewerName: '',
        eventName: '',
        rating: 0,
        review: '',
        media: []
    });

    const [newPitch, setNewPitch] = useState({
        title: '',
        description: '',
        requiredFunding: '',
        deadline: '',
        mainImage: null
    });

    // Media viewer modal state
    const [selectedMedia, setSelectedMedia] = useState(null);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    const curator = {
        name: "DJ Blaze",
        stageName: "The Blaze Master",
        profilePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmwJKXOAOJ_f2jlwhnlINidcfUo9qnhEAANg",
        contact: "djblaze@example.com",
        followers: 5234,
        about: "DJ Blaze is a renowned music curator known for electrifying performances and unforgettable events.",
        socialLinks: {
            instagram: "https://instagram.com/djblaze",
            twitter: "https://twitter.com/djblaze",
            facebook: "https://facebook.com/djblaze",
        },
        mediaGallery: [
            { type: 'image', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmwJKXOAOJ_f2jlwhnlINidcfUo9qnhEAANg' },
            { type: 'video', url: 'http://example.com/video1.mp4' },
            { type: 'audio', url: 'http://example.com/audio1.mp3' },
        ],
        stats: {
            eventsHosted: 48,
            averageRating: 4.8,
            totalReviews: 156
        },
        events: [
            {
                _id: "1",
                title: "Neon Nights Festival",
                date: "Mar 15, 2024",
                mainImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070",
                location: "Mumbai, India",
                status: "Upcoming",
                price: "2,999"
            },
            {
                _id: "2",
                title: "Art Basel India",
                date: "Apr 20, 2024",
                mainImage: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=2070",
                location: "Delhi, India",
                status: "Planning",
                price: "1,499"
            },
            {
                _id: "3",
                title: "Tech Summit 2024",
                date: "May 10, 2024",
                mainImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070",
                location: "Bangalore, India",
                status: "Confirmed",
                price: "3,999"
            }
        ],
        reviews: [
            {
                _id: "1",
                eventName: "Winter Music Festival",
                rating: 5,
                review: "Amazing atmosphere and perfect sound setup!",
                date: "2024-01-15",
                media: ["image1.jpg", "video1.mp4"]
            },
            // ... other reviews
        ],
        pitches: [
            {
                _id: "1",
                title: "Neon Nights 2024",
                description: "A fusion of electronic and classical music",
                requiredFunding: "₹500,000",
                currentFunding: "₹200,000",
                deadline: "2024-06-01",
                status: "funding"
            },
            // ... other pitches
        ]
    };

    // Function to get dominant colors from profile image
    const getImageColors = (imageSrc) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;

        img.onload = () => {
            const colorThief = new ColorThief();
            try {
                const colorPalette = colorThief.getPalette(img, 2);
                setProfileColors(colorPalette);
            } catch (error) {
                console.error('Error getting colors:', error);
            }
        };
    };

    useEffect(() => {
        if (curator.profilePhoto) {
            getImageColors(curator.profilePhoto);
        }
    }, [curator.profilePhoto]);

    // Convert RGB array to CSS color string
    const rgbToString = (rgb) => rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : 'transparent';

    // Handle review submission
    const handleReviewSubmit = (e) => {
        e.preventDefault();

        // Create new review object
        const review = {
            _id: Date.now().toString(),
            ...newReview,
            date: new Date().toISOString().split('T')[0],
            media: newReview.media.map(file => ({
                url: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' : 'video'
            }))
        };

        setReviews(prevReviews => [review, ...prevReviews]);
        setShowReviewForm(false);
        setNewReview({
            reviewerName: '',
            eventName: '',
            rating: 0,
            review: '',
            media: []
        });
    };

    // Handle pitch submission
    const handlePitchSubmit = (e) => {
        e.preventDefault();

        const pitch = {
            _id: Date.now().toString(),
            ...newPitch,
            currentFunding: "₹0",
            status: "funding",
            mainImage: newPitch.mainImage ? URL.createObjectURL(newPitch.mainImage) : null
        };

        setPitches(prevPitches => [pitch, ...prevPitches]);
        setShowPitchForm(false);
        setNewPitch({
            title: '',
            description: '',
            requiredFunding: '',
            deadline: '',
            mainImage: null
        });
    };

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'events':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {curator.events.map((event) => (
                            <Link
                                key={event._id}
                                to={`/event/${event.title.replace(/\s+/g, "-")}`}
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    <div className="relative h-full bg-[#0E0E1A] rounded-2xl p-6 ring-1 ring-gray-900/5 leading-none flex flex-col overflow-hidden">
                                        {/* Cosmic Background Effects */}
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2C1B47] via-[#1A1A2E] to-[#0E0E1A] opacity-50"></div>
                                        <div className="absolute inset-0 bg-[url('/stars.png')] bg-repeat opacity-20"></div>

                                        {/* Content Container */}
                                        <div className="relative z-10">
                                            {/* Image Container with Glow Effect */}
                                            <div className="relative mb-4 overflow-hidden rounded-xl">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E1A] via-transparent to-transparent z-10"></div>
                                                <img
                                                    src={event.mainImage}
                                                    alt={event.title}
                                                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                                />
                                                <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                                            </div>

                                            {/* Event Details with Cosmic Styling */}
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                                                    {event.title}
                                                </h3>

                                                {/* Date and Price Row */}
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <FaCalendarAlt className="text-purple-400 w-4 h-4" />
                                                        <span className="text-gray-400 text-sm">{event.date}</span>
                                                    </div>
                                                    <span className="text-purple-400 font-semibold">₹{event.price}</span>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="flex justify-end">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                                        ${event.status === 'upcoming'
                                                            ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50'
                                                            : 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50'
                                                        } backdrop-blur-sm`}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 opacity-10 rounded-full blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                            <div className="absolute bottom-0 left-0 -mb-3 -ml-3 w-24 h-24 bg-gradient-to-tr from-purple-600 to-blue-600 opacity-10 rounded-full blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                );

            case 'reviews':
                return (
                    <div>
                        {/* Add Review Button with Glow Effect */}
                        <div className="flex justify-end mb-6">
                            <div className="relative group">
                                <div className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] group-hover:opacity-100 group-hover:blur-md transition-all duration-300" />
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="relative px-4 py-2 bg-gray-900 rounded-xl text-white font-medium flex items-center gap-2 transition-all duration-200"
                                >
                                    <FaPlus className="w-4 h-4" />
                                    Add Review
                                </button>
                            </div>
                        </div>

                        {/* Review Form Modal */}
                        {showReviewForm && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-[#181818] rounded-xl p-6 w-full max-w-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold">Add Review</h3>
                                        <button
                                            onClick={() => setShowReviewForm(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newReview.reviewerName}
                                                onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Event Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newReview.eventName}
                                                onChange={(e) => setNewReview({ ...newReview, eventName: e.target.value })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Rating
                                            </label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                                        className={`text-2xl ${star <= newReview.rating ? 'text-[#8B33FE]' : 'text-gray-600'
                                                            }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Review
                                            </label>
                                            <textarea
                                                value={newReview.review}
                                                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white h-32"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Media
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={(e) => setNewReview({
                                                    ...newReview,
                                                    media: Array.from(e.target.files)
                                                })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[#8B33FE] text-white rounded-lg py-2 hover:bg-[#7429d4] transition-colors"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Reviews Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews
                                .filter(review => review.eventName !== "Winter Music Festival")
                                .map((review) => (
                                    <div
                                        key={review._id}
                                        className="relative group"
                                    >
                                        {/* Animated Galaxy Border */}
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                                        {/* Main Card Container */}
                                        <div className="relative bg-[#0E0E1A] rounded-2xl p-6 h-full overflow-hidden">
                                            {/* Galaxy Background Effects */}
                                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2C1B47] via-[#1A1A2E] to-[#0E0E1A] opacity-50"></div>
                                            <div className="absolute inset-0 bg-[url('/stars.png')] bg-repeat opacity-20 animate-twinkle"></div>

                                            {/* Content Container */}
                                            <div className="relative z-10 flex flex-col gap-3">
                                                {/* Header with Event Name and Rating */}
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                                                        {review.eventName}
                                                    </h3>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, index) => (
                                                            <FaStar
                                                                key={index}
                                                                className={`w-5 h-5 ${index < review.rating
                                                                    ? 'text-[#8B33FE] group-hover:text-purple-400'
                                                                    : 'text-gray-600'
                                                                    } transform hover:scale-110 transition-all duration-200`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Review Text */}
                                                <p className="text-gray-400 relative">
                                                    {review.review}
                                                </p>

                                                {/* Media Gallery */}
                                                {review.media && review.media.length > 0 && (
                                                    <div className="flex gap-2 flex-wrap">
                                                        {review.media.map((media, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() => setSelectedMedia(media)}
                                                                className="relative overflow-hidden rounded-lg cursor-pointer group/media"
                                                            >
                                                                {media.type === 'image' ? (
                                                                    <img
                                                                        src={media.url}
                                                                        alt="Review media"
                                                                        className="w-20 h-20 object-cover transform group-hover/media:scale-110 transition-all duration-300"
                                                                    />
                                                                ) : (
                                                                    <video
                                                                        src={media.url}
                                                                        className="w-20 h-20 object-cover"
                                                                    />
                                                                )}
                                                                <div className="absolute inset-0 bg-purple-500/10 group-hover/media:bg-purple-500/20 transition-colors duration-300"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Footer with Date and Reviewer Name */}
                                                <div className="flex justify-between mt-2">
                                                    <p className="text-sm text-gray-500">{review.date}</p>
                                                    <p className="text-sm text-purple-400">- {review.reviewerName}</p>
                                                </div>
                                            </div>

                                            {/* Decorative Galaxy Elements */}
                                            <div className="absolute top-0 right-0 -mt-3 -mr-3 w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 opacity-10 rounded-full blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                            <div className="absolute bottom-0 left-0 -mb-3 -ml-3 w-32 h-32 bg-gradient-to-tr from-purple-600 to-blue-600 opacity-10 rounded-full blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Media Viewer Modal */}
                        {selectedMedia && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                                onClick={() => setSelectedMedia(null)}
                            >
                                <div className="max-w-4xl max-h-[90vh] p-4">
                                    {selectedMedia.type === 'image' ? (
                                        <img
                                            src={selectedMedia.url}
                                            alt="Review media"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <video
                                            src={selectedMedia.url}
                                            controls
                                            className="max-w-full max-h-full"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'pitches':
                return (
                    <div>
                        {/* New Pitch Button with Glow Effect */}
                        <div className="flex justify-end mb-6">
                            <div className="relative group">
                                <div className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] group-hover:opacity-100 group-hover:blur-md transition-all duration-300" />
                                <button
                                    onClick={() => setShowPitchForm(true)}
                                    className="relative px-4 py-2 bg-gray-900 rounded-xl text-white font-medium flex items-center gap-2 transition-all duration-200"
                                >
                                    <FaPlus className="w-4 h-4" />
                                    New Pitch
                                </button>
                            </div>
                        </div>

                        {/* Pitches Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pitches
                                .filter(pitch => pitch.title !== "Neon Nights 2024")
                                .map((pitch) => (
                                    <BackgroundGradient
                                        key={pitch._id}
                                        className="rounded-[22px] p-4 sm:p-10 bg-[#181818] shadow-lg"
                                    >
                                        {pitch.mainImage && (
                                            <img
                                                src={pitch.mainImage}
                                                alt={pitch.title}
                                                className="w-full h-48 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                        <div className={`flex flex-col ${!pitch.mainImage ? 'h-full justify-between' : ''}`}>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">{pitch.title}</h3>
                                                <p className="text-gray-400 mb-4">{pitch.description}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-[#8B33FE] h-2 rounded-full"
                                                        style={{
                                                            width: `${(parseInt(pitch.currentFunding.replace(/[₹,]/g, '')) /
                                                                parseInt(pitch.requiredFunding.replace(/[₹,]/g, ''))) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">
                                                        Raised: <span className="text-white">₹{pitch.currentFunding}</span>
                                                    </span>
                                                    <span className="text-gray-400">
                                                        Goal: <span className="text-white">₹{pitch.requiredFunding.replace('₹', '')}</span>
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Deadline: {pitch.deadline}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${pitch.status === 'funding'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {pitch.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </BackgroundGradient>
                                ))}
                        </div>

                        {/* Pitch Form Modal */}
                        {showPitchForm && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-[#181818] rounded-xl p-6 w-full max-w-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold">New Pitch</h3>
                                        <button
                                            onClick={() => setShowPitchForm(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <form onSubmit={handlePitchSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Event Title
                                            </label>
                                            <input
                                                type="text"
                                                value={newPitch.title}
                                                onChange={(e) => setNewPitch({ ...newPitch, title: e.target.value })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={newPitch.description}
                                                onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white h-32"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Required Funding (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={newPitch.requiredFunding}
                                                onChange={(e) => setNewPitch({ ...newPitch, requiredFunding: e.target.value })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Deadline
                                            </label>
                                            <input
                                                type="date"
                                                value={newPitch.deadline}
                                                onChange={(e) => setNewPitch({ ...newPitch, deadline: e.target.value })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Main Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setNewPitch({
                                                    ...newPitch,
                                                    mainImage: e.target.files[0]
                                                })}
                                                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[#8B33FE] text-white rounded-lg py-2 hover:bg-[#7429d4] transition-colors"
                                        >
                                            Submit Pitch
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Calculate curator stats based on actual data
    const calculateStats = () => {
        // Count total events (excluding filtered ones if any)
        const totalEvents = curator.events.length || 0;

        // Calculate average rating from actual reviews
        const filteredReviews = reviews.filter(review => review.eventName !== "Winter Music Festival");
        const totalRatings = filteredReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = filteredReviews.length > 0
            ? (totalRatings / filteredReviews.length).toFixed(1)
            : '0.0';

        // Count total reviews (excluding filtered ones)
        const totalReviews = filteredReviews.length;

        return {
            eventsHosted: totalEvents,
            averageRating: averageRating,
            totalReviews: totalReviews
        };
    };

    const [stats, setStats] = useState(calculateStats());

    // Update stats when reviews change
    useEffect(() => {
        const updatedStats = calculateStats();
        setStats(updatedStats);
    }, [reviews, curator.events]); // Recalculate when reviews or events change

    return (
        loading ? (
            <div className="w-full flex items-center justify-center py-3">
                <img src="/Images/loader.svg" alt="loading..." className="object-contain w-[60px] h-[60px]" />
            </div>
        ) : (
            <div className="bg-[#0E0F13] min-h-screen text-white">
                {/* Banner and Profile Section */}
                <div className="relative">
                    {/* Banner Image */}
                    <div className="h-80 w-full overflow-hidden">
                        <img
                            src={curator.banner || "/Images/banner-curator.jpg"}
                            alt="Profile Banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0E0F13]"></div>
                    </div>

                    {/* Profile Content */}
                    <div className="max-w-6xl mx-auto px-5">
                        <div className="relative -mt-32">
                            {/* Profile Image with Dynamic Glow */}
                            <div className="relative inline-block">
                                <div
                                    className="absolute -inset-1 rounded-full border-4 border-transparent transition-all duration-300"
                                    style={{
                                        background: profileColors.length ?
                                            `linear-gradient(45deg, ${rgbToString(profileColors[0])}, ${rgbToString(profileColors[1])})` :
                                            'linear-gradient(45deg, rgba(139,51,254,0.7), rgba(255,105,234,0.7))',
                                        filter: 'blur(8px)',
                                    }}
                                ></div>
                                <img
                                    src={curator.profilePhoto || "/Images/default-profile.png"}
                                    alt="Profile"
                                    className="relative w-40 h-40 rounded-full border-4 border-[#0E0F13] object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/Images/default-profile.png"; // Fallback to default image
                                    }}
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-4xl font-bold">{curator.name}</h1>
                                    <h2 className="text-xl text-purple-400 mt-1">{curator.stageName}</h2>
                                    <p className="text-gray-400 mt-2">{curator.contact}</p>
                                </div>

                                {/* Follow Button */}
                                <div className="mt-4 md:mt-0">
                                    <div className="flex gap-2">
                                        <button className="relative group px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold text-sm border border-white/20 transition-all duration-200">
                                            <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-70 transition-all duration-300 blur-lg bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]"></div>
                                            <span className="relative">Follow</span>
                                        </button>
                                        <button className="relative group px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold text-sm border border-white/20 transition-all duration-200">
                                            <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-70 transition-all duration-300 blur-lg bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]"></div>
                                            <span className="relative">Contact</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bio and Social Links */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-semibold mb-2">About</h3>
                                    <p className="text-gray-300">{curator.about}</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Connect</h3>
                                    <div className="flex gap-4">
                                        {curator.socialLinks?.instagram && (
                                            <a href={curator.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-purple-400 transition-colors">
                                                <FaInstagram className="w-6 h-6" />
                                            </a>
                                        )}
                                        {curator.socialLinks?.twitter && (
                                            <a href={curator.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-purple-400 transition-colors">
                                                <FaTwitter className="w-6 h-6" />
                                            </a>
                                        )}
                                        {curator.socialLinks?.facebook && (
                                            <a href={curator.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-purple-400 transition-colors">
                                                <FaFacebook className="w-6 h-6" />
                                            </a>
                                        )}
                                        {curator.socialLinks?.linkedin && (
                                            <a href={curator.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-purple-400 transition-colors">
                                                <FaLinkedin className="w-6 h-6" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                <div className="flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl p-4">
                                    <FaCalendarCheck className="text-purple-500 text-xl mb-2" />
                                    <span className="text-2xl font-bold text-white">{stats.eventsHosted || 0}</span>
                                    <span className="text-sm text-gray-400">Events Hosted</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl p-4">
                                    <FaStar className="text-purple-500 text-xl mb-2" />
                                    <span className="text-2xl font-bold text-white">{stats.averageRating || '0.0'}</span>
                                    <span className="text-sm text-gray-400">Average Rating</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl p-4">
                                    <FaComments className="text-purple-500 text-xl mb-2" />
                                    <span className="text-2xl font-bold text-white">{stats.totalReviews || 0}</span>
                                    <span className="text-sm text-gray-400">Total Reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-800">
                    <div className="max-w-6xl mx-auto px-5">
                        <nav className="flex space-x-8">
                            {['Events', 'Reviews', 'Pitches'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`py-4 px-2 border-b-2 transition-colors duration-300 ${activeTab === tab.toLowerCase()
                                        ? 'border-purple-500 text-purple-500'
                                        : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="max-w-6xl mx-auto px-5 py-8">
                    {renderContent()}
                </div>
            </div>
        )
    );
};

export default CuratorPage;
