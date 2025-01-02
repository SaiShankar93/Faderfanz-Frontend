import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export default function CategorySlider({ data }) {
  const icons = [
    { icon: "/logos/1.svg", text: "Book Shelf", param: "light&sofa" },
    { icon: "/logos/2.svg", text: "Light & Sofa", param: "Bookshelf" },
    { icon: "/logos/3.svg", text: "Reading Table", param: "ReadingTable" },
    { icon: "/logos/4.svg", text: "Corner Table", param: "cornerTable" },
    { icon: "/logos/5.svg", text: "Office Chair", param: "officeChair" },
    { icon: "/logos/6.svg", text: "Bed", param: "bed" },
    { icon: "/logos/7.svg", text: "Temple", param: "temple" },
  ];
  const [screenSize, setScreenSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const { isDarkMode } = useContext(MainAppContext);

  useEffect(() => {
    console.log(data);
    const resultArray = data.flatMap((obj) => obj?.subcategories);
    setSubCategory(resultArray);
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) {
        setScreenSize(3);
      } else if (width >= 600 && width < 1024) {
        setScreenSize(4);
      } else if (width >= 1024 && width < 1180) {
        setScreenSize(5);
      } else {
        setScreenSize(6);
      }
    }

    // Add event listener to listen for resize events
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the initial screen size
    handleResize();

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
        spaceBetween={30}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="  w-full h-[100px] my-4 md:h-[230px] 2xl:h-[280px] px-[15%] md:px-[8%] "
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <Link
              onClick={() => {
                setSelectedCategory(index);
              }}
              to={`/shop/${item?.fileName}/all`}
            >
              <div
                className={` relative flex items-end justify-center w-[70px] h-[70px] md:w-[150px] md:h-[150px] ${
                  isDarkMode ? "dark" : ""
                }  rotateCircle cursor-pointer `}
              >
                <img
                  className={`  w-full h-full  dark:invert scale-[0.7] md:scale-[0.5] object-contain `}
                  src={item?.logoLink}
                  // src={"/Images/3.png.png"}
                  alt="iocns"
                />
                <span className=" absolute text-[6px] md:text-xs mb-1.5 md:mb-4 font-medium ">
                  {item?.fileName}
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
        {subCategory.map((item, index) => (
          <SwiperSlide key={index}>
            <Link
              onClick={() => {
                setSelectedCategory(index);
              }}
              to={`/shop/${item?.name}`}
            >
              <div
                className={` relative flex items-end justify-center w-[70px] h-[70px] md:w-[150px] md:h-[150px]  ${
                  isDarkMode ? "dark" : ""
                } rotateCircle cursor-pointer `}
              >
                <img
                  className={`  w-full h-full  dark:invert scale-[0.7] md:scale-[0.5] object-contain `}
                  src={item?.subLogoLink}
                  // src={"/Images/3.png.png"}
                  alt="iocns"
                />
                <span className=" absolute text-[6px] md:text-xs mb-1.5 md:mb-4 font-medium ">
                  {item?.name}
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
