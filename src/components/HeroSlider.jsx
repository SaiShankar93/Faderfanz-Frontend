import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
        // navigation={true}
        modules={[Autoplay, Pagination]}
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
      >
        {slider.map((slide, index) => (
          console.log(slide),
          <SwiperSlide key={index}>
          {
            <div className=" relative  text-white w-full h-full flex flex-col  ">
              <a href={slide.link}>
                <img
                  className="w-full h-full object-fill lg:object-cover"
                  src={slide.image}
                  alt={slide.name}
                />
              </a>
              {/* <div className=" absolute pl-7 md:pl-0 flex items-center justify-center flex-col">
                {slide.title && (
                  <p className=" text-[15px] md:text-[17px] 2xl-text-[20px] uppercase text-left ">
                    {slide.title}
                  </p>
                )}
                {slide.description && (
                  <p className=" text-[20px] md:text-[40px] 2xl-text-[48px] w-[70%] leading-10 mt-1 mb-4 font-[700] plus-jakarta text-left -ml-1 ">
                    {slide.description}
                  </p>
                )}
                {slide.description && (
                  <Link to={slide.link} className=" w-fit">
                    <button className=" border border-white w-fit px-4 py-2 uppercase text-[11px] md:text-[13px]">
                      {slide.buttonContent}
                    </button>
                  </Link>
                )}
              </div> */}
                 {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            </div>
          }
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
