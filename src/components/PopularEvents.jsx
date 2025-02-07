import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import PopularEventCard from './PopularEventCard';

const timeFilters = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This Weekend', value: 'weekend' },
    { label: 'Free', value: 'free' },
];

// Temporary mock data - replace with actual API data
const mockEvents = [
    {
        id: 1,
        title: 'The Kazi-culture show',
        image: '/events/event1.jpeg',
        date: '25-26',
        month: 'NOV',
        location: '12 Lake Avenue, Mumbai, India',
        time: '8:30 AM - 7:30 PM',
        interestedCount: 14,
        isFree: true
    },
    {
        id: 2,
        title: 'Party Night',
        image: '/events/event2.png',
        date: '25-26',
        month: 'NOV',
        location: '12 Lake Avenue, Mumbai, India',
        time: '8:30 AM - 7:30 PM',
        interestedCount: 14,
        isFree: true
    },
    {
        id: 3,
        title: 'The Kazi-culture show',
        image: '/events/event3.png',
        date: '25-26',
        month: 'NOV',
        location: '12 Lake Avenue, Mumbai, India',
        time: '8:30 AM - 7:30 PM',
        interestedCount: 14,
        isFree: false
    },
    // Add more mock events as needed
];

export default function PopularEvents() {
    const [activeFilter, setActiveFilter] = React.useState('all');

    // Filter events based on the active filter
    const filteredEvents = mockEvents.filter(event => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'free' && event.isFree) return true;
        // Add more filtering logic for 'today', 'tomorrow', etc.
        return false; // Default case
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center gap-2 mb-8">
                <h2 className="text-3xl md:text-4xl font-semibold text-white">Popular</h2>
                <div className="flex items-center gap-2">
                    <span className="text-3xl md:text-4xl font-semibold text-[#C5FF32]">Events</span>
                    <span className="text-3xl md:text-4xl font-semibold text-white">Near you</span>
                </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <PopularEventCard key={event.id} event={event} />
                ))}
            </div>

            <button className="w-full mt-8 py-4 bg-[#1C1D24] text-gray-400 rounded-xl hover:bg-[#262626] transition-colors">
                See More
            </button>
        </div>
    );
} 