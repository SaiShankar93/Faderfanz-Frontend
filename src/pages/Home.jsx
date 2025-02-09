import React, { useContext, useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import NewsSlider from "../components/NewsSlider";
import CategorySlider from "../components/CategorySlider";
import { Link } from "react-router-dom";
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
    quote:
      "As a curator, working with this platform has been seamless. Managing events, tracking RSVPs, and engaging with attendees has never been this easy. It's a game-changer!",
    name: "Sophia Carter",
    title: "Event Curator",
  },
  {
    quote:
      "I attended the TechFest 2024 organized through this platform, and it was an unforgettable experience. The app kept me updated on sessions and activities, and the ticketing system was super convenient.",
    name: "Michael Brown",
    title: "Event Attendee",
  },
  {
    quote:
      "Partnering with this platform for our sponsorship was a great decision. The detailed analytics and visibility we received during the event helped us reach our target audience effectively.",
    name: "Emily Wilson",
    title: "Marketing Manager at BrandSphere",
  },
  {
    quote:
      "We hosted our annual conference at one of the venues listed on this platform. The booking process was straightforward, and the support team ensured everything ran smoothly on the event day.",
    name: "Liam Johnson",
    title: "Venue Manager",
  },
  {
    quote:
      "Organizing my art exhibition was made easy with this platform. It helped me manage ticket sales, attendee lists, and promotions effortlessly. Highly recommended!",
    name: "Amelia Thompson",
    title: "Art Exhibition Curator",
  },
  {
    quote:
      "The platform made it incredibly easy to find and book events. I loved how the reviews and ratings helped me choose the best ones to attend.",
    name: "Chris Evans",
    title: "Regular Event Attendee",
  },
  {
    quote:
      "As a sponsor, the platform allowed us to target the right audience and showcase our brand in the best possible way. The ROI exceeded our expectations.",
    name: "Olivia Martinez",
    title: "Sponsorship Coordinator at AdDynamics",
  },
  {
    quote:
      "Managing multiple venues can be overwhelming, but this platform simplified everything for us. From booking inquiries to real-time updates, it has streamlined our operations.",
    name: "James Lee",
    title: "Venue Owner",
  },
  {
    quote:
      "I joined a workshop through this platform, and it was an excellent experience. The reminders and updates kept me informed, and the session was very engaging.",
    name: "Ava Taylor",
    title: "Workshop Participant",
  },
  {
    quote:
      "This platform connected me with talented curators and enthusiastic attendees for our charity event. It made the entire process smooth and enjoyable.",
    name: "Ethan Wright",
    title: "Event Organizer",
  },
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

  return (
    <section className="w-full bg-[#0E0F13] text-white relative overflow-hidden">
      {/* Header + Hero + Categories Background Wrapper */}
      <div className="relative">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 z-0 w-full"
          style={{
            height: '200vh', // Make it tall enough to cover all three sections
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
            transform: 'translateY(-30%)', // Adjust this value to position the gradient
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

        {/*
        <ScrollAnimation variants={scaleUpVariants}>
          <div className="flex flex-col items-center pt-24 w-full sm:max-w-[1280px] mx-auto gap-10 relative z-100 bg-[#0f0f0f]">
            <h2 className="text-center text-3xl font-semibold xl:w-[500px] quicksand">
              <span className="text-[#808080]"></span> Reviews
            </h2>
            <p className="text-sm text-[#808080] text-center xl:w-[900px] w-[90vw]">
              Don't just take our word for it; hear what our satisfied clients have to say about their experience with KaziCulture. We take pride in building lasting relationships and delivering exceptional Events.
            </p>
            <div className="w-full h-[500px] no-scrollbar overflow-x-hidden">
              <div className="flex gap-4 w-full animate-scroll"
                style={{
                  animation: "scroll 15s linear infinite", // Smooth scrolling animation
                  animationPlayState: "running", // Default to running
                }}
                onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")} // Pause scrolling on hover
                onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")} // Resume scrolling on leave
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="h-full w-[350px]">
                    <div className="flex flex-col gap-6 sm:w-[350px] w-[300px] h-[400px] items-center border border-[#262626] rounded-2xl p-5 py-8 bg-gradient-to-b from-[#1a1a1a] to-transparent via-[#1a1a1a59]">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoo4nBuzAbDEozya5g9w5RfNVDx7XwmUdSug&s"
                        alt=""
                        className="w-[100px] h-[100px] rounded-full object-cover"
                      />
                      <div className="flex flex-col justify-center">
                        <a className="font-normal sm:text-base text-sm underline" href="/profile">
                          {testimonial.name}
                        </a>
                        <span className="text-[#808080] text-xs sm:text-sm">
                          {testimonial.title}
                        </span>
                      </div>
                      <p className="md:text-sm text-[12px] text-center">
                        {testimonial.quote}
                      </p>
                      <Stars stars={4} />
                    </div>
                    <div className="ml-5">
                      <svg
                        width="33"
                        height="16"
                        viewBox="0 0 33 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.3395 13.55C18.9421 16.3969 14.5579 16.3969 12.1605 13.55L0.75 0L32.75 2.74432e-06L21.3395 13.55Z"
                          fill="#262626"
                        />
                      </svg>
                    </div>
                    <div className="mt-6 ml-2 flex items-center gap-2">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoo4nBuzAbDEozya5g9w5RfNVDx7XwmUdSug&s"
                        alt=""
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                      <div className="flex flex-col justify-center">
                        <span className="text-[#808080] text-xs sm:text-sm">
                          Review By:
                        </span>
                        <a className="font-normal sm:text-base text-sm underline" href="/profile">
                          Sai Shankar
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimation>
        */}

        {/* <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 px-[2%] mb-10">
          {categories
            ?.filter((i) => {
              return i?.selected === true;
            })
            .slice(0, 6)
            ?.map((item, index) => {
              return (
                <Link to={`/shop/${item?.fileName}/all`} key={index}>
                  <div className=" pl-2 md:pl-2 pb-2 md:pb-2">
                    <div className=" relative shade_image">
                      <p
                        style={{ writingMode: "vertical-rl" }}
                        className="text-[#353535] absolute -left-0 md:-left-0 top-4 rotate-180 plus-jakarta font-[600] text-[10px] md:text-2xl capitalize flex items-center justify-center"
                      >
                        {item?.fileName}
                      </p>
                      <img
                        className=" object-cover object-center h-[116px] lg:h-[302px] "
                        src={item?.imageLink}
                        alt={item.param}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div> */}

        {/* <div className="w-full h-[1px] bg-gray-600 my-16"></div> */}



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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
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

        {/* Top Sponsers */}

        <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
          <div className=" flex flex-col items-center col-span-4">
            <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
              Our Top Sponsers
            </p>
            <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400 ">
              Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
              eiusmo tempor incididunt ut labore
            </p>
          </div>
        </div>
        <div className="absolute right-0 mx-8 inline-flex group">
          <div
            className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"
          />
          <a
            href="/events/all/all"
            title="View all Events"
            className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
            role="button"
          >
            View All Sponsers &rarr;
          </a>
        </div>
        {loading ? (
          <div className=" w-full flex items-center justify-center py-3">
            <img
              src="/Images/loader.svg"
              alt="loading..."
              className=" object-contain w-[60px] h-[60px]"
            />
          </div>
        ) : (
          <>
            <div className="w-full col-span-4 py-16">
              <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                <div className="flex space-x-6 lg:grid lg:grid-cols-3 lg:gap-16 lg:space-x-0 px-8 lg:px-16">
                  {[...newProducts, ...newProducts, ...newProducts].map((event, index) => (
                    <div key={index} className="min-w-[280px] w-[280px] lg:w-full lg:min-w-0">
                      <SponserCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </>
        )}



        <div className="w-full h-[1px] bg-gray-600 my-16"></div>

        {/* Event Section

        <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
          <div className=" flex flex-col items-center col-span-4">
            <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
              Featured CroudFunding Events
            </p>
            <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400 ">
              Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
              eiusmo tempor incididunt ut labore
            </p>
          </div>
        </div>
        <div className="absolute right-0 mx-8 inline-flex group">
          <div
            className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"
          />
          <a
            href="/events/all/all"
            title="View all Events"
            className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
            role="button"
          >
            View All Events &rarr;
          </a>
        </div>


        {loading ? (
          <div className=" w-full flex items-center justify-center py-3">
            <img
              src="/Images/loader.svg"
              alt="loading..."
              className=" object-contain w-[60px] h-[60px]"
            />
          </div>
        ) : (
          <>
            <div className="w-full col-span-4 py-16">
              <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                <div className="flex space-x-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-x-0 px-8">
                  {[...newProducts, ...newProducts, ...newProducts].map((event, index) => (
                    <div key={index} className="min-w-[280px] w-[280px] lg:w-full lg:min-w-0 p-[1px]">
                      <EventCard
                        event={event}
                        key={event._id}
                        isCrowdfunding={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="w-full h-[1px] bg-gray-600 my-16"></div> */}


        {/* Top Guests */}

        <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
          <div className=" flex flex-col items-center col-span-4">
            <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
              Top Guests/Fans
            </p>
            <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400 ">
              Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
              eiusmo tempor incididunt ut labore
            </p>
          </div>
        </div>
        <div className="absolute right-0 mx-8 inline-flex group">
          <div
            className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"
          />
          <a
            href="/events/all/all"
            title="View all Events"
            className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
            role="button"
          >
            View All Fans &rarr;
          </a>
        </div>


        {loading ? (
          <div className=" w-full flex items-center justify-center py-3">
            <img
              src="/Images/loader.svg"
              alt="loading..."
              className=" object-contain w-[60px] h-[60px]"
            />
          </div>
        ) : (
          <>
            <div className="w-full col-span-4 py-16">
              <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                <div className="flex space-x-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-x-0 px-8">
                  {[...newProducts, ...newProducts, ...newProducts].map((event, index) => (
                    <div key={index} className="min-w-[280px] w-[280px] lg:w-full lg:min-w-0 p-[1px]">
                      <UserCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="w-full h-[1px] bg-gray-600 my-16"></div>

        {/* Blogs Section */}
        <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
          <div className=" flex flex-col items-center col-span-4">
            <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
              Featured Blogs
            </p>
            <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400 ">
              Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
              eiusmo tempor incididunt ut labore
            </p>
          </div>
        </div>
        <div className="absolute right-0 mx-8 inline-flex group">
          <div
            className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"
          />
          <a
            href="/blogs/all"
            title="View all Events"
            className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
            role="button"
          >
            View All Blogs &rarr;
          </a>
        </div>

        {loading ? (
          <div className=" w-full flex items-center justify-center py-3">
            <img
              src="/Images/loader.svg"
              alt="loading..."
              className=" object-contain w-[60px] h-[60px]"
            />
          </div>
        ) : (
          <>
            <div className="w-full col-span-4 py-16">
              <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                <div className="flex space-x-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-x-0 px-8">
                  {[...newProducts, ...newProducts, ...newProducts].map((event, index) => (
                    <div key={index} className="min-w-[280px] w-[280px] lg:w-full lg:min-w-0 p-[1px]">
                      <BlogCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-2 ">
          <div className=" flex flex-col items-center py-10 col-span-4">
            <p className=" text-[24px] plus-jakarta md:text-[28px] 2xl:text-[35px] font-[700] text-[#212121] dark:text-gray-400 ">
              The Process
            </p>
            <p className=" text-[#474747] text-center text-[13px] md:text-[14px] 2xl:text-[15px] md:w-[40%] mb-4 dark:text-gray-400 ">
              Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
              eiusmo tempor incididunt ut labore
            </p>
            <div className=" grid grid-cols-1 gap-5 md:grid-cols-3">
              {Process.map((item, index) => {
                return (
                  <div
                    key={index}
                    className=" text-gray-700 relative flex flex-col items-center  gap-3 p-2 px-3"
                  >
                    <p className="  text-[30px] plus-jakarta md:text-[59px] font-bold plus-jakarta text-[#212121] dark:text-gray-400  capitalize ">
                      {item.number}
                    </p>
                    <p className="  font-semibold plus-jakarta  text-[15.6px] md:h-[60px] text-center md:text-[17.5px] text-[#212121] dark:text-gray-400 capitalize ">
                      {item.text}
                    </p>
                    <p className="  text-[12.4px] md:text-[13.4px] font-medium text-[#474747] dark:text-gray-400 text-center capitalize ">
                      {item.describe}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div> */}

        {/* <div className="dark:text-gray-400 bg-gray-100 flex flex-col items-center">
          <p className=" text-[24px] plus-jakarta py-10 md:text-[28px] 2xl:text-[35px] font-[700] text-[#212121] dark:text-gray-400 ">
            Testimonial
          </p>
          <div className="flex space-x-16 px-[4%] xl:px-[8%] py-4 mt-2 relative">
            {testimonialsData?.description && (
              <div className="flex flex-col w-50">
                <p className="text-[#363F4D] font-bold plus-jakarta text-[20px] md:text-[30px] 2xl:text-[32px] mb-4">
                  {testimonialsData.title}
                </p>
                {truncateContent(testimonialsData?.description, 50)}
              </div>
            )}
            <div className="flex relative xl:col-span-1 w-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{ clickable: true }}
                  navigation={true}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="testimonial-slider"
                >
                  {testimonialsData?.testimonials?.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div className="text-white text-center p-4 bg-gray-800 bg-opacity-50 rounded-md">
                        <p>{item}</p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {testimonialsData.imagePath && (
                <img
                  src={testimonialsData.imagePath}
                  alt="Testimonial Image"
                  className="rounded-md w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div> */}

        {/* <div className=" relative text-white overflow-x-hidden w-full h-[300px] md:h-[530px] flex flex-col items-center justify-center ">
          <img
            className=" w-full h-full object-cover"
            src={`${catalogueImage}`}
            // src="/main/mainBanner2.svg"
            alt="slide-Image"
          />

          <div className=" absolute flex flex-col items-center justify-center gap-20 bg-black/50 w-full h-full top-0 left-0">
            <p className=" playball text-[15px] md:text-[17px] 2xl-text-[30px] scale-[1.5] 2xl:scale-[3] uppercase text-left ">
              Discover Our
            </p>
            <p className=" uppercase poppins text-[20px] md:text-[40px] font-semibold plus-jakarta 2xl-text-[500px] scale-[2] 2xl:scale-[3.5] ">
              CATALOGUE
            </p>
            <div className=" w-full flex items-center justify-around ">
              <Link target="_blank"
                className="font-semibold plus-jakarta underline w-fit px-4 py-2 uppercase text-[11px] md:text-xl"
                onClick={() => (window.location.href = catalogueLinks[0], '_blank')}
              >
                View Catalogue 1
              </Link>
              <a
                href={catalogueLinks[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold plus-jakarta underline w-fit px-4 py-2 uppercase text-[11px] md:text-xl"
              >
                View Catalogue 1
              </a>
              <a
                href={catalogueLinks[1]}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold plus-jakarta underline w-fit px-4 py-2 uppercase text-[11px] md:text-xl"
              >
                View Catalogue 2
              </a>
              <a
                href={catalogueLinks[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold plus-jakarta underline w-fit px-4 py-2 uppercase text-[11px] md:text-xl"
              >
                View Catalogue 3
              </a>
              <Link target="_blank"
                className="font-semibold plus-jakarta underline w-fit px-4 py-2 uppercase text-[11px] md:text-xl"
                onClick={() => (window.location.href = catalogueLinks[2], '_blank')}
              >
                View Catalogue 3
              </Link>
            </div>
          </div>
        </div> */}
        {/* <div className="dark:text-gray-400 flex flex-col items-center col-span-4 mt-10">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] font-playfair plus-jakarta font-[700] text-[#212121] dark:text-gray-400">
            Latest News
          </p>
          <p className="font-playfair dark:text-gray-400 text-[#474747] w-[90%] md:w-[50%] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 ">
            Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo
            tempor incididunt ut labore eiusmo tempor incididunt ut labore
          </p>
        </div> */}
        {/* <NewsSlider blogs={blogs} /> */}
        {/* <div className="w-full flex px-[8%] mx-auto relative">
          {banners.find((banner) => banner.fileName === "Banner1") && (
            <div className="relative w-full flex justify-center items-center shade_image">
              <img
                className="h-full object-contain"
                src={
                  banners.find((banner) => banner.fileName === "Banner1")
                    ?.filePath
                    ? banners.find((banner) => banner.fileName === "Banner1")
                      .filePath
                    : "/main/discount_banner.jpg"
                }
                alt="slide-Image"
              />
              <div className="absolute bottom-30 left-0 right-0 p-4 flex justify-between items-end w-full">
                <div className="p-2 rounded">
                  <h2 className="text-xl md:text-2xl font-bold text-black">
                    {
                      banners.find((banner) => banner.fileName === "Banner1")
                        .title
                    }
                  </h2>
                  <p className="text-sm md:text-base text-black pb-3">
                    {
                      banners.find((banner) => banner.fileName === "Banner1")
                        .description
                    }
                  </p>
                  <a
                    href={
                      banners
                        .find((banner) => banner.fileName === "Banner1")
                        .redirectUrl.startsWith("http")
                        ? banners.find((banner) => banner.fileName === "Banner1")
                          .redirectUrl
                        : `${banners.find(
                          (banner) => banner.fileName === "Banner1"
                        ).redirectUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 text-white px-4 py-2 rounded shadow-md hover:bg-orange-700 transition duration-300"
                  >
                    {
                      banners.find((banner) => banner.fileName === "Banner1")
                        .buttonContent
                    }
                  </a>
                </div>
              </div>
            </div>
          )}
        </div> */}

        {/* <div className="w-full bg-[#F6F6F6] flex items-center flex-wrap justify-center px-[4%] mt-10 pb-[20px] pt-[45px]">
          {feature.map((item, index) => {
            return (
              <div
                key={index}
                className=" text-gray-700 relative flex items-center  w-[300px] gap-3 border border-gray-500 p-2 px-3"
              >
                <div className=" border border-gray-700 rounded-full p-1.5">
                  {item.icon}
                </div>
                <div className=" flex flex-col">
                  <p className="  font-semibold text-xs md:text-[13px]  capitalize ">
                    {item.text}
                  </p>
                  <p className="  text-[12.5px]  capitalize ">{item.describe}</p>
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
    </section>
  );
};

export default Home;
