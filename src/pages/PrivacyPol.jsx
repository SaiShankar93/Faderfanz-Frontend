import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import parse from "html-react-parser";

const PrivacyPol = () => {
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/privacy`
        );
        const { policy } = response.data;
        setPrivacyPolicyText(policy.content);
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
        toast.error("Failed to fetch privacy policy");
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <div className=" dark:text-gray-400 ">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]   dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600   flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121]  dark:text-gray-400  ">
          Privacy Policy
        </h2>
        <div className=" flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">Privacy Policy</span>
        </div>
      </div>

      <section className=" px-[4%] md:px-[8%] mt-4 md:mt-14 mb-10 ">
        {privacyPolicyText && parse(privacyPolicyText)}
      </section>
    </div>
  );
};

export default PrivacyPol;
