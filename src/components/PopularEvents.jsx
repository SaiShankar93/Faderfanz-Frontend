import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import PopularEventCard from './PopularEventCard';
import axiosInstance from '@/configs/axiosConfig';
import { toast } from 'react-toastify';

const timeFilters = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This Weekend', value: 'weekend' },
    { label: 'Free', value: 'free' },
];

// Mock data for fallback
// const mockEvents = [
//     {
//         _id: 1,
//         title: 'The Kazi-culture show',
//         image: '/events/event1.jpeg',
//         date: '25-26',
//         month: 'NOV',
//         location: '12 Lake Avenue, Mumbai, India',
//         time: '8:30 AM - 7:30 PM',
//         interestedCount: 14,
//         isFree: true
//     },
//     {
//         _id: 2,
//         title: 'Party Night',
//         image: '/events/event2.png',
//         date: '25-26',
//         month: 'NOV',
//         location: '12 Lake Avenue, Mumbai, India',
//         time: '8:30 AM - 7:30 PM',
//         interestedCount: 14,
//         isFree: true
//     },
//     {
//         _id: 3,
//         title: 'The Kazi-culture show',
//         image: '/events/event3.png',
//         date: '25-26',
//         month: 'NOV',
//         location: '12 Lake Avenue, Mumbai, India',
//         time: '8:30 AM - 7:30 PM',
//         interestedCount: 14,
//         isFree: false
//     }
// ];

const PopularEvents = ({ showTitle = true, showBackground = true, currentEventId  }) => {
    const [activeFilter, setActiveFilter] = React.useState('all');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllEvents, setShowAllEvents] = useState(false);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/events');
            console.warn("event data",data.data);
            if (data && data.data.length > 0) {
                setEvents(data.data);
            } else {
                // If API returns no data, keep using mock data
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to fetch events');
            // Keep using mock data on error
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events based on the active filter
    // const filteredEvents = events.filter(event => {
    //     if (activeFilter === 'all') return true;
    //     if (activeFilter === 'free' && (event.isFree || event.ticketPrice === 0)) return true;
        
    //     // For mock data
    //     if (event.date) {
    //         const eventDate = new Date(event.date);
    //         const today = new Date();
    //         const tomorrow = new Date(today);
    //         tomorrow.setDate(tomorrow.getDate() + 1);
    //         const thisWeekend = new Date(today);
    //         thisWeekend.setDate(thisWeekend.getDate() + (6 - today.getDay()));

    //         switch (activeFilter) {
    //             case 'today':
    //                 return eventDate.toDateString() === today.toDateString();
    //             case 'tomorrow':
    //                 return eventDate.toDateString() === tomorrow.toDateString();
    //             case 'weekend':
    //                 return eventDate >= today && eventDate <= thisWeekend;
    //             default:
    //                 return true;
    //         }
    //     }
        
    //     // For API data
    //     if (event.startDate) {
    //         const eventDate = new Date(event.startDate);
    //         const today = new Date();
    //         today.setHours(0, 0, 0, 0);
    //         const tomorrow = new Date(today);
    //         tomorrow.setDate(tomorrow.getDate() + 1);
    //         const thisWeekend = new Date(today);
    //         thisWeekend.setDate(thisWeekend.getDate() + (6 - today.getDay()));

    //         switch (activeFilter) {
    //             case 'today':
    //                 return eventDate.toDateString() === today.toDateString();
    //             case 'tomorrow':
    //                 return eventDate.toDateString() === tomorrow.toDateString();
    //             case 'weekend':
    //                 return eventDate >= today && eventDate <= thisWeekend;
    //             default:
    //                 return true;
    //         }
    //     }

    //     return false;
    // });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 relative overflow-hidden">
            {/* Background Gradient - Only show if showBackground is true */}
            {showBackground && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        pointerEvents: 'none',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <img
                        src="/Images/bg-grad-pevents.svg"
                        alt=""
                        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-auto opacity-40"
                        style={{
                            maxWidth: '1323px',
                            transform: 'translateY(-50%) translateX(-30%)',
                        }}
                    />
                </div>
            )}

            {/* Content with relative positioning */}
            <div className="relative z-10">
                {showTitle && (
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-semibold">
                            Popular <span className="text-[#C5FF32]">Events</span> Near you
                        </h2>
                    </div>
                )}

                <div className="flex flex-wrap gap-3 mb-8">
                    {timeFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${activeFilter === filter.value
                                    ? 'bg-[#00FFB2] text-black'
                                    : 'bg-[#1C1D24] text-gray-400 hover:bg-[#262626]'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5FF32] mx-auto"></div>
                        <p className="text-gray-400 mt-4">Loading events...</p>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.slice(0, showAllEvents ? events.length : 3).map((event) => {
                            if(event.id === currentEventId){
                                return null
                            }
                            return <PopularEventCard key={event._id} event={event} />
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No events found</p>
                    </div>
                )}

                {events.length > 3 && (
                    <button 
                        className="w-full mt-8 py-4 bg-[#1C1D24] text-gray-400 rounded-xl hover:bg-[#262626] transition-colors" 
                        onClick={() => setShowAllEvents(!showAllEvents)}
                    >
                        {showAllEvents ? 'Show Less' : 'See More'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PopularEvents; 