import React from 'react';

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="bg-[#1A1A1A]/40 backdrop-blur-sm rounded-2xl p-8 flex flex-col gap-6">
            {/* Profile and Info */}
            <div className="flex items-center gap-4">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-[#C5FF32] text-sm">{testimonial.location}</p>
                </div>
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-400 text-sm leading-relaxed">
                {testimonial.text}
            </p>
        </div>
    );
};

export default TestimonialCard; 