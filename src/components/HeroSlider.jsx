import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoSearchOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function HeroSlider({
  slider,
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  events,
  isCrowdfunding=false,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  // Filter search results based on search query and location
  useEffect(() => {
    
    if (!events?.data) {
      setSearchResults([]);
      return;
    }

    let filtered = events.data;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) => {
        return (
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (getLocationDisplay(item.location).toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }

    // Filter by selected location
    if (selectedLocation && selectedLocation !== "No Location") {
      filtered = filtered.filter((item) => {
        const itemLocation = getLocationDisplay(item.location).toLowerCase();
        return itemLocation.includes(selectedLocation.toLowerCase());
      });
    }

    setSearchResults(filtered);
  }, [searchQuery, selectedLocation, events]);

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

  // Check if we should show search results
  const shouldShowResults = searchQuery.trim() || (selectedLocation && selectedLocation !== "No Location");

  console.log("searchQuery", searchQuery, selectedLocation);
  return (
    <div className="relative w-full h-[600px]">
      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white text-center mb-12">
          {isCrowdfunding ? "Explore tons of campaigns" : "Explore tons of amazing events"}
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-4xl relative">
          <div className="flex bg-[#1C1D24]/80 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="flex-1 flex items-center min-w-0">
              <IoSearchOutline className="ml-4 w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={isCrowdfunding ? "Search Crowdfunding Campaigns, Categories, Location..." : "Search Events, Categories, Location..."}
                className="w-full px-3 py-3 bg-transparent text-white focus:outline-none placeholder-gray-400 min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center border-l border-gray-700/50 shrink-0">
              <IoLocationOutline className="ml-4 w-5 h-5 text-gray-400" />
              <select
                className="w-32 sm:w-40 px-3 py-3 bg-transparent text-gray-600 focus:outline-none appearance-none cursor-pointer"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="No Location">No Location</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>
          </div>

          {/* Search Results Block */}
          {shouldShowResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1D24]/95 backdrop-blur-sm rounded-lg border border-gray-700/50 max-h-80 overflow-y-auto z-30">
              {searchResults.length > 0 ? (
                <div className="p-4">
                  <div className="text-sm text-gray-400 mb-3">
                    Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
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
                  {searchResults.map((result) => (
                    <div
                      onClick={() => {
                        if (isCrowdfunding) {
                          navigate(`/crowdfunding/${result._id}`);
                        } else {
                          navigate(`/event/${result.id}`);
                        }
                      }}
                      key={result.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`${import.meta.env.VITE_SERVER_URL}${result.banner?.url}`}
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center space-x-2">
                          <span>{result.category}</span>
                          <span>•</span>
                          <span>{getLocationDisplay(result.location)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <div className="text-gray-400">
                    No results found
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
        {slider?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                className="w-full h-full object-cover"
                src={"/heroslider.jpeg"}
                alt={slide.name}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
