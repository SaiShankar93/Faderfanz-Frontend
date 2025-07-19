import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { MdStar } from "react-icons/md";
import MultiRangeSlider from "multi-range-slider-react";
import { AiOutlineBars } from "react-icons/ai";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle, IoStarOutline } from "react-icons/io5";
import { array, number } from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import { FaStar } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { EventCard } from "@/components/EventCard";
import HeroSlider from "../components/HeroSlider";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import axiosInstance from "@/configs/axiosConfig";

const sortMethods = [
  {
    id: 1,
    name: "Sort By Popularity",
    parameter: "rating",
  },
  {
    id: 2,
    name: "Price(Low to High)",
    parameter: "price",
  },
  {
    id: 3,
    name: "Price(High to Low)",
    parameter: "price",
  },
  {
    id: 4,
    name: "A to Z",
    parameter: "name",
  },
  {
    id: 5,
    name: "Z to A",
    parameter: "name",
  },
];

// Sample event data
const sampleEvents = [
  {
    _id: 1,
    title: "The Kazi-culture show",
    location: "12 Lake Avenue, Mumbai, India",
    time: "8:30 AM - 7:30 PM",
    mainImage: "/heroslider.jpeg",
    date: "NOV 25 - 26",
    interested: 14,
  },
  {
    _id: 2,
    title: "Mumbai Music Festival",
    location: "Marine Drive, Mumbai, India",
    time: "4:00 PM - 11:00 PM",
    mainImage: "/heroslider.jpeg",
    date: "NOV 27 - 28",
    interested: 22,
  },
  {
    _id: 3,
    title: "Art & Culture Exhibition",
    location: "Gallery Modern, Mumbai, India",
    time: "10:00 AM - 6:00 PM",
    mainImage: "/heroslider.jpeg",
    date: "NOV 30",
    interested: 18,
  },
];

