import React, { useContext, useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import NewsSlider from "../components/NewsSlider";
import CategorySlider from "../components/CategorySlider";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle } from "react-icons/io5";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import Featured from "@/components/Featured";
import { TiTick, TiWorld } from "react-icons/ti";
import { BsBellFill, BsClock } from "react-icons/bs";
import Featured2 from "@/components/Featured2";
import { Helmet } from "react-helmet";
import PopupModal from "@/components/PopupModal";
import { Swiper, SwiperSlide } from "swiper/react";
import ScrollAnimation from "../components/ScrollAnimation";
import { variants, scaleUpVariants } from "../animations/variants";
import { FaHeart, FaStar } from "react-icons/fa";
import {
  IoStarOutline,
} from "react-icons/io5";
import CreateEventBanner from '@/components/CreateEventBanner';
import { VenueOwnerCard } from '../components/VenueOwnerCard';
import RegisterVenueBanner from '../components/RegisterVenueBanner';
import BecomeCuratorBanner from '@/components/BecomeCuratorBanner';
import RaiseFundBanner from '../components/RaiseFundBanner';
import GuestCard from '../components/GuestCard';
import TestimonialCard from '../components/TestimonialCard';

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import parse from "html-react-parser";
import Hero from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
import { CuratorCard } from "@/components/CuratorCard";
import { BlogCard } from "@/components/BlogCard";
import { SponserCard } from "@/components/SponserCard";
import { UserCard } from "@/components/UsersCard";
import ExploreCategories from "@/components/ExploreCategories";
import PopularEvents from "@/components/PopularEvents";

const box = [
  {
    icon: "/ship.png",
    text: "FREE SHIPPING",
    describe: "Order Above 1500",
  },
  { icon: "/free.png", text: "FREE ASSEMBLY", describe: "On all orders" },
  { icon: "/bell.png", text: "WARRANTY", describe: "one year Warranty" },
  {
    icon: "/secure.png",
    text: "SECUREE PAYMENTS",
    describe: "Safe, Fast & Secure",
  },
];
// const categories = [
//   { icon: "/main/hm1.svg", text: "Living Room", param: "livingroom" },
//   { icon: "/main/hm2.svg", text: "Bed Room", param: "bedroom" },
//   { icon: "/main/hm3.svg", text: "Dinnining Room", param: "dinningroom" },
//   { icon: "/main/hm4.svg", text: "Office", param: "office" },
//   { icon: "/main/hm5.svg", text: "hospitality", param: "hospitality" },
//   { icon: "/main/hm6.svg", text: "Outdoor", param: "outdoor" },
// ];
const testimonials = [
  {
    name: "Jesica Okonkwo - CEO",
    location: "California",
    image: "/Images/testimonial.png",
    text: "This platform allow me to know trending events in my area and also follow up on the activities around them. I never get to miss any hot events since I know about Kazi-Culture"
  },
  {
    name: "Michael Chen - Event Planner",
    location: "New York",
    image: "/Images/testimonial.png",
    text: "As an event planner, Kazi-Culture has revolutionized how I discover and manage events. The platform's intuitive interface and comprehensive features make it a game-changer."
  },
  {
    name: "Sarah Johnson - Artist",
    location: "London",
    image: "/Images/testimonial.png",
    text: "Finding the right venues and connecting with the right audience was always a challenge until I found Kazi-Culture. Now I can focus more on my art and less on logistics."
  },
  {
    name: "David Rodriguez - Venue Owner",
    location: "Miami",
    image: "/Images/testimonial.png",
    text: "Since listing my venue on Kazi-Culture, I've seen a significant increase in bookings. The platform makes it easy to showcase my space and connect with event organizers."
  },
  {
    name: "Emma Wilson - Music Producer",
    location: "Nashville",
    image: "/Images/testimonial.png",
    text: "The community on Kazi-Culture is incredible. I've found amazing collaboration opportunities and my events always get great engagement through the platform."
  },
  {
    name: "Alex Thompson - Tech Entrepreneur",
    location: "San Francisco",
    image: "/Images/testimonial.png",
    text: "What sets Kazi-Culture apart is its focus on quality and user experience. It's become my go-to platform for both hosting and discovering unique events."
  },
  {
    name: "Lisa Zhang - Cultural Director",
    location: "Toronto",
    image: "/Images/testimonial.png",
    text: "Kazi-Culture has helped us reach diverse audiences and promote cultural events more effectively. The platform truly understands the needs of event organizers."
  },
  {
    name: "Marcus Brown - DJ",
    location: "Berlin",
    image: "/Images/testimonial.png",
    text: "The exposure I've gotten through Kazi-Culture is phenomenal. The platform connects me with the right venues and helps me build my brand in the industry."
  },
  {
    name: "Sophia Patel - Festival Organizer",
    location: "Mumbai",
    image: "/Images/testimonial.png",
    text: "Managing large-scale events becomes much easier with Kazi-Culture. The tools and support they provide are invaluable for event organizers."
  }
];


