import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";

const WishlistData = [
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
];

const WishList = () => {
  const { currency, wishlist, setWishlist } = useContext(AppContext);
  const { handleRemoveWishlist, wishlistedProducts, setProductPageId } =
    useContext(MainAppContext);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    // console.log(wishlistedProducts);
    // getWishlist(user?._id);
  }, []);
  // const getWishlist = async (userId) => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_SERVER_URL}/wishlist/${
  //         userDetails?._id || userId
  //       }`
  //     );
  //     setWishlistedProducts(response?.data?.wishlist?.products);
  //     // console.log(response.data);
  //     // Handle success response, if needed
  //   } catch (error) {
  //     console.error("Error Fetching Cart", error);
  //   }
  // };

  return (
    <>
      <div className=" ">
        <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]    dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between ">
          <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            Wishlist
          </h2>
          <div className=" flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px] ">
            <Link to="/">
              <span className=" uppercase text-[#FF7004] cursor-pointer ">
                Home
              </span>
            </Link>
            <span className=" px-1 ">/</span>
            <span className=" uppercase">Wishlist</span>
          </div>
        </div>

        <section className=" px-[2%] xl:px-[8%] mt-4 md:mt-14 mb-7 lg:mb-14 ">
          {wishlistedProducts?.length !== 0 ? (
            <div className="w-full xl:px-[8%] flex items-center justify-center">
              <table className=" w-full xl:w-[90%] hidden md:table">
                <thead className="w-full">
                  <tr className="w-full text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#F2F2F2]">
                    <th className="py-2">Image</th>
                    <th className="py-2">Product</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Remove</th>
                  </tr>
                </thead>
                {/* {// console.log(wishlistedProducts)} */}
                <tbody className="w-full">
                  {wishlistedProducts?.map((item, index) => {
                    return (
                      <tr key={index} className="">
                        <td className="flex items-center mt-1 justify-center">
                          <Link
                            key={index}
                            to={`/product/${item?.title}`}
                            onClick={() => {
                              setProductPageId(item?.productId?._id);
                            }}
                          >
                            <img
                              className="h-[70px] d:h-[90px] 2xl:w-[110px] object-cover"
                              src={`${
                                import.meta.env.VITE_SERVER_URL
                              }/${item.productId?.mainImage.replace(
                                /\\/g,
                                "/"
                              )}`}
                              alt="product-img"
                            />
                          </Link>
                        </td>
                        <td className="text-center">
                          <Link
                            key={index}
                            to={`/product/${item?.title}`}
                            onClick={() => {
                              sessionStorage.setItem(
                                "productPageId",
                                JSON.stringify(item?.productId?._id)
                              );
                              setProductPageId(item?.productId?._id);
                            }}
                          >
                            {item.productId?.title}
                          </Link>
                        </td>
                        <td className="text-center">
                          {item?.productId?.price}
                        </td>
                        {/* <td className="text-center">
                          <input
                            className="text-center w-[40px] dark:bg-transparent"
                            type="number"
                            value={item?.quantity}
                          />
                        </td> */}
                        {/* <td className="text-center">
                          {parseFloat(item?.price) * item?.quantity}
                        </td> */}
                        <td
                          onClick={() => {
                            handleRemoveWishlist(item.productId?._id);
                            // const newArray = wishlistedProducts.filter(
                            //   (obj) =>
                            //     obj?.productId?.id !== item?.productId?.id
                            // );
                            // setWishlist(newArray);
                            // setWishlistedProducts(newArray);
                            // toast.error("Product Removed from Wishlist");
                          }}
                          className="text-center cursor-pointer"
                        >
                          Remove
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className=" flex flex-col md:hidden">
                {wishlistedProducts?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" w-[100%] grid grid-cols-4 gap-2 p-1 mb-2.5 bg-gray-300 "
                    >
                      <img
                        className=" inline-block col-span-1 h-full md:h-[90px] 2xl:w-[110px] object-cover "
                        src={item?.productId?.mainImage}
                        alt="product-img"
                      />
                      <div className=" col-span-3 flex flex-col text-[13px] ">
                        <p className=" font-semibold">
                          {item?.productId?.title}
                        </p>
                        <p className=" ">
                          {item?.productId?.description?.slice(0, 10)}
                        </p>
                        <p className=" font-bold">
                          {currency}{" "}
                          {currency === "OMR"
                            ? (item.productId.price * 0.1).toFixed(2)
                            : item.productId.price}
                        </p>
                        {/* <p className="">
                          <input
                            className=" w-[40px] "
                            type="number"
                            value={item.quantity ?i}
                            onChange={() => {}}
                          />
                        </p> */}
                        <p
                          onClick={() => {
                            handleRemoveWishlist(item?.productId?._id);
                          }}
                          className=" mt-2 cursor-pointer "
                        >
                          Remove
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className=" flex flex-col w-full items-center justify-center py-10">
              <p className=" text-sm font-semibold text-gray-600 ">
                No Items in Wishlist
              </p>
              <Link to="/shop" className=" underline text-orange-600">
                Contine Shopping
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default WishList;