const Shop = () => {
  const {
    filterCategories,
    setFilterCategories,
    filterSubCategories,
    setFilterSubCategories,
    filterColor,
    setFilterColor,
    filters,
    handleFilterChange,
    expandedSections,
    toggleSection,
  } = useContext(AppContext);

  const {
    wishlistedProducts,
    setWishlistedProducts,
    handleAddToWishlist,
    setCartCount,
    minValue,
    set_minValue,
    maxValue,
    set_maxValue,
    maxPrice,
    setMaxPrice,
    Products,
    handleRemoveWishlist,
    buyNow,
    setBuyNow,
    setProductPageId,
  } = useContext(MainAppContext);
  const [page, setPage] = useState(0);
  const [isCard, setIsCard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState(1);
  const [banners, setBanners] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  // const [Products, setProducts] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [events, setEvents] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { category, subcategory } = useParams();
  const [interestedEvents, setInterestedEvents] = useState(new Set());
  const [interestLoading, setInterestLoading] = useState({});
  const [userData, setUserData] = useState(null);

  const { SetIsMobileFilterOpen, currency, wishlist } = useContext(AppContext);
  const handleInput = (e) => {
    set_minValue(Number(e.minValue));
    set_maxValue(Number(e.maxValue));
  };
  const [categories, setCategories] = useState([]);
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      // console.log(response.data.categories);
      setCategories(response.data?.categories);
      // // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getAllCategories();
    getAllBanners();
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    setSortedArray(Products);
    const maxPrice = Products.reduce((max, product) => {
      return product.price > max ? product.price : max;
    }, 0);
    setMaxPrice(Number(maxPrice));
    set_maxValue(Number(maxPrice));

    console.log(category, subcategory);
    setFilterCategories(category ? category.toLowerCase() : "all");
    setFilterSubCategories(subcategory ? subcategory.toLowerCase() : "all");
    setWishlistedProducts(wishlist);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [category, subcategory, Products]);

  useEffect(() => {
    setFilterCategories(category ? category.toLowerCase() : "all");
    setFilterSubCategories(subcategory ? subcategory.toLowerCase() : "all");
  }, [category, subcategory]);

  const sortProducts = (method) => {
    switch (method) {
      case "2":
        return [...Products].sort((a, b) => a.price - b.price);
      case "3":
        return [...Products].sort((a, b) => b.price - a.price);
      case "4":
        return [...Products].sort((a, b) => a.title.localeCompare(b.title));
      case "5":
        return [...Products].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return [...Products].sort(
          (a, b) => Number(b.avgRating) - Number(a.avgRating)
        );
    }
  };

  useEffect(() => {
    setSortedArray(sortProducts(sortMethod));
  }, [Products, sortMethod]);

  const Stars = ({ stars }) => {
    const ratingStars = Array.from({ length: 5 }, (elem, index) => {
      return (
        <div key={index}>
          {stars >= index + 1 ? (
            <FaStar className=" dark:text-yellow-400 text-black" />
          ) : (
            <IoStarOutline className=" text-black dark:text-yellow-400 " />
          )}
        </div>
      );
    });
    return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
  };

  const getAllBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/banner`
      );
      setBanners(response.data?.banners);
      // // // // console.log(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const getEvents = async () => {
    try {
      const {data} = await axiosInstance.get(`/events?needApproved=true`);
      if (data.data) {
        console.log(data.data,'data.data')
        setEvents(data.data);
      } else throw new Error("Fetching Events failed");
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    }
  };
  useEffect(() => {
    getEvents();
  }, []);

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
        
        // Update the event's interested count in events list
        setEvents(prev => prev.map(eventItem => {
          if (eventItem._id === eventId || eventItem.id === eventId) {
            // If the API returns the updated interested array, use it
            if (response.data.interested && Array.isArray(response.data.interested)) {
              return { ...eventItem, interested: response.data.interested };
            }
            // Otherwise, manually update the array
            const currentInterested = eventItem.interested || [];
            const updatedInterested = isInterested 
              ? [...currentInterested, { user: userData._id, userModel: userData.role }]
              : currentInterested.filter(interest => interest.user !== userData._id);
            return { ...eventItem, interested: updatedInterested };
          }
          return eventItem;
        }));
        
        toast.success(isInterested ? 'Marked as interested!' : 'Removed from interested!');
      }
    } catch (error) {
      console.error('Error toggling event interest:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle interest status');
    } finally {
      setInterestLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    console.log(events, "events");
    return sampleEvents.filter((event) => {
      // Price filter
      if (filters.price.length > 0) {
        const eventPrice = event.price === 0 ? "free" : "paid";
        if (!filters.price.includes(eventPrice)) return false;
      }

      // Date filter
      if (filters.date.length > 0) {
        const today = new Date();
        const eventDate = new Date(event.date);
        const isToday = eventDate.toDateString() === today.toDateString();
        const isTomorrow =
          eventDate.toDateString() ===
          new Date(today.setDate(today.getDate() + 1)).toDateString();
        const isThisWeek =
          eventDate <= new Date(today.setDate(today.getDate() + 7));
        const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;

        const dateMatch = filters.date.some((filter) => {
          switch (filter) {
            case "today":
              return isToday;
            case "tomorrow":
              return isTomorrow;
            case "this week":
              return isThisWeek;
            case "this weekend":
              return isWeekend;
            default:
              return true;
          }
        });
        if (!dateMatch) return false;
      }

      // Category filter
      if (filters.category.length > 0) {
        if (!filters.category.includes(event.category?.toLowerCase()))
          return false;
      }

      // Format filter
      if (filters.format.length > 0) {
        if (!filters.format.includes(event.format?.toLowerCase())) return false;
      }

      return true;
    });
  }, [filters, sampleEvents]);

  // Add these expanded arrays for the "More" functionality
  const allCategories = [
    "Adventure Travel",
    "Art Exhibitions",
    "Auctions & Fundraisers",
    "Beer Festivals",
    "Benefit Concerts",
    "Cultural Festivals",
    "Dance Events",
    "Food & Wine",
    "Gaming Events",
    "Music Festivals",
  ];

  const allFormats = [
    "Community Engagement",
    "Concerts & Performances",
    "Conferences",
    "Experiential Events",
    "Festivals & Fairs",
    "Workshops",
    "Seminars",
    "Virtual Events",
    "Hybrid Events",
    "Networking Events",
  ];

  // Update the filter sections to use the expanded state
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
    <div className="bg-[#0E0F13] font-sen">
      <div className="relative w-full">
        <HeroSlider events={{data:events}} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Hidden on mobile, shown as sidebar on desktop */}
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

            {/* Date Filter */}
            {renderFilterSection(
              "Date",
              ["Today", "Tomorrow", "This Week", "This Weekend", "Pick a Date"],
              "date"
            )}

            {/* Category Filter */}
            {renderFilterSection("Category", allCategories, "category")}

            {/* Format Filter */}
            {renderFilterSection("Format", allFormats, "format")}
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white">All Events</h2>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 hidden sm:inline">Sort by:</span>
                <select
                  className="bg-[#1C1D24]/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#C5FF32]"
                  value={sortMethod}
                  onChange={(e) => setSortMethod(e.target.value)}
                >
                  {sortMethods.map((method) => (
                    <option
                      key={method.id}
                      value={method.id}
                      className="bg-[#1C1D24]"
                    >
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Cards */}
            <div className="space-y-4">
              {events.length > 0 &&
                events.map((event) => (
                  <Link
                    to={`/event/${event.id}`}
                    key={event._id}
                    className="bg-[#1C1D24]/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-[#1C1D24]/70 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4">
                      {/* Image container */}
                      <div className="w-full sm:w-[200px] h-[200px] sm:h-[140px] flex-shrink-0">
                        <img
                          src={event.banner?.url ? `${import.meta.env.VITE_SERVER_URL}${event.banner?.url}` : "/heroslider.jpeg"}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Date container */}
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <div className="bg-[#262626]/50 backdrop-blur-sm rounded-xl px-4 py-3 inline-block">
                          <div className="text-gray-400 text-sm font-medium mb-1">
                            {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                          </div>
                          <div className="text-white text-lg font-semibold">
                            {new Date(event.startDate).getDate()}
                          </div>
                        </div>
                      </div>

                      {/* Content container */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="relative">
                          <h3 className="text-white text-xl font-semibold mb-3 pr-12">
                            {event.title}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                              <IoLocationOutline className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm truncate">
                                {event.location.address || "Location TBA"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <IoTimeOutline className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">
                                {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                              <FaStar className="w-3 h-3 text-[#C5FF32]" />
                              <span className="text-sm">
                                {Array.isArray(event?.interested) ? event.interested.length : (event?.interested || 0)} interested
                              </span>
                            </div>
                          </div>

                          {/* Star button */}
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEventInterestToggle(event._id || event.id, event);
                            }}
                            disabled={interestLoading[event._id || event.id]}
                            className={`absolute right-0 top-0 p-2.5 rounded-full transition-colors group ${
                              isUserInterestedInEvent(event) 
                                ? 'bg-[#C5FF32] hover:bg-[#d4ff66]' 
                                : 'bg-[#1C1D24]/50 hover:bg-[#1C1D24]/70'
                            } ${interestLoading[event._id || event.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <FaStar className={`w-4 h-4 transition-colors ${
                              isUserInterestedInEvent(event) 
                                ? 'text-black' 
                                : 'text-[#C5FF32]'
                            } group-hover:scale-110 transition-transform`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Load more button */}
            <button
              onClick={() => setItemsPerPage((prev) => prev + 8)}
              className="w-full mt-8 py-4 bg-[#1C1D24]/50 backdrop-blur-sm text-gray-400 rounded-xl hover:bg-[#1C1D24]/70 transition-colors"
            >
              See More
            </button>
          </div>
        </div>

        {/* Mobile filters button */}
        <button
          onClick={() => SetIsMobileFilterOpen(true)}
          className="fixed bottom-4 left-4 lg:hidden bg-[#C5FF32] p-4 rounded-full shadow-lg hover:bg-[#d4ff66] transition-colors"
        >
          <AiOutlineBars className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Shop;
