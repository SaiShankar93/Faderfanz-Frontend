import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendarEvent } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

export function VenueOwnerCard({ event }) {
    return (
        <div className="bg-[#0E0E0E]/80 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center gap-6">
            {/* Profile Image */}
            <img
                src={event?.image || "Images/Venueownercard.png"}
                alt={event?.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-[#1A1A1A]"
            />

            {/* Name */}
            <h3 className="text-white text-2xl font-semibold">Kazi Culture E.</h3>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center">
                    <FaLocationDot className="text-[#C5FF32] text-xl mb-2" />
                    <p className="text-[#C5FF32] text-2xl font-bold">235</p>
                    <p className="text-gray-400 text-sm mt-1">Venues Owned</p>
                </div>
                <div className="flex flex-col items-center">
                    <BsCalendarEvent className="text-[#C5FF32] text-xl mb-2" />
                    <p className="text-[#C5FF32] text-2xl font-bold">235</p>
                    <p className="text-gray-400 text-sm mt-1">Events hosted</p>
                </div>
                <div className="flex flex-col items-center">
                    <AiFillStar className="text-[#C5FF32] text-xl mb-2" />
                    <p className="text-[#C5FF32] text-2xl font-bold">4.6</p>
                    <p className="text-gray-400 text-sm mt-1">Rating</p>
                </div>
            </div>

            {/* Social Links and View Profile Button Container */}
            <div className="flex items-center justify-between w-full mt-2">
                {/* Social Links */}
                <div className="flex gap-3">
                    <Link
                        to="#"
                        className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00FFB2] hover:bg-[#2A2A2A] transition-colors"
                    >
                        <FaFacebook size={20} />
                    </Link>
                    <Link
                        to="#"
                        className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00FFB2] hover:bg-[#2A2A2A] transition-colors"
                    >
                        <FaInstagram size={20} />
                    </Link>
                    <Link
                        to="#"
                        className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#00FFB2] hover:bg-[#2A2A2A] transition-colors"
                    >
                        <FaTwitter size={20} />
                    </Link>
                </div>

                {/* View Profile Button */}
                <Link
                    to={`/venue/${event?.id}`}
                    className="px-6 py-2 bg-[#C5FF32] text-black rounded-lg text-center font-medium hover:bg-[#b3ff00] transition-colors"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
