import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { IoHeartCircle } from "react-icons/io5";
import { MainAppContext } from "@/context/MainContext";
import { AppContext } from "@/context/AppContext";

export default function Featured2({
  products,
  newProducts,
  filteredCategory,
  wishlistedProducts,
}) {
  const [screenSize, setScreenSize] = useState("");

  const {
    handleAddToWishlist,
    handleRemoveWishlist,
    productPageId,
    setProductPageId,
  } = useContext(MainAppContext);
  const { currency } = useContext(AppContext);
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) {
        setScreenSize(2);
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
    console.log(products);
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="xl:hidden">
        <Swiper
          loop={true}
          slidesPerView={screenSize}
          spaceBetween={10}
          navigation={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className=" w-full h-[350px] 2xl:h-[400px] px-[2%] pb-20 "
        >
          <>
            {products?.filter((e) => {
              if (filteredCategory === "New Arrivals") {
                return e?.approved;
              } else if (filteredCategory === "Featured") {
                return e?.approved && e.featured === true;
              } else {
                return (
                  e?.approved &&
                  (e.superCategory || e.mainCategory === filteredCategory)
                );
              }
            })?.length > 0 ? (
              <>
                {products
                  ?.filter((e) => {
                    if (filteredCategory === "New Arrivals") {
                      return e?.approved;
                    } else if (filteredCategory === "Featured") {
                      return e?.approved && e.featured === true;
                    } else {
                      return (
                        e?.approved &&
                        (e.superCategory || e.mainCategory === filteredCategory)
                      );
                    }
                  })
                  .map((pro, index) => (
                    <SwiperSlide className="" key={index}>
                      <div className=" h-full relative 2xl:flex 2xl:flex-col 2xl:items-center 2xl:justify-center w-[600px] mx-auto  border">
                        <div className=" absolute top-3  left-3  flex flex-col gap-2 ">
                          {pro?.dis && (
                            <div className="  px-2 py-0.5 text-sm bg-[#FF7004] text-white ">
                              {pro?.dis}
                            </div>
                          )}
                          {pro?.tag && (
                            <div className="  px-2 py-0.5 text-sm bg-[#007A58] text-white ">
                              {pro.tag}
                            </div>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 ">
                          {wishlistedProducts.find((i) => {
                            return i?.productId?._id === pro?._id;
                          }) ? (
                            <IoHeartCircle
                              onClick={() => {
                                handleRemoveWishlist(pro?._id);
                              }}
                              className={` cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                            />
                          ) : (
                            <IoHeartCircle
                              onClick={() => {
                                handleAddToWishlist(pro?._id);
                              }}
                              className={` cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                            />
                          )}
                        </div>

                        <Link
                          to={`/product/${pro?.title
                            ?.replace(/\//g, "")
                            .replace(/\s+/g, "-")}`}
                          onClick={() => {
                            sessionStorage.setItem(
                              "productPageId",
                              JSON.stringify(pro?._id)
                            );
                            setProductPageId(pro?._id);
                          }}
                          className=" flex items-center "
                        >
                          <img
                            className=" h-[220px] w-full lg:h-[250px] xl:h-[310px] "
                            src={pro.mainImage}
                            alt="product-img"
                          />
                        </Link>
                        <p className=" text-center text-[15px]  font-[500] plus-jakarta mt-2 mb-1">
                          {pro.title?.slice(0, 25)}
                        </p>
                        <div className=" text-sm flex items-center justify-center">
                          {pro?.discountValue > 0 &&
                            pro?.discountValue !== null ? (
                            <>
                              <p className="font-[600] plus-jakarta dark:text-gray-400 text-[#A4A4A4]">
                                {currency}{" "}
                                <span className="line-through">
                                  {currency === "OMR"
                                    ? (pro.price * 0.1).toFixed(2)
                                    : pro.price}
                                </span>
                              </p>
                              <p className=" ml-1 font-[600] plus-jakarta dark:text-gray-400 text-[#000]">
                                <span>
                                  {currency === "OMR"
                                    ? (pro.discountValue * 0.1).toFixed(2)
                                    : pro.discountValue.toFixed(2)}
                                </span>
                              </p>
                            </>
                          ) : (
                            <p className=" text-center">
                              {currency}{" "}
                              {currency === "OMR"
                                ? (pro.price * 0.1).toFixed(2)
                                : pro.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </>
            ) : (
              <p className=" text-center text-xs w-full sm:text-sm">
                No products available in this category
              </p>
            )}
          </>
        </Swiper>
      </div>
      <div className="hidden xl:block ">
        <Swiper
          loop={true}
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className=" w-full h-full p-[1%] "
        >
          <>
            {newProducts.map((item1, index) => {
              return (
                <SwiperSlide
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "10px",
                    justifyItems: "start",
                    gridTemplateRows: "repeat(2, auto)",
                  }}
                  className=" px-[2%] grid grid-cols-5 items-start grid-rows-2 "
                  key={index}
                >
                  {item1?.filter((e) => {
                    if (filteredCategory === "New Arrivals") {
                      return e?.approved;
                    } else if (filteredCategory === "Featured") {
                      return e?.approved && e.featured === true;
                    } else {
                      return (
                        e?.approved &&
                        (e.superCategory === filteredCategory ||
                          e.mainCategory === filteredCategory)
                      );
                    }
                  })?.length > 0 ? (
                    <>
                      {item1
                        ?.filter((e) => {
                          if (filteredCategory === "New Arrivals") {
                            return e?.approved;
                          } else if (filteredCategory === "Featured") {
                            return e?.approved && e.featured === true;
                          } else {
                            return (
                              e?.approved &&
                              (e.superCategory ||
                                e.mainCategory === filteredCategory)
                            );
                          }
                        })
                        .map((pro, index) => (
                          <div
                            key={index}
                            className=" relative col-span-1 2xl:flex 2xl:flex-col 2xl:items-center 2xl:justify-center  w-full border "
                          >
                            <div className=" absolute top-3  left-3  flex flex-col gap-2 ">
                              {pro?.dis && (
                                <div className="  px-2 py-0.5 text-sm bg-[#FF7004] text-white ">
                                  {pro?.dis}
                                </div>
                              )}
                              {pro?.tag && (
                                <div className="  px-2 py-0.5 text-sm bg-[#007A58] text-white ">
                                  {pro.tag}
                                </div>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 ">
                              {wishlistedProducts.find((i) => {
                                return i?.productId?._id === pro?._id;
                              }) ? (
                                <IoHeartCircle
                                  onClick={() => {
                                    handleRemoveWishlist(pro?._id);
                                  }}
                                  className={` cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                                />
                              ) : (
                                <IoHeartCircle
                                  onClick={() => {
                                    handleAddToWishlist(pro?._id);
                                  }}
                                  className={` cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                                />
                              )}
                            </div>

                            <Link
                              to={`/product/${pro?.title
                                ?.replace(/\//g, "")
                                .replace(/\s+/g, "-")}`}
                              onClick={() => {
                                sessionStorage.setItem(
                                  "productPageId",
                                  JSON.stringify(pro?._id)
                                );
                                setProductPageId(pro?._id);
                              }}
                              className=" flex items-center "
                            >
                              <img
                                className=" h-[220px] w-full lg:h-[250px] xl:h-[310px] "
                                src={pro.mainImage}
                                alt="product-img"
                              />
                            </Link>
                            <p className=" text-center text-[15px]  font-[500] plus-jakarta mt-2 mb-1 pb-2">
                              {pro.title?.slice(0, 25)}
                            </p>
                            <div className=" text-sm flex items-center justify-center pb-3">
                              {pro?.discountValue > 0 &&
                                pro?.discountValue !== null ? (
                                <>
                                  <p className="font-[600] plus-jakarta plus-jakarta dark:text-gray-400 text-[#A4A4A4]">
                                    {currency}{" "}
                                    <span className="line-through">
                                      {currency === "OMR"
                                        ? (pro.price * 0.1).toFixed(2)
                                        : pro.price}
                                    </span>
                                  </p>
                                  <p className=" ml-1 font-[600] plus-jakarta plus-jakarta dark:text-gray-400 text-[#000]">
                                    <span>
                                      {currency === "OMR"
                                        ? (pro.discountValue * 0.1).toFixed(2)
                                        : pro.discountValue.toFixed(2)}
                                    </span>
                                  </p>
                                </>
                              ) : (
                                <p className=" text-center">
                                  {currency}{" "}
                                  {currency === "OMR"
                                    ? (pro.price * 0.1).toFixed(2)
                                    : pro.price}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div className=" flex items-center justify-center  py-3 w-full col-span-5">
                      <p className=" text-center text-xs w-full sm:text-sm">
                        No products available in this category
                      </p>
                    </div>
                  )}
                </SwiperSlide>
              );
            })}
          </>
        </Swiper>
      </div>
    </div>
  );
}
