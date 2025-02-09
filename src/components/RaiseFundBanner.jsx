import React from 'react';
import { Link } from 'react-router-dom';

const RaiseFundBanner = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-16">
            <div className="relative bg-gradient-to-r from-[#0A8F1C] to-[#0F6B1A] rounded-3xl overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5FF32]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00FFB2]/20 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-5"></div>
                    {/* Circular Pattern */}
                    <div className="absolute inset-0 bg-[url('/images/circular-pattern.svg')] opacity-10"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
                    {/* Left side with Icon and Text */}
                    <div className="flex items-center gap-8">
                        {/* Money Icon */}
                        <div className="relative w-24 h-24 hidden md:block">
                            <img
                                src="/icons/money-hand.svg"
                                alt="Raise Fund"
                                className="w-full h-full object-contain invert"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#C5FF32]/20 to-[#00FFB2]/20 blur-xl"></div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Raise Fund</h2>
                            <p className="text-gray-200 text-sm md:text-base">
                                Raise fund for your next project
                            </p>
                        </div>
                    </div>

                    {/* Get Started Button */}
                    <Link
                        to="/raise-fund"
                        className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RaiseFundBanner; 