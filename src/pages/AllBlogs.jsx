import React, { useState } from "react";
import { EventCard } from "../components/EventCard"; // Ensure EventCard is imported correctly
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { CuratorCard } from "@/components/CuratorCard";
import { BlogCard } from "@/components/BlogCard";

const AllBlogs = () => {
    const [loading, setLoading] = useState(true);
    setTimeout(() => {
        setLoading(false);
    }, 1000);
    const curators = [
        {
            _id: "1",
            title: "DJ Blaze",
            mainImage: "http://localhost:5000/images/additionalImages-1735064142892.jpeg",
            contact: "djblaze@example.com",
            followers: 5234,
            about: "DJ Blaze is a renowned music curator known for electrifying performances and unforgettable events.",
        },
        {
            _id: "2",
            title: "DJ Spark",
            mainImage: "http://localhost:5000/images/additionalImages-1735064142892.jpeg",
            contact: "djspark@example.com",
            followers: 4321,
            about: "DJ Spark lights up every event with her incredible energy and beats.",
        },
        {
            _id: "3",
            title: "DJ Wave",
            mainImage: "http://localhost:5000/images/additionalImages-1735064142892.jpeg",
            contact: "djwave@example.com",
            followers: 6789,
            about: "DJ Wave brings the coolest vibes to every stage.",
        },
    ];

    return (
        <div className="bg-[#0E0F13] pt-24">
            <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
                <div className=" flex flex-col items-center col-span-4">
                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] plus-jakarta font-[700] text-white dark:text-gray-400 ">
                        Explore All Blogs
                    </p>
                    <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px]  dark:text-gray-400 ">
                        Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
                        eiusmo tempor incididunt ut labore
                    </p>
                </div>
            </div>
            <svg
                className="fixed top-0 right-0 z-[0] pointer-events-none"
                width="536"
                height="1071"
                viewBox="0 0 536 1071"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g filter="url(#filter0_f_1_3190)">
                    <circle cx="535.5" cy="535.5" r="207.5" fill="#8B33FE" fillOpacity="0.4" />
                </g>
                <defs>
                    <filter
                        id="filter0_f_1_3190"
                        x="0"
                        y="0"
                        width="1071"
                        height="1071"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="164" result="effect1_foregroundBlur_1_3190" />
                    </filter>
                </defs>
            </svg>
            {
                loading ? (
                    <div className=" w-full flex items-center justify-center py-3" >
                        <img
                            src="/Images/loader.svg"
                            alt="loading..."
                            className=" object-contain w-[60px] h-[60px]"
                        />
                    </div >
                ) : (
                    <>
                        <div className="w-full col-span-4 px-8 py-16">
                            <div className="w-full col-span-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {curators.map((event) => (
                                    console.log(event),
                                    <BlogCard event={event} key={event._id} />
                                ))}
                            </div>

                        </div>
                    </>
                )}
        </div>
    );
};

export default AllBlogs;
