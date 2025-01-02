import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "axios";

export default function PartnersSlider() {
  const icons = [
    { icon: "/Images/microsoft.png", text: "Book Shelf" },
    { icon: "/Images/google.png", text: "Light & Sofa" },
    { icon: "/Images/microsoft.png", text: "Reading Table" },
    { icon: "/Images/google.png", text: "Corner Table" },
    { icon: "/Images/cisco.png", text: "Office Chair" },
    { icon: "/Images/cisco.png", text: "Office Chair" },
  ];
  const [screenSize, setScreenSize] = useState("");
  const [partners, setPartners] = useState([]);

  const getPartners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/partners`
      );
      console.log(response.data);
      setPartners(response.data)
    } catch (error) {
      console.error("Error fetching catalogue:", error);
    }
  };

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) {
        setScreenSize(3);
      } else if (width >= 600 && width < 1024) {
        setScreenSize(4);
      } else {
        setScreenSize(5);
      }
    }

    // Add event listener to listen for resize events
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the initial screen size
    handleResize();
    getPartners()
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Swiper
        loop={true}
        slidesPerView={screenSize}
        spaceBetween={10}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination]}
        className=" dark:bg-black w-full  h-fit my-4 md:h-[100px] 2xl:h-[140px] px-[8%] pb-10 "
      >
        {partners.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              className=" scale-[0.8] lg:scale-[0.5] 2xl:scale-[0.4] "
          src={item.logo}
              alt={item.name}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
