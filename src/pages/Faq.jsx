import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { HiMiniChevronDown } from "react-icons/hi2";

const FaqList = [
  {
    id: 1,
    heading: "What Shipping Methods are Available?",
    content:
      "Terms know how to pursue pleasure rationally encounter cnces that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because.",
  },
  {
    id: 2,
    heading: "How I Return back my product?",
    content: `We provide how all this mistaken
        dea of denouncing pleasure and sing`,
  },
  {
    id: 3,
    heading: "What is the payment secutiry system?",
    content: `We provide how all this mistaken dea of denouncing pleasure and sing`,
  },
  {
    id: 4,
    heading: "How can I track my order?",
    content: `We provide how all this mistaken
       dea of denouncing pleasure and sing`,
  },
  {
    id: 5,
    heading: "Do I need creat account for buy products?",
    content: `We provide how all this mistaken dea of denouncing pleasure and sing`,
  },
];
const Faq = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" ">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]   dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600   flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
          FAQ's
        </h2>
        <div className=" flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">Faq Us</span>
        </div>
      </div>

      <section className=" sm:px-[8%] mt-4 md:mt-4 mb-5 ">
        <div className="w-full px-4 pt-4">
          <div className="mx-auto w-full ms:max-w-xl flex flex-col gap-3 rounded-2xl bg-white dark:bg-transparent p-2">
            {FaqList.map((item, index) => {
              return (
                <Disclosure key={index}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between bg-[#E9E9E9] dark:bg-transparent dark:border dark:border-gray-700 px-4 py-4 text-left text-[13.6px] sm:text-sm font-medium hover:bg-[#FF7004] dark:hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-gray-300 ">
                        <span>{item.heading}</span>
                        <HiMiniChevronDown
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-2.5 pb-5 text-[13.6px] sm:text-sm border border-gray-300 dark:border-gray-700 font-medium text-[#7A7A7A] -mt-3 ">
                        {item.content}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
