import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Tooltip } from "@material-tailwind/react";

export default function AttributeSlider({
  data,
  setPrice,
  setMaxPrice,
  setMinPrice,
  SetActiveImage,
  selectedAttribute,
  setSelectedAttributes,
  SetViewMaterialImg,
  SetMaterialImage,
}) {
  const icons = [
    { icon: "/Images/microsoft.png", text: "Book Shelf" },
    { icon: "/Images/google.png", text: "Light & Sofa" },
    { icon: "/Images/microsoft.png", text: "Reading Table" },
    { icon: "/Images/google.png", text: "Corner Table" },
    { icon: "/Images/cisco.png", text: "Office Chair" },
    { icon: "/Images/cisco.png", text: "Office Chair" },
  ];
  const [screenSize, setScreenSize] = useState("");

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) {
        setScreenSize(3);
      } else if (width >= 600 && width < 1024) {
        setScreenSize(4);
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
      {/* <div className="grid grid-cols-8 gap-3 px-[0%] dark:bg-black">
        {data?.values?.map((attr, index) => (
          <div
            key={index}
            onClick={() => {
              if (Number(attr?.price) !== 0) {
                setPrice(Number(attr?.price));
                setMaxPrice(0);
                setMinPrice(0);
              }

              const existingAttribute = selectedAttribute.find(
                (attribute) => attribute.type === attr.type
              );

              if (existingAttribute) {
                const newArr = selectedAttribute.filter((i) => {
                  return i?.type !== attr?.type;
                });
                setSelectedAttributes([...newArr, attr]);
                console.log([...newArr, attr]);
              } else {
                setSelectedAttributes([...selectedAttribute, attr]);
                console.log([...newArr, attr]);
              }
            }}
            className={`h-full text-[12.3px] md:text-[13.6px] 2xl:text-[15px] ${selectedAttribute?.find((i) => i.value === attr.value)
              ? "bg-gray-300 text-gray-800"
              : ""
              } cursor-pointer w-fit border border-gray-300 text-gray-600 ${attr.type === "material" ? "" : "px-3 py-1"
              } text-sm ${attr?.type === "color" ? `bg-${attr.value} cursor-pointer` : ""
              } ${selectedAttribute?.find((i) => i.value === attr.value) &&
                attr?.type === ("color" || "material")
                ? "border-2 border-green-500 cursor-pointer"
                : ""
              }`}
          >
            {attr.type === "material" ? (
              <Tooltip className="z-20" content={attr?.value}>
                <img
                  src={attr?.attributeImage}
                  onClick={() => {
                    SetMaterialImage(attr?.attributeImage);
                    SetViewMaterialImg(true);
                  }}
                  alt="material-img"
                  className={`w-[40px] h-[40px] md:w-[60px] md:h-[60px] object-cover border cursor-pointer ${selectedAttribute?.find((i) => i.value === attr?.value)
                    ? "border-black"
                    : ""
                    }`}
                />
              </Tooltip>
            ) : (
              <p>{attr.value}</p>
            )}
          </div>
        ))}
      </div> */}



      <Swiper
        loop={true}
        slidesPerView={screenSize}
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 10500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className={` dark:bg-black px-[15%] `}
      >
        {data?.values?.map((attr, index) => (
          <SwiperSlide key={index}>
            <div
              key={index}
              onClick={() => {
                if (Number(attr?.price) !== 0) {
                  setPrice(Number(attr?.price));
                  setMaxPrice(0);
                  setMinPrice(0);
                }

                const existingAttribute = selectedAttribute.find(
                  (attribute) => attribute.type === attr.type
                );

                if (existingAttribute) {
                  const newArr = selectedAttribute.filter((i) => {
                    return i?.type !== attr?.type;
                  });
                  setSelectedAttributes([...newArr, attr]);
                  console.log([...newArr, attr]);
                } else {
                  setSelectedAttributes([...selectedAttribute, attr]);
                  console.log([...newArr, attr]);
                }
              }}
              className={` h-full text-[12.3px] md:text-[13.6px] 2xl:text-[15px]  ${selectedAttribute?.find((i) => i.value === attr.value)
                ? "bg-gray-300 text-gray-800"
                : ""
                }cursor-pointer w-fit border border-gray-300 text-gray-600 ${attr.type === "material" ? "" : "px-3 py-1"
                } text-sm ${attr?.type === "color" ? `bg-${attr.value} cursor-pointer ` : ""
                } ${selectedAttribute?.find((i) => i.value === attr.value) &&
                  attr?.type === ("color" || "material")
                  ? " border-2 border-green-500 cursor-pointer"
                  : ""
                } `}
            >
              {attr.type === "material" ? (
                <Tooltip className="z-20" content={attr?.value}>
                  <img
                    src={attr?.attributeImage}
                    onClick={() => {
                      SetMaterialImage(attr?.attributeImage);
                      SetViewMaterialImg(true);
                    }}
                    alt="material-img"
                    className={`w-[40px] h-[40px] md:w-[60px] md:h-[60px] object-cover border cursor-pointer  ${selectedAttribute?.find((i) => i.value === attr?.value)
                      ? " border-black"
                      : ""
                      }`}
                  />
                </Tooltip>
              ) : (
                <p>{attr.value}</p>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>




    </>
  );
}
