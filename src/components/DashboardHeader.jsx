import React, { useContext, useEffect, useState } from "react";
import { MdCastConnected, MdOutlineWbSunny, MdPerson } from "react-icons/md";
import { DashboardAppContext } from "../context/DashboardContext";
import { MainAppContext } from "@/context/MainContext";
import { IoMoonSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  RiCloseCircleFill,
  RiMessage3Line,
  RiMoneyDollarCircleFill,
  RiShoppingBag2Fill,
} from "react-icons/ri";
import { HiHome } from "react-icons/hi2";
import { IoMdCart } from "react-icons/io";
import { MdSettings, MdShop2 } from "react-icons/md";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const DashboardTabs = [
  {
    id: 1,
    name: "Dashboard",
    type: "tab",
    link: "/dashboard",
    icon: <HiHome className=" text-[21px]" />,
  },
  {
    id: 2,
    name: "Orders",
    type: "tab",
    link: "/dashboard/orders",
    icon: <IoMdCart className=" text-[21px]" />,
  },
  {
    id: 3,
    name: "Product List",
    type: "tab",
    link: "/dashboard/products",
    icon: <RiShoppingBag2Fill className=" text-[21px]" />,
  },
  {
    id: 4,
    name: "Add Product",
    type: "tab",
    link: "/dashboard/add-product",
    icon: <FaPlusCircle className=" text-[21px]" />,
  },
  {
    id: 5,
    name: "Payments",
    type: "tab",
    link: "/dashboard/payments",
    icon: <RiMoneyDollarCircleFill className=" text-[21px]" />,
  },
  {
    id: 6,
    name: "Reviews",
    type: "tab",
    link: "/dashboard/reviews",
    icon: <RiMessage3Line className=" text-[21px]" />,
  },
];
const DashboardHeader = () => {
  const { isVendorDialogOpen, setIsVendorDialogOpen } =
    useContext(DashboardAppContext);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [activeTab, setactiveTab] = useState(1);
  const [userDetails, setUserDetails] = useState({});
  const [vendorNav, setVendorNav] = useState(false);
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
    <div className=" py-3.5 gap-3 px-[2%] w-full flex items-center justify-end">
      <Link to="/profile">
        <button className=" bg-black hidden lg:block text-sm font-semibold py-1.5 rounded-sm px-4 ml-2 text-white">
          Customer Dashboard
        </button>
      </Link>
      {/* <MdCastConnected className=" text-[23px] cursor-pointer" /> */}
      {userLoggedIn && userDetails?.role == "admin" && (
        <Link to="/admindashboard">
          <button className=" bg-black hidden lg:block text-sm font-semibold py-1.5 rounded-sm px-4 ml-2 text-white">
            Admin Dashboard
          </button>
        </Link>
      )}
      {!isDarkMode ? (
        <MdOutlineWbSunny
          title="lightmode"
          onClick={() => {
            SetIsDarkMode(true);
            localStorage.setItem("darkMode", "dark");
          }}
          className=" text-[22px] cursor-pointer"
        />
      ) : (
        <IoMoonSharp
          title="darkmode"
          onClick={() => {
            SetIsDarkMode(false);
            localStorage.setItem("darkMode", "");
          }}
          className=" text-[19px] cursor-pointer"
        />
      )}
      <MdPerson
        onClick={() => {
          setIsVendorDialogOpen(true);
        }}
        className=" text-[23px] cursor-pointer"
      />
      <div className=" relative">
        <BsThreeDotsVertical
          onClick={() => {
            setVendorNav((prev) => !prev);
          }}
          className=" cursor-pointer text-[22px]"
        />
        <div>
          {vendorNav && (
            <div className=" absolute top-10 right-0 bg-white shadow-sm shadow-black/30">
              {DashboardTabs.map((tab, index) => {
                return (
                  <Link
                    onClick={() => {
                      setVendorNav(false);
                      setactiveTab(tab.id);
                    }}
                    key={index}
                    to={tab.link}
                    className={`flex w-max min-w-full items-center gap-2 ${
                      activeTab === tab.id
                        ? " text-white bg-orange-400"
                        : "text-[#7A7A7A]"
                    }  cursor-pointer hover:bg-gray-100 hover:text-black font-[600] plus-jakarta p-3 px-10 text-[13px] md:text-[16px] 2xl:text-[16.5px] focus:outline-none `}
                  >
                    {tab.icon}
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
