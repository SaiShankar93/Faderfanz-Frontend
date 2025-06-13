import React, { useEffect, useState } from "react";
import { EventCard } from "../components/EventCard"; // Ensure EventCard is imported correctly
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axiosInstance from "@/configs/axiosConfig";
import { useParams } from "react-router-dom";

const BlogPage = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);

  const fetchBlogData = async () => {
    try {
      const response = await axiosInstance.get(`/blogs/${id}`);
      const data = await response.data;
      if (data.success) setBlogData(data.data);
      else toast.error("Unable to fetch blogs");
    } catch (error) {
      console.log("Error fetching blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  const allImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmwJKXOAOJ_f2jlwhnlINidcfUo9qnhEAANg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmwJKXOAOJ_f2jlwhnlINidcfUo9qnhEAANg",
  ];
  const curator = {
    title: "DJ Blaze",
    profilePhoto:
      "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual image URL
    contact: "djblaze@example.com",
    followers: 5234,
    about:
      "DJ Blaze is a renowned music curator known for electrifying performances and unforgettable events.",
    socialLinks: {
      instagram: "https://instagram.com/djblaze",
      twitter: "https://twitter.com/djblaze",
      facebook: "https://facebook.com/djblaze",
    },
    totalEvents: 48,
    events: [
      {
        _id: "1",
        title: "Summer Beats Festival",
        date: "July 15, 2024",
        mainImage:
          "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual event image URL
        price: 50,
      },
      {
        _id: "2",
        title: "Electric Nights",
        date: "August 23, 2024",
        mainImage:
          "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual event image URL
        price: 60,
      },
      {
        _id: "3",
        title: "Winter Groove",
        date: "December 5, 2024",
        mainImage:
          "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual event image URL
        price: 75,
      },
    ],
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return [
    loading ? (
      <div className=" w-full flex items-center justify-center py-3">
        <img
          src="/Images/loader.svg"
          alt="loading..."
          className=" object-contain w-[60px] h-[60px]"
        />
      </div>
    ) : (
      <div className="bg-[#0E0F13] min-h-screen pt-16 text-white">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mt-12">
            {blogData?.title}
          </h1>
          <p className="text-gray-400 mt-2">Author : {`${blogData?.author?.firstName} ${blogData?.author?.lastName}` || "No author"}</p>
          <p className="text-xl mt-2">5 min read | Published : {formatDate(blogData?.createdAt)}</p>
        </div>
        <div className="bg-[#0E0F13] min-h-screen pt-16 text-white">
          <svg
            className="fixed bottom-0 right-0 z-[0] pointer-events-none"
            width="536"
            height="1071"
            viewBox="0 0 536 1071"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1_3190)">
              <circle
                cx="535.5"
                cy="535.5"
                r="207.5"
                fill="#8B33FE"
                fillOpacity="0.4"
              />
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
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="164"
                  result="effect1_foregroundBlur_1_3190"
                />
              </filter>
            </defs>
          </svg>
          <div className="max-w-5xl mx-auto py-10 px-5">
            <div className="w-full h-[400px] lg:h-[600px]">
              <Swiper
                loop={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay, Pagination]}
                className="w-full h-full rounded-lg overflow-hidden"
              >
                {blogData?.contentImages?.length > 0 && blogData?.contentImages?.map((image, index) => {
                  return (
                  <SwiperSlide key={index}>
                    <img
                      className="w-full h-full object-cover"
                      src={`${import.meta.env.VITE_SERVER_URL}${image}`}
                      alt="Event"
                    />
                  </SwiperSlide>
                )})}
              </Swiper>
            </div>
            <svg
              width="601"
              height="1031"
              viewBox="0 0 601 1031"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fixed top-0 left-0 z-[0] pointer-events-none hidden lg:block"
            >
              <g filter="url(#filter0_f_1_3194)">
                <circle
                  cx="85.5"
                  cy="515.5"
                  r="207.5"
                  fill="#8B33FE"
                  fill-opacity="0.4"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_1_3194"
                  x="-430"
                  y="0"
                  width="1031"
                  height="1031"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="154"
                    result="effect1_foregroundBlur_1_3194"
                  />
                </filter>
              </defs>
            </svg>
            <div className="flex py-12">
              {blogData?.content || "No content"}
            </div>
          </div>
        </div>
      </div>
    ),
  ];
};

export default BlogPage;
