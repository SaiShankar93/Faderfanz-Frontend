import React, { useContext, useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import NewsSlider from "../components/NewsSlider";
import CategorySlider from "../components/CategorySlider";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle } from "react-icons/io5";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import Featured from "@/components/Featured";
import { TiTick, TiWorld } from "react-icons/ti";
import { BsBellFill, BsClock } from "react-icons/bs";

const Process = [
  {
    number: "01",
    text: "First, a conversation sparks off the magic",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
  {
    number: "02",
    text: "Next, co-creation begins, with a site visit.",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
  {
    number: "03",
    text: "Finally the dream comes alive.",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
];
const feature = [
  {
    icon: <TiWorld className=" text-[19px] " />,
    text: "FREE SHIPPING",
    describe: "Order Above AED 1500",
  },
  {
    icon: <TiTick className=" text-[19px] " />,
    text: "FREE ASSEMBLY",
    describe: "On all orders",
  },
  {
    icon: <BsBellFill className=" text-[20px] " />,
    text: "WARRANTY",
    describe: "one year Warranty",
  },
  {
    icon: <BsClock className=" text-[19px] " />,
    text: "SECURE PAYMENTS",
    describe: "Safe, Fast & Secure",
  },
];
const news = [
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "Lorem ipsum dolor sit amet, consectetur adipi elit, sed.",
  },
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "do eiusmod tempor incididu ut labore et dolore magna",
  },
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "do eiusmod tempor incididu ut labore et dolore magna.",
  },
];

