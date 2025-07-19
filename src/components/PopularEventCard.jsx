import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/configs/axiosConfig';

const PopularEventCard = ({ event, onEventUpdate }) => {
    const [interestedEvents, setInterestedEvents] = useState(new Set());
    const [interestLoading, setInterestLoading] = useState({});
    const [userData, setUserData] = useState(null);

    // Get current user data
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUserData({ _id: decoded.id, role: decoded.role });
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    // Check if user is interested in an event
    const isUserInterestedInEvent = (event) => {
        if (!userData) return false;
        
        // Check if the event has an interested array
        if (event.interested && Array.isArray(event.interested)) {
            const isInterested = event.interested.some(interest => 
                interest.user === userData._id || interest.user === userData.id
            );
            return isInterested;
        }
        
        // Fallback to interestedEvents set
        return interestedEvents.has(event._id || event.id);
    };

    // Event interest toggle functionality
    const handleEventInterestToggle = async (eventId, event) => {
        try {
            setInterestLoading(prev => ({ ...prev, [eventId]: true }));
            
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to mark events as interested');
                return;
            }

            const response = await axiosInstance.post(`/events/${eventId}/interest`);
            
            if (response.data) {
                const { isInterested, totalInterested } = response.data;
                
                // Update interested events set
                setInterestedEvents(prev => {
                    const newSet = new Set(prev);
                    if (isInterested) {
                        newSet.add(eventId);
                    } else {
                        newSet.delete(eventId);
                    }
                    return newSet;
                });
                
                // Update the event data in real-time if onEventUpdate is provided
                if (onEventUpdate) {
                    // If the API returns the updated interested array, use it
                    if (response.data.interested && Array.isArray(response.data.interested)) {
                        onEventUpdate(eventId, { interested: response.data.interested });
                    } else {
                        // Otherwise, manually update the array
                        const currentInterested = event.interested || [];
                        const updatedInterested = isInterested 
                            ? [...currentInterested, { user: userData._id, userModel: userData.role }]
                            : currentInterested.filter(interest => interest.user !== userData._id);
                        onEventUpdate(eventId, { interested: updatedInterested });
                    }
                }
                
                toast.success(isInterested ? 'Marked as interested!' : 'Removed from interested!');
            }
        } catch (error) {
            console.error('Error toggling event interest:', error);
            toast.error(error.response?.data?.message || 'Failed to toggle interest status');
        } finally {
            setInterestLoading(prev => ({ ...prev, [eventId]: false }));
        }
    };

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
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEventInterestToggle(event._id || event.id, event);
                    }}
                    disabled={interestLoading[event._id || event.id]}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                        isUserInterestedInEvent(event) 
                            ? 'bg-[#C5FF32] hover:bg-[#d4ff66]' 
                            : 'bg-[#1C1D24]/50 hover:bg-[#1C1D24]/70'
                    } ${interestLoading[event._id || event.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FaStar className={`w-4 h-4 transition-colors ${
                        isUserInterestedInEvent(event) 
                            ? 'text-black' 
                            : 'text-[#C5FF32]'
                    }`} />
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
                            <span className="text-[#C5FF32]">{Array.isArray(event?.interested) ? event.interested.length : (event?.interested || 0)} interested</span>
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