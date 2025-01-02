import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import {
  RiCloseCircleFill,
  RiMessage3Line,
  RiMoneyDollarCircleFill,
  RiShoppingBag2Fill,
} from "react-icons/ri";
import { DashboardAppContext } from "../context/DashboardContext";
import { HiHome } from "react-icons/hi2";
import { IoMdCart } from "react-icons/io";
import { MdPerson, MdSettings, MdShop2 } from "react-icons/md";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { MainAppContext } from "@/context/MainContext";
import { useAuth } from "@/context/AuthContext";

export default function VendorDialog() {
  const { isVendorDialogOpen, setIsVendorDialogOpen } =
    useContext(DashboardAppContext);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [activeTab, setactiveTab] = useState(1);
  const [userDetails, setUserDetails] = useState({});
  const { isDarkMode, SetIsDarkMode } = useContext(MainAppContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);
    setUserDetails(user);
    var themeMode = localStorage.getItem("darkMode");
    if (themeMode === "dark") {
      return SetIsDarkMode(true);
    } else {
      return SetIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user.role);
    setUserDetails(user);
  }, [userLoggedIn]);

  return (
    <Transition.Root show={isVendorDialogOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${isDarkMode ? "dark" : ""} relative dark z-10`}
        onClose={setIsVendorDialogOpen}
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
          <div className="fixed inset-0 bg-gray-500 dark:bg-black/20 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-black shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className=" relative flex items-start justify-between">
                        <Link
                          onClick={() => {
                            setIsVendorDialogOpen(false);
                            setactiveTab(7);
                          }}
                          to={"/dashboard/settings"}
                          className={`mt-3 border-t border-gray-300 flex items-center gap-2 ${
                            activeTab === 7
                              ? "bg-orange-400 hover:bg-orange-400"
                              : "text-[#7A7A7A]"
                          } cursor-pointer hover:bg-gray-100 hover:text-black font-[600] plus-jakarta p-3 px-5 text-[13px] md:text-[16px] 2xl:text-[16.5px] focus:outline-none`}
                        >
                          <MdSettings className="text-[21px]" />
                          Settings
                        </Link>
                        <RiCloseCircleFill
                          onClick={() => {
                            setIsVendorDialogOpen(false);
                          }}
                          className="z-30 text-[30px] text-[#FF7004] cursor-pointer"
                        />
                      </div>
                      <div className="relative h-full flex flex-col">
                        <Link
                          onClick={() => {
                            setIsVendorDialogOpen(false);
                          }}
                          to={"/profile"}
                          className={`flex items-center gap-2  text-[#7A7A7A] cursor-pointer hover:bg-gray-100 font-[600] plus-jakarta p-3 px-5 text-[13px] md:text-[16px] 2xl:text-[16.5px] focus:outline-none`}
                        >
                          <MdPerson className="text-[21px]" />
                          Customer dashboard
                        </Link>
                        {userLoggedIn && userDetails?.role == "admin" && (
                          <Link
                            onClick={() => {
                              setIsVendorDialogOpen(false);
                            }}
                            to="/admindashboard"
                            className={`flex items-center gap-2  text-[#7A7A7A] cursor-pointer hover:bg-gray-100 font-[600] plus-jakarta p-3 px-5 text-[13px] md:text-[16px] 2xl:text-[16.5px] focus:outline-none`}
                          >
                            <MdShop2 className="text-[21px]" />
                            Admin Dashboard
                          </Link>
                        )}
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
