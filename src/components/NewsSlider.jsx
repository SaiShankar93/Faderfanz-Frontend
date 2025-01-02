import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

// Utility function to convert HTML content to plain text
const convertHtmlToText = (htmlContent) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default function NewsSlider({ blogs }) {
  const { setBlogId } = useContext(MainAppContext);
  const [screenSize, setScreenSize] = useState(3);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) {
        setScreenSize(1);
      } else if (width >= 600 && width < 1024) {
        setScreenSize(2);
      } else {
        setScreenSize(3);
      }
    }

    window.addEventListener("resize", handleResize);

    handleResize(); // Call on component mount to set initial screen size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const blogDate = (blogDate) => {
    const date = new Date(blogDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Note: Months are zero-indexed
    const year = date.getFullYear();

    // Format date as MM/DD/YYYY
    return `${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}/${year}`;
  };

  return (
    <Swiper
      loop={true}
      slidesPerView={screenSize}
      spaceBetween={30}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-full h-[550px] 2xl:h-[600px] px-[8%] pb-10"
      autoplay={{ delay: 5000 }} // Optional: Set autoplay interval
    >
      {blogs.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="flex h-full flex-col items-start">
            <img
              className="w-full h-full object-cover"
              src={slide.imageLink}
              alt="slide-Image"
            />
            <p className="text-[#FF7004] text-sm mt-2">
              {blogDate(slide.createdAt?.split("T")[0])}
            </p>
            <p className="text-[#212121] text-left text-[15px] md:text-[22px] font-[600] plus-jakarta dark:text-gray-400">
              {slide.title?.slice(0, 65)} {" ... "}
            </p>
            <p className="dark:text-gray-400 text-[#474747] text-left text-[14px] mb-2 font-[400]">
              {convertHtmlToText(slide.content)?.slice(0, 110)} {" ... "}
            </p>
            <Link
              to={`/blog/${slide?.title
                ?.replace(/\//g, "")
                .replace(/\s+/g, "-")}`}
              onClick={() => {
                sessionStorage.setItem(
                  "blogId",
                  JSON.stringify(slide?._id)
                );
                setBlogId(slide?._id);
              }}
            >
              <button className="px-4 py-2 bg-[#4D4D4D] text-sm text-white">
                Read More
              </button>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
