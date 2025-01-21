import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export function EventCard({ event, key, isCrowdfunding }) {
    const { seteventPageId } = useContext(MainAppContext);

    return (
        <div>
            <Link
                to={isCrowdfunding ? `/crowdfunding/${event?._id}` : `/event/${event?.title.replace(/\s+/g, "-")}`}
                onClick={() => {
                    sessionStorage.setItem("eventPageId", JSON.stringify(event?._id));
                    seteventPageId(event?._id);
                }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/50 transition-all duration-300 block"
            >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                    <img
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm9Z9vP0ryzbptT0RmJQpgIvVV0F1HGFW-CA&s"}
                        alt={event?.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {event?.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4">
                        {event?.description || "Experience the joy and Enjoy with your friends at our DJ event."}
                    </p>

                    {/* Funding Progress */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Current Funding</span>
                            <span className="text-purple-400 font-semibold">
                                75%
                            </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-300"
                                style={{ width: '75%' }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                            <span className="text-white font-semibold">12.8k $</span>
                            <span className="text-gray-400">15k $</span>
                        </div>
                    </div>

                    {/* Listed By section */}
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-sm text-gray-400">
                            Listed By: {event?.listedBy || "Raihan Khan"}
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-400 text-sm">
                            Deadline: FEB 1, 2025
                        </span>
                        {isCrowdfunding ? (
                            <button className="px-4 py-2 bg-purple-500/10 rounded-full text-purple-400 text-sm hover:bg-purple-500/20 transition-colors">
                                Contribute now
                            </button>
                        ) : (
                            <button className="px-4 py-2 bg-purple-500/10 rounded-full text-purple-400 text-sm hover:bg-purple-500/20 transition-colors">
                                View Event
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
