import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export function EventCard({ event, key }) {
    console.log(event);
    const {
        seteventPageId,
    } = useContext(MainAppContext);

    return (
        (<div>
            <Link to={`/event/${event?.title.replace(/\s+/g, "-")}`}
                onClick={() => {
                    sessionStorage.setItem(
                        "eventPageId",
                        JSON.stringify(event?._id)
                    );
                    seteventPageId(event?._id);
                }}
            >
                <BackgroundGradient className="rounded-[22px]   p-4 sm:p-10 bg-[#181818]">
                    <img
                        src={event.mainImage}
                        alt="jordans"
                        height="400"
                        width="400"
                        className="object-contain h-[150px] md:h-[200px]" />
                    <p
                        className="text-base sm:text-xl mt-4 mb-2 text-gray-400">
                        {event.title}
                    </p>

                    <p className="text-sm text-neutral-400 text-gray-500">
                        Experience the joy and Enjoy with your friends at our DJ event.
                    </p>
                    <button
                        className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-[#27272A] mt-4 text-xs font-bold dark:bg-zinc-800">
                        <span>Book now </span>
                        <span className="bg-[#3f3f46] rounded-full text-[0.6rem] px-2 py-0 text-white">
                            ${event.price}
                        </span>
                    </button>
                </BackgroundGradient>
            </Link>
        </div >)
    );
}
