import React, { useState, useEffect } from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoSearchOutline, IoLocationOutline } from 'react-icons/io5';
import { FiFilter } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import axiosInstance from "@/configs/axiosConfig";

const AllSponsors = () => {
    // UI States
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        price: false,
        category: false,
        format: false
    });

    // Data States
    const [sponsors, setSponsors] = useState([]);
    const [filteredSponsors, setFilteredSponsors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("No Location");

    // Filter States
    const [selectedSort, setSelectedSort] = useState("rating");
    const [filters, setFilters] = useState({
        price: [],
        category: [],
        format: []
    });

    // Mock data - Replace with API call
    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const { data } = await axiosInstance.get(`/management/sponsors`);
                if (data) {
                    setSponsors(data);
                    console.log(data);
                    setFilteredSponsors(data);
                    setLoading(false);
                }
                console.log(data);
            } catch (error) {
                console.error("Error fetching sponsors:", error);
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []);

    // Helper function to get location display text
    const getLocationDisplay = (location) => {
        if (typeof location === 'string') {
            return location;
        }
        if (location && typeof location === 'object') {
            return location.city || location.address || 'Unknown Location';
        }
        return 'Unknown Location';
    };

    // Filter and Search Logic
    useEffect(() => {
        let result = [...sponsors];

        // Search filter with pattern matching
        if (searchQuery.trim()) {
            result = result.filter(sponsor =>
                sponsor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sponsor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sponsor.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sponsor.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (getLocationDisplay(sponsor.location).toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Location filter with pattern matching
        if (selectedLocation && selectedLocation !== "No Location") {
            result = result.filter(sponsor => {
                const sponsorLocation = getLocationDisplay(sponsor.location).toLowerCase();
                return sponsorLocation.includes(selectedLocation.toLowerCase());
            });
        }

        // Apply category filters
        if (filters.category.length > 0) {
            result = result.filter(sponsor =>
                filters.category.includes(sponsor.category?.toLowerCase())
            );
        }

        // Apply format filters
        if (filters.format.length > 0) {
            result = result.filter(sponsor =>
                filters.format.includes(sponsor.format?.toLowerCase())
            );
        }

        // Apply price filters
        if (filters.price.length > 0) {
            result = result.filter(sponsor =>
                filters.price.includes(sponsor.price?.toLowerCase())
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (selectedSort) {
                case 'rating':
                    return b.rating - a.rating;
                case 'eventsSponsored':
                    return b.eventsSponsored - a.eventsSponsored;
                case 'followers':
                    return b.followers - a.followers;
                default:
                    return 0;
            }
        });

        setFilteredSponsors(result);
    }, [sponsors, searchQuery, selectedLocation, filters, selectedSort]);

    // Check if we should show search results
    const shouldShowResults = searchQuery.trim() || (selectedLocation && selectedLocation !== "No Location");

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
        'Corporate',
        'Brand',
        'Agency',
        'Media',
        'Technology',
        'Entertainment',
        'Food & Beverage',
        'Fashion',
        'Sports',
        'Education'
    ];

    const allFormats = [
        'Full Sponsorship',
        'Co-Sponsorship',
        'Media Sponsorship',
        'In-Kind Sponsorship',
        'Title Sponsorship',
        'Event Series',
        'Venue Sponsorship',
        'Product Placement',
        'Digital Sponsorship',
        'Technical Sponsorship'
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
                        Explore Our Sponsors
                    </h1>

                    {/* Search Bar */}
                    <div className="w-full max-w-4xl relative">
                        <div className="flex flex-col sm:flex-row bg-[#1C1D24]/80 backdrop-blur-sm rounded-lg overflow-hidden">
                            <div className="flex-1 flex items-center min-w-0">
                                <IoSearchOutline className="ml-4 w-5 h-5 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search Sponsors, Categories, Location..."
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
                                    <option value="No Location" className="text-black">No Location</option>
                                    <option value="Mumbai" className="text-black">Mumbai</option>
                                    <option value="Hyderabad" className="text-black">Hyderabad</option>
                                    <option value="Bangalore" className="text-black">Bangalore</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        {shouldShowResults && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1D24]/95 backdrop-blur-sm rounded-lg border border-gray-700/50 max-h-80 overflow-y-auto z-30">
                                {filteredSponsors.length > 0 ? (
                                    <div className="p-4">
                                        <div className="text-sm text-gray-400 mb-3">
                                            Found {filteredSponsors.length} sponsor{filteredSponsors.length !== 1 ? "s" : ""}
                                            {searchQuery.trim() && selectedLocation && selectedLocation !== "No Location" && (
                                                <span> for "{searchQuery}" in {selectedLocation}</span>
                                            )}
                                            {searchQuery.trim() && (!selectedLocation || selectedLocation === "No Location") && (
                                                <span> for "{searchQuery}"</span>
                                            )}
                                            {!searchQuery.trim() && selectedLocation && selectedLocation !== "No Location" && (
                                                <span> in {selectedLocation}</span>
                                            )}
                                        </div>
                                        {filteredSponsors.slice(0, 5).map((sponsor) => (
                                            <div
                                                key={sponsor._id}
                                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                                                onClick={() => {
                                                    window.location.href = `/sponsor/${sponsor._id}`;
                                                }}
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={sponsor.image || "/Images/sponsor-logo.png"}
                                                        alt={sponsor.businessName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white font-medium truncate">
                                                        {sponsor.businessName}
                                                    </div>
                                                    <div className="text-sm text-gray-400 flex items-center space-x-2">
                                                        <span>{sponsor.category}</span>
                                                        <span>•</span>
                                                        <span>{getLocationDisplay(sponsor.location)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {filteredSponsors.length > 5 && (
                                            <div className="text-center pt-2 border-t border-gray-700/50">
                                                <span className="text-sm text-gray-400">
                                                    And {filteredSponsors.length - 5} more sponsors...
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center">
                                        <div className="text-gray-400">
                                            No sponsors found
                                            {searchQuery.trim() && selectedLocation && selectedLocation !== "No Location" && (
                                                <span> for "{searchQuery}" in {selectedLocation}</span>
                                            )}
                                            {searchQuery.trim() && (!selectedLocation || selectedLocation === "No Location") && (
                                                <span> for "{searchQuery}"</span>
                                            )}
                                            {!searchQuery.trim() && selectedLocation && selectedLocation !== "No Location" && (
                                                <span> in {selectedLocation}</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Try different keywords or categories
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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
                                <option value="eventsSponsored" className="bg-[#1C1D24]">Events</option>
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
                            <h2 className="text-2xl font-semibold text-white">All Sponsors</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">Sort by:</span>
                                <select
                                    className="bg-[#1C1D24]/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#C5FF32]"
                                    value={selectedSort}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                >
                                    <option value="rating" className="bg-[#1C1D24]">Rating</option>
                                    <option value="eventsSponsored" className="bg-[#1C1D24]">Events</option>
                                    <option value="followers" className="bg-[#1C1D24]">Followers</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Header */}
                        <div className="lg:hidden mb-6">
                            <h2 className="text-xl font-semibold text-white">All Sponsors</h2>
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
                                {sponsors.length === 0 ? (
                                    <div className="text-center text-gray-400 py-8">
                                        No sponsors found matching your criteria
                                    </div>
                                ) : (
                                    sponsors.map((sponsor) => (
                                        <SponsorCard
                                            key={sponsor._id}
                                            sponsor={sponsor}
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

// SponsorCard component
const SponsorCard = ({ sponsor, onSocialClick }) => {
    return (
        <div className="bg-[#1C1D24]/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-[#1C1D24]/70 transition-colors">
            <div className="flex flex-col sm:flex-row items-stretch h-auto sm:h-60">
                {/* Sponsor Logo/Image */}
                <div className="w-full sm:w-60 h-48 sm:h-full flex-shrink-0">
                    <img
                        src={"/Images/sponsor-logo.png"}
                        // src={sponsor.image || "/Images/sponsor-logo.png"}
                        alt={sponsor.businessName}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 pl-4 sm:pl-6 flex flex-col justify-around">
                    <div>
                        {/* Sponsor Name and Description */}
                        <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2">{sponsor.businessName}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sponsor.description}</p>

                        {/* Stats Row */}
                        <div className="flex justify-between sm:justify-start sm:space-x-12 mb-2">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{sponsor.eventsSponsoredCount}</span>
                                    <img src="/icons/location-icon.svg" alt="Events" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                                </div>
                                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Events Sponsored</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{sponsor.followersCount}</span>
                                    <img src="/icons/Event-icon.svg" alt="Followers" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                                </div>
                                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{sponsor.rating}</span>
                                    <img src="/icons/Star.svg" alt="Rating" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                                </div>
                                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Rating</span>
                            </div>
                        </div>

                        {/* Products Preview
                        {sponsor.products && sponsor.products.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-white text-sm font-medium mb-2">Products</h4>
                                <div className="flex gap-2">
                                    {sponsor.products.slice(0, 2).map((product) => (
                                        <div key={product._id} className="bg-[#2A2B32] px-3 py-1 rounded-full">
                                            <span className="text-gray-300 text-xs">{product.name}</span>
                                        </div>
                                    ))}
                                    {sponsor.products.length > 2 && (
                                        <div className="bg-[#2A2B32] px-3 py-1 rounded-full">
                                            <span className="text-gray-300 text-xs">+{sponsor.products.length - 2} more</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )} */}
                    </div>

                    {/* Contact Info and Button Row */}
                    <div className="flex items-center justify-between">
                        <div className="text-gray-400 text-sm">
                            Contact: {sponsor.contactName}
                        </div>
                        <div>
                            <a
                                href={`/sponsor/${sponsor._id}`}
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

export default AllSponsors;
