import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CardList = [
  {
    id: 1,
    img: "/Images/ab2.png",
    heading: "OUR VISSION",
    content: `We provide how all this mistaken idea of
            denouncing pleasure and sing pain was born an will
            give you a ete account of the system, and expound the
            actual teangs the eat explorer of the truth, the mer of
            human tas assumenda est, omnis dolor repellend`,
  },
  {
    id: 1,
    img: "/Images/ab3.png",
    heading: "OUR MISSION",
    content: `We provide how all this mistaken idea of
      denouncing pleasure and sing pain was born an will
      give you a ete account of the system, and expound the
      actual teangs the eat explorer of the truth, the mer of
      human tas assumenda est, omnis dolor repellend`,
  },
  {
    id: 3,
    img: "/Images/ab4.png",
    heading: "OUR GOAL",
    content: `We provide how all this mistaken idea of
      denouncing pleasure and sing pain was born an will
      give you a ete account of the system, and expound the
      actual teangs the eat explorer of the truth, the mer of
      human tas assumenda est, omnis dolor repellend`,
  },
];

const FeatureList = [
  {
    id: 1,
    heading: "FAST DELIVERY",
    content:
      "We provide how all this is taken dea of denouncing pleasure and sing",
  },
  {
    id: 2,
    heading: "SECURE PAYMENT",
    content: `We provide how all this mistaken
        dea of denouncing pleasure and sing`,
  },
  {
    id: 3,
    heading: "EASY ORDER TRACKING",
    content: `We provide how all this mistaken dea of denouncing pleasure and sing`,
  },
  {
    id: 4,
    heading: "24/7 SUPPORT",
    content: `We provide how all this mistaken
       dea of denouncing pleasure and sing`,
  },
  {
    id: 5,
    heading: "QUALITY PRODUCT",
    content: `We provide how all this mistaken dea of denouncing pleasure and sing`,
  },
  {
    id: 6,
    heading: "MONEY BACK GUARNTEE",
    content: `We provide how all this mistaken
        dea of denouncing pleasure and sing`,
  },
  {
    id: 7,
    heading: "FREE RETURN",
    content: `We provide how all this mistaken
        dea of denouncing pleasure and sing`,
  },
];
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" text-gray-400 pt-20 bg-[#0E0F13]">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7  text-white dark:border-b dark:border-t dark:border-gray-600   flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121]  dark:text-gray-400  ">
          About Us
        </h2>
        <div className=" flex items-center font-[500] text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">About Us</span>
        </div>
      </div>

      <section className=" px-[4%] md:px-[8%] mt-4 md:mt-14 ">
        <div className=" flex flex-col md:flex-row gap-3 md:gap-10 mb-8 md:mb-12 ">
          <img
            className=" w-full h-[230px] md:h-[390px]  2xl:w-[855px] object-cover "
            src="/Images/ab1.png"
            alt="ab1"
          />
          <div className=" flex flex-col">
            <h3 className=" text-[20px] md:text-[26px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
              WELCOME TO{" "}
              <span className=" text-[#FF7004]">creative furnitures.</span>
            </h3>
            <p className=" text-[12.5px] md:text-[13.6px] font-[400] md:w-[65%] text-justify mt-2 md:mt-4 mb-5 md:mb-8 text-[#7A7A7A] dark:text-gray-600">
              CREATIVE FURNITURE provide how all this mistaken idea of
              denouncing pleasure and sing pain was born an will give you a
              complete account of the system, and expound the actual teachings
              of the eat explorer of the truth, the mer of human.
            </p>
            <h3 className=" text-[17px] md:text-[21px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
              WIN BEST ONLINE SHOP AT 2024
            </h3>
            <p className=" text-[12.5px] md:text-[13.6px] font-[400] md:w-[65%] mt-2 md:mt-4 text-justify text-[#7A7A7A] dark:text-gray-600">
              CREATIVE FURNITURE provide how all this mistaken idea of
              denouncing pleasure and sing pain was born an will give you a
              complete account of the system, and expound the actual teachings
              of the eat explorer of the truth, the mer of human
            </p>
          </div>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mb:-12 ">
          {CardList.map((card, index) => {
            return (
              <div key={index}>
                <img
                  className=" w-full h-[200px] md:h-[300px] object-cover "
                  src={card.img}
                  alt="card-img"
                />
                <div className=" mt-4 md:mt-10">
                  <h4 className=" text-[17px] md:text-[20px] font-[700] plus-jakarta text-[#363F4D]  dark:text-gray-400  md:mb-2 ">
                    {card.heading}
                  </h4>
                  <p className=" text-[12.7px] md:text-[13.6px]   text-[#6c6c6c]">
                    {card.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className=" flex flex-col ">
          <h3 className=" text-[17px] md:text-[20px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
            YOU CAN CHOOSE US BECAUSE
            <br />
            WE ALWAYS PROVIDE IMPORTANCE...
          </h3>
          <p className=" text-[12.7px] md:text-[13.6px] font-[400] md:w-[45%] text-justify mt-2 md:mt-4 mb-4 md:mb-8 text-[#7A7A7A] dark:text-gray-600">
            We provide how all this mistaken idea of denouncing pleasure and
            sing pain was born will give you a complete account of the system,
            and expound the actual
          </p>
        </div>

        <div className=" flex flex-col-reverse md:flex-row gap-1 mb-7 md:mb-12 ">
          <div className=" grid grid-cols-2 gap-x-6 md:gap-0 ">
            {FeatureList.map((item, index) => {
              return (
                <div className=" flex flex-col mb-2 md:mb-5 " key={index}>
                  <h3 className=" text-[15px] md:text-[17px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
                    {item.heading}
                  </h3>
                  <p className=" text-[12.1px] md:text-[13.3px] font-[400] md:w-[65%] text-justify text-[#6c6c6c]">
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>
          <img
            className=" mb-2 md:mb-0 h-[210px] 2xl:h-[288px] object-cover "
            src="/Images/ab5.png"
            alt="ab1"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
