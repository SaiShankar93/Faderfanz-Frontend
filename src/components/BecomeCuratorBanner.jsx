import React from 'react';
import { Link } from 'react-router-dom';

const BecomeCuratorBanner = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-16">
            <div className="relative bg-gradient-to-r from-[#2B1857] to-[#271B4D] rounded-3xl overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B33FE]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#44BCFF]/20 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-5"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
                    {/* Left side with Icon and Text */}
                    <div className="flex items-center gap-8">
                        {/* DJ Icon */}
                        <div className="relative w-24 h-24 hidden md:block">
                            <img
                                src="/icons/dj-icon.svg"
                                alt="DJ"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B33FE]/20 to-[#44BCFF]/20 blur-xl"></div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Become a Curator</h2>
                            <p className="text-gray-400 text-sm md:text-base">
                                Become a Curator on Kazi Culture to reach out to broader audience
                            </p>
                        </div>
                    </div>

                    {/* Get Started Button */}
                    <Link
                        to="/become-curator"
                        className="inline-flex items-center gap-2 bg-[#00FFB2] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#00E6A0] transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8 12H16M12 16V8"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BecomeCuratorBanner; 