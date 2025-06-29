import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export function BlogCard({ event }) {
    const { seteventPageId } = useContext(MainAppContext);

    // Format the createdAt date
    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(date);
    };

    return (
        <Link
            to={`/blog/${event?._id}`}
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
                        src={event?.featuredImage ? `${import.meta.env.VITE_SERVER_URL}${event?.featuredImage}` : "https://images.unsplash.com/photo-1544077960-604201fe74bc"}
                        alt={event?.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                        {event?.title || "No title"}
                    </h3>

                    {/* Date and Author */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                        <p>{formatDate(event?.createdAt)}</p>
                        <p>Publish by: {"No Author"}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
