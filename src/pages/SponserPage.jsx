import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { EventCard } from "../components/EventCard";
import { FaInstagram, FaTwitter, FaFacebook, FaCrown, FaHandshake, FaChartLine, FaUsers, FaMoneyBillWave, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { NormalEvent } from "@/components/NormalEvent";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { MainAppContext } from "@/context/MainContext";

// Event/Party Images
const eventImages = {
    music: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070",
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070",
    ],
    art: [
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080",
        "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=2070",
        "https://images.unsplash.com/photo-1638686603026-a4cd2b9a9e65?q=80&w=2089",
    ],
    tech: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070",
        "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070",
    ]
};

const SponserPage = () => {
    const { seteventPageId } = useContext(MainAppContext);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]); // Reviews as comments
    const [newComment, setNewComment] = useState("");
    const Stars = ({ stars }) => {
        const ratingStars = Array.from({ length: 5 }, (elem, index) => {
            return (
                <div key={index}>
                    {stars >= index + 1 ? (
                        <FaStar className=" text-[#8B33FE]" />
                    ) : (
                        <IoStarOutline className="  text-{#8B33FE} " />
                    )}
                </div>
            );
        });
        return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
    };

    const handleLike = () => {
        handleLiked(!liked);
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([
                ...comments,
                {
                    title: "User Comment",
                    comment: newComment,
                    rating: 5, // Example rating
                    userId: { name: "Anonymous" },
                    createdAt: new Date().toISOString(),
                },
            ]);
            setNewComment("");
        }
    };
    setTimeout(() => {
        setLoading(false);
    }, 1000);
    const sponsor = {
        businessName: "BTechnologies",
        gstInfo: "29ABCDE1234F1Z5",
        contactPerson: {
            name: "Balayya",
            role: "Marketing Director"
        },
        profilePhoto: "https://t3.ftcdn.net/jpg/01/10/11/00/360_F_110110063_4kxHX5YKcqrKqFz9udsaqmjkTCoOhKHc.jpg",
        bannerImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfyXyWt38DuDNgLaD8jvYSJ96TNTj3aFC6Bg&s",
        categories: ["Music", "Sports", "Art"],
        expectations: ["Brand Exposure", "Sales Growth", "Market Reach"],
        contact: "sponsorships@sponsor.com",
        followers: 5234,
        about: "Leading technology solutions provider, empowering events with cutting-edge innovations.",
        socialLinks: {
            instagram: "https://instagram.com/Sannidhan_2424",
            twitter: "https://twitter.com/KSannidhan",
            facebook: "https://facebook.com/Sannidhan-Katta",
        },
        stats: {
            eventsSponsored: 48,
            totalInvestment: "₹18M+",
            successRate: "92%"
        },
        sponsoredEvents: [
            {
                _id: "1",
                title: "Summer Beats Festival",
                date: "FEB 15, 2025",
                mainImage: eventImages.music[0],
                sponsorshipAmount: "₹500,000",
                status: "Upcoming"
            },
            {
                _id: "2",
                title: "Electric Nights",
                date: "August 23, 2024",
                mainImage: eventImages.music[1],
                sponsorshipAmount: "₹100,000",
                status: "Completed"
            },
            {
                _id: "3",
                title: "Winter Groove",
                date: "December 5, 2024",
                mainImage: eventImages.music[2],
                sponsorshipAmount: "₹300,000",
                status: "Completed"
            },
        ],
        opportunities: [
            {
                _id: "1",
                title: "Winter Music Festival",
                requiredFunding: "₹1,000,000",
                currentFunding: "₹750,000",
                deadline: "Dec 1, 2024",
                mainImage: eventImages.art[0]
            },
            {
                _id: "2",
                title: "Spring Art Gala",
                requiredFunding: "₹500,000",
                currentFunding: "₹300,000",
                deadline: "Mar 15, 2025",
                mainImage: eventImages.art[1]
            },
            {
                _id: "3",
                title: "Summer Tech Expo",
                requiredFunding: "₹2,000,000",
                currentFunding: "1,200,000",
                deadline: "Jun 30, 2025",
                mainImage: eventImages.tech[0]
            }
        ]
    };

    // Helper function to calculate funding progress percentage
    const calculateFundingProgress = (current, required) => {
        // Remove currency symbol and convert to numbers
        const currentAmount = parseFloat(current.replace(/[₹,]/g, ''));
        const requiredAmount = parseFloat(required.replace(/[₹,]/g, ''));
        return (currentAmount / requiredAmount) * 100;
    };

    // Helper function to determine event status based on date
    const getEventStatus = (eventDate) => {
        const currentDate = new Date();
        const eventDateTime = new Date(eventDate);
        return eventDateTime > currentDate ? "Upcoming" : "Completed";
    };

    return (
        loading ? (
            <div className="w-full flex items-center justify-center py-3">
                <img src="/Images/loader.svg" alt="loading..." className="object-contain w-[60px] h-[60px]" />
            </div>
        ) : (
            <div className="bg-[#0E0F13] min-h-screen text-white pt-24">
                {/* Profile Section */}
                <div className="relative">
                    {/* Banner Section */}
                    <div className="h-[400px] relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E0F13]/50 to-[#0E0F13]"></div>
                        <div className="absolute inset-0 bg-[#0E0F13]/30"></div>
                        <img
                            src={sponsor.bannerImage || "/Images/default-banner.jpeg"}
                            alt="Sponsor Banner"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/Images/default-banner.jpeg";
                            }}
                        />
                    </div>

                    {/* Profile Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Mobile View Layout */}
                            <div className="md:hidden">
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={sponsor.profilePhoto || "/Images/default-profile.png"}
                                        alt={sponsor.businessName}
                                        className="w-24 h-24 rounded-full border-4 border-[#0E0F13] object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/Images/default-profile.png";
                                        }}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 flex-nowrap">
                                            <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                                                Verified Sponsor
                                            </span>
                                            <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full whitespace-nowrap">
                                                GST Verified
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold text-sm border border-white/20 transition-all duration-200 hover:bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]">
                                                Follow
                                            </button>
                                            <button className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold text-sm border border-white/20 transition-all duration-200 hover:bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]">
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Profile Info */}
                                <div className="mb-6">
                                    <h1 className="text-3xl font-bold mb-2">{sponsor.businessName}</h1>
                                    <div className="text-lg text-gray-300 mb-2">
                                        {sponsor.contactPerson.name} • {sponsor.contactPerson.role}
                                    </div>
                                    <p className="text-lg text-gray-300 mb-4">{sponsor.contact}</p>

                                    {/* Stats */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center">
                                            <FaUsers className="mr-1" />
                                            {sponsor.followers.toLocaleString()} followers
                                        </span>
                                        <span className="flex items-center">
                                            <FaHandshake className="mr-1" />
                                            {sponsor.stats.eventsSponsored} events sponsored
                                        </span>
                                        <span className="flex items-center">
                                            <FaMoneyBillWave className="mr-1" />
                                            {sponsor.stats.totalInvestment} invested
                                        </span>
                                        <span className="flex items-center">
                                            <FaChartLine className="mr-1" />
                                            {sponsor.stats.successRate} success rate
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop View Layout */}
                            <div className="hidden md:flex flex-col md:flex-row items-end gap-8">
                                <img
                                    src={sponsor.profilePhoto || "/Images/default-profile.png"}
                                    alt={sponsor.businessName}
                                    className="w-48 h-48 rounded-full border-4 border-[#0E0F13] object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/Images/default-profile.png";
                                    }}
                                />
                                <div className="flex-1">
                                    {/* Profile Info */}
                                    <div className="flex-1 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                                                Verified Sponsor
                                            </span>
                                            <span className="text-sm font-medium bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                                                GST Verified
                                            </span>
                                        </div>
                                        <h1 className="text-5xl font-bold mb-2">{sponsor.businessName}</h1>
                                        <div className="text-xl text-gray-300 mb-2">
                                            {sponsor.contactPerson.name} • {sponsor.contactPerson.role}
                                        </div>
                                        <p className="text-xl text-gray-300 mb-4">{sponsor.contact}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center">
                                                <FaUsers className="mr-1" />
                                                {sponsor.followers.toLocaleString()} followers
                                            </span>
                                            <span className="flex items-center">
                                                <FaHandshake className="mr-1" />
                                                {sponsor.stats.eventsSponsored} events sponsored
                                            </span>
                                            <span className="flex items-center">
                                                <FaMoneyBillWave className="mr-1" />
                                                {sponsor.stats.totalInvestment} invested
                                            </span>
                                            <span className="flex items-center">
                                                <FaChartLine className="mr-1" />
                                                {sponsor.stats.successRate} success rate
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Desktop Action Buttons */}
                                <div className="flex gap-4 mb-4">
                                    <button className="relative px-6 py-3 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold text-sm w-[120px] border border-white/20 transition-all duration-200 hover:bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]">
                                        Follow
                                    </button>
                                    <button className="relative px-6 py-3 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold text-sm w-[120px] border border-white/20 transition-all duration-200 hover:bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]">
                                        Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="max-w-6xl mx-auto px-8 py-8">
                    {/* About Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">About</h2>
                        <p className="text-gray-300 max-w-3xl mb-6">{sponsor.about}</p>

                        {/* Categories Section */}
                        <h3 className="text-xl font-semibold mb-3">Interested Categories</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {sponsor.categories.map((category, index) => (
                                <span key={index} className="px-3 py-1 bg-[#8B33FE]/20 text-[#8B33FE] rounded-full text-sm">
                                    {category}
                                </span>
                            ))}
                        </div>

                        {/* Sponsorship Goals */}
                        <h3 className="text-xl font-semibold mb-3">Sponsorship Goals</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {sponsor.expectations.map((expectation, index) => (
                                <span key={index} className="px-3 py-1 bg-[#8B33FE]/20 text-[#8B33FE] rounded-full text-sm">
                                    {expectation}
                                </span>
                            ))}
                        </div>

                        {/* Business Information Section - Updated with more transparency and blur */}
                        <div className="relative mt-8">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-3xl"></div>
                            <div className="relative bg-gradient-to-br from-blue-900/40 to-black/40 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 via-blue-900/30 to-black/20 animate-gradient-x"></div>
                                <div className="relative p-8 bg-black/20">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                                            Business Information
                                        </span>
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="group">
                                                <label className="text-sm text-gray-400 mb-1 block">GST Number</label>
                                                <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/5 group-hover:border-blue-500/30 transition-all duration-300">
                                                    <p className="text-white font-mono">{sponsor.gstInfo}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="group">
                                                <label className="text-sm text-gray-400 mb-1 block">Contact Person</label>
                                                <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/5 group-hover:border-blue-500/30 transition-all duration-300">
                                                    <p className="text-white">
                                                        {sponsor.contactPerson.name}
                                                        <span className="text-gray-400 ml-2">
                                                            ({sponsor.contactPerson.role})
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-6 mb-12">
                        {sponsor.socialLinks?.instagram && (
                            <a href={sponsor.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#8B33FE] transition-colors">
                                <FaInstagram className="w-6 h-6" />
                            </a>
                        )}
                        {sponsor.socialLinks?.twitter && (
                            <a href={sponsor.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#8B33FE] transition-colors">
                                <FaTwitter className="w-6 h-6" />
                            </a>
                        )}
                        {sponsor.socialLinks?.facebook && (
                            <a href={sponsor.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#8B33FE] transition-colors">
                                <FaFacebook className="w-6 h-6" />
                            </a>
                        )}
                    </div>

                    {/* Sponsored Events Section */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-8 text-center">Sponsored Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sponsor.sponsoredEvents.map((event) => (
                                <Link
                                    key={event._id}
                                    to={`/event/${event.title.replace(/\s+/g, "-")}`}
                                    onClick={() => {
                                        sessionStorage.setItem("eventPageId", JSON.stringify(event._id));
                                        seteventPageId(event._id);
                                    }}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                                        <img
                                            src={event.mainImage}
                                            alt={event.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventStatus(event.date) === 'Upcoming'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {getEventStatus(event.date)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                                            <span className="flex items-center">
                                                <FaCalendarAlt className="mr-2" />
                                                {event.date}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#8B33FE] font-bold">
                                                {event.sponsorshipAmount}
                                            </span>
                                            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                                <FaArrowRight className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Funding Opportunities Section */}
                    <div className="mt-16 mb-24">
                        <h2 className="text-2xl font-bold mb-8 text-center">Funding Opportunities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sponsor.opportunities.map((opportunity) => (
                                <Link
                                    key={opportunity._id}
                                    to={`/crowdfunding/${opportunity.title.replace(/\s+/g, "-")}`}
                                    onClick={() => {
                                        sessionStorage.setItem("crowdfundingId", JSON.stringify(opportunity._id));
                                    }}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                                        <img
                                            src={opportunity.mainImage}
                                            alt={opportunity.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                            {opportunity.title}
                                        </h3>

                                        {/* Funding Progress */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Current Funding</span>
                                                <span className="text-purple-400 font-semibold">
                                                    {calculateFundingProgress(opportunity.currentFunding, opportunity.requiredFunding)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${calculateFundingProgress(
                                                            opportunity.currentFunding,
                                                            opportunity.requiredFunding
                                                        )}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-sm">
                                                <span className="text-white font-semibold">{opportunity.currentFunding}</span>
                                                <span className="text-gray-400">{opportunity.requiredFunding}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-sm text-gray-400">
                                                Deadline: {opportunity.deadline}
                                            </span>
                                            <button
                                                className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold hover:bg-purple-500/20 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    console.log("Contributing to:", opportunity.title);
                                                }}
                                            >
                                                Contribute
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default SponserPage;
