import React, { useState } from "react";
import { EventCard } from "../components/EventCard"; // Ensure EventCard is imported correctly
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const VenueOwnerPage = () => {
    const [loading, setLoading] = useState(true);
    setTimeout(() => {
        setLoading(false);
    }, 1000);
    const curator = {
        name: "DJ Blaze",
        profilePhoto: "http://localhost:5000/images/additionalImages-1735064142892.jpeg", // Replace with actual image URL
        contact: "djblaze@example.com",
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
                            <div className="max-w-5xl mx-auto py-10 px-5">
                                {/* Header Section */}
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={curator.profilePhoto}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                                    />
                                    <h1 className="text-4xl font-bold mt-4">{curator.name}</h1>
                                    <p className="text-gray-400 mt-2">{curator.contact}</p>
                                    <div className="relative my-4   group">
                                        <div
                                            className="absolute -inset-1 rounded-xl blur-lg opacity-70 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"
                                        />
                                        <a
                                            href=""
                                            title="View all Events"
                                            className="relative inline-flex items-center justify-center px-6 py-3  font-bold text-white bg-gray-900 rounded-xl font-pj transition-all duration-200 focus:outline-none  focus:ring-offset-2 focus:ring-gray-900 md:px-6 md:py-3 text-xs"
                                            role="button"
                                        >
                                            Follow
                                        </a>
                                    </div>
                                    <p className="text-xl mt-2">Followers: {curator.followers.toLocaleString()}</p>
                                    <p className="text-gray-300 mt-4 max-w-lg">{curator.about}</p>
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
                                {/* Social Links */}
                                <div className="flex justify-center gap-6 mt-6">
                                    <a
                                        href={curator.socialLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl text-gray-400 hover:text-white transition"
                                    >
                                        <FaInstagram />
                                    </a>
                                    <a
                                        href={curator.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl text-gray-400 hover:text-white transition"
                                    >
                                        <FaTwitter />
                                    </a>
                                    <a
                                        href={curator.socialLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl text-gray-400 hover:text-white transition"
                                    >
                                        <FaFacebook />
                                    </a>
                                </div>


                            </div>
                            <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
                                <div className=" flex flex-col items-center col-span-4">
                                    <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] plus-jakarta font-[700] text-white dark:text-gray-400 ">
                                        All Events
                                    </p>
                                </div>
                            </div>
                            <div className="w-full col-span-4 px-8 py-16">
                                <div className="w-full col-span-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {curator.events.map((event) => (
                                        console.log(event),
                                        <EventCard event={event} key={event._id} />
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>
                )
        ]

    );
};

export default VenueOwnerPage;
