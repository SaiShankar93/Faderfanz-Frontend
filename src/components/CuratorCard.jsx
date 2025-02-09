import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { BsCalendarEvent, BsPeople } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

export function CuratorCard({ event }) {
    return (
        <div className="bg-[#0E0E0E]/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            {/* Profile Image - Larger size */}
            <div className="relative w-full h-64">
                <img
                    src={event?.image || "/Images/CuratorCard.png"}
                    alt={event?.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-4">
                {/* Name */}
                <h3 className="text-white text-2xl font-semibold text-center">DJ Kazi</h3>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                        <BsCalendarEvent className="text-[#C5FF32] text-xl" />
                        <p className="text-[#C5FF32] text-2xl font-bold mt-2">235</p>
                        <p className="text-gray-400 text-sm">Performances</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <BsPeople className="text-[#C5FF32] text-xl" />
                        <p className="text-[#C5FF32] text-2xl font-bold mt-2">235</p>
                        <p className="text-gray-400 text-sm">Followers</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <AiFillStar className="text-[#C5FF32] text-xl" />
                        <p className="text-[#C5FF32] text-2xl font-bold mt-2">4.6</p>
                        <p className="text-gray-400 text-sm">Rating</p>
                    </div>
                </div>

                {/* Social Links and View Profile Button */}
                <div className="flex items-center justify-between mt-2">
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
                        to={`/curator/${event?.id}`}
                        className="px-6 py-2 bg-[#C5FF32] text-black rounded-lg text-center font-medium hover:bg-[#b3ff00] transition-colors"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}