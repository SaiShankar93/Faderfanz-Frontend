import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        icon: "/icons/sponsors.svg",
        label: "Sponsors",
        link: "/sponser/all",
        colors: "from-[#00FFB2] to-[#C5FF32]"
    },
    {
        icon: "/icons/venue.svg",
        label: "Venue Owners",
        link: "/venue/:id",
        colors: "from-[#C5FF32] to-[#FFE600]"
    },
    {
        icon: "/icons/curators.svg",
        label: "Curators",
        link: "/curator/all",
        colors: "from-[#00FFB2] to-[#C5FF32]"
    },
    {
        icon: "/icons/crowdfunding.svg",
        label: "Crowdfunding",
        link: "/crowdfunding/:id",
        colors: "from-[#00FFB2] to-[#C5FF32]"
    },
    {
        icon: "/icons/guests.svg",
        label: "Guests/Fans",
        link: "/guests",
        colors: "from-[#00FFB2] to-[#C5FF32]"
    },
    {
        icon: "/icons/blogs.svg",
        label: "Blogs",
        link: "/venue/all",
        colors: "from-[#00FFB2] to-[#C5FF32]"
    }
];

export default function ExploreCategories({}) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center gap-2 mb-12">
                <h2 className="text-3xl font-semibold text-white">Explore</h2>
                <span className="text-3xl font-semibold text-[#C5FF32]">Categories</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        to={category.link}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="group relative">
                            <div className="w-32 h-32 rounded-full bg-[#1C1D24] flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-105">
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.colors} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <img
                                    src={category.icon}
                                    alt={category.label}
                                    className="w-16 h-16 relative z-10"
                                />
                            </div>
                        </div>
                        <span className="text-white text-sm font-medium text-center">
                            {category.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
} 