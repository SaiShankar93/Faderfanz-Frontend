import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendarEvent } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

export function VenueOwnerCard({ event }) {
    return (
        <div className="bg-[#0E0E0E]/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center gap-4">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1A1A1A]">
                <img
                    src={event?.venueImage?.[0] ? `${import.meta.env.VITE_SERVER_URL}${event?.venueImage?.[0]}` : "/Images/Venueownercard.png"}
                    alt={event?.venueName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Name */}
            <h3 className="text-white text-xl font-semibold text-center">{event?.venueName}</h3>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center">
                    <FaLocationDot className="text-[#C5FF32] text-xl mb-1" />
                    <p className="text-[#C5FF32] text-lg font-bold">{event?.address || "N/A"}</p>
                    <p className="text-gray-400 text-xs text-center">Location</p>
                </div>
                <div className="flex flex-col items-center">
                    <BsCalendarEvent className="text-[#C5FF32] text-xl mb-1" />
                    <p className="text-[#C5FF32] text-lg font-bold">{event?.menuProducts?.length || 0}</p>
                    <p className="text-gray-400 text-xs text-center">Menu Items</p>
                </div>
                <div className="flex flex-col items-center">
                    <AiFillStar className="text-[#C5FF32] text-xl mb-1" />
                    <p className="text-[#C5FF32] text-lg font-bold">{event?.hasMenu ? "Yes" : "No"}</p>
                    <p className="text-gray-400 text-xs text-center">Has Menu</p>
                </div>
            </div>

            {/* Social Links and View Profile Button Container */}
            <div className="flex items-center justify-between w-full mt-2">
                {/* Social Links */}
                <div className="flex gap-2">
                    <Link
                        to={event?.website || "#"}
                        className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00FFB2] hover:bg-[#2A2A2A] transition-colors"
                    >
                        <FaFacebook size={16} />
                    </Link>
                    <Link
                        to={event?.website || "#"}
                        className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00FFB2] hover:bg-[#2A2A2A] transition-colors"
                    >
                        <FaInstagram size={16} />
                    </Link>
                    <Link
                        to={event?.website || "#"}
                        className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00FFB2] hover:bg-[#2A2A2A] transition-colors"
                    >
                        <FaTwitter size={16} />
                    </Link>
                </div>

                {/* View Profile Button */}
                <Link
                    to={`/event-venue/${event?._id}`}
                    className="px-4 py-1.5 bg-[#C5FF32] text-black rounded-lg text-sm font-medium hover:bg-[#b3ff00] transition-colors"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
