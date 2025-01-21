import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { CardSpotlight } from "./ui/card-spotlight";

export function CuratorCard({ event, key }) {
    console.log(event);
    const {
        seteventPageId,
    } = useContext(MainAppContext);

    return (
        (<div className="bg-black/20 border border-gray-500 p-4 rounded-lg shadow-lg">
            <Link to={`/curator/id`}
            // onClick={() => {
            //     sessionStorage.setItem(
            //         "eventPageId",
            //         JSON.stringify(event?._id)
            //     );
            //     seteventPageId(event?._id);
            // }}
            >
                <CardSpotlight className="h-42 w-42">
                    <p className="text-xl font-bold relative z-20 mt-2 text-white">
                        <div className="flex justify-center">
                            <img
                                src={"https://thumbs.dreamstime.com/b/dj-performing-neon-lit-club-high-end-mixer-dark-surrounded-vibrant-lights-skillfully-mixing-music-audio-creating-333111795.jpg"}
                                alt="jordans"
                                height="400"
                                width="400"
                                // className="object-contain h-[150px] md:h-[200px]"
                                className="w-24 h-24 rounded-full border-2 border-white shadow-md mb-4"

                            />
                        </div>
                        <p
                            className="flex justify-center text-center text-base sm:text-xl mt-4 mb-2 text-gray-400">
                            {event.name}
                        </p>
                    </p>
                    </CardSpotlight>


                    <div className="z-20 ">
                        <p className="flex justify-center text-center my-1 text-sm text-neutral-400 mb-2">{event.contact ? event.contact : "djblaze@example.com"}</p>
                        <p className="flex justify-center text-center my-1 text-sm text-neutral-400">Followers: {event.followers ? event.followers.toLocaleString() : 143}</p>
                    </div>
                    <p className="text-sm text-neutral-400 text-gray-500 my-2">
                        Experience the joy and Enjoy with your friends at our DJ event.
                    </p>
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
            </Link>
        </div >)
    );
}