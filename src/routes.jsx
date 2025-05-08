import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PencilSquareIcon
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { IoAddCircle, IoLogOutOutline, IoPeopleOutline } from "react-icons/io5";
import Coupon from "./pages/dashboard/Coupon";
import { RiCoupon2Fill, RiMessage2Fill } from "react-icons/ri";
import {
  MdEmail,
  MdNotificationsActive,
  MdPhoto,
  MdShop,
} from "react-icons/md";
import Users from "./pages/dashboard/Users";
import Vendors from "./pages/dashboard/Vendors";
import Orders from "./pages/dashboard/Orders";
import { FaBoxes, FaHammer, FaNewspaper } from "react-icons/fa";
import Newsletter from "./pages/dashboard/Newsletter";
import Products from "./pages/dashboard/Products";
import { BsBox2, BsFilePdf } from "react-icons/bs";
import Banner from "./pages/dashboard/Banner";
import AddProduct from "./pages/dashboard/AddProduct";
import PrivacyPolicy from "./pages/dashboard/Privacy";
import Reviews from "./pages/dashboard/Reviews";
import { TiSocialInstagramCircular } from "react-icons/ti";
import Social from "./pages/dashboard/Settings";
import { HiSquares2X2 } from "react-icons/hi2";
import Categories from "./pages/dashboard/Categories";
import NewsPage from "./pages/dashboard/Blogs";
import Materials from "./pages/dashboard/Materials";
import PopupAdmin from "./pages/dashboard/Popup";
import Transactions from "./pages/dashboard/Transaction";
import { AiFillStar } from "react-icons/ai";
import TestimonialPage from "./pages/dashboard/Testimonial";
import Blogs from "./pages/dashboard/Blogs";
// import PrivacyPolicy from "./pages/dashboard/PrivacyPolicy";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/",
        element: <Home />,
      },
      {
        icon: <PencilSquareIcon {...icon} />,
        name: "Blogs",
        path: "/blogs",
        element: <Blogs />,
      },
      
      {
        icon: <FaBoxes {...icon} />,
        name: "Orders",
        path: "/orders",
        element: <Orders />,
      },
      {
        icon: <FaBoxes {...icon} />,
        name: "Transactions",
        path: "/transactions",
        element: <Transactions />,
      },
      {
        icon: <BsBox2 {...icon} />,
        name: "Products",
        path: "/products",
        element: <Products />,
      },
      {
        icon: <MdShop {...icon} />,
        name: "Vendors",
        path: "/vendors",
        element: <Vendors />,
      },
      {
        icon: <IoPeopleOutline {...icon} />,
        name: "Users",
        path: "/users",
        element: <Users />,
      },
      {
        icon: <RiMessage2Fill {...icon} />,
        name: "Reviews",
        path: "/reviews",
        element: <Reviews />,
      },
      {
        icon: <IoAddCircle {...icon} />,
        name: "Add-Product",
        path: "/add-product",
        element: <AddProduct />,
      },
      {
        icon: <FaHammer {...icon} />,
        name: "Materials",
        path: "/materials",
        element: <Materials />,
      },
      {
        icon: <MdEmail {...icon} />,
        name: "Newsletter",
        path: "/newsletter",
        element: <Newsletter />,
      },
      {
        icon: <RiCoupon2Fill {...icon} />,
        name: "Coupon",
        path: "/coupon",
        element: <Coupon />,
      },
      {
        icon: <MdPhoto {...icon} />,
        name: "Ads-Banner",
        path: "/ads-banner",
        element: <Banner />,
      },
      {
        icon: <HiSquares2X2 {...icon} />,
        name: "Categories",
        path: "/categories",
        element: <Categories />,
      },
      {
        icon: <MdPhoto {...icon} />,
        name: "Privacy-Policy",
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      
      {
        icon: <AiFillStar {...icon} />,
        name: "Testimonial",
        path: "/testimonial",
        element: <TestimonialPage />,
      },
      {
        icon: <TiSocialInstagramCircular {...icon} />,
        name: "links",
        path: "/links",
        element: <Social />,
      },
      {
        icon: <MdNotificationsActive {...icon} />,
        name: "Popup Admin",
        path: "/popup-admin",
        element: <PopupAdmin />,
      },
      // {
      //   icon: <BsFilePdf {...icon} />,
      //   name: "Privacy-Pol",
      //   path: "/privacy-pol",
      //   element: <PrivacyPolicy />,
      // },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Vendors List",
      //   path: "/tables",
      //   element: <Tables />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "Vendors List",
      //   path: "/tables",
      //   element: <Tables />,
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
      // {
      //   icon: <IoLogOutOutline {...icon} />,
      //   name: "Logout",
      //   path: "/admin-logout",
      //   element: <Notifications />,
      // },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
