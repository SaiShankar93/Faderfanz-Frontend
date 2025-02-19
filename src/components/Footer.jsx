import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Newsletter from "./Newsletter";



const Footer = () => {
  const FooterLinks = [
    {
      id: 1,
      heading: "My Account",
      list: [
        {
          id: "2.1",
          name: "Login",
          link: "/login",
        },
        {
          id: "1.1",
          name: "My account",
          link: "/profile",
        },
        {
          id: "1.1",
          name: "My Events",
          link: "/wishlist",
        },
        {
          id: "1.1",
          name: "Tickets",
          link: "/profile",
        },
        {
          id: "1.1",
          name: "Contact Us",
          link: "/contact",
        },
        {
          id: "1.1",
          name: "Privacy-policy",
          link: "/privacy-policy",
        },
      ],
    },
    {
      id: 2,
      heading: "About Us",
      list: [
        {
          id: "2.1",
          name: "About Us",
          link: "/about",
        },
        {
          id: "2.1",
          name: "Register",
          link: "/register",
        },

        {
          id: "2.2",
          name: "Booking Guide",
          link: "/about",
        },
        {
          id: "2.3",
          name: "Register as Curator",
          link: "/vendor-register",
        },
        {
          id: "2.4",
          name: "FAQs",
          link: "/faqs",
        },
        {
          id: "2.5",
          name: "Create Event",
          link: "/create-event",
        },
      ],
    },
  ];

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


  const [social, setSocial] = useState({});
  useEffect(() => {
    const getSocialMedia = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/social`
        );
        // console.log("Social media profile:", response.data.socialMedia);
        setSocial(response.data.socialMedia);
        // Handle the social media profile data as needed
      } catch (error) {
        console.error("Error getting social media profile:", error);
        // Handle error
      }
    };
    getSocialMedia();
  }, []);

  return (
    <>
      <footer className=" text-gray-400 bg-[#0E0F13] border-t dark:border-gray-400 min-h-[360px] flex flex-col justify-between pt-5 px-[8%] ">

        {/* <Newsletter /> */}

        <div className=" grid grid-cols-1 md:grid-cols-6 gap-6 ">
          <div className=" col-span-2">
            <h2 className=" text-[30px] font-semibold mb-2 ">
              Kazi Culture
            </h2>
            <p className=" mb-5 md:mb-7 text-[13.5px] text-[#929292] dark:text-gray-400 ">
              Duis autem vel eum iriure dolor in hendrerit in vulputate velit
              esse molestie consequat, vel illum dolore eu feugiat nulla
              facilisis.
            </p>
            <p className=" text-gray-400  mb-2 font-[600] plus-jakarta text-[15px] ">
              Follow Us On Social:
            </p>
            <div className=" flex items-center gap-5 mb-4 md:mb-0">
              <Link to={social?.facebook ? social?.facebook : "/"}>
                <img className=" h-[17px]  " src="/logos/l1.svg" alt="logo" />
              </Link>
              <Link to={social?.twitter ? social?.twitter : "/"}>
                <img className=" h-[17px]  " src="/logos/l2.svg" alt="logo" />
              </Link>
              <Link to={social?.instagram ? social?.instagram : "/"}>
                <img className=" h-[17px]  " src="/logos/l3.svg" alt="logo" />
              </Link>
              <Link to={social?.linkedin ? social?.linkedin : "/"}>
                <img className=" h-[17px]  " src="/logos/l4.svg" alt="logo" />
              </Link>
              <Link to={social?.youtube ? social?.youtube : "/"}>
                <img className=" h-[17px]  " src="/logos/l5.svg" alt="logo" />
              </Link>
            </div>
          </div>

          {/* <div className=" col-span-3 md:col-span-1 flex flex-col text-left ">
            <h2 className="mb-3 ml-2 font-[600] plus-jakarta dark:text-gray-400 text-[#292929] capitalize">
              Opening Time{" "}
            </h2>
            <ul className="dark:text-gray-400 text-[#727272] flex flex-col  text-[13.3px] ">
              <li className="mb-4">Mon – Fri: 8AM – 10PM</li>
              <li className="mb-4">Sat: 9AM-8PM</li>
              <li className="mb-4">Sun: Closed</li>
            </ul>
          </div> */}


          {FooterLinks.map((item, index) => {
            return (
              <div
                key={index}
                className=" col-span-1 flex flex-col text-left  "
              >
                <h2 className="mb-3 font-[600] ml-2 plus-jakarta dark:text-gray-400  capitalize">
                  {item.heading}
                </h2>
                <ul className="text-gray-400 flex flex-col text-[13.5px] ">
                  {item.list.map((e, index) => {
                    return (
                      <Link to={e.link} key={index} className="mb-4">
                        <li
                          href="https://github.com/themesberg/flowbite"
                          className="hover:underline "
                        >
                          {e.name}
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            );
          })}


          <div className=" col-span-3 md:col-span-2 flex flex-col text-left ">
            <h2 className="mb-3 ml-2 font-[600] plus-jakarta dark:text-gray-400  capitalize">
              Newsletter
            </h2>
            <p className=" text-[14px] text-left px-1 md:text-[14px] text-[#929292] dark:text-gray-400 pb-[20px]">
              Signup for exclusive offers, original stories, events and more.
            </p>
            <input
              className=" w-[100%] text-[15px] p-[15px] dark:bg-transparent"
              type="text"
              name="email"
              placeholder=" Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className=" uppercase bg-[#222] py-[10px] mt-[10px] w-auto border-gray-400 px-3 uppercase text-[14px] text-[#fff] font-[700] plus-jakarta"
              onClick={handleSubscribe}
            >
              Sign Up
            </button>

          </div>


        </div>
        <div className=" py-4 md:py-6 border-t border-gray-400 flex flex-col-reverse md:flex-row items-center justify-between text-[12.2px] md:text-[13.4px] text-gray-400  ">
          <p className=" mt-3 md:mt-0 ">
            Copyright ©2024{" "}
            <span className=" text-[#EE3333]">Kazi Culture</span> All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy">Policy</Link>
            <Link to="/faqs">Questions</Link>
            <Link to="/contact">Affiliate</Link>
            <Link to="/contact">Help</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
