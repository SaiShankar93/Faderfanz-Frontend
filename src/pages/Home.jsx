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

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import parse from "html-react-parser";
import Hero from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
import { CuratorCard } from "@/components/CuratorCard";
import { BlogCard } from "@/components/BlogCard";

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
const Process = [
  {
    number: "01",
    text: "First, a conversation sparks off the magic",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
  {
    number: "02",
    text: "Next, co-creation begins, with a site visit.",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
  {
    number: "03",
    text: "Finally the dream comes alive.",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
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
  const [newProducts, setNewProducts] = useState([]);
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
      setNewProducts(chunkedArray[0]);
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

  return (
    <section className=" w-full bg-[#0E0F13] dark:text-white">
      <Hero />
      <Helmet>
        <title>{"Kazi Culture"} </title>
        <meta name="description" />
        <meta name="description" content={"Kazi Culture"} />
        <meta name="keywords" content={"Kazi Culture"} />
        <meta name="author" content={"Kazi Culture"} />
      </Helmet>
      {/* {showModal && <div className="modal-overlay" />}
      {showModal && <PopupModal onClose={() => setShowModal(false)} />} */}
      {/* <HeroSlider slider={slider} /> */}
      {/* <CategorySlider data={categories} /> */}
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
      <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 px-[2%] mb-10">
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
      </div>

      {/* Event Section */}

      <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
        <div className=" flex flex-col items-center col-span-4">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] plus-jakarta font-[700] text-white dark:text-gray-400 ">
            Featured Events
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
          <div className="w-full col-span-4 px-8 py-16">
            <div className="w-full col-span-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((event) => (
                console.log(event),
                <EventCard event={event} key={event._id} />
              ))}
            </div>

          </div>
        </>
      )}
      {/* curators section */}
      <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
        <div className=" flex flex-col items-center col-span-4">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] plus-jakarta font-[700] text-white dark:text-gray-400 ">
            Featured Curators
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
          href="/curator/all"
          title="View all Events"
          className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
          role="button"
        >
          View All Curators &rarr;
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
          <div className="w-full col-span-4 px-8 py-16">
            <div className="w-full col-span-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((event) => (
                console.log(event),
                <CuratorCard event={event} key={event._id} />
              ))}
            </div>

          </div>
        </>
      )}

      {/* Blogs Section */}
      <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
        <div className=" flex flex-col items-center col-span-4">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] plus-jakarta font-[700] text-white dark:text-gray-400 ">
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
          <div className="w-full col-span-4 px-8 py-16">
            <div className="w-full col-span-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((event) => (
                console.log(event),
                <BlogCard event={event} key={event._id} />
              ))}
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
                      }`
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
    </section>
  );
};

export default Home;
