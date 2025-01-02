import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import { lightGreen } from "@mui/material/colors";

// const CartData = [
//   {
//     id: 1,
//     image: "/Images/pan.png",
//     name: "Cillum dolore tortor nisl fermentum",
//     price: "29.00",
//     quantity: 1,
//   },
//   {
//     id: 1,
//     image: "/Images/pan.png",
//     name: "Cillum dolore tortor nisl fermentum",
//     price: "29.00",
//     quantity: 1,
//   },
//   {
//     id: 1,
//     image: "/Images/pan.png",
//     name: "Cillum dolore tortor nisl fermentum",
//     price: "29.00",
//     quantity: 1,
//   },
//   {
//     id: 1,
//     image: "/Images/pan.png",
//     name: "Cillum dolore tortor nisl fermentum",
//     price: "29.00",
//     quantity: 1,
//   },
// ];

const Cart = () => {
  const { currency, isCartOpen, SetIsCartOpen, cartTotal, setCartTotal } =
    useContext(AppContext);
  const { setCartCount } = useContext(MainAppContext);
  const [coupon, setCoupon] = useState("");
  const [couponName, setCouponName] = useState("");
  const [total, setTotal] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [cart, setCart] = useState([]);
  const server_url = import.meta.env.VITE_SERVER_URL;
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (window.innerWidth < 960) {
      SetIsCartOpen(true);
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    if (userLoggedIn == true) {
      getCart(user._id);
    } else {
      var tempCart = JSON.parse(localStorage.getItem("cart")) || [];
      // // // console.log(tempCart);
      setCartCount(tempCart?.length);
      setCart(tempCart || []);
      // if (cart?.length > 0) {
      const total1 = tempCart?.reduce(
        (acc, obj) => acc + obj.updatedPrice * obj.quantity,
        0
      );
      console.log(total1);
      setTotal(total1);
    }
  }, [userLoggedIn]);

  useEffect(() => {
    if (window.innerWidth < 960) {
      SetIsCartOpen(true);
      navigate("/");
      return;
    }
    getCoupon();
  }, [cart]);

  const getCart = async (userId) => {
    if (userLoggedIn) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/cart/${userDetails?._id || userId
          }`
        );
        console.log(response.data);
        setCart(response.data.cart.products);
        setCartCount(
          response.data.cart.products?.length !== 0
            ? response.data.cart.products?.length
            : 0
        );
        // // console.log(response.data.cart.products);
        if (response.data.cart.products?.length > 0) {
          const total1 = response.data.cart.products.reduce(
            (acc, obj) => acc + obj?.updatedPrice * obj.quantity,
            0
          );
          setTotal(total1);
          if (response.data.cart.couponDiscountedTotal != 0) {
            setDiscountAmt(total1 - response.data.cart.couponDiscountedTotal);
          }
        }
        // Handle success response, if needed
      } catch (error) {
        console.error("Error Fetching Cart", error);
      }
    }
  };

  const addToCart = async (userId, productId, quantity) => {
    // // // console.log(quantity);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/cart/addProduct`,
        {
          userId: userId,
          productId: productId,
          quantity: quantity,
        }
      );
      // // // console.log(response.data.cart);
      getCart(userId);
      toast.success("Product Added to Cart");
      // Handle success response, if needed
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
      // Handle error
    }
  };

  const decreaseQuantityOfProduct = async (userId, productId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/cart/decreaseQuantity`,
        {
          userId: userId,
          productId: productId,
        }
      );
      // // // console.log(response.data.cart);
      getCart(userId);
      toast.success("Product quantity decreased");
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
      toast.error("Failed to decrease product quantity");
    }
  };

  const removeProduct = async (userId, productId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/cart/removeProduct`,
        {
          userId: userId,
          productId: productId,
        }
      );
      // // // console.log(response.data.cart);
      getCart(userId);
      toast.success("Product Removed from Cart");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Failed to remove product from cart");
    }
  };

  const applyCoupon = async () => {
    const userId = userDetails._id;
    try {
      // if (discountAmt !== 0) {
      //   return toast("Other Coupon Already Applied.");
      // }
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/cart/applyCoupon`,
        {
          userId: userId,
          couponCode: coupon,
          total,
        }
      );
      // setCoupon(response.data?.coupon);
      if (response.data?.coupon?.discountType === "percentage") {
        const total1 =
          parseFloat(
            cart?.reduce(
              (acc, obj) => acc + obj?.updatedPrice * obj.quantity,
              0
            ) * response.data?.coupon?.discountAmount
          ) / 100;
        const total2 = parseFloat(
          cart?.reduce(
            (acc, obj) => acc + obj?.updatedPrice * obj.quantity,
            0
          ) *
          (response.data?.coupon?.discountAmount * 0.01)
        );
        // // // console.log(total1);
        // setTotal(total1);
        // console.log("6");
        setDiscountAmt(total2);
      } else if (response.data?.coupon?.discountType === "fixed") {
        // const total1 =
        //   cart?.reduce(
        //     (acc, obj) => acc + obj?.updatedPrice * obj.quantity,
        //     0
        //   ) - response.data?.coupon?.discountAmount;
        // // // console.log(total1);
        // setTotal(total1);
        // console.log("7");
        setDiscountAmt(response.data?.coupon?.discountAmount);
      }
      toast.success(response.data.message);
      getCoupon();
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      toast.error(error.response.data.error);
    }
  };

  const removeCoupon = async () => {
    try {
      const userId = userDetails._id;
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/cart/removeCoupon/${userId}`
      );
      toast.success(response.data.message);
      setDiscountAmt(0);
      getCoupon();
    } catch (err) {
      console.log(err);
      toast.error("Error removing coupon");
    }
  };

  const getCoupon = async () => {
    try {
      const userId = userDetails._id;
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/cart/getCoupon/${userId}`
      );
      console.log(response.data.coupon);
      setCouponName(response.data.coupon.code);
    } catch (err) {
      setCouponName(null);
    }
  };

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));

  //   const total1 = cart.reduce(
  //     (acc, obj) => acc + obj.productId.price * obj.quantity,
  //     0
  //   );
  //   setTotal(total1);
  //   getCart(user?._id);
  // }, [cart, total]);

  return (
    <>
      <div className=" ">
        <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]  dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600  flex items-center justify-between ">
          <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            Cart
          </h2>
          <div className=" flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px] ">
            <Link to="/">
              <span className=" uppercase text-[#FF7004] cursor-pointer ">
                Home
              </span>
            </Link>
            <span className=" px-1 ">/</span>
            <span className=" uppercase">Cart</span>
          </div>
        </div>
        {cart?.length !== 0 ? (
          <section className=" px-[2%] xl:px-[8%] mt-4 md:mt-14 ">
            <div className="w-full xl:px-[8%] flex items-center justify-center">
              <table className=" w-full xl:w-[90%] hidden md:table">
                <thead className="w-full">
                  <tr className="w-full text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#F2F2F2]">
                    <th className="py-2">Image</th>
                    <th className="py-2">Product</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Discounted Price</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Remove</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {cart?.map((item, index) => {
                    return (
                      <tr key={index} className="">
                        <td className="flex items-center justify-center">
                          {/* {// // console.log(item.productId?.mainImage)} */}
                          <img
                            className="h-[100px] md:h-[90px] 2xl:w-[110px] object-cover mt-1"
                            src={
                              item.productId?.mainImage.startsWith(server_url)
                                ? item.productId?.mainImage
                                : `${server_url}/${item.productId?.mainImage.replace(
                                  /\\/g,
                                  "/"
                                )}`
                            }
                            alt="product-img"
                          />
                        </td>
                        <td className="text-center max-w-[100px]">
                          {item.productId?.title?.slice(0, 50)}
                        </td>
                        <td className="text-center">
                          {item?.productId?.price}
                        </td>
                        <td className="text-center">{item?.updatedPrice}</td>
                        <td className="">
                          <div className=" w-full flex justify-center">
                            <span
                              onClick={() => {
                                if (userLoggedIn) {
                                  decreaseQuantityOfProduct(
                                    userDetails._id,
                                    item?.productId?._id
                                  );
                                } else {
                                  toast("You are not logged in");
                                }
                              }}
                              className=" px-3 text-[23px] cursor-pointer bg-gray-300 dark:hover:text-black hover:bg-gray-400 "
                            >
                              -
                            </span>
                            <input
                              className="text-center w-[40px] dark:bg-transparent bg-gray-300"
                              type="number"
                              value={item.quantity ? item.quantity : 1}
                              onChange={(e) => {
                                addToCart(
                                  userDetails._id,
                                  item.productId._id,
                                  1
                                );
                              }}
                            />
                            <span
                              onClick={() => {
                                if (userLoggedIn) {
                                  addToCart(
                                    userDetails._id,
                                    item.productId._id,
                                    1
                                  );
                                } else {
                                  toast("You are not logged in");
                                }
                              }}
                              className=" px-3 text-[23px] cursor-pointer bg-gray-300 dark:hover:text-black hover:bg-gray-400 "
                            >
                              +
                            </span>
                          </div>
                        </td>
                        <td className="text-center">
                          {parseFloat(item?.updatedPrice) *
                            (item?.quantity ? item?.quantity : 1) ||
                            item?.productId?.price * item?.quantity}
                        </td>
                        <td className="text-center pl-8 cursor-pointer">
                          <MdOutlineDelete
                            onClick={() => {
                              // const newArray = cart.filter(
                              //   (obj) =>
                              //     obj.productId?._id !== item.productId?._id
                              // );
                              // setCart(newArray);
                              if (userLoggedIn) {
                                removeProduct(
                                  userDetails._id,
                                  item?.productId?._id
                                );
                                return;
                              } else {
                                var tempCart =
                                  JSON.parse(localStorage.getItem("cart")) ||
                                  [];
                                // // // console.log(tempCart);
                                var newTempCart = tempCart?.filter((i) => {
                                  return (
                                    i?.productId?._id !== item?.productId?._id
                                  );
                                });
                                setCartCount(newTempCart?.length);
                                // // // console.log(newTempCart);
                                setCart(newTempCart);
                                if (tempCart?.length > 0) {
                                  const total1 = tempCart?.reduce(
                                    (acc, obj) =>
                                      acc + obj.productId?.price * obj.quantity,
                                    0
                                  );
                                  setTotal(total1);
                                  // console.log("9");
                                  setCartTotal(total1);
                                }
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(newTempCart)
                                );
                                // // // console.log(
                                //   JSON.parse(localStorage.getItem("cart"))
                                // );
                                return toast.success(
                                  "Product removed from Cart"
                                );
                              }
                              // toast.error("Product Removed from Wishlist");
                            }}
                            className="text-[22px]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className=" flex flex-col md:hidden">
                {cart?.products?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" w-[100%] grid grid-cols-4 gap-2 p-1 mb-2.5 bg-gray-300 dark:bg-black "
                    >
                      <img
                        className=" inline-block col-span-1 h-full md:h-[120px]  2xl:w-[150px] object-cover "
                        src={item.image}
                        alt="product-img"
                      />
                      <div className=" col-span-3 flex flex-col text-[13px] ">
                        <p className=" font-semibold">{item.name}</p>
                        <p className=" font-bold plus-jakarta">
                          {currency}{" "}
                          {currency === "OMR"
                            ? (item?.price * 0.1).toFixed(2)
                            : item?.price}
                        </p>
                        <p className="">
                          <input
                            className=" w-[40px] dark:bg-transparent "
                            type="number"
                            value={item.quantity}
                            onChange={() => {
                              // // console.log(item.quantity);
                            }}
                          />
                        </p>
                        <p className=" mt-2 cursor-pointer ">Remove</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:px-[8%] flex flex-col md:grid grid-cols-2 gap-10 m-3 md:m-8 mb-14 ">
              <div>
                <div className=" flex flex-col">
                  <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mb-3 ">
                    Calculate Shipping
                  </h4>
                  <div className=" flex flex-col md:flex-row md:items-center gap-3">
                    <select
                      className=" dark:bg-transparent w-[240px] 2xl:w-[300px] border-[1px] border-[#999999] p-2 text-[#7A7A7A] text-[13px] md:text-[14px]"
                    // value=""
                    // onChange={() => {}}
                    >
                      <option>Dubai</option>
                    </select>
                    <select
                      className=" dark:bg-transparent w-[240px] 2xl:w-[300px] border-[1px] border-[#999999] p-2 text-[#7A7A7A] text-[13px] md:text-[14px]"
                    // value=""
                    // onChange={() => {}}
                    >
                      <option>United Arab Emirates</option>
                    </select>
                  </div>
                  <div className=" mt-3 ">
                    <input
                      type="number"
                      className=" dark:bg-transparent w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] p-2 text-[#7A7A7A] text-[13px] md:text-[14px]"
                      placeholder="Postcode / Zip"
                    />
                    <button className=" bg-[#363F4D] px-4 py-2.5 font-medium uppercase text-[11px] md:text-[13px] text-white ">
                      Estimate
                    </button>
                  </div>
                </div>
                <div className=" flex flex-col">
                  <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D]  dark:text-gray-400 underline underline-offset-3 mt-6 mb-1.5 ">
                    Discount Coupon Code
                  </h4>
                  <div className=" mt-3 ">
                    <input
                      type="text"
                      className=" dark:bg-transparent w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] p-2 text-[#7A7A7A] text-[13px] md:text-[14px]"
                      placeholder="Coupon Code"
                      value={!coupon ? "" : coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                      }}
                    />
                    <button
                      className=" bg-[#363F4D] px-4 py-2.5 font-medium uppercase text-[11.2px] md:text-[13px] text-white "
                      onClick={() => {
                        if (userLoggedIn == true) {
                          applyCoupon();
                        } else {
                          toast("You are not logged in");
                        }
                      }}
                    >
                      Apply Code
                    </button>
                    {/* {couponName && (
                      <div className="mt-3 flex items-center bg-gray-100 rounded p-2">
                        <span className="text-gray-700 text-sm md:text-base">
                          {couponName}
                        </span>
                        <button
                          className="ml-2 text-red-600 font-bold text-lg focus:outline-none hover:text-red-800 transition-colors"
                          onClick={removeCoupon}
                        >
                          &times;
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>

              <div>
                <div className=" flex flex-col p-5 justify-center bg-[#F2F2F2] dark:bg-transparent">
                  <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mt-6 mb-5 ">
                    Cart Summary
                  </h4>
                  <div className=" flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl text-[13px]:md:text-[14px] ">
                    <p>Sub Total</p>
                    <p>
                      {currency}{" "}
                      {currency === "OMR" ? (total * 0.1).toFixed(2) : total}
                    </p>
                  </div>
                  {discountAmt !== 0 && (
                    <div className=" flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl text-[13px]:md:text-[14px] ">
                      <p>Coupon Discount </p>
                      <p>
                        {currency} -
                        {currency === "OMR"
                          ? (discountAmt * 0.1).toFixed(2)
                          : discountAmt?.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {couponName && (
                    <div className=" flex items-center justify-between font-[400] plus-jakarta tetx-[#363F4D] text-[13px] 2xl text-[13px]:md:text-[13px]">
                      <span className="items-center">
                        Coupon Code: {couponName}
                      </span>
                      <button
                        className="ml-2 text-red-600 font-bold text-lg focus:outline-none hover:text-red-800 transition-colors"
                        onClick={removeCoupon}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                  {/* {cart?.length > 0 && (
                    <div className=" flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl text-[13px]:md:text-[14px] ">
                      <p>Shipping Cost</p>
                      <p>
                        {" "}
                        {currency}{" "}
                        {currency === "OMR" ? (25 * 0.1).toFixed(2) : 25.0}
                      </p>
                    </div>
                  )} */}
                  <div className=" mt-3 py-1 border-t-[1px] border-[#999999] flex items-center justify-between font-[700] plus-jakarta text-[13px] md:text-[16px] 2xl:text-[18px]">
                    <p>Grand Total</p>
                    <p>
                      {currency}{" "}
                      {currency === "OMR"
                        ? parseFloat(total - discountAmt * 0.1).toFixed(2)
                        : total - discountAmt}
                    </p>
                  </div>
                </div>
                <div className=" flex items-center justify-around mt-3 ">
                  <Link to="/shop/all/all">
                    <button className=" px-4 py-2.5 font-medium uppercase text-[11.2px] md:text-[13px] border-[1.4px] border-[#999999] text-[#7A7A7A] ">
                      Update Cart
                    </button>
                  </Link>

                  {/* <Link to="/checkout"> */}
                  <button
                    onClick={() => {
                      if (userLoggedIn == true) {
                        return navigate("/checkout");
                      } else {
                        toast.success("Please Login to continue...");
                        return navigate("/login");
                      }
                    }}
                    className=" bg-[#363F4D]  border-[1.4px] border-[#363F4D] px-4 py-2.5 font-medium uppercase text-[11.2px] md:text-[13px] text-white "
                  >
                    Checkout
                  </button>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className=" flex flex-col w-full items-center justify-center py-10">
            <p className=" text-sm font-semibold text-gray-600 ">
              No Items in Cart
            </p>
            <Link to="/shop" className=" underline text-orange-600">
              Contine Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
