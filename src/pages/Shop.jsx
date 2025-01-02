import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdStar } from "react-icons/md";
import MultiRangeSlider from "multi-range-slider-react";
import { AiOutlineBars } from "react-icons/ai";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle, IoStarOutline } from "react-icons/io5";
import { array, number } from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import { FaStar } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { EventCard } from "@/components/EventCard";

const sortMethods = [
  {
    id: 1,
    name: "Sort By Popularity",
    parameter: "rating",
  },
  {
    id: 2,
    name: "Price(Low to High)",
    parameter: "price",
  },
  {
    id: 3,
    name: "Price(High to Low)",
    parameter: "price",
  },
  {
    id: 4,
    name: "A to Z",
    parameter: "name",
  },
  {
    id: 5,
    name: "Z to A",
    parameter: "name",
  },
];

const Shop = () => {
  const {
    filterCategories,
    setFilterCategories,
    filterSubCategories,
    setFilterSubCategories,
    filterColor,
    setFilterColor,
  } = useContext(AppContext);

  const {
    wishlistedProducts,
    setWishlistedProducts,
    handleAddToWishlist,
    setCartCount,
    minValue,
    set_minValue,
    maxValue,
    set_maxValue,
    maxPrice,
    setMaxPrice,
    Products,
    handleRemoveWishlist,
    buyNow,
    setBuyNow,
    setProductPageId,
  } = useContext(MainAppContext);
  const [page, setPage] = useState(0);
  const [isCard, setIsCard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState(1);
  const [banners, setBanners] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  // const [Products, setProducts] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { category, subcategory } = useParams();

  const { SetIsMobileFilterOpen, currency, wishlist } = useContext(AppContext);
  const handleInput = (e) => {
    set_minValue(Number(e.minValue));
    set_maxValue(Number(e.maxValue));
  };
  const [categories, setCategories] = useState([]);
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
  useEffect(() => {
    window.scrollTo(0, 0);
    getAllCategories();
    getAllBanners();
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    setSortedArray(Products);
    const maxPrice = Products.reduce((max, product) => {
      return product.price > max ? product.price : max;
    }, 0);
    setMaxPrice(Number(maxPrice));
    set_maxValue(Number(maxPrice));

    console.log(category, subcategory);
    setFilterCategories(category ? category.toLowerCase() : "all");
    setFilterSubCategories(subcategory ? subcategory.toLowerCase() : "all");
    setWishlistedProducts(wishlist);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [category, subcategory, Products]);

  useEffect(() => {
    setFilterCategories(category ? category.toLowerCase() : "all");
    setFilterSubCategories(subcategory ? subcategory.toLowerCase() : "all");
  }, [category, subcategory]);

  const sortProducts = (method) => {
    switch (method) {
      case "2":
        return [...Products].sort((a, b) => a.price - b.price);
      case "3":
        return [...Products].sort((a, b) => b.price - a.price);
      case "4":
        return [...Products].sort((a, b) => a.title.localeCompare(b.title));
      case "5":
        return [...Products].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return [...Products].sort(
          (a, b) => Number(b.avgRating) - Number(a.avgRating)
        );
    }
  };

  useEffect(() => {
    setSortedArray(sortProducts(sortMethod));
  }, [Products, sortMethod]);

  const Stars = ({ stars }) => {
    const ratingStars = Array.from({ length: 5 }, (elem, index) => {
      return (
        <div key={index}>
          {stars >= index + 1 ? (
            <FaStar className=" dark:text-yellow-400 text-black" />
          ) : (
            <IoStarOutline className=" text-black dark:text-yellow-400 " />
          )}
        </div>
      );
    });
    return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
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

  return (
    <div className="bg-[#0E0F13] lg:pt-16 pt-0">
      <div className="bg-[#0E0F13]">
        {loading ? (
          <div className=" w-full flex items-center justify-center py-3">
            <img
              src="/Images/loader.svg"
              alt="loading..."
              className=" object-contain w-[60px] h-[60px]"
            />
          </div>
        ) : (
          <section className="bg-[#0E0F13] px-[3%] w-full pb-14 flex gap-10 pt-12 lg:pt-12 ">

            {/* <div className=" hidden lg:block w-[23%] h-full border-[2px] p-2.5 border-[#E5E5E5] dark:border-gray-700 ">
              <p className="  border-b-[1px] py-2.5 border-[#E5E5E5]  dark:text-gray-400 text-white font-[700] plus-jakarta text-[13px] md:text-[14.5px] 2xl:text-[16px] ">
                CATEGORIES
              </p>

              {categories?.map((i, index) => {
                return (
                  <div key={index}>
                    {i?.subcategories ? (
                      <Menu>
                        <Menu.Button
                          className={`w-full justify-between capitalize cursor-pointer flex items-center border-b-[1px] py-2.5 border-[#E5E5E5] ${
                            i?.fileName?.toLowerCase() === filterCategories
                              ? "text-[#F9BA48] font-bold plus-jakarta"
                              : "text-white dark:text-gray-400"
                          } font-[400] text-[13px] md:text-[14px] 2xl:text-[16px] `}
                        >
                          {i.fileName}
                          <ChevronDownIcon className=" w-[15px]" />
                        </Menu.Button>
                        <Menu.Items className="   flex flex-col  text-[13px] md:text-[13px] 2xl:text-[16px]  dark:text-gray-600 bg-white pl-2 gap-2 w-full ">
                          {i?.subcategories?.map((e, index) => {
                            return (
                              <Link
                                autoFocus="off"
                                to={`/shop/${i?.fileName}/${e?.name}`}
                                onClick={() => {
                                  SetIsMenuOpen(false);
                                }}
                                key={index}
                              >
                                <p
                                  className={`w-full capitalize cursor-pointer flex items-center border-b-[1px] py-2.5 border-[#E5E5E5] ${
                                    i?.fileName?.toLowerCase() ===
                                    filterCategories
                                      ? "text-[#F9BA48] font-bold plus-jakarta"
                                      : "text-[#363F4D] dark:text-gray-400"
                                  } font-[400] text-[12px] md:text-[13px] 2xl:text-[15px] `}
                                  key={index}
                                >
                                  {e?.name}
                                </p>
                              </Link>
                            );
                          })}
                        </Menu.Items>
                      </Menu>
                    ) : (
                      <Link
                        to={`/shop/${i?.fileName}/all`}
                        onClick={() => {
                          setFilterCategories(i?.fileName?.toLowerCase());
                        }}
                        className={`w-full capitalize cursor-pointer flex items-center border-b-[1px] py-2.5 border-[#E5E5E5] ${
                          i?.fileName?.toLowerCase() === filterCategories
                            ? "text-[#F9BA48] font-bold plus-jakarta"
                            : "text-[#363F4D] dark:text-gray-400"
                        } font-[400] text-[13px] md:text-[14px] 2xl:text-[16px] `}
                      >
                        {i?.fileName}
                      </Link>
                    )}
                  </div>
                );
              })}
              <div className=" bg-[#E5E5E5] p-3 ">
                <p className="  border-b-[1px] pt-2.5 border-[#E5E5E5] text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[14.5px] 2xl:text-[16px] ">
                  FILTER BY PRICE
                </p>
                <MultiRangeSlider
                  min={0}
                  max={maxPrice}
                  step={5}
                  label="false"
                  ruler="false"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                  barInnerColor="#F9BA48"
                  barRightColor="#000"
                  barLeftColor="#000"
                  thumbLeftColor="#F9BA48"
                  thumbRightColor="#F9BA48"
                  minValue={minValue}
                  maxValue={maxValue}
                  onInput={(e) => {
                    handleInput(e);
                  }}
                />
                <p className="  border-b-[1px] border-[#E5E5E5] text-[#363F4D] font-[700] plus-jakarta text-[12.5px] md:text-[14px] 2xl:text-[15px] ">
                  Price: {currency}{" "}
                  {currency === "OMR" ? minValue * 0.1 : minValue} - {currency}{" "}
                  {currency === "OMR" ? maxValue * 0.1 : maxValue}
                </p>
              </div>

              <button
                onClick={() => {
                  setFilterColor("");
                  setFilterCategories("");
                  set_minValue(0);
                  set_maxValue(maxPrice);
                }}
                className=" my-2 bg-gray-600 text-white text-sm px-4 py-2 "
              >
                {" "}
                Clear Filters
              </button>
            </div> */}
            <div className="w-full lg:w-full h-full">
              <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%]  mt-5 ">
                <div className=" flex flex-col items-center col-span-4">
                  <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] plus-jakarta font-[700] text-white dark:text-gray-400 ">
                    All Events
                  </p>
                  <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] dark:text-gray-400 ">
                    Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
                    eiusmo tempor incididunt ut labore
                  </p>
                </div>
              </div>
              <div className=" w-full flex lg:grid grid-cols-3 gap-2 items-center justify-between pt-8">

                {/* <div className=" w-full hidden lg:flex gap-2 items-center">
                  <HiMiniSquares2X2
                    onClick={() => {
                      setIsCard(true);
                    }}
                    className={` text-[19px] cursor-pointer ${
                      isCard && "text-[#F9BA48]"
                    } `}
                  />
                  <AiOutlineBars
                    onClick={() => {
                      setIsCard(false);
                    }}
                    className={` text-[19px] cursor-pointer pointer ${
                      !isCard && "text-[#F9BA48]"
                    } `}
                  />
                </div> */}
                <div className=" flex items-center pr-3 py-2.5 text-[#7A7A7A] font-[400] text-[12px] md:text-[13.5px] 2xl:text-[14px] ">
                  <label htmlFor="sort-method" className="text-white px-2">Sort By: </label>
                  <select
                    name="sort-method"
                    id="sort-method"
                    className="text-[14px] p-2 bg-transparent border border-gray-700   "
                    value={sortMethod}
                    onChange={(e) => {
                      setSortMethod(e.target.value);
                    }}
                  >
                    {sortMethods.map((e, index) => {
                      return (
                        <option
                          className=" p-2 bg-black "
                          key={index}
                          value={e.id}
                        >
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <p
                  onClick={() => {
                    SetIsMobileFilterOpen(true);
                  }}
                  className=" lg:hidden underline text-sm cursor-pointer "
                >
                  Filters
                </p>
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
                  <div className="w-full grid-cols-2 sm:grid-cols-3 grid lg:grid-cols-4 gap-5 pt-12">
                    {sortedArray
                      .filter((product) => {
                        console.log(product);
                        const isPriceInRange =
                          Number(product.price) > minValue &&
                          Number(product.price) < maxValue;
                        const matchesCategory =
                          filterCategories === "all" ||
                          product?.mainCategory?.some(
                            (cat) =>
                              cat.toLowerCase() ===
                              filterCategories.toLowerCase()
                          );

                        const matchesSubCategory =
                          filterSubCategories === "all" ||
                          product?.subCategory?.some(
                            (cat) =>
                              cat.toLowerCase() ===
                              filterSubCategories.toLowerCase()
                          );

                        return (
                          product?.approved &&
                          isPriceInRange &&
                          matchesCategory &&
                          (filterSubCategories === "all" || matchesSubCategory)
                        );
                      })
                      ?.slice(0, itemsPerPage)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`relative ${isCard
                            ? "flex flex-col items-center justify-between"
                            : "col-span-2 gap-3 flex border border-gray-300 dark:border-gray-700 rounded-md p-3"
                            } shadow shadow-black/30`}
                        >                          
                          <EventCard event={item}  key={item._id}/>
                        </div>
                      ))}
                  </div>
                  {sortedArray?.filter((e) => {
                    const isPriceInRange =
                      Number(e.price) > minValue && Number(e.price) < maxValue;
                    const matchesCategory =
                      filterCategories === "all" ||
                      e?.mainCategory?.some(
                        (cat) =>
                          cat.toLowerCase() === filterCategories.toLowerCase()
                      );

                    const matchesSubCategory =
                      filterSubCategories === "all" ||
                      e?.subCategory?.some(
                        (cat) =>
                          cat.toLowerCase() ===
                          filterSubCategories.toLowerCase()
                      );

                    return (
                      e?.approved &&
                      isPriceInRange &&
                      matchesCategory &&
                      matchesSubCategory
                    );
                  })?.length > itemsPerPage ? (
                    <div
                      onClick={() => setItemsPerPage((prev) => prev + 8)}
                      className="p-3 cursor-pointer border-t bg-gray-200 text-gray-700 font-semibold border-b border-gray-300 my-2 flex items-center justify-center gap-3"
                    >
                      See More
                    </div>
                  ) : (
                    <p className="mt-10 text-center">
                      No More Events Available
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Shop;
