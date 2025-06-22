import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiCloseCircleFill,
  RiFacebookFill,
  RiGoogleFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterFill,
  RiYoutubeFill,
} from "react-icons/ri";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu } from "@headlessui/react";
import { AppContext } from "../context/AppContext";
import { MainAppContext } from "@/context/MainContext";
import { useAuth } from "@/context/AuthContext";
import { IoIosLogOut } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";

const NavList = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "OFFICE",
    dropdownList: [
      {
        id: "2.1",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 3,
    name: "HOSPITALITY",
    dropdownList: [
      {
        id: "3.1",
        name: "link 1",
        link: "/",
      },
      {
        id: "3.2",
        name: "link 1",
        link: "/",
      },
      {
        id: "3.3",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 4,
    name: "OUTDOOR ",
    dropdownList: [
      {
        id: "4.1",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.2",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.3",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.4",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 5,
    name: "UNIQUE",
    link: "/",
  },
  {
    id: 6,
    name: "HOW IT WORKS",
    link: "/",
  },
  {
    id: 7,
    name: "BECOME A PARTNER",
    link: "/",
  },
];

export default function DialogBar() {
  const {
    currency,
    setCurrency,
    language,
    setLanguage,
    isMenuOpen,
    SetIsMenuOpen,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(MainAppContext);
  const [userDetails, setUserDetails] = useState({});
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  useEffect(() => {
    // Function to fetch the menu from the backend
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/menu`
        );
        // console.log(response.data.items);
        setMenu(response.data.items);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    const getCategoriesData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/category`
        );
        console.log(response.data.categories);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Call the fetchMenu function when the component mounts
    fetchMenu();
    getCategoriesData();
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    // // console.log(user.name);
    setUserDetails(user);
    setUserLoggedIn(user ? true : false);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserLoggedIn(false);
    toast.success("Successfully logged out");
    navigate("/");
  };
  const [social, setSocial] = useState({});
  useEffect(() => {
    const getSocialMedia = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/social`
        );
        // console.log("Social media profile:", response.data.socialMedia);
        setSocial(response.data.socialMedia);
        // Handle the social media profile data as needed
      } catch (error) {
        console.error("Error getting social media profile:", error);
        // Handle error
      }
    };
    getSocialMedia();
  }, []);

  return (
    <Transition.Root show={isMenuOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${isDarkMode ? "dark" : ""} relative dark z-50`}
        onClose={SetIsMenuOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className=" relative flex items-start justify-between">
                        <RiCloseCircleFill
                          onClick={() => {
                            SetIsMenuOpen(false);
                          }}
                          className=" z-30 absolute -top-4 right-0 cursor-pointer text-[30px] text-[#FF7004] bg-white"
                        />
                      </div>
                      <div className=" relative h-full flex flex-col">
                        <div className=" w-full relative ">
                          <Link
                            to={`/`}
                            onClick={() => {
                              SetIsMenuOpen(false);
                            }}
                            style={{ outline: "none" }}
                          >
                            <p className=" outline-none border-t-[0px] py-2.5 border-[#efefef] text-gray-800 dark:text-gray-600 font-[600] plus-jakarta text-[13px] md:text-[13px] 2xl:text-[16px]">
                              Home
                            </p>
                          </Link>
                        </div>
                        <div className=" w-full relative ">
                          <Link
                            to={`/shop/all/all`}
                            onClick={() => {
                              SetIsMenuOpen(false);
                            }}
                            style={{ outline: "none" }}
                          >
                            <p className=" outline-none border-t-[1px] py-2.5 border-[#efefef] text-gray-800 dark:text-gray-600 font-[600] plus-jakarta text-[13px] md:text-[13px] 2xl:text-[16px]">
                              All Products
                            </p>
                          </Link>
                        </div>
                        {menu.map((item, index) => {
                          return (
                            <div className=" w-full relative " key={index}>
                              {!item?.subItems.length > 0 ? (
                                <Link
                                  to={item.url}
                                  onClick={() => {
                                    SetIsMenuOpen(false);
                                  }}
                                  style={{ outline: "none" }}
                                >
                                  <p
                                    className=" outline-none border-t-[1px] py-2.5 border-[#efefef] text-gray-800 dark:text-gray-600 font-[600] capitalize plus-jakarta text-[13px] md:text-[13px] 2xl:text-[16px]"
                                    key={index}
                                  >
                                    {item.title}
                                  </p>
                                </Link>
                              ) : (
                                <Menu>
                                  <Menu.Button className=" w-full flex items-center justify-between border-t-[1px] py-2.5  border-[#efefef] capitalize dark:text-gray-600 text-gray-800 font-[600] plus-jakarta text-[13px] md:text-[13px] 2xl:text-[16px] ">
                                    {item.title}
                                    <ChevronDownIcon className=" w-[15px]" />
                                  </Menu.Button>
                                  <Menu.Items className="  flex flex-col  text-[13px] md:text-[13px] 2xl:text-[16px]  dark:text-gray-600 bg-white pl-2 gap-2 w-full ">
                                    {item?.subItems?.map((e, index) => {
                                      return (
                                        <Link
                                          autoFocus="off"
                                          to={e.url}
                                          key={index}
                                        >
                                          <p
                                            className=" border-t-[1px] py-2.5 capitalize"
                                            key={index}
                                          >
                                            {e.title}
                                          </p>
                                        </Link>
                                      );
                                    })}
                                  </Menu.Items>
                                </Menu>
                              )}
                            </div>
                          );
                        })}
                        {categories?.map((item, index) => {
                          return (
                            <div className=" w-full relative " key={index}>
                              {item?.subcategories ? (
                                <Menu>
                                  <Menu.Button className=" w-full flex items-center justify-between capitalize border-t-[1px] py-2.5 border-[#efefef] dark:text-gray-600 text-gray-800 font-[600] plus-jakarta text-[13px] md:text-[13px] 2xl:text-[16px] ">
                                    {item.fileName}
                                    <ChevronDownIcon className=" w-[15px]" />
                                  </Menu.Button>
                                  <Menu.Items className="   flex flex-col  text-[13px] md:text-[13px] 2xl:text-[16px]  dark:text-gray-600 bg-white pl-2 gap-2 w-full ">
                                    {item?.subcategories?.map((e, index) => {
                                      return (
                                        <Link
                                          autoFocus="off"
                                          to={`/shop/${item?.fileName}/${e?.name}`}
                                          onClick={() => {
                                            SetIsMenuOpen(false);
                                          }}
                                          key={index}
                                        >
                                          <p
                                            className=" border-t-[1px] py-2.5 border-gray-500 capitalize"
                                            key={index}
                                          >
                                            {e?.name}
                                          </p>
                                        </Link>
                                      );
                                    })}
                                  </Menu.Items>
                                </Menu>
                              ) : (
                                <Link
                                  to={`/shop/${item?.fileName}/all`}
                                  onClick={() => {
                                    SetIsMenuOpen(false);
                                  }}
                                  style={{ outline: "none" }}
                                >
                                  <p
                                    className=" outline-none border-t-[1px] py-2.5 dark:border-gray-600 border-[#EEEEEE] text-gray-800 dark:text-gray-600 font-[600] plus-jakarta text-[13px] md:text-[13px] 2xl:text-[16px]"
                                    key={index}
                                  >
                                    {item?.fileName}
                                  </p>
                                </Link>
                              )}
                            </div>
                          );
                        })}
                        <div className=" flex flex-col text-gray-800 font-[600] plus-jakarta text-[13px] md:text-[13px] 2xl:text-[16px] ">
                          {/* <select
                            value={language}
                            onChange={(e) => {
                              setLanguage(e.target.value);
                            }}
                            className=" border-t-[1px] py-2.5 dark:border-gray-700 border-[#EEEEEE] dark:text-gray-600  bg-transparent "
                          >
                            <option value="ENG">(ENG)</option>
                            <option value="SPN">(SPN)</option>
                          </select> */}
                          <select
                            value={currency}
                            onChange={(e) => {
                              setCurrency(e.target.value);
                            }}
                            autoFocus="off"
                            className=" border-t-[1px] py-2.5 dark:border-gray-700 border-[#EEEEEE] dark:text-gray-600  bg-transparent "
                          >
                            <option className=" text-black  " value={"AED"}>
                              AED
                            </option>
                            <option className=" text-black  " value={"OMR"}>
                              OMR
                            </option>
                          </select>
                        </div>
                        {!userLoggedIn ? (
                          <Link autoFocus="off" to="/login">
                            <button
                              onClick={() => {
                                SetIsMenuOpen(false);
                              }}
                              className=" bg-orange-400  w-full  text-sm font-semibold py-1.5 rounded-sm px-4  mt-2"
                            >
                              Login
                            </button>
                          </Link>
                        ) : (
                          <div
                            onClick={() => {
                              SetIsMenuOpen(false);
                              handleLogout();
                            }}
                            className={`flex items-center gap-2 bg-[#FF7004] text-white  cursor-pointer 
                        font-[600] plus-jakarta p-3 px-5 text-[13px] md:text-[15.5px] 2xl:text-[16.5px] `}
                          >
                            <IoIosLogOut />
                            Log Out
                          </div>
                        )}
                        <div className=" absolute bottom-0 left-0 w-full flex items-center justify-between px-[3%]">
                          <Link to={social?.facebook ? social?.facebook : "/"}>
                            {" "}
                            <RiFacebookFill className=" text-[25px] p-1 rounded-full bg-[#FF7004] text-white " />
                          </Link>
                          <Link to={social?.twitter ? social?.twitter : "/"}>
                            {" "}
                            <RiTwitterFill className=" text-[25px] p-1 rounded-full bg-[#FF7004] text-white " />
                          </Link>
                          <Link to={social?.linkedin ? social?.linkedin : "/"}>
                            {" "}
                            <RiLinkedinFill className=" text-[25px] p-1 rounded-full bg-[#FF7004] text-white " />
                          </Link>
                          <Link to={social?.youtube ? social?.youtube : "/"}>
                            {" "}
                            <RiYoutubeFill className=" text-[25px] p-1 rounded-full bg-[#FF7004] text-white " />
                          </Link>
                          <Link
                            to={social?.instagram ? social?.instagram : "/"}
                          >
                            {" "}
                            <RiInstagramFill className=" text-[25px] p-1 rounded-full bg-[#FF7004] text-white " />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
