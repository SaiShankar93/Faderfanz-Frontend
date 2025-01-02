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
} from "react-icons/io5";
import { FaHeart, FaStar } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import LoadSirv from "../LoadSirv";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import AttributeSlider from "@/components/AttributeSlider";
import { Tooltip } from "@material-tailwind/react";
import { Swiper, SwiperSlide } from "swiper/react";

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
    <div className="bg-[#0E0F13] text-white min-h-screen py-16 px-4 md:px-10 lg:px-20">
      <Helmet>
        <title>{product?.title}</title>
        <meta name="description" content={product?.metaDescription} />
        <meta name="keywords" content={product?.metaHead} />
        <meta name="author" content={product?.metaTitle} />
      </Helmet>

      <section className="w-full py-10">
        {loading || !product ? (
          <div className="w-full flex items-center justify-center py-10">
            <img
              src="/Images/loader.svg"
              alt="loading..."
              className="w-[60px] h-[60px] object-contain"
            />
          </div>
        ) : (
          <div className="w-full">
            {/* Image Carousel */}
            <svg
              className="fixed top-0 right-0 z-[0] pointer-events-none"
              width="536"
              height="1071"
              viewBox="0 0 536 1071"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_f_1_3190)">
                <circle cx="535.5" cy="535.5" r="207.5" fill="#8B33FE" fillOpacity="0.4" />
              </g>
              <defs>
                <filter
                  id="filter0_f_1_3190"
                  x="0"
                  y="0"
                  width="1071"
                  height="1071"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="164" result="effect1_foregroundBlur_1_3190" />
                </filter>
              </defs>
            </svg>
            <div className="w-full h-[400px] lg:h-[600px]">
              <Swiper
                loop={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay, Pagination]}
                className="w-full h-full rounded-lg overflow-hidden"
              >
                {allImages?.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      className="w-full h-full object-cover"
                      src={image}
                      alt="Event"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Main Content Layout */}
            <div className="mt-10 flex flex-col lg:flex-row gap-10">
              {/* Left Section */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <h1 className="text-4xl font-bold mb-4">{product?.title}</h1>
                  <button onClick={handleLike} className="text-2xl">
                    {
                      liked > 0 ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaHeart />
                      )
                    }
                  </button>

                </div>
                <div className="py-3 flex gap-2">
                  <Stars stars={3} /> 
                  <span className="text-gray-400">(5)</span>
                </div>
                <p className="text-xl text-gray-400 mb-6">₹{product?.price}</p>

                <p className="mb-8 leading-7">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis perspiciatis aliquam possimus deserunt ut veniam tempora repellendus aperiam laudantium voluptatem molestiae sunt tenetur assumenda ab, molestias delectus corrupti sapiente ullam!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores dolorem quas adipisci sapiente numquam voluptate eligendi fugit explicabo dolores iure ipsam vero, nobis eum aliquam tempore at velit illum architecto. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda minima asperiores tenetur ipsa nihil nulla enim perferendis unde laudantium architecto laborum illum pariatur, vitae possimus sint repudiandae quisquam soluta! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor odit repellat aliquid atque! Odit alias labore pariatur delectus dicta ratione dolores ut, exercitationem reiciendis. Officia pariatur blanditiis sapiente dignissimos dolor.
                </p>

                {/* Map Section */}
                <div className=" p-6 rounded-lg mb-8 order-3 ">
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <iframe
                    className="w-full h-60 rounded-md"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345094274!2d-122.42006968468114!3d37.779280979759516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064c2cb33b7%3A0xe3a6b535d61c5b6!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1645678886145!5m2!1sen!2sus"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
                <svg width="601" height="1031" viewBox="0 0 601 1031" fill="none" xmlns="http://www.w3.org/2000/svg" className="fixed top-[0%] left-0 z-[0] pointer-events-none hidden lg:block">
                  <g filter="url(#filter0_f_1_3194)">
                    <circle cx="85.5" cy="515.5" r="207.5" fill="#8B33FE" fill-opacity="0.4" />
                  </g>
                  <defs>
                    <filter id="filter0_f_1_3194" x="-430" y="0" width="1031" height="1031" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feGaussianBlur stdDeviation="154" result="effect1_foregroundBlur_1_3194" />
                    </filter>
                  </defs>
                </svg>
                {/* Comments Section */}
                <div className=" p-6 rounded-lg order-2 lg:order-3  ">
                  <h3 className="text-lg font-semibold mb-4">Comments</h3>
                  <div className="mb-4">
                    {comments.map((comment, index) => (
                      <div
                        key={index}
                        className="p-4 mb-4 bg-gray-700 rounded-md"
                      >
                        <p>
                          <strong>{comment.userId?.name}</strong> - {" "}
                          {comment.createdAt.split("T")[0]}
                        </p>
                        <p>{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment..."
                    className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
                  ></textarea>
                  <div className="absolute  group">
                    <div
                      className="absolute  px-4 py-2 -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"
                    />
                    <button
                      onClick={handleAddComment}
                      href=""
                      title="View all Events"
                      className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
                      role="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="w-full lg:w-1/3 p-6 rounded-lg">
                {/* Curator Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Curator</h3>
                  <p className="mt-2">John Doe</p>
                  <p className="text-gray-400">Event Date: 25th December 2024</p>
                </div>

                {/* Ticket Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Tickets</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={handleDecrease}
                      className=" px-4 py-2 rounded-md"
                    >
                      -
                    </button>
                    <span className="text-xl">{ticketCount}</span>
                    <button
                      onClick={handleIncrease}
                      className=" px-4 py-2 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <p>Total Price: ₹{ticketPrice * ticketCount}</p>
                  <div className="absolute my-12 inline-flex group">
                    <div
                      className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"
                    />
                    <a
                      href=""
                      title="View all Events"
                      className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
                      role="button"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default EventPage;
