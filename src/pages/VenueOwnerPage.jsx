import React, { useState } from "react";
import { EventCard } from "../components/EventCard"; // Ensure EventCard is imported correctly
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const VenueOwnerPage = () => {
    const [loading, setLoading] = useState(true);
    setTimeout(() => {
        setLoading(false);
    }, 1000);

    // Updated data structure for venue owner
    const venueOwner = {
        venueName: "Skyline Lounge",
        profilePhoto: "http://localhost:5000/images/venue-profile.jpg",
        location: {
            address: "123 Party Street, Downtown",
            coordinates: "40.7128° N, 74.0060° W",
        },
        contact: {
            email: "info@skylinelounge.com",
            phone: "+1 (555) 123-4567",
            gst: "GST123456789",
        },
        about: "Premier rooftop venue featuring state-of-the-art sound systems and panoramic city views.",
        followers: 8456,
        rating: 4.8,
        totalReviews: 234,
        amenities: ["Rooftop Access", "VIP Areas", "Full Bar", "Professional Sound System"],
        capacity: "500 people",
        menu: {
            available: true,
            highlights: ["Signature Cocktails", "Premium Spirits", "Bar Snacks"],
        },
        images: [
            "http://localhost:5000/images/venue-1.jpg",
            "http://localhost:5000/images/venue-2.jpg",
            "http://localhost:5000/images/venue-3.jpg",
        ],
        regularEvents: [
            {
                _id: "1",
                title: "Techno Tuesdays",
                description: "Weekly electronic music night featuring local DJs",
                time: "Every Tuesday, 9 PM - 2 AM",
                cover: 20,
            },
            {
                _id: "2",
                title: "Weekend Groove",
                description: "Premium weekend party experience",
                time: "Friday & Saturday, 10 PM - 4 AM",
                cover: 30,
            },
        ],
        reviews: [
            {
                _id: "1",
                user: "Party Enthusiast",
                rating: 5,
                comment: "Amazing venue with great acoustics!",
                date: "2024-02-15",
                venueResponse: "Thank you for your kind words! We're glad you enjoyed the experience.",
            },
            {
                _id: "2",
                user: "Night Life Lover",
                rating: 4,
                comment: "Great atmosphere, but drinks are a bit pricey.",
                date: "2024-02-10",
            },
        ],
    };

    return (
        loading ? (
            <div className=" w-full flex items-center justify-center py-3" >
                <img
                    src="/Images/loader.svg"
                    alt="loading..."
                    className=" object-contain w-[60px] h-[60px]"
                />
            </div >
        ) : (
            <div className="bg-[#0E0F13] min-h-screen text-white">
                <div className="bg-[#0E0F13] min-h-screen pt-16 text-white">
                    <svg
                        className="fixed bottom-0 right-0 z-[0] pointer-events-none"
                        width="536"
                        height="1071"
                        viewBox="0 0 536 1071"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g filter="url(#filter0_f_1_3190)">
                            <circle cx="535.5" cy="535.5" r="207.5" fill="#8B33FE" fillOpacity="0.4" />
                        </g>
                        <defs>
                            <filter
                                id="filter0_f_1_3190"
                                x="0"
                                y="0"
                                width="1071"
                                height="1071"
                                filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB"
                            >
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="164" result="effect1_foregroundBlur_1_3190" />
                            </filter>
                        </defs>
                    </svg>
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        {/* Venue Header Section */}
                        <div className="relative rounded-2xl overflow-hidden mb-10">
                            <div className="h-[300px] w-full">
                                <img
                                    src={venueOwner.images[0]}
                                    alt={venueOwner.venueName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0E0F13] p-6">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">{venueOwner.venueName}</h1>
                                        <p className="text-gray-300 flex items-center gap-2">
                                            <span>⭐ {venueOwner.rating}</span>
                                            <span>•</span>
                                            <span>{venueOwner.totalReviews} reviews</span>
                                        </p>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] group-hover:opacity-100 transition-all duration-300"></div>
                                        <button className="relative px-6 py-3 bg-gray-900 rounded-xl text-white font-bold">
                                            Contact Venue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Venue Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Details */}
                            <div className="lg:col-span-2 space-y-8">
                                <section className="bg-gray-900/50 rounded-xl p-6">
                                    <h2 className="text-2xl font-bold mb-4">About the Venue</h2>
                                    <p className="text-gray-300">{venueOwner.about}</p>

                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Location</h3>
                                            <p className="text-gray-300">{venueOwner.location.address}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Capacity</h3>
                                            <p className="text-gray-300">{venueOwner.capacity}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Regular Events Section */}
                                <section className="bg-gray-900/50 rounded-xl p-6">
                                    <h2 className="text-2xl font-bold mb-4">Regular Events</h2>
                                    <div className="space-y-4">
                                        {venueOwner.regularEvents.map((event) => (
                                            <div key={event._id} className="border border-gray-700 rounded-lg p-4">
                                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                                <p className="text-gray-300 mb-2">{event.description}</p>
                                                <p className="text-gray-400">{event.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column - Additional Info */}
                            <div className="space-y-6">
                                {/* Contact Info */}
                                <section className="bg-gray-900/50 rounded-xl p-6">
                                    <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                                    <div className="space-y-3">
                                        <p className="text-gray-300">📧 {venueOwner.contact.email}</p>
                                        <p className="text-gray-300">📱 {venueOwner.contact.phone}</p>
                                        <p className="text-gray-300">🏢 GST: {venueOwner.contact.gst}</p>
                                    </div>
                                </section>

                                {/* Amenities */}
                                <section className="bg-gray-900/50 rounded-xl p-6">
                                    <h2 className="text-xl font-bold mb-4">Amenities</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {venueOwner.amenities.map((amenity, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default VenueOwnerPage;