const feature = [
  {
    icon: <TiWorld className=" text-[19px] " />,
    text: "FREE SHIPPING",
    describe: "Order Above AED 1500",
  },
  {
    icon: <TiTick className=" text-[19px] " />,
    text: "FREE ASSEMBLY",
    describe: "On all orders",
  },
  {
    icon: <BsBellFill className=" text-[20px] " />,
    text: "WARRANTY",
    describe: "one year Warranty",
  },
  {
    icon: <BsClock className=" text-[19px] " />,
    text: "SECURE PAYMENTS",
    describe: "Safe, Fast & Secure",
  },
];
const news = [
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "Lorem ipsum dolor sit amet, consectetur adipi elit, sed.",
  },
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "do eiusmod tempor incididu ut labore et dolore magna",
  },
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "do eiusmod tempor incididu ut labore et dolore magna.",
  },
];

const Home = () => {
  const { currency, wishlist, setWishlist } = useContext(AppContext);

  const [filteredCategory, setFilteredCategory] = useState("New Arrivals");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([
    {
      title: "Tech Conference 2025", // Event Title
      description: "An annual gathering of tech enthusiasts, developers, and innovators to discuss the future of technology.",
      discounts: true,
      discountValue: 20, // Discount for early bird
      price: 4999, // Ticket price
      currency: "USD",
      available: 500, // Total tickets available
      pieces: 500, // Remaining tickets
      promotional: "Early Bird Offer",
      editorContent:
        "<p>Join the most awaited technology conference of the year and get exclusive insights into the world of innovation.</p>", // Event promotional content
      width: 0, // Not applicable for events
      height: 0, // Not applicable for events
      weight: 0, // Not applicable for events
      status: "available",
      sku: "EVENT12345", // Unique event code
      mainImage:
        "https://example.com/images/tech-conference-2025.jpg", // Banner image of the event
      additionalImages: [
        "https://example.com/images/venue.jpg",
        "https://example.com/images/speakers.jpg",
      ],
      mainCategory: ["Events"],
      subCategory: ["Technology", "Innovation"],
      series: ["Annual Tech Conferences"],
      tags: ["Tech", "Conference", "2025", "Innovation"],
      vendorId: "63fdd34a98123b4c12345678", // Example vendor ID (organizer)
      approved: true,
      createdAt: new Date(),
      attributes: [
        {
          type: "VIP Access", // Event ticket type
          value: "Includes access to all sessions and VIP seating.",
          price: "7999", // Price for VIP access
          attributeImage: "https://example.com/images/vip-pass.jpg",
        },
        {
          type: "Standard Access",
          value: "Includes access to all sessions.",
          price: "4999",
          attributeImage: "https://example.com/images/standard-pass.jpg",
        },
      ],
      featured: true,
      isStock: true,
      threeDiaLinkHor: "",
      threeDiaLinkVer: "",
      arFilePath: "",
      metaTitle: "Tech Conference 2025 - Leading Innovation in Technology",
      metaDescription:
        "Join Tech Conference 2025 to explore innovations, network with experts, and experience the future of technology.",
      metaTags: "tech, conference, innovation, 2025, technology",
    },
  ]);

  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [catalogueImage, setCatalogueImage] = useState(null);
  const [catalogueLinks, setCatalogueLinks] = useState(["", "", ""]);
  const [slider, setSlider] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const { wishlistedProducts, handleAddToWishlist, handleRemoveWishlist } =
    useContext(MainAppContext);

  const [activeVenueFilter, setActiveVenueFilter] = useState('All');
  const [venueOwners] = useState([
    // Mock data - replace with your actual data
    { id: 1, name: "Kazi Culture E.", rating: 4.6 },
    { id: 2, name: "Venue Owner 2", rating: 4.8 },
    { id: 3, name: "Venue Owner 3", rating: 4.2 }
  ]);

  const [activeCuratorFilter, setActiveCuratorFilter] = useState('All');
  const [showAllCurators, setShowAllCurators] = useState(false);

  const [activeFundingFilter, setActiveFundingFilter] = useState('All');
  const [showAllCrowdfunding, setShowAllCrowdfunding] = useState(false);

  const [activeGuestFilter, setActiveGuestFilter] = useState('All');
  const [showAllGuests, setShowAllGuests] = useState(false);

  const [activeFilter, setActiveFilter] = useState('All');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  // Auto-scroll effect
  useEffect(() => {
    if (isHovered) return; // Don't auto-scroll while user is interacting

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev < Math.ceil(testimonials.length / 3) - 1 ? prev + 1 : 0
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isHovered, testimonials.length]);

  const getFilteredVenueOwners = () => {
    switch (activeVenueFilter) {
      case 'Top Rated':
        return [...venueOwners].sort((a, b) => b.rating - a.rating);
      case 'Most used':
        // Add your sorting logic for most used
        return venueOwners;
      case 'Cheapest':
        // Add your sorting logic for cheapest
        return venueOwners;
      default:
        return venueOwners;
    }
  };

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      // console.log(response.data);
      setFilteredProducts(response.data);
      const chunkedArray = [];
      for (let i = 0; i < response?.data?.length; i += 10) {
        chunkedArray.push(response?.data?.slice(i, i + 10));
      }
      console.log(chunkedArray);
      // setNewProducts(chunkedArray[0]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
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

  const getAllBlogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/blogs`
      );
      console.log(response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCatalogue = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`
      );
      console.log(response.data.catalogue);
      setCatalogueImage(response.data.catalogue.image);
      setCatalogueLinks(response.data.catalogue.links);
    } catch (error) {
      console.error("Error fetching catalogue:", error);
    }
  };

  const getSlider = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/slider`
      );
      console.log(response.data);
      setSlider(response.data);
    } catch (error) {
      console.error("Error fetching catalogue:", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/testimonial`
      );
      console.log(response.data);
      if (response.data) {
        setTestimonialsData(response.data);
      } else {
        console.error("API response does not contain a valid testimonial data");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const truncateContent = (htmlContent, wordLimit) => {
    const textContent = htmlContent.replace(/<[^>]+>/g, "");
    const words = textContent.split(/\s+/);
    if (words.length <= wordLimit) {
      return htmlContent;
    }
    const truncatedText = words.slice(0, wordLimit).join(" ") + "...";
    return parse(truncatedText);
  };
  const Stars = ({ stars }) => {
    const ratingStars = Array.from({ length: 5 }, (elem, index) => {
      return (
        <div key={index}>
          {stars >= index + 1 ? (
            <FaStar className=" text-[#8B33FE]" />
          ) : (
            <IoStarOutline className="  text-{#8B33FE} " />
          )}
        </div>
      );
    });
    return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getAllProducts();
    getAllBanners();
    getAllCategories();
    getAllBlogs();
    getCatalogue();
    getSlider();
    fetchTestimonials();
    // setWishlistedProducts(wishlist);
  }, []);

  const getFilteredCurators = () => {
    // Mock data - replace with your actual curator data
    const curators = [
      { id: 1, name: "DJ Kazi", rating: 4.6, price: 100, bookings: 50 },
      { id: 2, name: "DJ Kazi", rating: 4.8, price: 80, bookings: 65 },
      { id: 3, name: "DJ Kazi", rating: 4.2, price: 120, bookings: 45 },
      { id: 4, name: "DJ Kazi", rating: 4.9, price: 90, bookings: 70 },
      { id: 5, name: "DJ Kazi", rating: 4.5, price: 70, bookings: 55 },
      { id: 6, name: "DJ Kazi", rating: 4.7, price: 110, bookings: 60 }
    ];

    let filtered = [...curators];

    switch (activeCuratorFilter) {
      case 'Top Rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Most book':
        filtered.sort((a, b) => b.bookings - a.bookings);
        break;
      case 'Cheapest':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        // 'All' case - no sorting needed
        break;
    }

    // Return all items if showAllCurators is true, otherwise return first 3
    return showAllCurators ? filtered : filtered.slice(0, 3);
  };

  const guests = [
    {
      id: 1,
      name: "Wellings Ali",
      image: "/Images/guestcard.png",
      attended: 235,
      counterRaised: 2235,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      image: "/Images/guestcard.png",
      attended: 189,
      counterRaised: 1875,
    },
    {
      id: 3,
      name: "Michael Chen",
      image: "/Images/guestcard.png",
      attended: 312,
      counterRaised: 3450,
    },
    {
      id: 4,
      name: "Emma Davis",
      image: "/Images/guestcard.png",
      attended: 156,
      counterRaised: 1590,
    },
    // Add more guests as needed
  ];

  const filteredGuests = guests.filter(guest => {
    // Add your filtering logic here based on activeFilter
    return activeFilter === 'All' || guest.attended > 200; // Example filter
  });

  const handleContribute = (id) => {
    navigate(`/crowdfunding/${id}`);
  };

  return (
    <section className="bg-[#0E0F13] min-h-screen text-white font-sen">
      {/* Header + Hero + Categories Background Wrapper */}
      <div className="relative">
        {/* Gradient Background - Modified to start below header */}
        <div
          className="absolute inset-0 z-0 w-full"
          style={{
            height: '200vh',
            background: `
              radial-gradient(
                circle at 50% 0%, 
                rgba(248, 41, 186, 0.4) 0%,
                rgba(8, 28, 209, 0.35) 25%,
                rgba(73, 222, 255, 0.3) 50%,
                rgba(89, 249, 172, 0) 75%
              )
            `,
            filter: 'blur(100px)',
            transform: 'translateY(0)', // Changed from -30% to 0
            top: '64px', // Added to start below header height
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Rest of the content with relative positioning */}
      <div className="relative z-10">
        <HeroSlider slider={slider} />
        <ExploreCategories />
        <PopularEvents events={filteredProducts} />
        <CreateEventBanner />

        {/* Popular Venue Owners Section */}
        <div className="w-full max-w-7xl mx-auto px-4 py-16 mb-24 relative overflow-hidden">
          {/* Fixed Background Gradient */}
          <div
            className="absolute inset-0 z-0"
            style={{
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src="/Images/bg-gradient-venue.svg"
              alt=""
              className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-auto opacity-40"
              style={{
                maxWidth: '1323px',
                transform: 'translateY(-50%) translateX(30%)', // Adjust the X translation to position from right
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-semibold">
                Popular <span className="text-[#C5FF32]">Venue Owners</span>
              </h2>

              {/* Filter Tabs */}
              <div className="flex gap-4">
                {['All', 'Top Rated', 'Most used', 'Cheapest'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveVenueFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${activeVenueFilter === filter
                        ? 'bg-[#C5FF32] text-black'
                        : 'text-white hover:bg-[#1A1A1A]'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredVenueOwners().map((owner) => (
                  <VenueOwnerCard key={owner.id} event={owner} />
                ))}
              </div>

              {/* See More Button */}
              <button className="w-full py-4 text-[#00FFB2] border border-[#1A1A1A] rounded-xl hover:bg-[#1A1A1A]/50 transition-colors mt-8">
                See More
              </button>
            </div>
          </div>
        </div>

        {/* Register Venue Banner with added top margin */}
        <div className="mt-16">
          <RegisterVenueBanner />
        </div>

        {/* curators section */}
        <div className="w-full max-w-7xl mx-auto px-4 py-16 relative overflow-hidden">
          {/* Background Gradient */}
          <div
            className="absolute inset-0 z-0"
            style={{
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src="/Images/bg-grad-curator.svg"
              alt=""
              className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-auto opacity-40"
              style={{
                maxWidth: '1323px',
                transform: 'translateY(-50%) translateX(-30%)', // Adjusted position for left side
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-semibold">
                Popular <span className="text-[#C5FF32]">Curators</span>
              </h2>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-4">
                {['All', 'Top Rated', 'Most book', 'Cheapest'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveCuratorFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${activeCuratorFilter === filter
                        ? 'bg-[#C5FF32] text-black'
                        : 'text-white hover:bg-[#1A1A1A]'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {getFilteredCurators().map((curator) => (
                  <div key={curator.id} className="w-full">
                    <CuratorCard event={curator} />
                  </div>
                ))}
              </div>

              {/* See More Button */}
              <button
                onClick={() => setShowAllCurators(!showAllCurators)}
                className="w-full py-4 text-[#00FFB2] border border-[#1A1A1A] rounded-xl hover:bg-[#1A1A1A]/50 transition-colors mt-8"
              >
                {showAllCurators ? 'Show Less' : 'See More'}
              </button>
            </div>
          </div>
        </div>

        {/* Become a Curator Banner */}
        <div className="mt-16">
          <BecomeCuratorBanner />
        </div>

        {/* Crowdfunding Section */}
        <div className="w-full max-w-7xl mx-auto px-4 py-16 relative overflow-hidden">
          {/* Background Gradient */}
          <div
            className="absolute inset-0 z-0"
            style={{
              pointerEvents: 'none',
              width: '100vw',  // Changed to viewport width
              height: '150%',  // Increased height to ensure full coverage
              left: '50%',     // Center horizontally
              transform: 'translateX(-50%)',  // Center align
              top: '-25%',     // Start from above to ensure full coverage
            }}
          >
            <img
              src="/Images/bg-grad-crowd.svg"
              alt=""
              className="absolute w-full h-full opacity-40"
              style={{
                objectFit: 'cover',  // Ensure the image covers the area
                objectPosition: 'center',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col gap-8">
              <h2 className="text-2xl font-semibold">
                Crowd <span className="text-[#C5FF32]">Funding</span>
              </h2>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-4">
                {['All', 'Recent', 'Most funded'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFundingFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${activeFundingFilter === filter
                        ? 'bg-[#C5FF32] text-black'
                        : 'text-white hover:bg-[#1A1A1A]'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].slice(0, showAllCrowdfunding ? undefined : 3).map((_, index) => (
                  <div key={index}>
                    <EventCard isCrowdfunding={true} />
                  </div>
                ))}
              </div>

              {/* See More Button */}
              <button
                onClick={() => setShowAllCrowdfunding(!showAllCrowdfunding)}
                className="w-full py-4 text-[#00FFB2] border border-[#1A1A1A] rounded-xl hover:bg-[#1A1A1A]/50 transition-colors mt-8"
              >
                {showAllCrowdfunding ? 'Show Less' : 'See More'}
              </button>
            </div>
          </div>
        </div>

        {/* Raise Fund Banner */}
        <div className="mt-16">
          <RaiseFundBanner />
        </div>

        {/* Popular Fans/Guests Section */}
        <div className="w-full max-w-7xl mx-auto px-4 py-16 relative overflow-hidden">
          {/* Section Header */}
          <div className="flex flex-col gap-8 mb-12">
            <h2 className="text-[32px] font-semibold text-white font-sen">
              Popular <span className="text-[#C5FF32]">Fans/Guests</span>
            </h2>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-4">
              {['All', 'Most Active', 'Top Contributors'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${activeFilter === filter
                      ? 'bg-[#C5FF32] text-black'
                      : 'text-white hover:bg-[#1A1A1A]'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuests.slice(0, showAllGuests ? filteredGuests.length : 3).map((guest) => (
              <GuestCard key={guest.id} guest={guest} />
            ))}
          </div>

          {/* See More Button */}
          <button
            onClick={() => setShowAllGuests(!showAllGuests)}
            className="w-full py-4 text-[#00FFB2] border border-[#1A1A1A] rounded-xl hover:bg-[#1A1A1A]/50 transition-colors mt-8"
          >
            {showAllGuests ? 'Show Less' : 'See More'}
          </button>
        </div>

        {/* Blogs Section with Background Gradient */}
        <div className="relative">
          {/* Blog Background Gradient */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/Images/bg-grad-blog.svg"
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

          {/* Blogs Content */}
          <div className="w-full max-w-7xl mx-auto px-4 py-16 relative">
            {/* Section Header */}
            <div className="flex flex-col gap-8 mb-12">
              <h2 className="text-[32px] font-semibold text-white font-sen">
                Featured <span className="text-[#C5FF32]">Blogs</span>
              </h2>
            </div>

            {/* Blogs Horizontal Scroll */}
            <div className="relative">
              {/* Blogs Container */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="w-[400px]">
                      <BlogCard
                        event={{
                          title: "BestSeller Book Bootcamp",
                          date: "Saturday, March 18, 9:30PM",
                          author: "Admin",
                          image: "/Images/blogcard.jpg"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* See More Button */}
              <Link
                to="/blogs"
                className="w-full py-4 text-[#00FFB2] border border-[#1A1A1A] rounded-xl hover:bg-[#1A1A1A]/50 transition-colors mt-8 block text-center"
              >
                See More
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials Section with Background Gradient */}
        <div className="relative">
          {/* Testimonial Background Gradient */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/Images/bg-grad-test.svg"
              alt="background gradient"
              className="absolute right-0 w-[940.82px] h-[940.82px] object-cover"
              style={{
                top: '50%',
                transform: 'translateY(-50%) rotate(82.53deg)',
                mixBlendMode: 'normal',
                opacity: 0.6,
              }}
            />
          </div>

          {/* Testimonials Content */}
          <div className="w-full max-w-7xl mx-auto px-4 py-16 relative overflow-hidden">
            {/* Section Title */}
            <div className="text-center mb-16">
              <p className="text-[#C5FF32] text-sm uppercase mb-4">TESTIMONIALS</p>
              <h2 className="text-4xl font-semibold text-white mb-4 font-sen">
                What people says about us
              </h2>
              <p className="text-gray-400 text-sm">
                This is what our users have to say about their experience using Kazi-Culture
              </p>
            </div>

            {/* Testimonials Slider */}
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Testimonials Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {/* Split testimonials into groups of 3 */}
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }, (_, i) => (
                    <div key={i} className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                      {testimonials.slice(i * 3, (i + 1) * 3).map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : 0))}
                className={`absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] transition-colors ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentSlide === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentSlide(prev => (prev < Math.ceil(testimonials.length / 3) - 1 ? prev + 1 : prev))}
                className={`absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] transition-colors ${currentSlide === Math.ceil(testimonials.length / 3) - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentSlide === Math.ceil(testimonials.length / 3) - 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(Math.ceil(testimonials.length / 3))].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-colors
                                  ${currentSlide === index ? 'bg-[#C5FF32]' : 'bg-gray-600'}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
