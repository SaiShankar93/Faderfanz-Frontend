import React, { useState } from "react";
import { EventCard } from "../components/EventCard"; // Ensure EventCard is imported correctly
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { CuratorCard } from "@/components/CuratorCard";
import { SponserCard } from "@/components/SponserCard";
import { VenueOwnerCard } from "@/components/VenueOwnerCard";
import { BlogCard } from "@/components/BlogCard";

const MyFeed = () => {
    const [loading, setLoading] = useState(true);
    setTimeout(() => {
        setLoading(false);
    }, 1000);
    const curator = {
        name: "Raihan",
        profilePhoto: "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual image URL
        contact: "raihan@example.com",
        followers: 5234,
        about: "DJ Blaze is a renowned music curator known for electrifying performances and unforgettable events.",
        socialLinks: {
            instagram: "https://instagram.com/djblaze",
            twitter: "https://twitter.com/djblaze",
            facebook: "https://facebook.com/djblaze",
        },
        totalEvents: 48,
        events: [
            {
                _id: "1",
                title: "Summer Beats Festival",
                date: "July 15, 2024",
                mainImage: "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual event image URL
                price: 50,
            },
            {
                _id: "2",
                title: "Electric Nights",
                date: "August 23, 2024",
                mainImage: "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual event image URL
                price: 60,
            },
            {
                _id: "3",
                title: "Winter Groove",
                date: "December 5, 2024",
                mainImage: "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual event image URL
                price: 75,
            },
        ],
    };

    return (
        [
            loading ?
                <div className=" w-full flex items-center justify-center py-3" >
                    <img
                        src="/Images/loader.svg"
                        alt="loading..."
                        className=" object-contain w-[60px] h-[60px]"
                    />
                </div > :
                (
                    <div className="bg-[#0E0F13] min-h-screen pt-16 text-white">
                        <div className="bg-[#0E0F13] min-h-screen pt-16 text-white">
                            <svg
                                className="fixed bottom-0 right-0 z-[0] pointer-events-none"
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
                            <div className=" mx-auto p-10 ">
                                {/* Header Section */}
                                <div className="flex  items-start text-start gap-5">
                                    <img
                                        src={curator.profilePhoto}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                                    />
                                    <div>
                                        <h1 className="text-3xl font-playwrite">Hello,</h1>
                                        <p className="text-2xl text-gray-400 playball">Raihan Khan</p>
                                    </div>
                                </div>
                                <svg width="601" height="1031" viewBox="0 0 601 1031" fill="none" xmlns="http://www.w3.org/2000/svg" className="fixed top-0 left-0 z-[0] pointer-events-none hidden lg:block">
                                    <g filter="url(#filter0_f_1_3194)">
                                        <circle cx="85.5" cy="515.5" r="207.5" fill="#8B33FE" fill-opacity="0.4" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_f_1_3194" x="-430" y="0" width="1031" height="1031" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                            <feGaussianBlur stdDeviation="154" result="effect1_foregroundBlur_1_3194" />
                                        </filter>
                                    </defs>
                                </svg>

                            </div>
                            <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
                                <div className=" flex flex-col items-center col-span-4">
                                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] open-sans font-[700] text-white dark:text-gray-400 ">
                                        Explore Your Personalized Feed
                                    </p>
                                </div>
                            </div>
                            <div className=" text-gray-400 flex flex-col items-start lg:grid xl:grid-cols-4 gap-6 px-10 xl:px-10 py-4 mt-5 ">
                                <div className=" flex flex-col items-start col-span-4">
                                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
                                        Sponsers You Follow
                                    </p>
                                </div>
                            </div>
                            <div className="w-full col-span-4 px-8  overflow-hidden">
                                {/* Horizontal Scrollable Container for Mobile Screens */}
                                <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                                    {/* Flex Container for Horizontal Scrolling */}
                                    <div className="flex space-x-6">
                                        {curator.events.map((event) => (
                                            <SponserCard event={event} key={event._id} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className=" text-gray-400 flex flex-col items-start lg:grid xl:grid-cols-4 gap-6 px-10 xl:px-10 py-4 mt-5 ">
                                <div className=" flex flex-col items-start col-span-4">
                                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
                                        Curators You Follow
                                    </p>
                                </div>
                            </div>
                            <div className="w-full col-span-4 px-8  overflow-hidden">
                                {/* Horizontal Scrollable Container for Mobile Screens */}
                                <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                                    {/* Flex Container for Horizontal Scrolling */}
                                    <div className="flex space-x-6">
                                        {curator.events.map((event) => (
                                            <CuratorCard event={event} key={event._id} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className=" text-gray-400 flex flex-col items-start lg:grid xl:grid-cols-4 gap-6 px-10 xl:px-10 py-4 mt-5 ">
                                <div className=" flex flex-col items-start col-span-4">
                                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
                                        Crowdfunding Events Contributed So far
                                    </p>
                                </div>
                            </div>
                            <div className="w-full col-span-4 px-8 py-16 overflow-hidden">
                                {/* Horizontal Scrollable Container for Mobile Screens */}
                                <div className="w-3/4 col-span-4 overflow-x-scroll scrollbar-hide ">
                                    {/* Flex Container for Horizontal Scrolling */}
                                    <div className="flex space-x-6">
                                        {curator.events.map((event) => (
                                            <EventCard event={event} key={event._id} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className=" text-gray-400 flex flex-col items-start lg:grid xl:grid-cols-4 gap-6 px-10 xl:px-10 py-4 mt-5 ">
                                <div className=" flex flex-col items-start col-span-4">
                                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
                                        Venue Owners You Follow
                                    </p>
                                </div>
                            </div>
                            <div className="w-full col-span-4 px-8  overflow-hidden">
                                {/* Horizontal Scrollable Container for Mobile Screens */}
                                <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                                    {/* Flex Container for Horizontal Scrolling */}
                                    <div className="flex space-x-6">
                                        {curator.events.map((event) => (
                                            <VenueOwnerCard event={event} key={event._id} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className=" text-gray-400 flex flex-col items-start lg:grid xl:grid-cols-4 gap-6 px-10 xl:px-10 py-4 mt-5 ">
                                <div className=" flex flex-col items-start col-span-4">
                                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] quicksand font-[700] text-white dark:text-gray-400 ">
                                        Liked Blogs
                                    </p>
                                </div>
                            </div>
                            <div className="w-full col-span-4 px-8  overflow-hidden">
                                {/* Horizontal Scrollable Container for Mobile Screens */}
                                <div className="w-full col-span-4 overflow-x-scroll scrollbar-hide">
                                    {/* Flex Container for Horizontal Scrolling */}
                                    <div className="flex space-x-6">
                                        {curator.events.map((event) => (
                                            <BlogCard event={event} key={event._id} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )
        ]

    );
};

export default MyFeed;
