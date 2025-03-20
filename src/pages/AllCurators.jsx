import React, { useState, useEffect } from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { IoSearchOutline, IoLocationOutline } from 'react-icons/io5';
import { FiFilter } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const AllCurators = () => {
    // UI States
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        price: false,
        category: false,
        format: false
    });

    // Data States
    const [curators, setCurators] = useState([]);
    const [filteredCurators, setFilteredCurators] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("Mumbai");

    // Filter States
    const [selectedSort, setSelectedSort] = useState("rating");
    const [filters, setFilters] = useState({
        price: [],
        category: [],
        format: []
    });

    // Mock data - Replace with API call
    useEffect(() => {
        const fetchCurators = async () => {
            try {
                // Simulate API call
                const mockCurators = [
                    {
                        id: 1,
                        name: "DJ Kazi",
                        image: "/Images/post.png",
                        performances: 235,
                        followers: 235,
                        rating: 4.6,
                        category: "DJs",
                        format: "DJ Sets",
                        price: "paid",
                        location: "Mumbai",
                        socialLinks: {
                            facebook: "#",
                            instagram: "#",
                            twitter: "#"
                        }
                    },
                    // ... other curators
                ];
                setCurators(mockCurators);
                setFilteredCurators(mockCurators);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching curators:", error);
                setLoading(false);
            }
        };

        fetchCurators();
    }, []);

    // Filter and Search Logic
    useEffect(() => {
        let result = [...curators];

        // Search filter
        if (searchQuery) {
            result = result.filter(curator =>
                curator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                curator.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Location filter
        if (selectedLocation) {
            result = result.filter(curator =>
                curator.location === selectedLocation
            );
        }

        // Apply category filters
        if (filters.category.length > 0) {
            result = result.filter(curator =>
                filters.category.includes(curator.category.toLowerCase())
            );
        }

        // Apply format filters
        if (filters.format.length > 0) {
            result = result.filter(curator =>
                filters.format.includes(curator.format.toLowerCase())
            );
        }

        // Apply price filters
        if (filters.price.length > 0) {
            result = result.filter(curator =>
                filters.price.includes(curator.price.toLowerCase())
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (selectedSort) {
                case 'rating':
                    return b.rating - a.rating;
                case 'performances':
                    return b.performances - a.performances;
                case 'followers':
                    return b.followers - a.followers;
                default:
                    return 0;
            }
        });

        setFilteredCurators(result);
    }, [curators, searchQuery, selectedLocation, filters, selectedSort]);

    // Handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle location change
    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    // Handle filter changes
    const handleFilterChange = (type, value) => {
        setFilters(prev => {
            const updatedFilters = { ...prev };
            if (updatedFilters[type].includes(value)) {
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
            } else {
                updatedFilters[type] = [...updatedFilters[type], value];
            }
            return updatedFilters;
        });
    };

    // Handle social link clicks
    const handleSocialClick = (url, platform) => {
        if (url === "#") {
            console.log(`${platform} profile not available`);
            return;
        }
        window.open(url, '_blank');
    };

    // Toggle expanded sections
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Toggle mobile filters
    const toggleMobileFilters = () => {
        setShowMobileFilters(!showMobileFilters);
    };

    // Filter categories
    const allCategories = [
        'DJs',
        'Musicians',
        'Bands',
        'Solo Artists',
        'Orchestras',
        'Live Performers',
        'Music Producers',
        'Sound Engineers',
        'Event Hosts',
        'MCs'
    ];

    const allFormats = [
        'Live Music',
        'DJ Sets',
        'Band Performance',
        'Solo Performance',
        'Orchestra',
        'Electronic Music',
        'Acoustic Sets',
        'Hybrid Performance',
        'Virtual Performance',
        'Interactive Shows'
    ];

    // Render filter sections
    const renderFilterSection = (title, items, type, showMore = true) => (
        <div className="mb-6">
            <h3 className="text-white text-base mb-4">{title}</h3>
            <div className="space-y-3">
                {items.slice(0, expandedSections[type] ? items.length : 5).map((item) => (
                    <label key={item} className="flex items-center group cursor-pointer">
                        <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
                            <input
                                type="checkbox"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                checked={filters[type].includes(item.toLowerCase())}
                                onChange={() => handleFilterChange(type, item.toLowerCase())}
                            />
                            <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
                            {filters[type].includes(item.toLowerCase()) && (
                                <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
                            )}
                        </div>
                        <span className="text-gray-400 group-hover:text-white transition-colors">{item}</span>
                    </label>
                ))}
            </div>
            {showMore && items.length > 5 && (
                <button
                    onClick={() => toggleSection(type)}
                    className="text-[#00FFB3] text-sm mt-3 hover:text-[#00FFB3]/80"
                >
                    {expandedSections[type] ? 'Less' : 'More'}
                </button>
            )}
        </div>
    );

    return (
        <div className="bg-[#0E0F13] min-h-screen relative font-sen">
            {/* Background SVG */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                    src="/Images/allspon.svg"
                    alt="background gradient"
                    className="absolute -left-[30%] w-[966px] h-[1613px] object-cover rotate-[82.53deg]"
                    style={{
                        top: '50%',
                        transform: 'translateY(-50%)',
                        mixBlendMode: 'normal',
                        opacity: 0.6,
                    }}
                />
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-6 md:mb-12">
                        Explore Our Curators
                    </h1>

                    {/* Search Bar */}
                    <div className="w-full max-w-4xl">
                        <div className="flex flex-col sm:flex-row bg-[#1C1D24]/80 backdrop-blur-sm rounded-lg overflow-hidden">
                            <div className="flex-1 flex items-center min-w-0">
                                <IoSearchOutline className="ml-4 w-5 h-5 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search Curators, Categories..."
                                    className="w-full px-3 py-3 bg-transparent text-white focus:outline-none placeholder-gray-400 min-w-0"
                                />
                            </div>
                            <div className="flex items-center border-t sm:border-t-0 sm:border-l border-gray-700/50 shrink-0">
                                <IoLocationOutline className="ml-4 w-5 h-5 text-gray-400" />
                                <select
                                    value={selectedLocation}
                                    onChange={handleLocationChange}
                                    className="w-full sm:w-32 md:w-40 px-3 py-3 bg-transparent text-white focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Bangalore">Bangalore</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <Swiper
                    loop={true}
                    pagination={{
                        clickable: true,
                        bulletActiveClass: 'swiper-pagination-bullet-active bg-[#00FFB2]'
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, Pagination]}
                    className="w-full h-full"
                >
                    <SwiperSlide>
                        <div className="relative w-full h-full">
                            <img
                                className="w-full h-full object-cover"
                                src="/heroslider.jpeg"
                                alt="Hero Slider"
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/50" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden flex justify-between items-center mb-4">
                        <button
                            onClick={toggleMobileFilters}
                            className="flex items-center gap-2 bg-[#1C1D24]/50 text-white px-4 py-2 rounded-lg"
                        >
                            <FiFilter size={18} />
                            <span>Filters</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Sort:</span>
                            <select
                                className="bg-[#1C1D24]/50 backdrop-blur-sm text-white px-2 py-2 rounded-lg border border-gray-700 text-sm"
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                            >
                                <option value="rating" className="bg-[#1C1D24]">Rating</option>
                                <option value="performances" className="bg-[#1C1D24]">Performances</option>
                                <option value="followers" className="bg-[#1C1D24]">Followers</option>
                            </select>
                        </div>
                    </div>

                    {/* Mobile Filter Drawer */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 bg-black/70 z-50 lg:hidden">
                            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[350px] bg-[#1C1D24] overflow-y-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-white text-xl font-semibold">Filters</h2>
                                    <button
                                        onClick={toggleMobileFilters}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <IoMdClose size={24} />
                                    </button>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-6">
                                    <h3 className="text-white text-base mb-4">Price</h3>
                                    <div className="space-y-3">
                                        {['Free', 'Paid'].map((price) => (
                                            <label key={price} className="flex items-center group cursor-pointer">
                                                <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        checked={filters.price.includes(price.toLowerCase())}
                                                        onChange={() => handleFilterChange('price', price.toLowerCase())}
                                                    />
                                                    <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
                                                    {filters.price.includes(price.toLowerCase()) && (
                                                        <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
                                                    )}
                                                </div>
                                                <span className="text-gray-400 group-hover:text-white transition-colors">{price}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Filter */}
                                {renderFilterSection('Category', allCategories, 'category')}

                                {/* Format Filter */}
                                {renderFilterSection('Format', allFormats, 'format')}

                                {/* Apply Filters Button */}
                                <div className="mt-8">
                                    <button
                                        onClick={toggleMobileFilters}
                                        className="w-full bg-[#C5FF32] text-black py-3 rounded-lg font-medium"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Filters */}
                    <aside className="hidden lg:block w-[280px] bg-[#1C1D24]/50 backdrop-blur-sm rounded-xl p-6 h-fit sticky top-4">
                        <h2 className="text-white text-xl font-semibold mb-6">Filters</h2>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h3 className="text-white text-base mb-4">Price</h3>
                            <div className="space-y-3">
                                {['Free', 'Paid'].map((price) => (
                                    <label key={price} className="flex items-center group cursor-pointer">
                                        <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
                                            <input
                                                type="checkbox"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                checked={filters.price.includes(price.toLowerCase())}
                                                onChange={() => handleFilterChange('price', price.toLowerCase())}
                                            />
                                            <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
                                            {filters.price.includes(price.toLowerCase()) && (
                                                <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-400 group-hover:text-white transition-colors">{price}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Category Filter */}
                        {renderFilterSection('Category', allCategories, 'category')}

                        {/* Format Filter */}
                        {renderFilterSection('Format', allFormats, 'format')}
                    </aside>

                    {/* Main content */}
                    <div className="flex-1">
                        {/* Desktop Header */}
                        <div className="hidden lg:flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-semibold text-white">All Curators</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">Sort by:</span>
                                <select
                                    className="bg-[#1C1D24]/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#C5FF32]"
                                    value={selectedSort}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                >
                                    <option value="rating" className="bg-[#1C1D24]">Rating</option>
                                    <option value="performances" className="bg-[#1C1D24]">Performances</option>
                                    <option value="followers" className="bg-[#1C1D24]">Followers</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Header */}
                        <div className="lg:hidden mb-6">
                            <h2 className="text-xl font-semibold text-white">All Curators</h2>
                        </div>

                        {loading ? (
                            <div className="w-full flex items-center justify-center py-3">
                                <img
                                    src="/Images/loader.svg"
                                    alt="loading..."
                                    className="object-contain w-[60px] h-[60px]"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCurators.length === 0 ? (
                                    <div className="text-center text-gray-400 py-8">
                                        No curators found matching your criteria
                                    </div>
                                ) : (
                                    filteredCurators.map((curator) => (
                                        <CuratorCard
                                            key={curator.id}
                                            curator={curator}
                                            onSocialClick={handleSocialClick}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// CuratorCard component
const CuratorCard = ({ curator, onSocialClick }) => {
    return (
        <div className="bg-[#1C1D24]/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-[#1C1D24]/70 transition-colors">
            <div className="flex flex-col sm:flex-row items-stretch h-auto sm:h-60">
                {/* Curator Image */}
                <div className="w-full sm:w-60 h-48 sm:h-full flex-shrink-0">
                    <img
                        src={curator.image}
                        alt={curator.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                        {/* Curator Name */}
                        <h3 className="text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{curator.name}</h3>

                        {/* Stats Row */}
                        <div className="flex justify-between sm:justify-start sm:space-x-12 mb-6">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{curator.performances}</span>
                                    <img src="/icons/location-icon.svg" alt="Performances" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                                </div>
                                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Performances</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{curator.followers}</span>
                                    <img src="/icons/Event-icon.svg" alt="Followers" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                                </div>
                                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{curator.rating}</span>
                                    <img src="/icons/Star.svg" alt="Rating" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                                </div>
                                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Links and Button Row */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onSocialClick(curator.socialLinks.facebook, 'Facebook')}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent flex items-center justify-center text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors"
                        >
                            <FaFacebook size={16} className="sm:text-lg" />
                        </button>
                        <button
                            onClick={() => onSocialClick(curator.socialLinks.instagram, 'Instagram')}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent flex items-center justify-center text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors"
                        >
                            <FaInstagram size={16} className="sm:text-lg" />
                        </button>
                        <button
                            onClick={() => onSocialClick(curator.socialLinks.twitter, 'Twitter')}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent flex items-center justify-center text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors"
                        >
                            <FaTwitter size={16} className="sm:text-lg" />
                        </button>
                        <div className="ml-auto">
                            <a
                                href={`/curator/${curator.id}`}
                                className="px-3 py-1.5 sm:px-5 sm:py-2 bg-[#C5FF32] text-black rounded-md text-center text-xs sm:text-sm font-medium hover:bg-[#b3ff00] transition-colors"
                            >
                                View Profile
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCurators;
