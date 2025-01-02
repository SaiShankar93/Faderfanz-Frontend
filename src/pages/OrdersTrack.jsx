import { IoClose } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useRef, useState } from "react";
import { IoCloseOutline, IoStar, IoStarOutline } from "react-icons/io5";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { MainAppContext } from "@/context/MainContext";

const sliderStyles = {
  color: "green",
  "& .MuiSliderThumb": {
    backgroundColor: "red",
  },
  "& .MuiSliderRail": {
    backgroundColor: "blue",
  },
  "& .MuiSliderTrac": {
    backgroundColor: "lightgray",
  },
};
const ordersTrack = ({ order, status, deliveryDate, createdAt }) => {
  const { isOrdersTrackForm, setIsOrdersTrackForm, currency } =
    useContext(AppContext);
  const { setProductPageId } = useContext(MainAppContext);

  function closeModal() {
    setIsOrdersTrackForm(false);
  }
  const marks = [
    {
      value: 0,
      label: "Order received",
    },
    {
      value: 25,
      label: "Inprogress",
    },
    {
      value: 50,
      label: "Quality check",
    },
    {
      value: 75,
      label: "Out for delivery",
    },
    {
      value: 100,
      label: "Order delivered",
    },
  ];

  function valuetext(value) {
    return `${value}°C`;
  }

  return (
    <>
      <div className="  fixed inset-0 w-full min-h-[100vh] flex items-center justify-center bg-black/30 overflow-hidden z-40 ">
        <div
          onClick={() => {
            setIsOrdersTrackForm(false);
          }}
          className="w-full h-full z-40"
        ></div>
        <div className="w-full absolute z-50  max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all pb-10 ">
          <h3
            as="h3"
            className="text-lg mb-4 flex items-center justify-between font-medium leading-6 text-gray-900"
          >
            Track Your Order
            <IoCloseOutline
              className=" text-[23px] cursor-pointer"
              onClick={() => {
                setIsOrdersTrackForm(false);
              }}
            />
          </h3>
          <Link
            className="flex items-center"
            to={`/product/${order?.title}`}
            onClick={() => {
              sessionStorage.setItem(
                "productPageId",
                JSON.stringify(order?.product._id)
              );
              setProductPageId(order?.product._id);
            }}
          >
            <div className="flex flex-col">
              <p className="text-[#000] flex flex-col lg:flex-row text-[15px] md:text-[16.5px] 2xl:text-[18px] font-bold plus-jakarta">
                {order.product.title}
                <span className=" lg:ml-2 text-xs sm:text-sm font-semibold bg-green-200 text-green-800 text-center py-1 w-fit px-3 ">
                  <p>{status}</p>
                </span>
              </p>
              <div className="flex items-center gap-2">
                <p className="text-[#000] text-[15px] md:text-[16.5px] 2xl:text-[18px]">
                  <span className="text-xs sm:text-sm font-medium">
                    Quantity:
                  </span>{" "}
                  <b>{order.quantity}</b>
                </p>
                {/* <p className="text-[#000] text-[15px] md:text-[14px] 2xl:text-[14px] capitalize">
                      <span className="text-xs sm:text-sm font-medium capitalize">Color:</span> {order.color}
                    </p>
                    <p className="text-[#000] text-[15px] md:text-[14px] 2xl:text-[14px]">
                      <span className="text-xs sm:text-sm font-medium capitalize">Rating:</span> {order.rating}
                    </p> */}
              </div>
              <p className="text-[#000] text-[15px] md:text-[16.5px] 2xl:text-[16px] font-semibold">
                <span className="text-xs sm:text-sm font-medium">Total:</span>{" "}
                {currency}{" "}
                {currency === "OMR"
                  ? (order.product.price * 0.1).toFixed(2)
                  : order.product.price}
              </p>
              <p className="text-[#000] text-[15px] md:text-[16.5px] 2xl:text-[16px] font-semibold">
                <span className="text-xs sm:text-sm font-medium">
                  Order Date:
                </span>{" "}
                {createdAt.split("T")[0]}
              </p>
              <p className="text-[#000] text-[15px] md:text-[16.5px] 2xl:text-[16px] font-semibold">
                <span className="text-xs sm:text-sm font-medium">
                  {" "}
                  Expected Delivery Date:
                </span>{" "}
                {deliveryDate ? (
                  deliveryDate
                ) : (
                  <span className=" text-sm">Will be Updated Soon</span>
                )}
              </p>
            </div>
          </Link>
          <div className=" flex items-center justify-center w-full">
            <Box sx={{ width: 450 }}>
              <Slider
                style={sliderStyles}
                aria-label="Custom marks"
                value={
                  status === "orderReceived"
                    ? 0
                    : status === "inprogress"
                    ? 25
                    : status === "pending"
                    ? 50
                    : status === "outForDelivery"
                    ? 75
                    : status === "orderDelivered"
                    ? 100
                    : 0
                }
                getAriaValueText={valuetext}
                step={25}
                valueLabelDisplay="auto"
                marks={marks}
                disabled
              />
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default ordersTrack;
