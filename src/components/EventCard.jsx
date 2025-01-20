import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export function EventCard({ event, key, isCrowdfunding }) {
    console.log(event);
    const {
        seteventPageId,
    } = useContext(MainAppContext);

    return (
        (<div>
            <Link to={isCrowdfunding ? `/crowdfunding/${event?._id}` : `/event/${event?.title.replace(/\s+/g, "-")}`}
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
                        className="object-contain h-[200px] md:h-[200px]" />
                    <p
                        className="text-base sm:text-xl mt-4 mb-2 text-gray-400">
                        {event.title}
                    </p>

                    <p className="text-sm text-neutral-400 text-gray-500">
                        Experience the joy and Enjoy with your friends at our DJ event.
                    </p>
                    <div className="mt-4">
                        <p className="text-sm text-neutral-400 mb-1">
                            <span className="font-bold text-white">670</span> donations
                        </p>
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                            <div
                                className="bg-[#8B33FE] h-2 rounded-full"
                                style={{ width: `${(79 / 89) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                            <span className="font-bold">12.8k $</span> raised
                        </p>
                    </div>
                    {isCrowdfunding ? (
                        <Link
                            to={`/crowdfunding/${event?._id}`}
                            className="rounded-full p-2 text-white flex items-center bg-[#27272A] mt-4 text-xs font-bold dark:bg-zinc-800"
                        >
                            Contribute now
                        </Link>
                    ) : (
                        <button
                            className="rounded-full p-2 text-white flex items-center bg-[#27272A] mt-4 text-xs font-bold dark:bg-zinc-800"
                        >
                            View Event
                        </button>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                        Listed By : Raihan Khan
                    </p>
                </BackgroundGradient>
            </Link>
        </div >)
    );
}
