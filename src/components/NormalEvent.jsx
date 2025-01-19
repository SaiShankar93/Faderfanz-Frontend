import React, {useState, useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

export function NormalEvent({ event, key }) {
    console.log(event);
    const {
        seteventPageId,
    } = useContext(MainAppContext);
    const [comments, setComments] = useState([]); // Reviews as comments
      const [newComment, setNewComment] = useState("");
    
    const Stars = ({ stars }) => {
        const ratingStars = Array.from({ length: 5 }, (elem, index) => {
            return (
                <div key={index}>
                    {stars >= index + 1 ? (
                        <FaStar className=" text-[#8B33FE]" />
                    ) : (
                        <IoStarOutline className="  text-{#8B33FE} " />
                    )}
                </div>
            );
        });
        return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
    };

    const handleLike = () => {
        handleLiked(!liked);
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([
                ...comments,
                {
                    title: "User Comment",
                    comment: newComment,
                    rating: 5, // Example rating
                    userId: { name: "Anonymous" },
                    createdAt: new Date().toISOString(),
                },
            ]);
            setNewComment("");
        }
    };
    return (
        (<div>
            <Link to={`/event/${event?.title.replace(/\s+/g, "-")}`}
                onClick={() => {
                    sessionStorage.setItem(
                        "eventPageId",
                        JSON.stringify(event?._id)
                    );
                    seteventPageId(event?._id);
                }}
            >
                <BackgroundGradient className="rounded-[22px]   p-4 sm:p-10 bg-[#181818]">
                    <img
                        src={event.mainImage}
                        alt="jordans"
                        height="400"
                        width="400"
                        className="object-contain h-[200px] md:h-[200px]" />
                    <p
                        className="text-base sm:text-xl mt-4 mb-2 text-gray-400">
                        {event.title}
                    </p>

                    <p className="text-sm text-neutral-400 text-gray-500">
                        Experience the joy and Enjoy with your friends at our DJ event.
                    </p>
                    {/* <div className="mt-4">
                            <p className="text-sm text-neutral-400 mb-1">
                                <span className="font-bold text-white">670</span> donations
                            </p>
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div
                                    className="bg-[#8B33FE] h-2 rounded-full"
                                    style={{ width: `${(79 / 89) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">
                                <span className="font-bold">12.8k $</span> raised
                            </p>
                        </div> */}
                    <button
                        className="rounded-full p-2 text-white flex items-center  bg-[#27272A] mt-4 text-xs font-bold dark:bg-zinc-800">
                        Contribute now
                    </button>
                    <p className="text-sm text-gray-400 mt-2">
                        Listed By : Raihan Khan
                    </p>
                </BackgroundGradient>
            </Link>

        </div >)
    );
}
