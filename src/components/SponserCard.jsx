import React, { useContext } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { Link, useParams } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

export function SponserCard({ event, key }) {
    console.log(event);
    const {
        seteventPageId,
    } = useContext(MainAppContext);

    return (
        (<div>
            <Link to={`/sponser/id`}
            // onClick={() => {
            //     sessionStorage.setItem(
            //         "eventPageId",
            //         JSON.stringify(event?._id)
            //     );
            //     seteventPageId(event?._id);
            // }}
            >
                <CardContainer className="inter-var no-scrollbar">
                    <CardBody className=" relative group/card  hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black/10 border-white/[0.2]  w-[15rem] sm:w-[25rem] h-auto rounded-xl p-4 border  ">
                        <CardItem translateZ="100" className="w-full mt-4">
                            <div className="w-full h-48 rounded-lg overflow-hidden">
                                <img
                                    src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEFopnFlNFLKsRKLcwLXyUDnsxIfFQv3yz8g&s"}
                                    alt={event.title}
                                    className="w-full h-full object-contain bg-white"
                                />
                            </div>
                        </CardItem>
                        <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-white mt-3 pl-4"
                        >
                            Zomato
                        </CardItem>
                        <CardItem
                            as="p"
                            translateZ="60"
                            className=" text-sm max-w-sm mt-2 text-neutral-300 pl-4"
                        >
                            <p className=" my-1 text-sm text-gray-400 ">{event.contact ? event.contact : "ceo@zomato.com"}</p>
                            <p className=" my-1 text-sm text-gray-500">Events Sponsered: {event.followers ? event.followers.toLocaleString() : 5}</p>
                            <p className=" my-1 text-sm text-gray-500">Category: {event.followers ? event.followers.toLocaleString() : "Sports, Music"}</p>
                        </CardItem>
                        <CardItem
                            as="p"
                            translateZ="60"
                            className=" text-sm max-w-sm mt-2 text-neutral-300 pl-4"
                        >
                            Iam an Avid Event Sponser and I love to sponser events.
                        </CardItem>
                        <div className="flex justify-between items-center mt-4">
                            <CardItem
                                translateZ={20}
                                as={Link}
                                href="https://twitter.com/mannupaaji"
                                target="__blank"
                                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                            >
                                View Sponser →
                            </CardItem>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition"
                                    aria-label="Twitter"
                                >
                                    <FaTwitter />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition"
                                    aria-label="Facebook"
                                >
                                    <FaFacebook />
                                </a>
                            </div>

                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-center md:justify-between mt-4">

                        </div>
                    </CardBody>

                </CardContainer>
            </Link>
        </div >)
    );
}

