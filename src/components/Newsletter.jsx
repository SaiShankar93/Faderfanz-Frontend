import React, { useState } from "react";
// import PartnersSlider from "./PartnersSlider";
import axios from "axios";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/subscribe", { email });
      toast.success(response.data.message);
      setEmail("");
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  };

  return (
    <>
      <div className=" dark:text-gray-400 dark:bg-black w-full pb-7 md:pb-14 flex flex-col items-center justify-center ">
        <p className=" text-[12.2px] md:text-[13.5px] text-[#929292] dark:text-gray-400">
          Special Ofers For Subscribers
        </p>
        <h4 className=" text-[19px] md:text-[24px] font-[700] plus-jakarta mb-3 text-[#292929] dark:text-gray-400">
          Ten Percent Member Discount
        </h4>
        <p className=" text-[12.2px] text-center px-1 md:text-[13.7px] text-[#929292] dark:text-gray-400">
          Subscribe to our newsletters now and stay up to date with new
          collections, the latest lookbooks and exclusive offers.
        </p>
        <div className=" mt-2 border-[2px] w-[95%] md:w-[450px] flex items-center justify-between border-[#EBEBEB] p-3.5 ">
          <input
            className=" w-[65%] text-[14px] dark:bg-transparent"
            type="text"
            name="email"
            placeholder=" Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className=" border-l border-gray-400 px-3 uppercase text-[14px] font-[700] plus-jakarta"
            onClick={handleSubscribe}
          >
            SUBSCRIBE!
          </button>
        </div>
      </div>
      {/* <PartnersSlider /> */}
    </>
  );
};

export default Newsletter;
