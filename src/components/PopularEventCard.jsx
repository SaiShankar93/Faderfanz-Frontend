import React from 'react';
import { FaStar } from 'react-icons/fa';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const PopularEventCard = ({ event }) => {
    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            date: date.getDate()
        };
    };

    // Format time range
    const formatTimeRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const { month, date } = formatDate(event.startDate);
    const timeRange = formatTimeRange(event.startDate, event.endDate);
    const isFree = !event.ticketPrice || event.ticketPrice === 0;
    const ticketsLeft = event.ticketsAvailable ? event.ticketsAvailable - event.ticketsSold : 0;

    // Format location string
    const formatLocation = (location) => {
        if (!location) return 'Location TBA';
        const parts = [location.address, location.city, location.state, location.country].filter(Boolean);
        return parts.join(', ');
    };

    return (
        <Link to={`/event/${event.id}`} className="block bg-[#1C1D24] rounded-3xl overflow-hidden group hover:bg-[#1C1D24]/90 transition-colors">
            {/* Image Container */}
            <div className="relative">
                <img
                    src={event.banner?.url ? `${import.meta.env.VITE_SERVER_URL}${event.banner?.url}` : '/events/event1.jpeg'}
                    alt={event.banner?.alt || event.title}
                    className="w-full h-[220px] object-cover"
                />
                <button
                    className="absolute top-3 right-3 bg-[#C5FF32] p-2 rounded-full hover:bg-[#d4ff66] transition-colors"
                    onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking the star
                        // Add your favorite/interested logic here
                    }}
                >
                    <FaStar className="w-4 h-4 text-black" />
                </button>
                {isFree && (
                    <span className="absolute top-3 left-3 bg-[#00FFB2] text-black text-sm font-medium px-4 py-1 rounded-full">
                        FREE
                    </span>
                )}
                {!isFree && (
                    <span className="absolute top-3 left-3 bg-[#1C1D24] text-white text-sm font-medium px-4 py-1 rounded-full">
                        ${event.ticketPrice}
                    </span>
                )}
            </div>

            {/* Content Container */}
            <div className="bg-gradient-to-b from-[#1C1D24] to-[#14151A] p-5">
                <div className="flex gap-5">
                    {/* Date Box - Left Side */}
                    <div className="bg-[#262626]/50 rounded-xl py-3 px-4 h-fit text-center mt-10">
                        <span className="text-gray-400 text-sm uppercase block">{month}</span>
                        <span className="text-white text-lg font-medium">{date}</span>
                    </div>

                    {/* Event Details - Right Side */}
                    <div className="flex-1">
                        <h3 className="text-white text-xl font-medium mb-2 line-clamp-2">
                            {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <IoLocationOutline className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{formatLocation(event.location)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <IoTimeOutline className="w-4 h-4 flex-shrink-0" />
                            <span>{timeRange}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                            <span className="text-[#C5FF32]">{event.stats?.interested || 0} interested</span>
                        </div>
                        {!isFree && (
                            <div className="mt-2 text-sm text-gray-400">
                                {ticketsLeft} tickets left
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PopularEventCard; 