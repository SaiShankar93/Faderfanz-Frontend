import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoSearchOutline } from 'react-icons/io5';
import { IoLocationOutline } from 'react-icons/io5';

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";

export default function HeroSlider({ slider }) {
  return (
    <div className="relative w-full h-[600px]">
      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white text-center mb-12">
          Explore tons of amazing events
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-4xl">
          <div className="flex bg-[#1C1D24]/80 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="flex-1 flex items-center min-w-0">
              <IoSearchOutline className="ml-4 w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search Events, Categories, Location..."
                className="w-full px-3 py-3 bg-transparent text-white focus:outline-none placeholder-gray-400 min-w-0"
              />
            </div>
            <div className="flex items-center border-l border-gray-700/50 shrink-0">
              <IoLocationOutline className="ml-4 w-5 h-5 text-gray-400" />
              <select
                className="w-32 sm:w-40 px-3 py-3 bg-transparent text-gray-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Slider */}
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active bg-[#00FFB2]'
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