import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { MdStar } from "react-icons/md";
import MultiRangeSlider from "multi-range-slider-react";
import { AiOutlineBars } from "react-icons/ai";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle, IoStarOutline, IoSearchOutline } from "react-icons/io5";
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

// Sample crowdfunding data
const sampleCrowdfunding = [
  {
    _id: 1,
    title: "Street Training Initiative",
    description: "We are raising money for the people in the street to have a good training opportunity.",
    target: 35000,
    raised: 16900,
    deadline: "23rd March, 2025",
    createdBy: "Raihan Khan",
    creatorImage: "/Images/testimonial.png",
    mainImage: "/Images/Crowdcard.png",
    category: "Education",
    donors: 14,
  },
  {
    _id: 2,
    title: "Community Art Center",
    description: "Building a space for local artists to showcase their work and conduct workshops.",
    target: 50000,
    raised: 25000,
    deadline: "15th April, 2025",
    createdBy: "Sarah Johnson",
    creatorImage: "/Images/testimonial.png",
    mainImage: "/Images/Crowdcard.png",
    category: "Arts",
    donors: 22,
  },
  {
    _id: 3,
    title: "Youth Sports Program",
    description: "Supporting underprivileged youth through sports and physical education.",
    target: 25000,
    raised: 12000,
    deadline: "30th March, 2025",
    createdBy: "Mike Thompson",
    creatorImage: "/Images/testimonial.png",
    mainImage: "/Images/Crowdcard.png",
    category: "Sports",
    donors: 18,
  },
];

const sortMethods = [
  {
    id: 1,
    name: "Sort By Popularity",
    parameter: "donors",
  },
  {
    id: 2,
    name: "Amount Raised (Low to High)",
    parameter: "raised",
  },
  {
    id: 3,
    name: "Amount Raised (High to Low)",
    parameter: "raised",
  },
  {
    id: 4,
    name: "A to Z",
    parameter: "title",
  },
  {
    id: 5,
    name: "Z to A",
    parameter: "title",
  },
];

const AllCrowdfunding = () => {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("No Location");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { category, subcategory } = useParams();

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
        return [...Products].sort((a, b) => a.raised - b.raised);
      case "3":
        return [...Products].sort((a, b) => b.raised - a.raised);
      case "4":
        return [...Products].sort((a, b) => a.title.localeCompare(b.title));
      case "5":
        return [...Products].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return [...Products].sort((a, b) => b.donors - a.donors);
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

  const getCrowdfunding = async () => {
    try {
      setLoading(true);
      const {data} = await axiosInstance.get(`management/campaigns`);
      if (data) {
        setEvents(data);
      } else throw new Error("Fetching Crowdfunding campaigns failed");
    } catch (error) {
      console.error("Error fetching crowdfunding campaigns:", error);
      toast.error("Failed to fetch crowdfunding campaigns");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    getCrowdfunding();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...events];

    // Search filter with pattern matching
    if (searchQuery.trim()) {
      result = result.filter(
        (campaign) =>
          campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (campaign.event && campaign.event.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filters
    if (filters.category.length > 0) {
      result = result.filter((campaign) =>
        filters.category.includes(campaign.category?.toLowerCase())
      );
    }

    // Apply format filters
    if (filters.format.length > 0) {
      result = result.filter((campaign) =>
        filters.format.includes(campaign.format?.toLowerCase())
      );
    }

    // Apply price filters
    if (filters.price.length > 0) {
      result = result.filter((campaign) => {
        const campaignAmount = campaign.amountRaised === 0 ? "free" : "paid";
        return filters.price.includes(campaignAmount);
      });
    }

    // Apply date filters
    if (filters.date.length > 0) {
      result = result.filter((campaign) => {
        const deadline = new Date(campaign.endDate);
        const today = new Date();
        const isToday = deadline.toDateString() === today.toDateString();
        const isTomorrow = deadline.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString();
        const isThisWeek = deadline <= new Date(today.setDate(today.getDate() + 7));
        const isWeekend = deadline.getDay() === 0 || deadline.getDay() === 6;

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
        return dateMatch;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortMethod) {
        case "2":
          return a.amountRaised - b.amountRaised;
        case "3":
          return b.amountRaised - a.amountRaised;
        case "4":
          return a.title.localeCompare(b.title);
        case "5":
          return b.title.localeCompare(a.title);
        default:
          return (b.donors?.length || 0) - (a.donors?.length || 0);
      }
    });

    setFilteredEvents(result);
  }, [events, searchQuery, filters, sortMethod]);

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
        <HeroSlider 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          selectedLocation={selectedLocation} 
          setSelectedLocation={setSelectedLocation} 
          events={{ data: events }}
          isCrowdfunding={true}
        />
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
              <h2 className="text-2xl font-semibold text-white">All Crowdfunding</h2>
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

            {/* Crowdfunding Cards */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5FF32]"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  {searchQuery.trim() ? (
                    <div>
                      <div className="text-lg mb-2">No crowdfunding campaigns found</div>
                      <div className="text-sm">Try different keywords or adjust your filters</div>
                    </div>
                  ) : (
                    <div>No crowdfunding campaigns available</div>
                  )}
                </div>
              ) : (
                filteredEvents.map((campaign) => (
                  <Link
                    to={`/crowdfunding/${campaign._id}`}
                    key={campaign._id}
                    className="bg-[#1C1D24]/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-[#1C1D24]/70 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4">
                      {/* Image container */}
                      <div className="w-full sm:w-[200px] h-[200px] sm:h-[140px] flex-shrink-0">
                        <img
                          src={import.meta.env.VITE_SERVER_URL + campaign?.banner?.url || "/Images/Crowdcard.png"}
                          alt={campaign.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Progress container */}
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <div className="bg-[#262626]/50 backdrop-blur-sm rounded-xl px-4 py-3 inline-block">
                          <div className="text-gray-400 text-sm font-medium mb-1">
                            Progress
                          </div>
                          <div className="text-white text-lg font-semibold">
                            {Math.round((campaign.amountRaised / campaign.goal) * 100)}%
                          </div>
                        </div>
                      </div>

                      {/* Content container */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="relative">
                          <h3 className="text-white text-xl font-semibold mb-3 pr-12">
                            {campaign.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">
                            {campaign.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="text-sm">
                                ${campaign.amountRaised.toLocaleString()} raised of ${campaign.goal.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="text-sm">
                                {campaign.donors?.length || 0} donors
                              </span>
                            </div>
                            {campaign.event && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <span className="text-sm">
                                  Event: {campaign.event.title}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-400">
                              <span className="text-sm">
                                Deadline: {new Date(campaign.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                              <span className="text-sm">
                                Status: <span className={`${campaign.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                  {campaign.status}
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* Star button */}
                          <button className="absolute right-0 top-0 bg-[#C5FF32] p-2.5 rounded-full hover:bg-[#d4ff66] transition-colors group">
                            <FaStar className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
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

export default AllCrowdfunding;

