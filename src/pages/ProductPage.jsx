import React, { useContext, useEffect, useRef, useState } from "react";
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

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Start } from "@mui/icons-material";

const EventPage = ({ }) => {
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
  const { userLoggedIn, setUserLoggedIn } = useAuth();
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
  const ticketPrice = product?.price || 0;

  const handleIncrease = () => setTicketCount((prev) => prev + 1);
  const handleDecrease = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));


  const getProductDetails = async (productId) => {
    setLoading(true);
    try {
      let eventPageId = sessionStorage.getItem("eventPageId");
      eventPageId = eventPageId.replace(/"/g, ''); // Remove all double quotes
      productId = productId.replace(/"/g, ''); // Remove all double quotes
      console.log(`${import.meta.env.VITE_SERVER_URL}/product/${eventPageId}`)

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
      setAllImages([response?.data?.mainImage, ...response?.data?.additionalImages]);
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

  return (
    <div className="relative bg-[#0E0F13] min-h-screen text-white overflow-hidden">
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
            src="/events/event1.jpeg"
            alt="Event Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="bg-[#C5FF32] p-2 md:p-3 rounded-full">
              <img src="/icons/share-icon.svg" alt="Share" className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="bg-[#C5FF32] p-2 md:p-3 rounded-full">
              <img src="/icons/star-icon.svg" alt="Star" className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Title and Info Container */}
        <div className="mt-6 md:mt-8">
          <h1 className="text-4xl md:text-[44px] font-bold mb-6 md:mb-8">The Kazi-culture show</h1>

          {/* Date/Time and Ticket Container */}
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 bg-[#1C1D24]/50 rounded-xl p-4 md:p-6">
            {/* Left Side - Date and Time */}
            <div className="flex-1">
              <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">Date and Time</h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <img src="/icons/calendar-icon.svg" alt="Calendar" className="w-5 h-5" />
                  <span>Saturday, 2 December 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/icons/time-icon.svg" alt="Time" className="w-5 h-5" />
                  <span>6:30 PM - 9:30 PM</span>
                </div>
                <button className="text-[#00FFB3] text-sm hover:text-[#00cc8f] transition-colors w-fit">
                  + Add to Calendar
                </button>
              </div>
            </div>

            {/* Right Side - Ticket Info */}
            <div className="flex-1">
              <div className="flex flex-col items-end">
                <button className="bg-[#00FFB3] text-black px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium mb-4 w-full md:w-auto flex items-center justify-center gap-2">
                  <IoTicketOutline className="w-5 h-5" />
                  Buy Tickets
                </button>
                <div className="w-full">
                  <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">Ticket Information</h2>
                  <div className="bg-[#1C1D24] rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <img src="/icons/ticket-icon.svg" alt="Ticket" className="w-5 h-5" />
                      <span className="text-[#94A3B8]">Standard Ticket: ₹ 200 each</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">Location</h2>
            <div className="bg-[#1C1D24] rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <img src="/icons/location-icon.svg" alt="Location" className="w-5 h-5 mt-1" />
                    <p className="text-[#94A3B8]">
                      12 Lake Avenue, Mumbai, Near Junction<br />
                      Of 24th & 32nd Road & Patwardhan<br />
                      Park,Off Linking Road, Bandra West,<br />
                      Mumbai, India
                    </p>
                  </div>
                </div>
                <div className="flex-1 h-[200px] md:h-[250px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.803960726307!2d72.82824147499422!3d19.0507943570711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c000000001%3A0x3c1c64a0f6c13656!2sBandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1709825037044!5m2!1sen!2sin"
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
            <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">Hosted by</h2>
            <div className="flex items-center gap-4">
              <img
                src="/Images/host-image.png"
                alt="City Youth Movement"
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-white font-medium text-lg mb-2">City Youth Movement</h3>
                <div className="flex gap-2">
                  <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    Contact
                  </button>
                  <button className="bg-transparent text-white px-6 py-2 rounded-lg text-sm font-medium border border-white hover:bg-white/10 transition-colors">
                    + Follow
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Description Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-xl mb-4">Event Description</h2>
            <div className="bg-[#1C1D24] rounded-xl p-6">
              <p className="text-[#94A3B8]">
                Get ready to kick off the Christmas season in Mumbai with KAZI OF CHRISTMAS - your favourite LIVE Christmas party/fair. Be the patch that the city needs! Your favourite monthly events, stalls, karaoke and more exciting surprises! Bring your family, new friends and sing along your favourite Christmas songs on the 2nd of December, 6:30 PM onwards at the Bungalow!<br /><br />
                Bonus Note: Wear your Santa hats!<br /><br />
                1. Reasons to attend the event:<br />
                2. The FIRST Christmas carnival of Mumbai!<br />
                3. A special Christmas choir!<br />
                4. Special dance performances and many more surprises!
              </p>
            </div>
          </div>

          {/* Sponsors Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-lg md:text-2xl mb-4">Sponsors</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[
                { name: "Elites Mark", image: "/Images/sponsor-logo.png" },
                // Add more sponsors here as needed
              ].map((sponsor, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white text-sm">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products by sponsor Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#94A3B8] text-xl">Products by sponsor: Elites Mark</h2>
              <a href="#" className="text-[#C5FF32] hover:text-[#a3cc28] transition-colors">Visit page</a>
            </div>

            {/* Horizontal scrollable container */}
            <div className="relative overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-min">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[320px] bg-[#1C1D24] rounded-xl overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src="/Images/product-image.png"
                        alt="Base Ball T-Shirt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white text-xl font-medium mb-3">BASE BALL T-SHIRT</h3>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#94A3B8] text-lg">${200}</span>
                        <span className="text-[#94A3B8]">Stock: 32</span>
                      </div>
                      <button className="bg-[#00FFB3] hover:bg-[#00cc8f] transition-colors text-black px-4 py-3 rounded-lg text-base w-full font-medium">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Curators Section */}
          <div className="mt-8">
            <h2 className="text-[#94A3B8] text-xl mb-6">Curators</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[
                { name: "DJ Larsh", image: "/Images/curator-img.png" },
                { name: "Mr Rush", image: "/Images/curator-img.png" },
                { name: "Mr Rush", image: "/Images/curator-img.png" },
                { name: "Mr Rush", image: "/Images/curator-img.png" },
                { name: "Mr Rush", image: "/Images/curator-img.png" },
                { name: "Mr Rush", image: "/Images/curator-img.png" }
              ].map((curator, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
                    <img
                      src={curator.image}
                      alt={curator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white text-sm">{curator.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Other events section (already implemented with PopularEvents) */}
          <div className="mt-16">
            <h2 className="text-[#94A3B8] text-2xl font-semibold mb-4">Other events you may Like</h2>
            <PopularEvents showTitle={false} showBackground={false} />
          </div>


        </div>
      </div>
    </div>
  );
};

export default EventPage;
