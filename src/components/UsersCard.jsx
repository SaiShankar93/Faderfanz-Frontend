import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import { cn } from "@/lib/utils";
import { EvervaultCard, Icon } from "./ui/evervault-card";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export function UserCard({ event, key }) {
    console.log(event);
    const {
        seteventPageId,
    } = useContext(MainAppContext);

    return (
        (<div>
            <Link to={`/blog/${event?.title.replace(/\s+/g, "-")}`}
                onClick={() => {
                    sessionStorage.setItem(
                        "blogPageId",
                        JSON.stringify(event?._id)
                    );
                    seteventPageId(event?._id);
                }}
            >
                <div className="border  border-white/[0.2] flex flex-col justify-between max-w-sm mx-auto p-4 relative h-[380px]">
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white " />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white " />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white " />

                    <EvervaultCard link="https://thumbs.dreamstime.com/b/dj-performing-neon-lit-club-high-end-mixer-dark-surrounded-vibrant-lights-skillfully-mixing-music-audio-creating-333111795.jpg" />
                    <p
                        className="flex justify-center text-center text-base sm:text-xl  text-gray-400">
                        Sai Shankar
                    </p>
                    <p
                        className="flex justify-center text-center text-base sm:text-md  text-gray-400">
                        Events Attended : 31
                    </p>
                    <p
                        className="flex justify-center text-center text-base sm:text-md  text-gray-400">
                        Crowdfunding Contributions : 23.4k $
                    </p>
                    {/* <h2 className="text-white   text-sm font-light">
                        Hover over this card to reveal an awesome effect. Running out of copy
                        here.
                    </h2> */}
                    <div className="flex flex-col md:flex-row justify-center items-center md:justify-between mt-4">
                        {/* View Profile Button */}
                        <button
                            className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-[#27272A] text-xs font-bold dark:bg-zinc-800 mb-4 md:mb-0"
                        >
                            <span>View Profile</span>
                            <span className="bg-[#27272A] rounded-full text-[0.6rem] px-2 py-0 text-white">
                                {/* ${event.price} */}
                            </span>
                        </button>

                        {/* Social Media Icons */}
                        <div className="flex justify-center gap-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition"
                                aria-label="Twitter"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition"
                                aria-label="Facebook"
                            >
                                <FaFacebook />
                            </a>
                        </div>
                    </div>
                </div>

            </Link>
        </div >)
    );
}
