import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { PinContainer } from "./ui/3d-pin";

export function VenueOwnerCard({ event, key }) {
    console.log(event);
    const {
        seteventPageId,
    } = useContext(MainAppContext);

    return (
        (<div>
            <Link to={`/venue/id`}
            // onClick={() => {
            //     sessionStorage.setItem(
            //         "eventPageId",
            //         JSON.stringify(event?._id)
            //     );
            //     seteventPageId(event?._id);
            // }}
            >
                <div className="h-[28rem] w-full flex items-center justify-center ">
                    <PinContainer
                        title="Hyderabad,TS"
                        href="/curator/id"
                    >
                        <div className="flex basis-full flex-col  tracking-tight text-slate-100/50 sm:basis-1/2 w-[18rem] h-[20rem] ">
                            <div className="flex justify-center">
                            <img
                                src={"http://localhost:5000/images/additionalImages-1735138631438.jpeg"}
                                alt="jordans"
                                height="400"
                                width="400"
                                // className="object-contain h-[150px] md:h-[200px]"
                                className="w-24 h-24 rounded-full border-2 border-white shadow-md mb-4"

                            />
                        </div>
                        <p
                            className="flex justify-center text-center text-base sm:text-xl mt-4 mb-2 text-gray-400">
                            Red Lion Club
                        </p>
                        <div className="">
                            <p className="flex justify-center text-center my-1 text-sm text-gray-400 mb-2">{event.contact ? event.contact : "Hyderabad,TS."}</p>
                            <p className="flex justify-center text-center my-1 text-sm text-gray-500">Contact: {event.followers ? event.followers.toLocaleString() : 630484811}</p>
                            <p className="flex justify-center text-center my-1 text-sm text-gray-500">Category: {event.followers ? event.followers.toLocaleString() : "DJ, Music"}</p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-center md:justify-between mt-4">
                            {/* View Profile Button */}
                            <button
                                className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-[#27272A] text-xs font-bold dark:bg-zinc-800 mb-4 md:mb-0"
                            >
                                <span>View Venue</span>
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
                            <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
                        </div>
                    </PinContainer>
                </div>


            </Link>
        </div >)
    );
}