import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  SlSocialFacebook,
  SlSocialInstagram,
  SlSocialTwitter,
} from "react-icons/sl";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  IoClose,
  IoCloseCircle,
  IoHeartCircle,
  IoStarOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { FaHeart, FaStar, FaShare } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import LoadSirv from "../LoadSirv";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import AttributeSlider from "@/components/AttributeSlider";
import { Tooltip } from "@material-tailwind/react";
import { Swiper, SwiperSlide } from "swiper/react";
import PopularEvents from "@/components/PopularEvents";
import { Dialog, Transition } from "@headlessui/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Start } from "@mui/icons-material";
import axiosInstance from "@/configs/axiosConfig";
const countryCurrencyList = [
  { code: "IN", name: "India", currency: { code: "INR", symbol: "₹" } },
  { code: "US", name: "United States", currency: { code: "USD", symbol: "$" } },
  { code: "GB", name: "United Kingdom", currency: { code: "GBP", symbol: "£" } },
  { code: "JP", name: "Japan", currency: { code: "JPY", symbol: "¥" } },
  { code: "AU", name: "Australia", currency: { code: "AUD", symbol: "$" } },
  { code: "CA", name: "Canada", currency: { code: "CAD", symbol: "$" } },
  { code: "CH", name: "Switzerland", currency: { code: "CHF", symbol: "₣" } },
  { code: "CN", name: "China", currency: { code: "CNY", symbol: "¥" } },
  { code: "DE", name: "Germany", currency: { code: "EUR", symbol: "€" } },
  { code: "FR", name: "France", currency: { code: "EUR", symbol: "€" } },
  { code: "IT", name: "Italy", currency: { code: "EUR", symbol: "€" } },
  { code: "ES", name: "Spain", currency: { code: "EUR", symbol: "€" } },
  { code: "BG", name: "Bulgaria", currency: { code: "BGN", symbol: "лв" } },
  { code: "BR", name: "Brazil", currency: { code: "BRL", symbol: "R$" } },
  { code: "CZ", name: "Czech Republic", currency: { code: "CZK", symbol: "Kč" } },
  { code: "DK", name: "Denmark", currency: { code: "DKK", symbol: "kr" } },
  { code: "HK", name: "Hong Kong", currency: { code: "HKD", symbol: "$" } },
  { code: "HU", name: "Hungary", currency: { code: "HUF", symbol: "Ft" } },
  { code: "ID", name: "Indonesia", currency: { code: "IDR", symbol: "Rp" } },
  { code: "IL", name: "Israel", currency: { code: "ILS", symbol: "₪" } },
  { code: "IS", name: "Iceland", currency: { code: "ISK", symbol: "kr" } },
  { code: "KR", name: "South Korea", currency: { code: "KRW", symbol: "₩" } },
  { code: "MX", name: "Mexico", currency: { code: "MXN", symbol: "$" } },
  { code: "MY", name: "Malaysia", currency: { code: "MYR", symbol: "RM" } },
  { code: "NO", name: "Norway", currency: { code: "NOK", symbol: "kr" } },
  { code: "NZ", name: "New Zealand", currency: { code: "NZD", symbol: "$" } },
  { code: "PH", name: "Philippines", currency: { code: "PHP", symbol: "₱" } },
  { code: "PL", name: "Poland", currency: { code: "PLN", symbol: "zł" } },
  { code: "RO", name: "Romania", currency: { code: "RON", symbol: "lei" } },
  { code: "SE", name: "Sweden", currency: { code: "SEK", symbol: "kr" } },
  { code: "SG", name: "Singapore", currency: { code: "SGD", symbol: "$" } },
  { code: "TH", name: "Thailand", currency: { code: "THB", symbol: "฿" } },
  { code: "TR", name: "Turkey", currency: { code: "TRY", symbol: "₺" } },
  { code: "ZA", name: "South Africa", currency: { code: "ZAR", symbol: "R" } },
  { code: "EU", name: "Eurozone", currency: { code: "EUR", symbol: "€" } },
];
const EventPage = ({}) => {
  const [activeImage, SetActiveImage] = useState(1);
  const [viewMainImg, SetViewMainImg] = useState(false);
  const [materialImage, SetMaterialImage] = useState("");
  const [viewMaterialImg, SetViewMaterialImg] = useState(false);
  const [activeTab, SetActiveTab] = useState(1);
  const [isStock, SetIsStock] = useState(false);
  const {
    wishlistedProducts,
    handleAddToWishlist,
    handleRemoveWishlist,
    setCartCount,
    productPageId,
    setProductPageId,
    setBuyNow,
    seteventPageId,
  } = useContext(MainAppContext);
  const [productQty, setProductQty] = useState(1);
  const [product, setProduct] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [sortedAttributes, setSortedAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [attributesArr, setAttributesArr] = useState({});
  const [is360, setIs360] = useState(false);
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(0);
  const [minprice, setMinPrice] = useState(0);
  const [maxprice, setMaxPrice] = useState(0);
  const [shouldDisableButton, setShouldDisableButton] = useState(true);
  const [display, setDisplay] = useState(false);
  const [ARSupported, setARSupported] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const navigate = useNavigate();
  const { currency, cart, setCart, wishlist, setWishlist } =
    useContext(AppContext);
  const { userLoggedIn } = useAuth();
  const param = useParams();
  // const productId = param.id;
  const model = useRef();
  // Accessing varient selections element
  const varient = useRef(null);
  const [allImages, setAllImages] = useState([]);
  const [likes, setLikes] = useState(0); // State for like functionality
  const [comments, setComments] = useState(reviews || []); // Reviews as comments
  const [newComment, setNewComment] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [liked, handleLiked] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [event, setEvent] = useState({});
  const [priceDetails, setPriceDetails] = useState({
    subtotal: 0,
    bookingFee: 0,
    gst: 0,
    total: 0,
  });

  const [embedUrl, setEmbedUrl] = useState(``);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return localStorage.getItem("selectedCountry") || "IN";
  });
  const [userCurrency, setUserCurrency] = useState({ code: "INR", symbol: "₹" });
  const [exchangeRate, setExchangeRate] = useState(1);

  // Helper function to calculate price details (matching backend calculation)
  const calculatePriceDetails = (price, quantity) => {
    const subtotal = price * quantity;
    // Calculate booking fee (2%)
    const bookingFee = (subtotal * 2) / 100;
    // Calculate GST (18% on subtotal + booking fee)
    const gst = ((subtotal + bookingFee) * 18) / 100;
    // Calculate total
    const total = subtotal + bookingFee + gst;

    return {
      subtotal,
      bookingFee,
      gst,
      total,
    };
  };

  const handleIncrease = () => {
    const newCount = ticketCount + 1;
    setTicketCount(newCount);
    // Update price details
    setPriceDetails(calculatePriceDetails(ticketPrice, newCount));
  };

  const handleDecrease = () => {
    if (ticketCount > 1) {
      const newCount = ticketCount - 1;
      setTicketCount(newCount);
      // Update price details
      setPriceDetails(calculatePriceDetails(ticketPrice, newCount));
    }
  };

  // Handler for selecting ticket type
  const handleSelectTicketType = (ticket) => {
    setSelectedTicketType(ticket);
    setTicketPrice(ticket.price);
    // Update price details when ticket type changes
    setPriceDetails(calculatePriceDetails(ticket.price, ticketCount));
  };

  const getEvent = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/events/${param?.id}`);
      if (response.data) {
        // Format the event data properly
        const eventData = response.data;

        console.log("event data:", eventData);
        setEvent(eventData);
        const mapQuery = encodeURIComponent(
          `${eventData?.location?.address}, ${eventData?.location?.city}, ${eventData?.location?.state}, ${eventData?.location?.country}, ${eventData?.location?.postalCode}`
        );
        setEmbedUrl(`https://www.google.com/maps?q=${mapQuery}&output=embed`);

        // Initialize the ticket price and selected ticket type if available
        if (eventData.tickets && eventData.tickets.length > 0) {
          setSelectedTicketType(eventData.tickets[0]);
          setTicketPrice(eventData.tickets[0].price);
        }
      } else throw new Error("Fetching Event failed");
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getEvent();
  }, [param?.id]);

  // Set initial ticket type and price when event data is loaded
  useEffect(() => {
    if (event?.tickets && event.tickets.length > 0) {
      const firstTicket = event.tickets[0];
      setSelectedTicketType(firstTicket);
      setTicketPrice(firstTicket.price);
      // Initialize price details with the first ticket
      setPriceDetails(calculatePriceDetails(firstTicket.price, ticketCount));
    }
  }, [event]);

  const getProductDetails = async (productId) => {
    setLoading(true);
    try {
      let eventPageId = sessionStorage.getItem("eventPageId");
      eventPageId = eventPageId.replace(/"/g, ""); // Remove all double quotes
      productId = productId.replace(/"/g, ""); // Remove all double quotes
      console.log(`${import.meta.env.VITE_SERVER_URL}/product/${eventPageId}`);

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/${eventPageId || productId}`
      );
      // if (response.data?.approved === false) {
      //   return navigate(-1);
      // }
      setProduct(response.data);
      console.log("tests", response?.data);
      setPrice(response.data?.price);
      SetActiveImage(response?.data?.mainImage);
      setAllImages([
        response?.data?.mainImage,
        ...response?.data?.additionalImages,
      ]);
      console.log(allImages);
      const sortedAttributes = response?.data?.attributes
        .filter((i) => {
          return i?.value !== "" && i?.type !== "";
        })
        .reduce((acc, curr) => {
          const index = acc.findIndex((item) => item.type === curr.type);
          if (index !== -1) {
            // If type already exists, push current object to its values array
            acc[index].values.push(curr);
          } else {
            // If type doesn't exist, create a new object with type and values array
            acc.push({ type: curr.type, values: [curr] });
          }
          return acc;
        }, []);

      let minPrice = Number.MAX_VALUE;
      let maxPrice = Number.MIN_VALUE;

      // Iterate over the outer array
      sortedAttributes.forEach((attribute) => {
        // Iterate over the inner array of values
        if (attribute.type?.toLowerCase() === "size") {
          attribute.values.forEach((value) => {
            const price = parseFloat(value.price); // Convert price to a number
            if (!isNaN(price)) {
              // Check if price is a valid number
              if (price < minPrice) {
                minPrice = price; // Update minPrice if necessary
              }
              if (price > maxPrice) {
                maxPrice = price; // Update maxPrice if necessary
              }
            }
          });
        }
      });
      if (minPrice == 0 || minPrice == Number.MAX_VALUE) {
        setMinPrice(response.data?.price);
      } else setMinPrice(minPrice);
      setMaxPrice(maxPrice);
      setSortedAttributes(sortedAttributes);
      // console.log(response.data.attributes);
      const organizedArrays = {};

      response.data.attributes.forEach((obj) => {
        const { type, value, price } = obj;
        if (!organizedArrays[type]) {
          organizedArrays[type] = [];
        }
        organizedArrays[type].push({ value, price });
      });

      setAttributesArr(organizedArrays);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    const productPageId2 = JSON.parse(sessionStorage.getItem("eventPageId"));
    // console.log(productPageId2);
    setUserDetails(user);
    getProductDetails(productPageId2);
    getReview(productPageId2);
    // if (userDetails) {
    //   getWishlist();
    // }
    // setWishlistedProducts(wishlist);
  }, []);
  useEffect(() => {
    const fetchEventData = async () => {
      // Check for param.id (from URL) or eventPageId from session storage
      const eventId =
        param?.id || JSON.parse(sessionStorage.getItem("eventPageId"));

      if (eventId) {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/events/${eventId}`);

          if (response.data) {
            const eventData = response.data;
            setEvent(eventData);

            // Initialize the ticket price and selected ticket type if available
            if (eventData.tickets && eventData.tickets.length > 0) {
              setSelectedTicketType(eventData.tickets[0]);
              setTicketPrice(eventData.tickets[0].price);
            }

            console.log("Loaded event data:", eventData);
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          toast.error("Failed to fetch event details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEventData();
  }, [param?.id]);
  useEffect(() => {
    if (typeof window.Sirv === "undefined") {
      LoadSirv().then(() => {
        window.Sirv.start();
      });
    } else {
      window.Sirv.start();
    }
  });
  useEffect(() => {
    function containsRequiredObjects(array) {
      let hasSize = false;
      let hasMaterial = false;
      let hasColor = false;

      for (const obj of array) {
        if (obj.type?.toLowerCase() === "size") {
          hasSize = true;
        } else if (obj.type?.toLowerCase() === "material") {
          hasMaterial = true;
        } else if (obj.type?.toLowerCase() === "color") {
          hasColor = true;
        }
        if (
          (hasSize && hasMaterial) ||
          (hasSize && hasColor) ||
          (hasMaterial && hasColor)
        ) {
          return true;
        }
      }

      return false;
    }
    const shouldDisableButton = !containsRequiredObjects(selectedAttribute);
    setShouldDisableButton(shouldDisableButton);
  }, [setSelectedAttributes, selectedAttribute]);

  useEffect(() => {
    const selected = countryCurrencyList.find((c) => c.code === selectedCountry);
    if (!selected || selected.currency.code === "INR") {
      setExchangeRate(1);
      return;
    }
    fetch(`https://api.frankfurter.app/latest?amount=1&from=INR&to=${selected.currency.code}`)
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.rates[selected.currency.code] || 1))
      .catch(() => setExchangeRate(1));
  }, [selectedCountry]);

  useEffect(() => {
    const currencyObj = countryCurrencyList.find((c) => c.code === selectedCountry);
    if (currencyObj) {
      setUserCurrency({ code: currencyObj.currency.code, symbol: currencyObj.currency.symbol });
    }
  }, [selectedCountry]);

  console.log(selectedCountry, "selectedCountry");
  console.log(userCurrency.code, "userCurrency");
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
  const [products, setProducts] = useState([]);

  const getReview = async (productPageId2) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/review/${productPageId2}`
      );
      // console.log(response.data.reviews);
      setReviews(response?.data?.reviews);
      const totalRatings = response?.data?.reviews?.reduce(
        (acc, review) => acc + review.rating,
        0
      );

      // Calculate the average rating
      const averageRating = Math.floor(
        totalRatings / response?.data?.reviews?.length
      );
      setRating(averageRating);
      // // console.log(averageRating);
      // Assuming the response contains an array of reviews
      return response.data.reviews; // Assuming the response contains an array of reviews
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return []; // Return an empty array in case of error
    }
  };

  const handleLike = () => {
    handleLiked(!liked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          title: "User Comment",
          comment: newComment,
          rating: 5, // Example rating
          userId: { name: "Anonymous" },
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewComment("");
    }
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Function to convert relative URLs to full URLs
  const getFullImageUrl = (relativeUrl) => {
    if (!relativeUrl) return "/images/event-placeholder.jpg";

    // If it's already a full URL, return it
    if (relativeUrl.startsWith("http")) return relativeUrl;

    // If it's a relative path starting with /
    if (relativeUrl.startsWith("/")) {
      return `${import.meta.env.VITE_SERVER_URL}${relativeUrl}`;
    }

    // Handle the case where there are backslashes (Windows paths)
    if (relativeUrl.includes("\\")) {
      const normalizedPath = relativeUrl.replace(/\\/g, "/");
      return `${import.meta.env.VITE_SERVER_URL}/${normalizedPath}`;
    }

    // If it's a relative path without /
    return `${import.meta.env.VITE_SERVER_URL}/${relativeUrl}`;
  };

  // Function to format event times (convert 24hr to 12hr format)
  const formatEventTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Add payment states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Function to handle ticket purchase
  const handleBuyTickets = async () => {
    try {
      // Check both userLoggedIn state and localStorage for user data
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;

      if (!userLoggedIn && !userData) {
        toast.error("Please login to purchase tickets");
        navigate("/login");
        return;
      }

      // Set initial email value if available from user data
      if (userData && userData.email && !userEmail) {
        setUserEmail(userData.email);
      }

      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error("Error opening payment modal:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Function to process payment
  const processPayment = async () => {
    if (!userEmail) {
      setPaymentError("Email is required for payment confirmation");
      return;
    }

    try {
      setPaymentProcessing(true);
      setPaymentError(null);

      // Get user data from localStorage
      let userData;
      try {
        userData = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      } catch (err) {
        console.error("Error parsing user data:", err);
        userData = null;
      }

      if (!userData) {
        throw new Error("User session expired. Please login again.");
      }

      // Get token from userData or accessToken in localStorage
      const token = userData.token || localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Make sure event has an _id
      if (!event || !event._id) {
        throw new Error(
          "Event information is missing. Please refresh the page."
        );
      }

      // Make sure we have a selected ticket
      if (!selectedTicketType || !selectedTicketType._id) {
        throw new Error("Please select a ticket type");
      }

      // Prepare ticket booking data according to TicketBookingController format
      const bookingData = {
        ticketQuantities: [
          {
            ticketId: selectedTicketType._id,
            quantity: ticketCount,
          },
        ],
        email: userEmail,
      };

      console.log("Booking data:", bookingData);

      // Make the API call to book tickets using the correct endpoint
      const response = await axiosInstance.post(
        `/tickets/event/${event._id}/book`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data, "response.data");
      // Handle successful response
      if (response.data && response.data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error("Invalid booking response");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage = error.response?.data?.message
        ? error.response.data.message
        : error.message
        ? error.message
        : "Failed to process booking. Please try again.";

      setPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Check for payment status on page load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const reference = queryParams.get("reference");
    const status = queryParams.get("status");

    // Handle payment success
    if (status === "success" && reference) {
      toast.success("Payment successful! Your tickets have been booked.");

      // No need to manually verify - the Paystack webhook in TicketBookingController
      // will automatically handle verification and updating ticket status

      // Clear query parameters by redirecting to clean URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (status === "failed" && reference) {
      toast.error("Payment failed. Please try again.");

      // Clear query parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    localStorage.setItem("selectedCountry", countryCode);
    const currencyObj = countryCurrencyList.find((c) => c.code === countryCode);
    if (currencyObj) {
      setUserCurrency({ code: currencyObj.currency.code, symbol: currencyObj.currency.symbol });
    }
  };

  return (
    <div className="relative bg-[#0E0F13] min-h-screen text-white overflow-hidden font-sen">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1323px] h-[1323px] rounded-[72px] bg-gradient-to-br from-[#F829BA] via-[#081CD1]/87 to-[#49DEFF] blur-[357px]" />
        </div>
      </div>

      {/* Content container - added relative and z-10 to ensure content stays above gradient */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 pt-0">
        {/* Hero Image Section */}
        <div className="relative w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden">
          <img
            src={
              event?.banner?.url
                ? getFullImageUrl(event.banner.url)
                : "/events/event1.jpeg"
            }
            alt={event?.banner?.alt || "Event Cover"}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="bg-[#C5FF32] p-2 md:p-3 rounded-full">
              <img
                src="/icons/share-icon.svg"
                alt="Share"
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </button>
            <button className="bg-[#C5FF32] p-2 md:p-3 rounded-full">
              <img
                src="/icons/star-icon.svg"
                alt="Star"
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </button>
          </div>
        </div>

        {/* Title and Info Container */}
        <div className="mt-6 md:mt-8">
          <h1 className="text-4xl md:text-[44px] font-bold mb-6 md:mb-8">
            {event?.title || "Event Title"}
          </h1>

          {/* Date/Time and Ticket Container */}
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 bg-[#1C1D24]/50 rounded-xl p-4 md:p-6">
            {/* Left Side - Date and Time */}
            <div className="flex-1">
              <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">
                Date and Time
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/icons/calendar-icon.svg"
                    alt="Calendar"
                    className="w-5 h-5"
                  />
                  <span>
                    {formatEventDate(event?.startDate)}{" "}
                    {event?.endDate && event?.startDate !== event?.endDate
                      ? `- ${formatEventDate(event?.endDate)}`
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/icons/time-icon.svg"
                    alt="Time"
                    className="w-5 h-5"
                  />
                  <span>
                    {formatEventTime(event?.startTime)} -{" "}
                    {formatEventTime(event?.endTime)}
                  </span>
                </div>
                {/* <button className="text-[#00FFB3] text-sm hover:text-[#00cc8f] transition-colors w-fit">
                  + Add to Calendar
                </button> */}
              </div>
            </div>

            {/* Right Side - Ticket Info */}
            <div className="flex-1">
              <div className="flex flex-col items-end">
                <button
                  onClick={handleBuyTickets}
                  className="bg-[#00FFB3] text-black px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium mb-4 w-full md:w-auto flex items-center justify-center gap-2 hover:bg-[#00cc8f] transition-colors"
                >
                  <IoTicketOutline className="w-5 h-5" />
                  Buy Tickets
                </button>
                <div className="w-full">
                  <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">
                    Ticket Information
                  </h2>
                  {/* Country selection dropdown (moved here) */}
                  <div className="mb-4">
                    <label className="text-[#94A3B8] block mb-2">Select Country:</label>
                    <select
                      className="w-full bg-[#2A2C37] text-white p-2 rounded-lg focus:outline-none"
                      value={selectedCountry}
                      onChange={handleCountryChange}
                    >
                      {countryCurrencyList.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-[#94A3B8] mb-2">Prices are converted from INR and may vary due to exchange rates.</div>
                  <div className="bg-[#1C1D24] rounded-xl p-4">
                    {event?.tickets && event.tickets.length > 0 ? (
                      <>
                        {/* Ticket selection if multiple tickets available */}
                        {event.tickets.length > 1 && (
                          <div className="mb-4">
                            <label className="text-[#94A3B8] block mb-2">
                              Select Ticket Type:
                            </label>
                            <select
                              className="w-full bg-[#2A2C37] text-white p-2 rounded-lg focus:outline-none"
                              value={selectedTicketType?._id || ""}
                              onChange={(e) => {
                                const selected = event.tickets.find(
                                  (t) => t._id === e.target.value
                                );
                                if (selected) handleSelectTicketType(selected);
                              }}
                            >
                              <option value="">Select a ticket type</option>
                              {event.tickets.map((ticket) => (
                                <option key={ticket._id} value={ticket._id}>
                                  {ticket.name} - {userCurrency.symbol}{ticket.price}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Display selected ticket or first ticket */}
                        <div className="flex items-center gap-2">
                          <img
                            src="/icons/ticket-icon.svg"
                            alt="Ticket"
                            className="w-5 h-5"
                          />
                          <span className="text-[#94A3B8]">
                            {selectedTicketType?.name || event.tickets[0].name}:
                            {userCurrency.symbol} {(ticketPrice * exchangeRate).toFixed(2)} each
                          </span>
                        </div>

                        {/* Ticket benefits if available */}
                        {(selectedTicketType?.benefits ||
                          event.tickets[0].benefits) && (
                          <div className="mt-2 ml-7 text-xs text-[#94A3B8]">
                            <p className="font-medium text-[#C5FF32] mb-1">
                              Includes:
                            </p>
                            <ul className="list-disc pl-4">
                              {(
                                selectedTicketType?.benefits ||
                                event.tickets[0].benefits
                              ).map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-[#94A3B8]">
                        Ticket information not available
                      </span>
                    )}

                    {/* Add ticket quantity selector */}
                    {event?.tickets && event.tickets.length > 0 && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[#94A3B8]">Quantity:</span>
                        <div className="flex items-center bg-[#2A2C37] rounded-lg">
                          <button
                            onClick={handleDecrease}
                            className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-white">
                            {ticketCount}
                          </span>
                          <button
                            onClick={handleIncrease}
                            className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[#94A3B8] ml-4">
                          Total: {userCurrency.symbol}{(ticketPrice * exchangeRate).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">
              Location
            </h2>
            <div className="bg-[#1C1D24] rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <img
                      src="/icons/location-icon.svg"
                      alt="Location"
                      className="w-5 h-5 mt-1"
                    />
                    <p className="text-[#94A3B8]">
                      {event?.location?.address ? (
                        <>
                          {event.location.address}
                          {event.location.landmark && (
                            <>
                              <br />
                              {event.location.landmark}
                            </>
                          )}
                          <br />
                          {event.location.city}, {event.location.state}{" "}
                          {event.location.postalCode}
                          <br />
                          {event.location.country}
                        </>
                      ) : (
                        "Location details not available"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex-1 h-[200px] md:h-[250px]">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full rounded-xl"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Hosted by Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">
              Hosted by
            </h2>
            <div className="flex items-center gap-4">
              {event?.curator || event?.creator ? (
                <>
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${
                      event?.creator?.images?.[0]
                    }`}
                    alt={
                      event.curator?.name ||
                      event.creator?.stageName ||
                      "Event Host"
                    }
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-white font-medium text-lg mb-2">
                      {event.curator?.stageName ||
                        event.curator?.name ||
                        (event.creator
                          ? event.creator.stageName ||
                            `${event.creator.firstName || ""} ${
                              event.creator.lastName || ""
                            }`.trim()
                          : "Event Host")}
                    </h3>
                    {(event.curator?.bio || event.creator?.bio) && (
                      <p className="text-[#94A3B8] text-sm mb-2 line-clamp-2">
                        {event.curator?.bio || event.creator?.bio}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link
                        to={`/curator/${
                          event.curator?.id || event.creator?._id
                        }`}
                        className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        Visit Profile
                      </Link>
                      {/* <button className="bg-transparent text-white px-6 py-2 rounded-lg text-sm font-medium border border-white hover:bg-white/10 transition-colors">
                        + Follow
                      </button> */}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src="/Images/host-image.png"
                    alt="Event Host"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-white font-medium text-lg mb-2">
                      Event Host
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          toast.info("Profile information not available")
                        }
                        className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        Visit Profile
                      </button>
                      <button className="bg-transparent text-white px-6 py-2 rounded-lg text-sm font-medium border border-white hover:bg-white/10 transition-colors">
                        + Follow
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Event Description Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-xl mb-4">Event Description</h2>
            <div className="bg-[#1C1D24] rounded-xl p-6">
              <p className="text-[#94A3B8] whitespace-pre-line">
                {event?.description || "Event description not available."}
              </p>

              {/* Display event categories and type */}
              {(event?.category || event?.eventType) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.category && (
                    <span className="bg-[#2A2C37] text-[#C5FF32] px-3 py-1 rounded-lg text-xs uppercase">
                      {event.category}
                    </span>
                  )}
                  {event.eventType && (
                    <span className="bg-[#2A2C37] text-[#00FFB3] px-3 py-1 rounded-lg text-xs uppercase">
                      {event.eventType}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sponsors Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">
              Sponsors
            </h2>
            {event?.sponsors && event.sponsors.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {event.sponsors.map((sponsor, i) => (
                  <Link
                    to={`/sponsor/${sponsor.id}`}
                    key={i}
                    className="flex flex-col items-center"
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
                      <img
                        src={
                          sponsor.businessLogo
                            ? getFullImageUrl(sponsor.businessLogo)
                            : "/Images/sponsor-logo.png"
                        }
                        alt={sponsor.businessName || sponsor.name || "Sponsor"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-sm">
                      {sponsor.businessName || sponsor.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[#94A3B8]">No sponsors for this event</p>
            )}
          </div>

          {/* Products by sponsor Section */}
          {event?.sponsors &&
            event.sponsors.some(
              (sponsor) => sponsor.products && sponsor.products.length > 0
            ) && (
              <div className="mt-8">
                {event.sponsors.map(
                  (sponsor, sponsorIndex) =>
                    sponsor.products &&
                    sponsor.products.length > 0 && (
                      <div key={sponsorIndex} className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-[#94A3B8] text-xl">
                            Products by sponsor:{" "}
                            {sponsor.businessName || sponsor.name}
                          </h2>
                          <a
                            href={`/sponsor/${sponsor.id}`}
                            className="text-[#C5FF32] hover:text-[#a3cc28] transition-colors"
                          >
                            Visit page
                          </a>
                        </div>

                        {/* Horizontal scrollable container */}
                        <div className="relative overflow-x-auto pb-4">
                          <div className="flex gap-6 min-w-min">
                            {sponsor.products.map((product, i) => (
                              <div
                                key={i}
                                className="flex-shrink-0 w-[320px] bg-[#1C1D24] rounded-xl overflow-hidden"
                              >
                                <div className="aspect-square relative">
                                  <img
                                    src={
                                      product.images || product.image
                                        ? getFullImageUrl(
                                            product.images || product.image
                                          )
                                        : "/Images/product-image.png"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-4">
                                  <h3 className="text-white text-xl font-medium mb-3">
                                    {product.name}
                                  </h3>
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="text-[#94A3B8] text-lg">
                                      {userCurrency.symbol}{(product.price * exchangeRate).toFixed(2)}
                                    </span>
                                    {product.stock && (
                                      <span className="text-[#94A3B8]">
                                        Stock: {product.stock}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      toast.info("Redirecting to product page");
                                      // You can add navigation to product page here
                                    }}
                                    className="bg-[#00FFB3] hover:bg-[#00cc8f] transition-colors text-black px-4 py-3 rounded-lg text-base w-full font-medium"
                                  >
                                    Buy Now
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}

          {/* Curators Section */}
          {event?.curators && (
            <div className="mt-8">
              <h2 className="text-[#94A3B8] text-xl mb-6">Curators</h2>
              <div className="flex gap-6 overflow-x-auto pb-4">
                {Array.isArray(event.curators) ? (
                  event.curators.map((curator, i) => {
                    return (
                      <Link
                        to={`/curator/${curator._id}`}
                        key={i}
                        className="flex flex-col items-center"
                      >
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
                          <img
                            src={`${import.meta.env.VITE_SERVER_URL}${
                              curator?.images?.[0]
                            }`}
                            alt={curator?.stageName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white text-sm">
                          {curator?.firstName} {curator?.lastName}
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-[#94A3B8]">
                    Curator information not available
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Other events section (already implemented with PopularEvents) */}
          <div className="mt-16">
            <h2 className="text-[#94A3B8] text-2xl font-semibold mb-4">
              Other events you may Like
            </h2>
            <PopularEvents
              showTitle={false}
              showBackground={false}
              currentEventId={event?._id}
            />
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Transition appear show={isPaymentModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsPaymentModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1C1D24] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-white mb-4"
                  >
                    Complete Your Purchase
                  </Dialog.Title>

                  <div className="mt-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white text-lg mb-2">
                          Event Details
                        </h4>
                        <div className="bg-[#2A2C37] rounded-lg p-3">
                          <p className="text-white font-medium">
                            {event?.title || "Event"}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {formatEventDate(event?.startDate || new Date())} •{" "}
                            {formatEventTime(event?.startTime || "09:00")} -{" "}
                            {formatEventTime(event?.endTime || "17:00")}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {event?.location?.address
                              ? `${event.location.address}, ${event.location.city}`
                              : "Location not available"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white text-lg mb-2">
                          Payment Information
                        </h4>
                        <div className="bg-[#2A2C37] rounded-lg p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                              <span className="text-[#94A3B8] text-sm">
                                Ticket Type
                              </span>
                              <span className="text-white text-sm">
                                {selectedTicketType?.name || "Standard Ticket"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#94A3B8] text-sm">
                                Ticket Price
                              </span>
                              <span className="text-white text-sm">
                                {userCurrency.symbol} {(ticketPrice * exchangeRate).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#94A3B8] text-sm">
                                Quantity
                              </span>
                              <span className="text-white text-sm">
                                {ticketCount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#94A3B8] text-sm">
                                Subtotal
                              </span>
                              <span className="text-white text-sm">
                                {userCurrency.symbol} {(priceDetails.subtotal * exchangeRate).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#94A3B8] text-sm">
                                Booking Fee (2%)
                              </span>
                              <span className="text-white text-sm">
                                {userCurrency.symbol} {(priceDetails.bookingFee * exchangeRate).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#94A3B8] text-sm">
                                GST (18%)
                              </span>
                              <span className="text-white text-sm">
                                {userCurrency.symbol} {(priceDetails.gst * exchangeRate).toFixed(2)}
                              </span>
                            </div>
                            <div className="border-t border-gray-700 my-1"></div>
                            <div className="flex justify-between font-medium">
                              <span className="text-[#C5FF32] text-sm">
                                Total Amount
                              </span>
                              <span className="text-white text-sm">
                                {userCurrency.symbol} {(priceDetails.total * exchangeRate).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white text-lg mb-2">
                          Payment Method
                        </h4>
                        <div className="bg-[#2A2C37] rounded-lg p-3">
                          <p className="text-[#94A3B8] text-sm mb-2">
                            You will be redirected to Paystack to complete your
                            payment.
                          </p>
                          <label className="block text-[#C5FF32] text-sm font-medium mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            placeholder="Enter your email for receipt"
                            className={`w-full p-3 rounded-lg bg-[#1C1D24] text-white placeholder:text-[#94A3B8] focus:outline-none ${
                              !userEmail && paymentError
                                ? "border border-red-500 focus:ring-red-500"
                                : "focus:ring-2 focus:ring-[#C5FF32]"
                            }`}
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {paymentError && (
                        <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
                          {paymentError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none"
                      onClick={() => setIsPaymentModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-black bg-[#00FFB3] hover:bg-[#00cc8f] focus:outline-none ${
                        paymentProcessing || !userEmail
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={processPayment}
                      disabled={paymentProcessing || !userEmail}
                      title={
                        !userEmail ? "Please enter your email address" : ""
                      }
                    >
                      {paymentProcessing ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EventPage;
