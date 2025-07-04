import React, { useState, useEffect } from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { IoSearchOutline, IoLocationOutline } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axiosInstance from "@/configs/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
const AllVenueOwners = () => {
  // Helper function to handle image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/Images/post.png";
    
    // Check if it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /
    if (imagePath.startsWith('/')) {
      return `${import.meta.env.VITE_SERVER_URL || ''}${imagePath}`;
    }
    
    // If it's a relative path without /
    return `${import.meta.env.VITE_SERVER_URL || ''}/${imagePath}`;
  };

  const navigate = useNavigate();

  // UI States
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: false,
    category: false,
    amenities: false,
  });

  // Data States
  const [filteredVenueOwners, setFilteredVenueOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [venueOwners, setVenueOwners] = useState([]);
  
  // Fetch venue owners from API
  const getVenueOwners = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/management/venue-owners`);
      if (response.data) {
        setVenueOwners(response.data);
        setFilteredVenueOwners(response.data);
        console.log("Venue Owners fetched successfully:", response.data);
      } else throw new Error("Fetching Venue Owners failed");
    } catch (error) {
      console.error("Error fetching venue owners:", error);
      toast.error("Failed to fetch venue owners");
      // Set empty array to avoid undefined errors
      setVenueOwners([]);
      setFilteredVenueOwners([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getVenueOwners();
  }, []);

  // Filter States
  const [selectedSort, setSelectedSort] = useState("rating");
  const [filters, setFilters] = useState({
    price: [],
    category: [],
    amenities: [],
  });

  // Initialize data on component mount
  useEffect(() => {
    // Fetch venue owners data when component mounts
    getVenueOwners();
  }, []);

  // Filter and Search Logic
  useEffect(() => {
    if (!venueOwners || !Array.isArray(venueOwners) || venueOwners.length === 0) {
      setFilteredVenueOwners([]);
      return;
    }
    
    let result = [...venueOwners];

    // Search filter - search by venue name, address
    if (searchQuery) {
      result = result.filter(
        (venue) =>
          (venue.venueName && venue.venueName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (venue.address && venue.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Location filter - search by address
    if (selectedLocation) {
      result = result.filter(
        (venue) => venue.address && venue.address.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (selectedSort) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "followers":
          return (b.totalFollowers || b.followersCount || 0) - (a.totalFollowers || a.followersCount || 0);
        case "menuItems":
          return ((b.menuProducts && b.menuProducts.length) || 0) - ((a.menuProducts && a.menuProducts.length) || 0);
        default:
          return 0;
      }
    });

    setFilteredVenueOwners(result);
  }, [venueOwners, searchQuery, selectedLocation, selectedSort]);

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
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[type].includes(value)) {
        updatedFilters[type] = updatedFilters[type].filter(
          (item) => item !== value
        );
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
    window.open(url, "_blank");
  };

  // Toggle expanded sections
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Filter categories
  const allCategories = [
    "Wedding Venue",
    "Conference Hall",
    "Party Hall",
    "Restaurant",
    "Hotel",
    "Banquet Hall",
    "Outdoor Venue",
    "Sports Venue",
    "Exhibition Space",
    "Theater",
  ];

  const allAmenities = [
    "Parking",
    "Catering",
    "WiFi",
    "Audio/Video Equipment",
    "Air Conditioning",
    "Bar",
    "Kitchen",
    "Dance Floor",
    "Stage",
    "Security",
  ];

  // Render filter sections
  const renderFilterSection = (title, items, type, showMore = true) => (
    <div className="mb-6">
      <h3 className="text-white text-base mb-4">{title}</h3>
      <div className="space-y-3">
        {items
          .slice(0, expandedSections[type] ? items.length : 5)
          .map((item) => (
            <label
              key={item}
              className="flex items-center group cursor-pointer"
            >
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
              <span className="text-gray-400 group-hover:text-white transition-colors">
                {item}
              </span>
            </label>
          ))}
      </div>
      {showMore && items.length > 5 && (
        <button
          onClick={() => toggleSection(type)}
          className="text-[#00FFB3] text-sm mt-3 hover:text-[#00FFB3]/80"
        >
          {expandedSections[type] ? "Less" : "More"}
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
            top: "50%",
            transform: "translateY(-50%)",
            mixBlendMode: "normal",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-6 md:mb-12">
            Explore Our Venues
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
                  placeholder="Search Venues, Categories..."
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
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Chennai">Chennai</option>
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
            bulletActiveClass: "swiper-pagination-bullet-active bg-[#00FFB2]",
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
              <span className="text-gray-400 text-sm">Sort:</span>                <select
                  className="bg-[#1C1D24]/50 backdrop-blur-sm text-white px-2 py-2 rounded-lg border border-gray-700 text-sm"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="rating" className="bg-[#1C1D24]">
                    Rating
                  </option>
                  <option value="followers" className="bg-[#1C1D24]">
                    Followers
                  </option>
                  <option value="menuItems" className="bg-[#1C1D24]">
                    Menu Items
                  </option>
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
                    {["Free", "Paid"].map((price) => (
                      <label
                        key={price}
                        className="flex items-center group cursor-pointer"
                      >
                        <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
                          <input
                            type="checkbox"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            checked={filters.price.includes(
                              price.toLowerCase()
                            )}
                            onChange={() =>
                              handleFilterChange("price", price.toLowerCase())
                            }
                          />
                          <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
                          {filters.price.includes(price.toLowerCase()) && (
                            <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
                          )}
                        </div>
                        <span className="text-gray-400 group-hover:text-white transition-colors">
                          {price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                {renderFilterSection("Category", allCategories, "category")}

                {/* Amenities Filter */}
                {renderFilterSection("Amenities", allAmenities, "amenities")}

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
                {["Free", "Paid"].map((price) => (
                  <label
                    key={price}
                    className="flex items-center group cursor-pointer"
                  >
                    <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
                      <input
                        type="checkbox"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        checked={filters.price.includes(price.toLowerCase())}
                        onChange={() =>
                          handleFilterChange("price", price.toLowerCase())
                        }
                      />
                      <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
                      {filters.price.includes(price.toLowerCase()) && (
                        <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
                      )}
                    </div>
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      {price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {renderFilterSection("Category", allCategories, "category")}

            {/* Amenities Filter */}
            {renderFilterSection("Amenities", allAmenities, "amenities")}
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white">
                All Venues
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">Sort by:</span>
                <select
                  className="bg-[#1C1D24]/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#C5FF32]"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="rating" className="bg-[#1C1D24]">
                    Rating
                  </option>
                  <option value="followers" className="bg-[#1C1D24]">
                    Followers
                  </option>
                  <option value="menuItems" className="bg-[#1C1D24]">
                    Menu Items
                  </option>
                </select>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <h2 className="text-xl font-semibold text-white">All Venues</h2>
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
                {filteredVenueOwners.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No venues found matching your criteria
                  </div>
                ) : (
                  filteredVenueOwners.map((venue) => (
                    <VenueCard
                      key={venue._id}
                      venue={venue}
                      onSocialClick={handleSocialClick}
                      getImageUrl={getImageUrl}
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

// VenueCard component
const VenueCard = ({ venue, onSocialClick, getImageUrl }) => {
  const navigate = useNavigate();

  // Default image if venueImage is empty
  const venueImage = venue.venueImage && venue.venueImage.length > 0 
    ? getImageUrl(venue.venueImage[0]) 
    : "/Images/post.png";
    
  // Format stats for display
  const stats = {
    rating: venue.rating || 0,
    totalRatings: venue.totalRatings || 0,
    followers: venue.totalFollowers || venue.followersCount || 0
  };

  // Handle venue click - navigate with state
  const handleViewVenue = () => {
    // Store the venue data in sessionStorage
    sessionStorage.setItem('selectedVenue', JSON.stringify(venue));
    // Navigate to the venue page
    navigate(`/event-venue/${venue._id}`);
  };

  return (
    <div className="bg-[#1C1D24]/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-[#1C1D24]/70 transition-colors">
      <div className="flex flex-col sm:flex-row items-stretch h-auto sm:h-60">
        {/* Venue Image */}
        <div className="w-full sm:w-60 h-48 sm:h-full flex-shrink-0">
          <img
            src={venueImage}
            alt={venue.venueName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Venue Name */}
            <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2">
              {venue.venueName}
            </h3>
            
            {/* Venue Address */}
            <p className="text-gray-400 text-sm mb-4">
              {venue.address}
            </p>

            {/* Stats Row */}
            <div className="flex justify-between sm:justify-start sm:space-x-12 mb-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">
                    {stats.followers}
                  </span>
                  <img
                    src="/icons/followers.svg"
                    alt="Followers"
                    className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]"
                  />
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">
                    {venue.menuProducts ? venue.menuProducts.length : 0}
                  </span>
                  <img
                    src="/icons/Event-icon.svg"
                    alt="Menu Items"
                    className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]"
                  />
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">
                  Menu Items
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">
                    {stats.rating}
                  </span>
                  <img
                    src="/icons/Star.svg"
                    alt="Rating"
                    className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]"
                  />
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">
                  Rating ({stats.totalRatings})
                </span>
              </div>
            </div>
          </div>

          {/* Social Links and Button Row */}
          <div className="flex items-center space-x-3">
            {venue.website && (
              <a
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent flex items-center justify-center text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors"
              >
                <FaFacebook size={16} className="sm:text-lg" />
              </a>
            )}
            <div className="ml-auto">
              <button
                onClick={handleViewVenue}
                className="px-3 py-1.5 sm:px-5 sm:py-2 bg-[#C5FF32] text-black rounded-md text-center text-xs sm:text-sm font-medium hover:bg-[#b3ff00] transition-colors"
              >
                View Venue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllVenueOwners;
