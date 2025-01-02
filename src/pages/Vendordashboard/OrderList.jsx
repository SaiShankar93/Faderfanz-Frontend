import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { sortMethods, sortProducts } from "../../utilities/SortMethod";
import VendorDetailsDialog from "../VendorDetailsDialog";
import { IoMail } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MainAppContext } from "@/context/MainContext";

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
const OrderList = () => {
  const [sortMethod, setSortMethod] = useState(2);
  const [filterMethod, setFilterMethod] = useState("");
  const [sortedArray, setSortedArray] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sortedArrayCount, setSortedArrayCount] = useState(OrdersData.length);
  const [deliveryDates, setDeliveryDates] = useState({});
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "vendor" && user1?.role !== "vendor") {
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
      // const user = JSON.parse(localStorage.getItem("user"));
      // console.log(user);
      setOrders(
        response.data.orders
          ?.flatMap((order) => order.products)
          ?.filter((order) => order?.product?.vendorId === user?._id)
      );
      // // console.log("ordersr", response.data.orders, totalAmountSum);
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

  return (
    <div className=" quicksand w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
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
          <table className="w-full border-collapse">
            <thead className="">
              <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                <th className="py-2 px-4">#ID</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Order Date</th>
                <th className="py-2 px-4">Delivery Date</th>
                <th className="py-2 px-4">Action</th>
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
                .map((item, index) => {
                  return (
                    <tr key={index} className="">
                      <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                        #{item._id}
                      </td>
                      {dialog && (
                        <VendorDetailsDialog
                          close={closeDialog}
                          data={item}
                          heading={"Order"}
                        />
                      )}
                      <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  text-[#FF7004] font-[600] plus-jakarta">
                        {item.customer.email}
                      </td>
                      <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                        AED {item.totalAmount}
                      </td>
                      <td>
                        <select
                          className={`text-center ${
                            item.status.toLowerCase() === "pending"
                              ? "bg-orange-200 text-orange-600"
                              : item.status.toLowerCase() === "returned"
                              ? "bg-red-200 text-red-700"
                              : item.status.toLowerCase() === "received"
                              ? "bg-green-200 text-green-700"
                              : "bg-blue-200 text-blue-600"
                          }
                          rounded-md py-1 w-full outline-none text-sm font-semibold`}
                          value={item?.status}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value)
                          }
                        >
                          <option
                            className=" bg-white text-black"
                            value="returned"
                          >
                            Returned
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="pending"
                            selected="selected"
                          >
                            Pending
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="dispatched"
                          >
                            Dispatched
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="received"
                          >
                            Received
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
                            setDialog(true);
                          }}
                          title="send email"
                          className="bg-[#FF7004] px-4 py-2.5 my-1 w-[100px] sm:w-[150px] lg:w-full mx-auto font-medium text-[11.2px] md:text-[13px] text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <p className=" dark:text-gray-400 text-[#FF7004] text-[11.2px] md:text-[13.5px] mt-2 font-semibold text-center ">
            No More Orders !
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
