import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaSearch } from 'react-icons/fa'
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function HeroSlider({ slider }) {
  return (
    <div className="relative w-full pt-32 md:px-14 px-0">
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination]}
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
      >
        {slider.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative text-white w-full h-full">
              <a href={slide.link}>
                <img
                  className="w-full h-full object-fill lg:object-cover"
                  src={slide.image}
                  alt={slide.name}
                />
              </a>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Text and Search Bar */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-playwrite">
                  Explore Tons of Amazing Events
                </h1>
                <div className="relative mt-8 w-full  max-w-[400px] sm:max-w-[500px]">
                  <input
                    type="text"
                    placeholder="Search events, venues, or curators"
                    className="w-full px-4 py-2 text-gray-900 rounded-lg shadow-lg"
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-4 bg-black text-white rounded-full"
                    type="button"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>


      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] pointer-events-none"
        />
      </div>
    </div>
  );
}
{/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-10">
{slide.title && (
  <p className="text-[18px] md:text-[22px] lg:text-[26px] font-semibold uppercase tracking-wide"
    style={{
      fontFamily: "'Playfair Display'",
    }}
  >
    {slide.title}
  </p>
)}
{slide.description && (
  <p className="text-[20px] md:text-[36px] lg:text-[48px] font-bold leading-snug mt-3 "
    style={{
      fontFamily: "'Playfair Display'",
    }}>
    {slide.description}
  </p>
)}
{slide.buttonContent && (
  <Link to={slide.link} className="mt-5">
    <button className="border border-white px-6 py-3 text-[14px] md:text-[16px] uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300">
      {slide.buttonContent}
    </button>
  </Link>
)}
</div> */}