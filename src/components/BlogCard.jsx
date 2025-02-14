import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export function BlogCard({ event }) {
    const { seteventPageId } = useContext(MainAppContext);

    return (
        <Link
            to={`/blog/${event?.title?.replace(/\s+/g, "-")}`}
            onClick={() => {
                sessionStorage.setItem("blogPageId", JSON.stringify(event?._id));
                seteventPageId(event?._id);
            }}
            className="block w-full"
        >
            <div className="bg-[#1A1A1A] rounded-[20px] overflow-hidden">
                {/* Image */}
                <div className="relative w-full aspect-[4/3]">
                    <img
                        src={event?.image || "https://images.unsplash.com/photo-1544077960-604201fe74bc"}
                        alt={event?.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                        {event?.title || "BestSeller Book Bootcamp -write, Market & Publish Your Book -Lucknow"}
                    </h3>

                    {/* Date and Author */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                        <p>{event?.date || "Saturday, March 18, 9:30PM"}</p>
                        <p>Publish by: {event?.author || "Admin"}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