const Home = () => {
  const { currency, wishlist, setWishlist } = useContext(AppContext);

  const [filteredCategory, setFilteredCategory] = useState("New Arrivals");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const { wishlistedProducts, handleAddToWishlist, handleRemoveWishlist } =
    useContext(MainAppContext);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const getAllBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/banner`
      );
      setBanners(response.data?.banners);
      // // // console.log(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      console.log(response.data.categories);
      setCategories(response.data?.categories);
      // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getAllProducts();
    getAllBanners();
    getAllCategories();
    // setWishlistedProducts(wishlist);
  }, []);

  return (
    <section className="off-white w-full dark:bg-black dark:text-white">
      <HeroSlider />
      {/* <div className=" relative text-white w-full h-fit md:h-[530px] flex flex-col items-center justify-center ">
        <img
          className=" w-full h-full object-fill md:object-cover"
          src="/main/mainBanner.svg"
          alt="slide-Image"
        /> */}

      {/* <div className=" absolute flex flex-col">
          <p className=" text-[15px] md:text-[17px] 2xl-text-[20px] uppercase text-left ">
            New Arrivals
          </p>
          <p className=" text-[20px] md:text-[40px] 2xl-text-[48px] w-[70%] leading-10 mt-1 mb-4 font-[700] plus-jakarta text-left -ml-1 ">
            Corporis nulla luxurious bedroom
          </p> 
          <button className="  font-semibold  w-fit px-4 py-2 uppercase text-[11px] md:text-[13px]">
            Shop Now
          </button> */}
      {/* </div> */}
      {/* </div> */}
      <CategorySlider data={categories} />
      <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 px-[8%] mb-10">
        {categories
          ?.filter((i) => {
            return i?.selected === true;
          })
          .slice(0, 6)
          ?.map((item, index) => {
            return (
              <Link to={`/shop/${item?.fileName}/all`} key={index}>
                <div className=" pl-5 md:pl-10">
                  <div className=" relative">
                    <p
                      style={{ writingMode: "vertical-rl" }}
                      className=" absolute -left-5 md:-left-8 rotate-180 font-bold plus-jakarta text-[10px] md:text-3xl capitalize flex items-center justify-center"
                    >
                      {item?.fileName}
                    </p>
                    <img
                      className=" object-fill h-[100px] lg:h-[350px] "
                      src={item?.imageLink}
                      alt={item.param}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="w-full flex items-center flex-wrap justify-center px-[8%] mb-10">
        {feature.map((item, index) => {
          return (
            <div
              key={index}
              className=" text-gray-700 relative flex items-center  w-[230px] gap-3 border border-gray-500 p-2 px-3"
            >
              <div className=" border border-gray-700 rounded-full p-1.5">
                {item.icon}
              </div>
              <div className=" flex flex-col">
                <p className="  font-semibold text-xs md:text-[13px]  capitalize ">
                  {item.text}
                </p>
                <p className="  text-[12.5px]  capitalize ">{item.describe}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className=" w-full grid grid-cols-1 md:grid-cols-4 px-[8%]">
        {backgrounds.map((background, index) => {
          return (
            <div
              key={index}
              className={` ${index === 1 ? "col-span-2" : "col-span-1"}`}
            >
              {background.link ? (
                <Link to={background.link}>
                  <div
                    className={` w-full relative ${
                      index === 1 ? "col-span-2" : "col-span-1"
                    } ${background.extraClass}`}
                  >
                    <img
                      className={`h-[300px]  ${
                        index === 1 ? "col-span-2" : "col-span-1"
                      } w-full 2xl:h-[360px]`}
                      src={background.image}
                      alt="card-img"
                    />
                    <div
                      className={` absolute top-0 left-0 text-white w-full h-full flex flex-col pt-7 pl-4  ${background.extraClass} `}
                    >
                      <p className=" text-[13.5px] 2xl:text-[14px]">
                        {background.text}
                      </p>
                      <p className=" text-[20px] 2xl:text-[24px] mt-1.5 mb-2">
                        {background.describe}
                      </p>
                      <p className=" w-[20%] bg-white h-[2px] rounded-full mb-4 "></p>
                      <p className=" text-[12px] 2xl:text-[14px]">
                        {background.sale}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className={` w-full relative ${background.extraClass}`}>
                  <img
                    className="h-[300px] w-full 2xl:h-[360px]"
                    src={background.image}
                    alt="card-img"
                  />
                  <div
                    className={` absolute top-0 left-0 text-white w-full h-full flex flex-col pt-7 pl-4  ${background.extraClass} `}
                  >
                    <p className=" text-[13.5px] 2xl:text-[14px]">
                      {background.text}
                    </p>
                    <p className=" text-[20px] 2xl:text-[24px] mt-1.5 mb-2">
                      {background.describe}
                    </p>
                    <p className=" w-[20%] bg-white h-[2px] rounded-full mb-4 "></p>
                    <p className=" text-[12px] 2xl:text-[14px]">
                      {background.sale}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div> */}
      {/* <a href="intent://arvr.google.com/scene-viewer/1.0?file=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;">
        Avocado
      </a>
      <a href="intent://arvr.google.com/scene-viewer/1.0?file=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;">
        Avocado
      </a>
      ;
      <model-viewer
        ar
        ar-modes="scene-viewer webxr quick-look"
        alt=" A 3D model of an astronaut."
        src="/3dmodel.usdz"
      ></model-viewer> */}
      <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
        <div className=" flex flex-col items-center col-span-4">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            Our Products
          </p>
          <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400 ">
            Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
            eiusmo tempor incididunt ut labore
          </p>
          <div className=" flex items-center flex-wrap justify-center gap-2 md:gap-6 font-[600] plus-jakarta text-[#474747] dark:text-gray-400 text-[13px] md:text-[17px] ">
            {/* <span
              className={`cursor-pointer ${
                filteredCategory === "discount" && "text-[#FF7004]"
              }`}
              onClick={() => {
                setFilteredCategory("discount");
              }}
            >
              Discount
            </span> */}
            <span
              className={`cursor-pointer ${filteredCategory === "New Arrivals" && "text-[#FF7004]"
                }`}
              onClick={() => {
                setFilteredCategory("New Arrivals");
              }}
            >
              New Arrivals
            </span>
            <span
              className={`cursor-pointer ${filteredCategory === "Featured" && "text-[#FF7004]"
                }`}
              onClick={() => {
                setFilteredCategory("Featured");
              }}
            >
              Featured
            </span>
            <span
              className={`cursor-pointer ${filteredCategory === "Best Sellers" && "text-[#FF7004]"
                }`}
              onClick={() => {
                setFilteredCategory("Best Sellers");
              }}
            >
              Best Sellers
            </span>
            <span
              className={`cursor-pointer ${filteredCategory === "Sale Items" && "text-[#FF7004]"
                } `}
              onClick={() => {
                setFilteredCategory("Sale Items");
              }}
            >
              Sale Items
            </span>
            <span
              className={`${filteredCategory === "On Sales" && "text-[#FF7004]"
                } cursor-pointer`}
              onClick={() => {
                setFilteredCategory("On Sales");
              }}
            >
              On Sales
            </span>
          </div>
          {/* <div className=" w-full py-1 flex items-center justify-end px-[4%] xl:px-[8%] ">
            <Link
              to={`/shop/${filteredCategory}`}
              className=" text-sm font-semibold text-gray-500 flex items-center justify-end w-full"
            >
              See More <MdArrowRight className=" text-[19px]" />
            </Link>
          </div> */}
        </div>
        {/*  */}
        {/* 
        {filteredProducts
          ?.filter((e) => {
            return (
              e?.approved &&
              (e.superCategory || e.mainCategory === filteredCategory)
            );
          })
          .slice(0, 8)?.length > 0 ? (
          <>
            {filteredProducts
              ?.filter((e) => {
                return (
                  e?.approved &&
                  (e.superCategory || e.mainCategory === filteredCategory)
                );
              })
              .slice(0, 8)
              .map((pro, index) => (
                <div
                  key={index}
                  className=" relative 2xl:flex 2xl:flex-col 2xl:items-center 2xl:justify-center w-fit mx-auto "
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
                    to={`/product/${pro?._id}`}
                    className=" flex items-center "
                  >
                    <img
                      className=" h-[220px] w-full lg:h-[250px] xl:h-[310px] "
                      src={pro.mainImage}
                      alt="product-img"
                    />
                  </Link>
                  <p className=" text-center  font-[500] mt-2 mb-1">
                    {pro.title}
                  </p>
                  <p className=" text-sm md:text-base text-center">
                    {pro.currency} {pro.price}
                  </p>
                </div>
              ))}
          </>
        ) : (
          <p className=" text-center text-xs w-full sm:text-sm">
            No products available in this category
          </p>
        )} */}
      </div>
      <div className="w-full col-span-4">
        <Featured2
          products={
            filteredCategory === "New Arrivals"
              ? [...filteredProducts]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
              : filteredProducts?.slice(0, 5)
          }
          filteredCategory={filteredCategory}
          wishlistedProducts={wishlistedProducts}
        />
        <Featured
          products={
            filteredCategory === "New Arrivals"
              ? [...filteredProducts].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )
              : filteredProducts
          }
          filteredCategory={filteredCategory}
          wishlistedProducts={wishlistedProducts}
        />
      </div>
      <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-2 ">
        <div className=" flex flex-col items-center py-10 col-span-4">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[35px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            The Process
          </p>
          <p className=" text-[#474747] text-center text-[13px] md:text-[14px] 2xl:text-[15px] md:w-[40%] mb-4 dark:text-gray-400 ">
            Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
            eiusmo tempor incididunt ut labore
          </p>
          <div className=" grid grid-cols-1 gap-5 md:grid-cols-3">
            {Process.map((item, index) => {
              return (
                <div
                  key={index}
                  className=" text-gray-700 relative flex flex-col items-center  gap-3 p-2 px-3"
                >
                  <p className="  text-[30px] plus-jakarta md:text-[59px] font-bold plus-jakarta text-[#212121] dark:text-gray-400  capitalize ">
                    {item.number}
                  </p>
                  <p className="  font-semibold  text-[15.6px] md:h-[60px] text-center md:text-[17.5px] text-[#212121] dark:text-gray-400 capitalize ">
                    {item.text}
                  </p>
                  <p className="  text-[12.4px] md:text-[13.4px] font-medium text-[#474747] dark:text-gray-400 text-center capitalize ">
                    {item.describe}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-20 px-[8%] py-4 ">
        <img
          className=" col-span-1 w-full "
          src={`${
            banners[3]?.filePath ? banners[3]?.filePath : "/Images/banner1.png"
          }`}
          alt="banner-img"
        />
        <img
          className=" col-span-1 w-full "
          src={`${
            banners[4]?.filePath ? banners[4]?.filePath : "/Images/banner2.png"
          }`}
          alt="banner-img"
        />
      </div> */}
      <div className=" relative text-white overflow-x-hidden w-full h-[300px] md:h-[530px] flex flex-col items-center justify-center ">
        <img
          className=" w-full h-full object-cover"
          src={`${!banners[2]?.filePath
            ? banners[2]?.filePath
            : "/main/mainBanner2.svg"
            }`}
          // src="/main/mainBanner2.svg"
          alt="slide-Image"
        />

        <div className=" absolute flex flex-col items-center justify-center gap-20 bg-black/50 w-full h-full top-0 left-0">
          <p className=" playball text-[15px] md:text-[17px] 2xl-text-[30px] scale-[1.5] 2xl:scale-[3] uppercase text-left ">
            Discover Our
          </p>
          <p className=" uppercase poppins text-[20px] md:text-[40px] font-semibold 2xl-text-[500px] scale-[2] 2xl:scale-[3.5] ">
            CATALOGUE
          </p>
          <div className=" w-full flex items-center justify-around ">
            <button className="  font-semibold underline  w-fit px-4 py-2 uppercase text-[11px] md:text-xl">
              View Catalogue 1
            </button>
            <button className="  font-semibold underline  w-fit px-4 py-2 uppercase text-[11px] md:text-xl">
              View Catalogue 2
            </button>
            <button className="  font-semibold underline  w-fit px-4 py-2 uppercase text-[11px] md:text-xl">
              View Catalogue 3
            </button>
          </div>
        </div>
      </div>
      <div className="dark:text-gray-400 flex flex-col items-center col-span-4 mt-10">
        <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400">
          Latest News
        </p>
        <p className=" dark:text-gray-400 text-[#474747] w-[90%] md:w-[50%] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 ">
          Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo
          tempor incididunt ut labore eiusmo tempor incididunt ut labore
        </p>
      </div>
      <NewsSlider />
      <div className=" relative text-white w-full h-[150px] md:h-[250px] px-[4%] md:px-[12%] flex flex-col items-center justify-center ">
        {/* <img
          className=" w-full h-full object-contain"
          src={`${banners[3]?.filePath
            ? banners[3]?.filePath
            : "/main/mainBanner3.svg"
            }`}
          alt="slide-Image"
        /> */}
      </div>
    </section>
  );
};

export default Home;
