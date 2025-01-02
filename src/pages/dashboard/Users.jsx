import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { sortMethods, sortProducts } from "../../utilities/SortMethod";
import VendorDetailsDialog from "../VendorDetailsDialog";
import { IoMail } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";

const OrdersData = [
  {
    id: 1,
    orderId: "257",
    name: "kljhg",
    email: "selem@hhh.com",
    phone: "987654568764",
    orders: 6,
    verified: true,
    date: "Mar 17, 2024",
  },
  {
    id: 2,
    orderId: "397",
    name: "kljhg",
    email: "minnadb@hhh.com",
    phone: "987654568764",
    orders: 6,
    verified: false,
    date: "Feb 27, 2024",
  },
  {
    id: 3,
    orderId: "437",
    name: "kljhg",
    email: "kaowihu@hhh.com",
    phone: "987654568764",
    orders: 6,
    verified: true,
    date: "Jan 01, 2024",
  },
  {
    id: 4,
    orderId: "397",
    name: "kljhg",
    email: "wirwnadb@hhh.com",
    phone: "987654568764",
    orders: 6,
    verified: false,
    date: "Nov 27, 2023",
  },
  {
    id: 4,
    orderId: "637",
    name: "kljhg",
    email: "fFewihu@hhh.com",
    phone: "987654568764",
    orders: 6,
    verified: true,
    date: "Dec 01, 2024",
  },
];
const filterMethods = [
  { id: 1, name: "See All", value: "" },
  { id: 2, name: "level 2", value: "level 2" },
  { id: 3, name: "level 1", value: "level 1" },
  { id: 4, name: "level 3", value: "level 3" },
];
const Users = () => {
  const [sortMethod, setSortMethod] = useState(2);
  const [filterMethod, setFilterMethod] = useState("");
  const [sortedArray, setSortedArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedArrayCount, setSortedArrayCount] = useState(OrdersData.length);

  useEffect(() => {
    setSortedArray(sortProducts(sortMethod, OrdersData));
  }, [OrdersData, sortMethod]);
  const [dialog, setDialog] = useState(false);
  const closeDialog = () => {
    return setDialog(false);
  };
  const [users, setUsers] = useState([]);
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, []);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/getUsers`
      );
      setUsers(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const fetchSubscribedUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/subscribe`
      );
      setSubscribedUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUsers();
    fetchSubscribedUsers();
  }, []);

  const isSubscribed = (email) => {
    return subscribedUsers.some((user) => user.email === email);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  // Calculate the start index and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const totalPages = Math.ceil(
    users?.filter((i) => {
      if (filterMethod !== "") {
        return i.status.toLowerCase() === filterMethod.toLowerCase();
      } else {
        return i;
      }
    }).length / pageSize
  );

  // Function to handle changing the page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className=" w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Users
      </p>
      {loading ? (
        <div className=" w-full flex items-center justify-center py-3">
          <img
            src="/Images/loader.svg"
            alt="loading..."
            className=" object-contain w-[60px] h-[60px]"
          />
        </div>
      ) : (
        <div className=" flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/5 bg-white p-3 md:p-5 ">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="">
                <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                  <th className="py-2 px-4">#ID</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Subscription Status</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Orders</th>
                  {/* <th className="py-2 px-4">Level</th> */}
                  <th className="py-2 px-4">Action</th>
                  <th className="py-2 px-4">Mail</th>
                </tr>
              </thead>
              <tbody className="">
                {users
                  ?.filter((i) => {
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
                        <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta plus-jakarta">
                          #{item.orderId}
                        </td>
                        {dialog && (
                          <VendorDetailsDialog
                            close={closeDialog}
                            data={item}
                            heading={"Vendor Detail"}
                          />
                        )}
                        <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  dark:text-gray-400 text-[#495058]  font-[600] plus-jakarta plus-jakarta">
                          {item.name}
                        </td>
                        <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  text-[#FF7004] font-[600] plus-jakarta plus-jakarta">
                          {item.email}
                        </td>
                        <td
                          className={`text-center py-2 px-4 ${
                            isSubscribed(item.email)
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {isSubscribed(item.email)
                            ? "Subscribed"
                            : "Unsubscribed"}
                        </td>
                        <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                          {item?.phone}
                        </td>
                        <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                          {item?.orders}
                        </td>
                        {/* <td>{item?.isVerified ? "Verified" : "Not Verified"}</td> */}
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
                        <td className="  items-center gap-2 py-2 px-4">
                          <Link
                            to={`/admindashboard/newsletter?email=${item.email}`}
                          >
                            <button className=" px-4 py-2.5 my-1 text-[22px] mx-auto font-medium text-black  dark:text-white ">
                              <IoMail />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="flex items-center justify-end gap-8">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
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
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
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
      )}
    </div>
  );
};

export default Users;
