import React from 'react';
import { Link } from 'react-router-dom';

const CreateEventBanner = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <div className="relative bg-gradient-to-r from-[#2B1857] to-[#271B4D] rounded-3xl overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0">
                    {/* Geometric shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B33FE]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#44BCFF]/20 rounded-full blur-3xl"></div>

                    {/* Decorative lines and shapes */}
                    <div className="absolute top-4 right-8 w-32 h-32 border-2 border-[#FF44EC]/20 rotate-12"></div>
                    <div className="absolute bottom-4 left-8 w-32 h-32 border-2 border-[#44BCFF]/20 -rotate-12"></div>

                    {/* Dots */}
                    <div className="absolute top-12 left-1/4 w-2 h-2 bg-[#FF675E] rounded-full"></div>
                    <div className="absolute bottom-12 right-1/4 w-2 h-2 bg-[#44BCFF] rounded-full"></div>
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#FF44EC] rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
                    {/* Left side with Calendar Icon and Text */}
                    <div className="flex items-center gap-8">
                        {/* Calendar Icon */}
                        <div className="relative w-24 h-24 hidden md:block">
                            <img
                                src="/icons/calendar-icon.svg"
                                alt="Calendar"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF44EC]/20 to-[#44BCFF]/20 blur-xl"></div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Create event</h2>
                            <p className="text-gray-400 text-sm md:text-base">
                                Got a show, event, activity or a great experience?
                                <br />
                                Partner with us & get listed on Kazi Culture
                            </p>
                        </div>
                    </div>

                    {/* Create Event Button */}
                    <Link
                        to="/create-event"
                        className="inline-flex items-center gap-2 bg-[#00FFB2] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#00E6A0] transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Create Event
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CreateEventBanner; 