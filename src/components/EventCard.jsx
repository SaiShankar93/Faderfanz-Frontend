import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export function EventCard({ event, key, isCrowdfunding }) {
    const { seteventPageId } = useContext(MainAppContext);
    const navigate = useNavigate();

    if (!isCrowdfunding) return null; // Return original event card if not crowdfunding

    // Calculate progress percentage
    const raisedAmount = 16900; // Default amount
    const targetAmount = 35000; // Default target
    const progressPercentage = Math.min(Math.round((raisedAmount / targetAmount) * 100), 100);

    const handleContribute = () => {
        // You can generate a unique ID for each campaign or use an existing one
        const campaignId = event?.id || 'default-campaign';
        navigate(`/crowdfunding/${campaignId}`);
    };

    return (
        <div className="bg-[#0E0E0E]/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            {/* Image Container */}
            <div className="relative h-48">
                <img
                    src={event?.image || "/Images/Crowdcard.png"}
                    alt={event?.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title and Description */}
                <div className="mb-6">
                    <h3 className="text-white text-xl font-semibold mb-2">
                        {event?.title || "Street Training"}
                    </h3>
                    <p className="text-[#808191] text-sm">
                        {event?.description || "We are raising money for the people in the street to have a good training opportunity"}
                    </p>
                </div>

                {/* Funding Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">
                            ${raisedAmount.toLocaleString()} raised
                        </span>
                        <span className="text-white">
                            {progressPercentage}%
                        </span>
                    </div>
                    <div className="relative w-full h-1 bg-[#1A1A1A] rounded-full">
                        <div
                            className="absolute left-0 h-full bg-[#00FFB2] rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Target Amount */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#808191]">Target</span>
                        <span className="text-white font-medium">
                            ${targetAmount.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Contribute Button */}
                <button
                    onClick={handleContribute}
                    className="w-full py-3 bg-[#C5FF32] text-black rounded-lg font-medium hover:bg-[#b3ff00] transition-colors mb-4"
                >
                    Contribute now
                </button>

                {/* Footer Info */}
                <div className="flex justify-between text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-[#808191]">Created by</span>
                        <div className="flex items-center gap-2">
                            <img
                                src={event?.creatorImage || "/Images/default-avatar.jpg"}
                                alt="Creator"
                                className="w-6 h-6 rounded-full"
                            />
                            <span className="text-white">{event?.creator || "Sannidhan Katta"}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <span className="text-[#808191]">Deadline</span>
                        <span className="text-white">{event?.deadline || "23rd March, 2025"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
