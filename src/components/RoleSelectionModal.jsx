import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelectionModal = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    const roleOptions = [
        {
            id: "sponsor",
            title: "Sponsor",
            description: "Become a sponsor"
        },
        {
            id: "venue-owner",
            title: "Venue Owner",
            description: "Register as a venue owner"
        },
        {
            id: "curator",
            title: "Curator",
            description: "Register as an event manager, artist, DJ etc."
        },
        {
            id: "guest",
            title: "Guest/Fans",
            description: "Register as a fan/guest"
        }
    ];

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (!selectedRole) return;

        switch (selectedRole) {
            case "sponsor":
                navigate("/register/sponsor");
                break;
            case "venue-owner":
                navigate("/register/venue-owner");
                break;
            case "curator":
                navigate("/register/curator");
                break;
            case "guest":
                navigate("/register/guest");
                break;
            default:
                navigate("/register");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1E1E2E] rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-white font-medium font-sen">Choose your preferred role</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-gray-400 mb-4 font-sen">Register as:</p>

                <div className="space-y-3">
                    {roleOptions.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            className={`w-full p-3 text-left rounded-lg border transition-colors duration-200 
                                ${selectedRole === role.id
                                    ? 'border-[#00FFB3] bg-[#1A1B23]'
                                    : 'border-gray-700 hover:border-gray-600 bg-[#1A1B23]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                    ${selectedRole === role.id
                                        ? 'border-[#00FFB3]'
                                        : 'border-gray-500'
                                    }`}
                                >
                                    {selectedRole === role.id && (
                                        <div className="w-2 h-2 rounded-full bg-[#00FFB3]" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-white font-sen text-base">{role.title}</h3>
                                    <p className="text-gray-400 text-sm font-sen">{role.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                <p className="text-gray-400 mt-4 font-sen">Already a User? <a href="/login" className="text-white hover:underline">Login</a> </p>
                <button
                    onClick={handleContinue}
                    disabled={!selectedRole}
                    className={`w-full mt-5 py-3 rounded-lg font-sen transition-colors duration-200 text-base
                        ${selectedRole
                            ? 'bg-[#00FFB3] hover:bg-[#00FFB3]/90 text-black'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default RoleSelectionModal; 