import React, { useContext, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaDollarSign,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import { HiSquares2X2 } from "react-icons/hi2";
import { MdPlayCircleOutline } from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import VendorDetailsDialog from "../VendorDetailsDialog";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};
const Dashboard = () => {
  const [dialog, setDialog] = useState(false);
  const [dialog2, setDialog2] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState(0);
  const [salesArray, setSalesArray] = useState([]);
  const [salesAmountArray, setSalesAmountArray] = useState([]);
  const [userCountByMonth, setUserCountByMonth] = useState([]);
  const { user } = useContext(MainAppContext);

  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    // if (user?.role !== "vendor" && user1?.role !== "vendor") {
    //   navigate("/login");
    // }
  }, []);
  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: salesArray,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Profits",
        data: salesAmountArray,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const DetailTabs = [
    {
      id: 1,
      heading: "Revenue",
      value: `AED ${totalSales}`,
      logo: (
        <FaDollarSign className=" bg-green-300 text-[40px] p-3 rounded-full" />
      ),
    },
    {
      id: 2,
      heading: "Underway Orders",
      value: totalOrders,
      logo: <FaTruck className=" bg-green-300 text-[40px] p-3 rounded-full" />,
    },
    {
      id: 3,
      heading: "Products",
      value: totalProducts,
      logo: (
        <HiSquares2X2 className=" bg-orange-300 text-[40px] p-3 rounded-full" />
      ),
    },
    {
      id: 4,
      heading: "Completed Orders",
      value: totalCompletedOrders,
      logo: (
        <FaShoppingBag className=" bg-blue-300 text-[40px] p-3 rounded-full" />
      ),
    },
  ];

  const closeDialog = () => {
    return setDialog(false);
  };
  const closeDialog2 = () => {
    return setDialog2(false);
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders();
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      // console.log(response.data);
      setTotalProducts(
        response?.data?.filter((i) => {
          return i?.approved === true && i?.vendorId === user?._id;
        })?.length
      );
      setProducts(
        response?.data?.filter((i) => {
          return i?.approved === true && i?.vendorId === user?._id;
        })
      );
      // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const calculateTotalOrdersLast7Days = (orders) => {
    const today = new Date();
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }

    const totalOrdersLast7Days = last7Days.map((date) => {
      const ordersOnDate = orders.filter((order) => {
        const orderDate = order.createdAt.split("T")[0];
        return orderDate === date;
      });
      return ordersOnDate.length;
    });

    return totalOrdersLast7Days;
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
      // setOrders(response.data.orders);
      setTotalOrders(
        response.data.orders
          ?.flatMap((order) => order.products)
          ?.filter((order) => order?.product?.vendorId === user?._id)?.length
      );
      // console.log(response.data.orders);
      const totalAmountSum = response.data.orders
        ?.flatMap((order) => order.products)
        ?.filter((order) => order?.product?.vendorId === user?._id)
        ?.reduce((sum, obj) => {
          return sum + Number(obj.totalAmount);
        }, 0);
      setTotalSales(totalAmountSum);
      const totalOrdersLast7Days = calculateTotalOrdersLast7Days(
        response?.data?.orders
      );
      setSalesArray(totalOrdersLast7Days);
      const monthlySales = new Array(12).fill(0);

      // Iterate over the orders
      response.data.orders?.forEach((order) => {
        if (order?.product?.vendorId === user?._id) {
          // Extract createdAt and totalAmount from the order object
          const { createdAt, totalAmount } = order;

          // Convert createdAt string to a Date object
          const orderDate = new Date(createdAt);

          // Get the month (0-based index in JavaScript)
          const month = orderDate.getMonth();

          // Add the totalAmount to the corresponding month's total sales
          monthlySales[month] += totalAmount;
        }
      });

      setSalesAmountArray(monthlySales);

      // // console.log("ordersr", response.data.orders, totalAmountSum);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className=" quicksand w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black dark:text-gray-400 px-[4%] py-10">
      <p className="dark:text-gray-400  text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Dashboard
      </p>
      <p className="dark:text-gray-400 text-[#4F5D77] text-[12px] md:text-[13px] 2xl:text-[14px] font-medium -mt-1 ">
        Whole data about your business here
      </p>
      <div className=" grid grid-cols-2 gap-y-3 gap-x-3 md:grid-cols-3 lg:grid-cols-4 mt-7 ">
        {DetailTabs.map((card, index) => {
          return (
            <div
              key={index}
              className=" flex items-center gap-2  dark:bg-white/5 bg-white py-4 px-3 lg:w-[84%] rounded-md shadow-sm shadow-black/35"
            >
              {card.logo}

              <div className=" flex flex-col justify-between">
                <p className="  text-[12px] md:text-[13px] 2xl:text-[14px] font-bold plus-jakarta ">
                  {card.heading}
                </p>
                <p className="  text-[15px] md:text-[19px] 2xl:text-[22px] font-bold plus-jakarta ">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className=" flex flex-col gap-3 mt-7  dark:bg-white/5 bg-white rounded-lg lg:p-4 ">
        <p className=" font-bold plus-jakarta text-[16px] md:text-[18px] 2xl:text-[19px] p-4 pb-0 lg:p-0 mb-3 ">
          Sale statistics
        </p>
        <Line options={options} data={data} />
      </div>

      <div className=" flex flex-col lg:grid grid-cols-3 gap-10 mt-7">
        <div className=" col-span-2">
          <p className=" font-bold plus-jakarta text-[16px] md:text-[18px] 2xl:text-[19px] mb-3 ">
            New Products
          </p>
          {products?.length > 0 ? (
            <>
              {" "}
              {products?.slice(0, 3).map((item, index) => {
                return (
                  <div
                    className=" flex w-full justify-between  dark:bg-white/5 bg-white p-2 lg:p-6"
                    key={index}
                  >
                    {dialog && (
                      <VendorDetailsDialog
                        close={closeDialog}
                        data={item}
                        heading={"Product"}
                      />
                    )}
                    <div className=" flex ">
                      <img
                        className=" h-[65px] mr-4 w-[65px] object-cover"
                        src="/Images/prod1.png"
                        alt="product-img"
                      />
                      <div className=" flex flex-col">
                        <p className="dark:text-gray-400 text-[#495057] font-[700] plus-jakarta text-[13px] md:text-[16.5px] 2xl:text-[18px]  ">
                          Chair furniture armchair cozy
                        </p>
                        <p className="dark:text-gray-400 text-[#ADB5BD] text-[11px] md:text-[13.5px] 2xl:text-[14px]">
                          Office & Stationery
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDialog(true);
                      }}
                      className=" bg-[#FF7004] px-7 py-2.5 my-1 h-fit rounded-md font-medium text-[11.2px] md:text-[13px] text-white "
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </>
          ) : (
            <p>You have not added any Products</p>
          )}
        </div>
        <div>
          <p className=" font-bold plus-jakarta text-[16px] md:text-[18px] 2xl:text-[19px] mb-3 ">
            Recent Underway Orders
          </p>
          {orders?.filter((i) => {
            return i.status !== "received" || "returned";
          })?.length > 0 ? (
            <>
              {orders
                ?.filter((i) => {
                  return i.status !== "received" || "returned";
                })
                ?.slice(0, 3)
                .map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" flex items-center gap-1 lg:gap-3  dark:bg-white/5 bg-white rounded-md p-2 lg:p-4 "
                    >
                      <MdPlayCircleOutline className=" mb-2.5 text-[#FF7004]" />
                      <p className="dark:text-gray-400 text-[#495057] font-bold plus-jakarta text-[13px] md:text-[16.5px] 2xl:text-[18px] mb-3 ">
                        March 17
                      </p>
                      <FaArrowRight className=" mb-2.5 text-[#FF7004]" />
                      <p className=" font-medium dark:text-gray-400 text-[#4F5D77] text-[11px] md:text-[13.5px] 2xl:text-[14.5px] mb-3 ">
                        Order ID: #257
                      </p>
                    </div>
                  );
                })}
            </>
          ) : (
            <p>You don't have any underway orders</p>
          )}
        </div>
      </div>

      <div className=" flex flex-col mt-7 overflow-x-scroll ">
        <p className=" font-bold plus-jakarta text-[16px] md:text-[18px] 2xl:text-[19px] mb-3 ">
          Latest orders
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="">
              <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                <th className="py-2 px-4">Id</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Order Date</th>
              </tr>
            </thead>
            <tbody className="">
              {orders?.length > 0 ? (
                <>
                  {orders?.slice(0, 10)?.map((item, index) => {
                    return (
                      <tr key={index} className="">
                        <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  dark:text-gray-400 text-[#495058]  font-[600] plus-jakarta">
                          #{item.customer._id}
                        </td>
                        <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  text-[#FF7004] font-[600] plus-jakarta">
                          {item.customer.email}
                        </td>
                        <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                          AED {item.totalAmount}
                        </td>
                        <td>
                          <p
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
                            onChange={(e) => {}}
                          >
                            {item?.status}
                          </p>
                        </td>
                        <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                          {new Date(item.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    );
                  })}{" "}
                </>
              ) : (
                <p>You don't have any orders</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
