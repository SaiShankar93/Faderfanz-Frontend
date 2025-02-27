import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
    RiAppleFill,
    RiFacebookCircleFill,
    RiGoogleFill,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const [isPswdVisible, setIsPswdVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formData;
    const { setUserLoggedIn } = useAuth();
    const { user, setUser } = useContext(MainAppContext);
    const { userData, setUserData } = useState({});

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/auth/local/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // console.log(res.data);
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUserLoggedIn(true);
                // setUserData(res.data.user);
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (err) {
            console.error("Login Error:", err.response.data);
            toast.error("Incorrect email or password");
        }
    };

    useEffect(() => {
        // console.log(userData);
        return setUser(userData);
    }, [userData, setUserData]);

    const loginWithGoogle = () => {
        window.open(
            `${import.meta.env.VITE_SERVER_URL}/auth/google/callback`,
            "_self"
        );
    };

    const loginWithFacebook = () => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/auth/facebook`, "_self");
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#1a1b4b] flex flex-col lg:flex-row">
            {/* Left Content - Made wider and responsive */}
            <div className="flex-[2] flex items-center justify-center p-4 lg:p-0">
                <div className="w-full max-w-xl px-4 lg:px-16 py-8 lg:py-0">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3 mb-8">
                        <img src="/faderfanz.png" alt="FaderFanz" className="w-12 h-12" />
                        <h1 className="text-2xl text-white font-sen">FaderFanz</h1>
                    </div>

                    <h2 className="text-[32px] font-semibold text-white font-sen mb-12">
                        Sign In to FaderFanz
                    </h2>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-gray-300 text-sm uppercase mb-2 font-medium">
                                YOUR EMAIL
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Enter your mail"
                                className="w-full bg-transparent border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-[#00FFB3] focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-300 text-sm uppercase font-medium">
                                    PASSWORD
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-gray-300 hover:text-[#00FFB3] transition-colors"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={isPswdVisible ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-[#00FFB3] focus:outline-none transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPswdVisible(!isPswdVisible)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {isPswdVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-600 rounded bg-transparent"
                                />
                                <span className="text-sm">Remember me</span>
                            </label>
                            <a href="/register" className="text-sm text-white hover:underline">
                                Register
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={!email || !password}
                            className="w-full bg-[#00FFB3] text-black font-medium py-3 rounded-lg hover:bg-[#00FFB3]/90 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
                        >
                            Sign In
                        </button>

                        {/* Or Divider */}
                        <div className="flex items-center">
                            <div className="flex-grow h-px bg-gray-600"></div>
                            <span className="px-4 text-gray-400 text-sm">Or</span>
                            <div className="flex-grow h-px bg-gray-600"></div>
                        </div>

                        {/* Google Login */}
                        <button
                            type="button"
                            onClick={loginWithGoogle}
                            className="w-full flex items-center justify-center gap-3 bg-black border border-gray-800 rounded-lg p-3 text-white hover:bg-gray-900 transition-colors"
                        >
                            <RiGoogleFill className="text-xl" />
                            <span>Sign up with Google</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Image Section - Made responsive */}
            <div className="hidden lg:block flex-1 relative">
                <img
                    src="/Images/gaming-event.jpeg"
                    alt="Gaming Event"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default Login;
