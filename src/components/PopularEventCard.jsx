import React from 'react';
import { FaStar } from 'react-icons/fa';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';

const PopularEventCard = ({ event }) => {
    return (
        <div className="bg-[#1C1D24] rounded-3xl overflow-hidden group">
            {/* Image Container */}
            <div className="relative">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-[220px] object-cover"
                />
                <button className="absolute top-3 right-3 bg-[#C5FF32] p-2 rounded-full">
                    <FaStar className="w-4 h-4 text-black" />
                </button>
                {event.isFree && (
                    <span className="absolute top-3 left-3 bg-[#00FFB2] text-black text-sm font-medium px-4 py-1 rounded-full">
                        FREE
                    </span>
                )}
            </div>

            {/* Content Container */}
            <div className="bg-gradient-to-b from-[#1C1D24] to-[#14151A] p-5">
                <div className="flex gap-5">
                    {/* Date Box - Left Side - Adjusted position */}
                    <div className="bg-[#262626]/50 rounded-xl py-3 px-4 h-fit text-center mt-10">
                        <span className="text-gray-400 text-sm uppercase block">NOV</span>
                        <span className="text-white text-lg font-medium">{event.date}</span>
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-1">
                        <h3 className="text-white text-xl font-semibold mb-2">
                            {event.title}
                        </h3>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <IoLocationOutline className="w-5 h-5" />
                                <span className="text-sm">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <IoTimeOutline className="w-5 h-5" />
                                <span className="text-sm">{event.time}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                            <FaStar className="w-4 h-4 text-[#C5FF32]" />
                            <span className="text-[#C5FF32] font-medium">{event.interestedCount}</span>
                            <span className="text-gray-400">interested</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularEventCard; 