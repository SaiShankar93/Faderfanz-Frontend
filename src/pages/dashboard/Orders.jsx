import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { sortMethods, sortProducts } from "../../utilities/SortMethod";
import VendorDetailsDialog from "../VendorDetailsDialog";
import { IoMail, IoMoonSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MainAppContext } from "@/context/MainContext";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { BsArrowLeftCircle } from "react-icons/bs";
import { DashboardNavbar, Sidenav } from "@/widgets/layout";
import { MdOutlineWbSunny } from "react-icons/md";
import routes from "@/routes";
import { setOpenSidenav, useMaterialTailwindController } from "@/context";
import { RiMenu3Line } from "react-icons/ri";

const OrdersData = [
  {
    id: 1,
    orderId: "257",
    email: "selem@hhh.com",
    weight: "1500",
    total: "44.00",
    status: "pending",
    date: "Mar 17, 2024",
  },
  {
    id: 2,
    orderId: "397",
    email: "minnadb@hhh.com",
    weight: "500",
    total: "989.00",
    status: "Received",
    date: "Feb 27, 2024",
  },
  {
    id: 3,
    orderId: "437",
    email: "kaowihu@hhh.com",
    weight: "250",
    total: "87.00",
    status: "returned",
    date: "Jan 01, 2024",
  },
  {
    id: 4,
    orderId: "397",
    email: "wirwnadb@hhh.com",
    weight: "9300",
    total: "4489.00",
    status: "Received",
    date: "Nov 27, 2023",
  },
  {
    id: 4,
    orderId: "637",
    email: "fFewihu@hhh.com",
    weight: "43500",
    total: "1027.00",
    status: "returned",
    date: "Dec 01, 2024",
  },
];
const filterMethods = [
  { id: 1, name: "See All", value: "" },
  { id: 2, name: "Received", value: "Received" },
  { id: 3, name: "Returned", value: "Returned" },
  { id: 4, name: "Pending", value: "Pending" },
];
const Orders = () => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav, sidenavType } = controller;
  const [sortMethod, setSortMethod] = useState(2);
  const [isNav, setIsNav] = useState(false);
  const [filterMethod, setFilterMethod] = useState("");
  const [sortedArray, setSortedArray] = useState([]);
  // const [selectedItem, setSelectedItem] = useState("");
  const [orders, setOrders] = useState([]);
  const [sortedArrayCount, setSortedArrayCount] = useState(OrdersData.length);
  const [deliveryDates, setDeliveryDates] = useState({});
  const { user, selectedItem, setSelectedItem } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    getAllOrders();
  }, []);
  const [dialog, setDialog] = useState(false);
  const closeDialog = () => {
    return setDialog(false);
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/order`
      );
      setOrders(response.data.orders);
      const initialDeliveryDates = {};
      response.data.orders.forEach((order) => {
        initialDeliveryDates[order._id] = "";
      });
      setDeliveryDates(initialDeliveryDates);
      // console.log(response.data.orders);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleUpdateDelivery = async (orderId) => {
    try {
      const deliveryDate = deliveryDates[orderId];
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/updateDelivery`,
        {
          orderId,
          deliveryDate,
        }
      );
      toast.success("Delivery date updated successfully!");
      // console.log("Delivery date updated successfully!");
    } catch (error) {
      console.error("Error updating delivery date:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/admin/orderStatus`,
        {
          orderId,
          newStatus,
        }
      );
      toast.success(res.data.message);
      // console.log("Order status updated successfully!");
      getAllOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response.data.error);
    }
  };
  const { isDarkMode, SetIsDarkMode } = useContext(MainAppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  // Calculate the start index and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const totalPages = Math.ceil(
    orders.filter((i) => {
      if (filterMethod !== "") {
        return i.status.toLowerCase() === filterMethod.toLowerCase();
      } else {
        return i;
      }
    }) / pageSize
  );

  // Function to handle changing the page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className=" open-sans w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10 z-50">
      <div className=" flex items-center gap-2 md:justify-between"></div>

      <p className=" flex items-center gap-3 dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Orders
      </p>

      <div className=" flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/5 bg-white p-3 md:p-5 ">
        <div className="overflow-x-auto">
          {/* <div className=" flex flex-col md:flex-row md:items-center justify-between">
            <p className=" text-sm font-semibold">
              We found {sortedArrayCount} items for you! 
            </p>
            <div className=" flex flex-col md:flex-row md:items-center gap-3 py-2">
              <select
                value={sortMethod}
                onChange={(e) => {
                  setSortMethod(e.target.value);
                }}
                className=" md:w-[250px] p-2 dark:bg-transparent dark:text-gray-400 text-[#4F5D77] font-semibold bg-[#f2f2f2] text-[12.5px] md:text-[14.4px]"
              >
                {sortMethods.map((method, index) => {
                  return (
                    <option
                      key={index}
                      value={method.value}
                      className=" text-black"
                    >
                      {method.name}
                    </option>
                  );
                })}
              </select>
              <select
                value={filterMethod}
                onChange={(e) => {
                  setFilterMethod(e.target.value);
                }}
                className=" w-full p-2 dark:bg-transparent dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] font-semibold text-[12.5px] md:text-[14.4px]"
              >
                {filterMethods.map((method, index) => {
                  return (
                    <option key={index} value={method.value}>
                      {method.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div> */}
          {dialog && (
            <VendorDetailsDialog
              close={closeDialog}
              data={selectedItem}
              heading={"Order"}
            />
          )}
          <table className="w-full border-collapse">
            <thead className="">
              <tr className="text-[#363F4D] font-[700] plus-jakarta plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                <th className="py-2 px-4">#ID</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Order Date</th>
                <th className="py-2 px-4">Delivery Date</th>
                <th className="py-2 px-4">Action</th>
                <th className="py-2 px-4">Mail</th>
              </tr>
            </thead>
            <tbody className="">
              {orders
                .filter((i) => {
                  if (filterMethod !== "") {
                    return (
                      i.status.toLowerCase() === filterMethod.toLowerCase()
                    );
                  } else {
                    return i;
                  }
                })
                .slice(startIndex, endIndex)
                .map((item, index) => {
                  return (
                    <tr key={index} className="">
                      <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                        #{item._id}
                      </td>

                      <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  text-[#FF7004] font-[600] plus-jakarta">
                        {item.customer.email}
                      </td>
                      <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                        AED {item.totalAmount}
                      </td>
                      <td>
                        <select
                          className={`text-center rounded-md py-1 w-full outline-none text-sm font-semibold ${
                            item.status === "orderReceived"
                              ? "bg-orange-200 text-orange-700"
                              : item.status === "inProgress"
                              ? "bg-green-200 text-green-700"
                              : item.status === "qualityCheck"
                              ? "bg-red-200 text-red-700"
                              : item.status === "outForDelivery"
                              ? "bg-blue-200 text-blue-700"
                              : item.status === "orderDelivered"
                              ? "bg-purple-200 text-purple-700"
                              : "bg-purple-200 text-purple-700"
                          }
                          rounded-md py-1 w-full outline-none text-sm font-semibold`}
                          value={item?.status}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value)
                          }
                        >
                          <option
                            className=" bg-white text-black"
                            value="orderReceived"
                          >
                            Order Received
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="inProgress"
                            selected="selected"
                          >
                            In Progress
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="qualityCheck"
                          >
                            Quality Check
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="outForDelivery"
                          >
                            Out For Delivery
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="orderDelivered"
                          >
                            Order Delivered
                          </option>
                        </select>
                      </td>
                      <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px] flex items-center justify-center">
                        <input
                          type="date"
                          className="mr-2"
                          value={deliveryDates[item._id]}
                          onChange={(e) =>
                            setDeliveryDates({
                              ...deliveryDates,
                              [item._id]: e.target.value,
                            })
                          }
                        />
                        <button
                          title="Update Delivery Date"
                          className="bg-[#FF7004] px-1 py-2 my-1 w-[80px] sm:w-[70px] lg:w-[70px] mx-auto font-medium text-[10px] md:text-[11px] text-white"
                          onClick={() => handleUpdateDelivery(item._id)}
                        >
                          Update
                        </button>
                      </td>

                      <td className="  items-center gap-2 py-2 px-4">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setDialog(true);
                          }}
                          title="view order"
                          className="bg-[#FF7004] px-4 py-2.5 my-1 w-[100px] sm:w-[150px] lg:w-full mx-auto font-medium text-[11.2px] md:text-[13px] text-white"
                        >
                          View
                        </button>
                      </td>
                      <td className="  items-center gap-2 py-2 px-4">
                        <Link to="/admindashboard/newsletter">
                          <button className=" px-4 py-2.5 my-1 text-[22px] mx-auto font-medium  text-black dark:text-white">
                            <IoMail />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div class="flex items-center justify-end gap-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              class="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  ></path>
                </svg>
              </span>
            </button>
            <p className="block font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Page <strong className="text-gray-900">{currentPage}</strong> of
              <strong className="text-gray-900">{totalPages}</strong>
            </p>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
