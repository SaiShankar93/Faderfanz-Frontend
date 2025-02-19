import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';

const GuestCard = ({ guest }) => {
    return (
        <div className="bg-[#1A1A1A] rounded-[20px] p-5 flex flex-col w-full min-h-[400px]">
            {/* Profile Image */}
            <div className="relative w-48 h-48 mx-auto mb-3">
                <img
                    src={guest.image}
                    alt={guest.name}
                    className="w-full h-full rounded-full object-cover border-4 border-[#1A1A1A]"
                />
            </div>

            {/* Name */}
            <h3 className="text-xl font-semibold text-white mb-5 text-center">{guest.name}</h3>

            {/* Stats Container */}
            <div className="w-full grid grid-cols-2 gap-3 mb-auto">
                <div className="bg-[#111111] rounded-xl p-3 flex flex-col items-center">
                    <p className="text-gray-500 text-sm">Attended</p>
                    <p className="text-2xl font-bold text-white my-1">
                        {guest.attended}
                    </p>
                    <p className="text-gray-500 text-sm">Events</p>
                </div>

                <div className="bg-[#111111] rounded-xl p-3 flex flex-col items-center">
                    <p className="text-gray-500 text-sm">Contributed</p>
                    <p className="text-2xl font-bold text-white my-1">
                        ${guest.counterRaised}
                    </p>
                    <p className="text-gray-500 text-sm">Crowd funding</p>
                </div>
            </div>

            {/* Bottom Container - Social Links and Button side by side */}
            <div className="flex items-center justify-between w-full mt-4">
                {/* Social Links */}
                <div className="flex gap-3">
                    {[FaFacebook, FaInstagram, FaXTwitter].map((Icon, index) => (
                        <Link
                            key={index}
                            to="#"
                            className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-[#00FFB2] hover:bg-[#2A2A2A] transition-colors"
                        >
                            <Icon size={20} />
                        </Link>
                    ))}
                </div>

                {/* View Profile Button */}
                <Link
                    to={`/venue/${guest.id}`}
                    className="px-6 py-2 bg-[#C5FF32] text-black rounded-lg text-center font-medium hover:bg-[#b3ff00] transition-colors"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default GuestCard; 