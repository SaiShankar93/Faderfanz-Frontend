import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import { phoneCode } from "@/utilities/Currency";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import CryptoJS from "crypto-js";

const Checkout = () => {
  const navigate = useNavigate();
  const { currency, cartTotal, orders, setOrders } = useContext(AppContext);
  const { buyNow, setBuyNow } = useContext(MainAppContext);
  const [isTnCAccepted, setIsTnCAccepted] = useState(false);
  const [phoneCode1, setPhoneCode1] = useState("+971");
  const [paymentMode, setPaymentMode] = useState("");
  const [cart, setCart] = useState([]);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comapnyName: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    trnNo: 0
  });
  const {
    firstName,
    lastName,
    email,
    phone,
    comapnyName,
    addressLine2,
    country,
    city,
    state,
    zipCode,
    trnNo,
  } = userDetails;
  const addressLine1 = userDetails.address;
  const onChange = (e) =>
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isVerify, setIsVerify] = useState(false);
  const [VerCode, setVerCode] = useState();
  const [loading, setLoading] = useState(false);
  const [hideVerifyButton, setHideVerifyButton] = useState(false);
  const [discount, setDiscount] = useState(0);
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   // console.log(cartTotal);
  //   const total1 = cart.reduce((acc, obj) => acc + obj.price * 1, 0);
  //   setTotal(total1);
  // }, []);

  const customerId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))?._id
    : null;

  // // console.log(cart);

  const handleStripeCheckout = async () => {
    setLoading(true);
    const public_key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    const stripe = await loadStripe(public_key);
    const userDetailsUpdated = {
      ...userDetails,
      customerId: customerId,
      phone: phoneCode1 + phone,
    };
    lightGreen(userDetailsUpdated);
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/stripe-checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: cart,
          customer: userDetailsUpdated,
          totalAmount: total,
        }),
      }
    );

    const session = await response.json();

    // Redirect to Stripe Checkout page
    setLoading(false);
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error redirecting to Stripe Checkout:", result.error);
      // Handle error
    }
  };

  const handleIPGCheckout = (
    userDetails,
    customerId,
    phoneCode1,
    phone,
    total
  ) => {
    console.log(userDetails, customerId, phoneCode1, phone, total, cart);
    const userDetailsUpdated = {
      ...userDetails,
      customerId: customerId,
      phone: phoneCode1 + phone,
      total: total,
    };

    const searchParams = new URLSearchParams(userDetailsUpdated).toString();

    navigate(`/checkoutipg?${searchParams}`);
  };

  const sendOtp = async () => {
    try {
      console.log(userDetails);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/order/sendOtp`,
        { email: userDetails.email }
      );
      console.log(response.data);
      toast.success(response.data);
      setIsVerify(true);
      setHideVerifyButton(true);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/order/verifyOtp`,
        { email: userDetails.email, otp: VerCode }
      );
      console.log(response.data);
      toast.success(response.data);
      setIsVerify(false);
    } catch (error) {
      console.error("Error:", error.message);
      toast.success("Please try again");
    }
  };

  const searchParam = useLocation();
  const param = new URLSearchParams(searchParam?.search).get("param");
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    getCart(user?._id);
  }, []);

  const getCart = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/cart/${userDetails?._id || userId}`
      );
      const cart = response.data.cart;
      const cartProducts = cart.products;
      setCart(cartProducts);

      if (param?.toLowerCase() === "buynow" && buyNow?.length === 0) {
        return navigate(-1);
      } else if (cartProducts.length === 0) {
        return navigate(-1);
      }

      if (cartProducts.length > 0) {
        const total1 = cartProducts.reduce((acc, obj) => {
          const price = obj.updatedPrice ? obj.updatedPrice : obj?.updatedPrice;
          return acc + Number(price) * Number(obj.quantity);
        }, 0);

        setSubTotal(total1);
        let total;
        if (cart.couponDiscountedTotal !== 0) {
          total = cart.couponDiscountedTotal;
          const discount = total1 - cart.couponDiscountedTotal;
          setDiscount(discount);
        } else {
          total = total1;
        }
        setTotal(total);
      }
    } catch (error) {
      console.error("Error Fetching Cart", error);
    }
  };

  return (
    <div className=" w-full">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]    dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
          Checkout
        </h2>
        <div className=" flex items-center font-[500] plus-jakarta plus-jakarta text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">Checkout</span>
        </div>
      </div>

      <div className=" md:px-[2%] xl:px-[8%] flex flex-col items-center lg:grid grid-cols-2 md:m-8 mb-14 ">
        <div className=" m-8 md:m-0 ">
          <div className=" flex flex-col ">
            <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mb-1.5 ">
              Billing Address
            </h4>

            <div className=" flex flex-col sm:grid grid-cols-2 sm:gap-10 xl:gap-[13%] md:mt-6 ">
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="first-name"
                >
                  First Name*
                </label>
                <input
                  name="firstName"
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="First Name"
                />
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="last-name"
                >
                  Last Name*
                </label>
                <input
                  name="lastName"
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2  ga2 md:mt-6 ">
              <div className=" flex-col flex mr-2">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="email"
                >
                  Email Address*
                </label>
                <div className=" flex w-full items-center justify-between border-[1.4px] border-[#999999] ">
                  <input
                    name="email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    className=" w-full  dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                    placeholder="Email"
                  />
                  {hideVerifyButton == false && (
                    <button
                      onClick={() => {
                        sendOtp();
                      }}
                      className=" h-full px-1 bg-gray-300 text-xs font-semibold"
                    >
                      Verify
                    </button>
                  )}
                </div>
                {isVerify && (
                  <div className=" flex w-full items-center justify-between mt-2 border-[1.4px] border-[#999999] ">
                    <input
                      name="number"
                      id="passwoed"
                      type="text"
                      value={VerCode}
                      onChange={(e) => {
                        setVerCode(e.target.value);
                      }}
                      className=" w-full md:w-[240px] 2xl:w-[300px] dark:bg-transparent    mt-1 p-2 text-[#7A7A7A] text-[14.4px]"
                      placeholder="Verification Code"
                    />
                    <button
                      className=" h-full px-1 bg-gray-300 text-xs font-semibold"
                      onClick={() => {
                        verifyOtp();
                      }}
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="phone"
                >
                  Phone no*
                </label>
                <div className=" flex items-center border-[1.4px] border-[#999999]">
                  <select
                    value={phoneCode1}
                    onChange={(e) => {
                      setPhoneCode1(e.target.value);
                    }}
                    className=" w-[60px] h-full"
                  >
                    {phoneCode?.map((code, index) => {
                      return (
                        <option key={index} value={code?.dial_code}>
                          {code?.dial_code}
                        </option>
                      );
                    })}
                  </select>
                  <input
                    name="phone"
                    id="phone"
                    type="number"
                    value={phone}
                    onChange={onChange}
                    className=" w-full md:w-[240px] 2xl:w-[300px] ] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                    placeholder="Phone No."
                  />
                </div>
              </div>
            </div>

            <div className=" grid grid-cols-2 md:mt-6 ">
              <div className=" w-full col-span-2">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="email"
                >
                  Company Name (optional)
                </label>
                <input
                  name="comapnyName"
                  id="Company-Name"
                  type="text"
                  value={comapnyName}
                  onChange={onChange}
                  className=" w-[100%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Company Name"
                />
              </div>
              <div className=" w-full col-span-2">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="email"
                >
                  TRN Number (optional)
                </label>
                <input
                  name="trn"
                  id="trn"
                  type="text"
                  value={trnNo}
                  onChange={onChange}
                  className=" w-[100%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="TRN Number"
                />
              </div>
            </div>

            <div className=" grid grid-cols-2 gap-4 md:gap-y-10 xl:gap-y-[13%] mt-3 md:mt-6 mb-1 ">
              <div className=" w-full col-span-2 ">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="Address"
                >
                  Address*
                </label>
                <input
                  name="addressLine1"
                  id="Address"
                  type="text"
                  value={addressLine1}
                  onChange={onChange}
                  className=" w-[100%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Address line 1"
                />
              </div>
              <div className=" col-span-2">
                <input
                  name="addressLine2"
                  id="Address-line-2"
                  type="text"
                  value={addressLine2}
                  onChange={onChange}
                  className=" w-[100%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Address line 2"
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2 gap-10 xl:gap-[13%] md:mt-10 ">
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="Country"
                >
                  Country*
                </label>
                <input
                  name="country"
                  id="Country"
                  type="text"
                  value={country}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Country"
                />
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="city"
                >
                  Town/City*
                </label>
                <input
                  name="city"
                  id="city"
                  type="text"
                  value={city}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Town/City"
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2 gap-10 xl:gap-[13%] md:mt-6 ">
              <div className=" flex flex-col">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="State"
                >
                  State*
                </label>
                <input
                  name="state"
                  id="State"
                  type="text"
                  value={state}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State"
                />
              </div>
              <div className=" flex flex-col">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="Zip-Code"
                >
                  Zip Code*
                </label>
                <input
                  name="zipCode"
                  id="Zip-Code"
                  type="number"
                  value={zipCode}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Zip Code"
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2 gap-10 xl:gap-[13%] mt-6 ">
              <div className=" flex items-center gap-2 ">
                <input
                  name="State*"
                  id="State*"
                  type="checkbox"
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State*"
                />
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="State*"
                >
                  Create an Acount?
                </label>
              </div>
              <div className=" flex items-center gap-2 ">
                <input
                  name="State*"
                  id="State*"
                  type="checkbox"
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State*"
                />
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="State*"
                >
                  Ship to Different Address{" "}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className=" w-full px-[5%] sm:px-[8%] flex flex-col justify-between  sm:m-8 md:mb-14 ">
          <div className=" ">
            <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mb-1.5 ">
              Cart Total
            </h4>
            <div className=" flex flex-col p-5 bg-[#F2F2F2] dark:bg-white/5">
              <div className=" flex items-center justify-between text-[14px] md:text-[16px] 2xl:text-[18px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 mt-6 mb-5 ">
                <p>Product</p>
                <p>Total</p>
              </div>
              {param?.toLowerCase() === "buynow" ? (
                <>
                  {buyNow?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className=" flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl:text-[14.4px] "
                      >
                        <p className=" text-[#7A7A7A] font-[600] plus-jakarta">
                          {item?.productId.title?.slice(0, 50)}
                        </p>
                        <p className=" text-[#363F4D] dark:text-gray-400 text-[600]">
                          {item.quantity} x {currency}
                          {currency === "OMR"
                            ? (item.updatedPrice * 1 * 0.1).toFixed(2)
                            : item.updatedPrice * 1}
                        </p>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {cart?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className=" flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl:text-[14.4px] "
                      >
                        <p className=" text-[#7A7A7A] font-[600] plus-jakarta">
                          {item?.productId?.title?.slice(0, 50)}
                        </p>
                        <p className="text-[#363F4D] dark:text-gray-400 text-[600]">
                          {item.quantity} x {currency}
                          {item.updatedPrice
                            ? currency === "OMR"
                              ? (item.updatedPrice * 1 * 0.1).toFixed(2)
                              : item.updatedPrice * 1
                            : currency === "OMR"
                              ? (item.updatedPrice * 1 * 0.1).toFixed(2)
                              : item.updatedPrice * 1}
                        </p>
                      </div>
                    );
                  })}
                </>
              )}
              <div className=" mt-3 py-1 border-t-[1px] border-[#999999] dark:bg-transparent flex items-center justify-between font-[700] plus-jakarta text-[12.4px] md:text-[13px] 2xl:text-[14px]">
                <p>Sub Total</p>
                <p>{subTotal}</p>
              </div>
              <div className=" mt-3 py-1 border-t-[1px] border-[#999999] dark:bg-transparent flex items-center justify-between font-[700] plus-jakarta text-[12.4px] md:text-[13px] 2xl:text-[14px]">
                <p>Discount</p>
                <p>{currency} -{discount}</p>
              </div>
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
                  {/* {currency} {total + 25.0} */}
                  {currency}{" "}
                  {currency === "OMR"
                    ? parseFloat(total * 0.1).toFixed(2)
                    : total}
                </p>
              </div>
            </div>
          </div>

          <div className="  mt-4">
            <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400     underline underline-offset-3 mt-4 md:m-0 mb-1.5 ">
              Payment Method
            </h4>
            <div className=" flex flex-col p-5 bg-[#F2F2F2] dark:bg-white/5">
              <div className=" flex items-center gap-2 ">
                <input
                  name="State*"
                  id="State*"
                  type="radio"
                  value={"card"}
                  onClick={(e) => {
                    setPaymentMode(e.target.value);
                  }}
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State*"
                />
                <label
                  className=" text-[#363F4D] dark:text-gray-400 font-[400] text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="State*"
                >
                  Pay with Credit/Debit card
                </label>
              </div>
              <div className=" flex items-center gap-2 ">
                <input
                  name="State*"
                  id="State*"
                  type="radio"
                  value={"installment"}
                  onClick={(e) => {
                    setPaymentMode(e.target.value);
                  }}
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State*"
                />
                <label
                  className=" text-[#363F4D] dark:text-gray-400 font-[400] text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="State*"
                >
                  Pay in 4 installments
                </label>
              </div>
              <div className=" flex items-center gap-2 ">
                <input
                  name="State*"
                  id="State*"
                  type="checkbox"
                  checked={isTnCAccepted}
                  onChange={() => {
                    setIsTnCAccepted(!isTnCAccepted);
                  }}
                  className=" border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State*"
                />
                <label
                  className=" text-[#7A7A7A] font-[400] text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="State*"
                >
                  I’ve read and accept the terms & conditions
                </label>
              </div>
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
              <button
                disabled={
                  !isTnCAccepted ||
                  paymentMode === "" ||
                  paymentMode === "installment"
                }
                className=" bg-[#363F4D] disabled:bg-gray-400 disabled:border-gray-400  border-[1.4px] border-[#363F4D] px-4 py-2.5 font-medium uppercase text-[13px] text-white mt-6 "
                onClick={() => {
                  // console.log(cart);
                  setOrders(cart);
                  handleIPGCheckout(
                    userDetails,
                    customerId,
                    phoneCode1,
                    phone,
                    total
                  );
                }}
              >
                Place order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
