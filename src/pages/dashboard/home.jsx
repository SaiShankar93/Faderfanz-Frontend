import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { RiOrderPlayFill } from "react-icons/ri";
import { BsBox } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

import { chartsConfig } from "@/configs";
import { MainAppContext } from "@/context/MainContext";
export function Home() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [salesArray, setSalesArray] = useState([]);
  const { user } = useContext(MainAppContext);
  const [salesAmountArray, setSalesAmountArray] = useState([]);
  const [userCountByMonth, setUserCountByMonth] = useState([]);
  const websiteViewsChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Sales",
        data: salesArray,
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ["", "", "", "", "", "", ""],
      },
    },
  };

  const dailySalesChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Sales",
        data: salesAmountArray,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: [
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
        ],
      },
    },
  };

  const completedTaskChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Sales",
        data: userCountByMonth,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#388e3c"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: [
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
        ],
      },
    },
  };
  const completedTasksChart = {
    ...completedTaskChart,
    series: [
      {
        name: "Users",
        data: userCountByMonth,
      },
    ],
  };

  const statisticsChartsData = [
    {
      color: "white",
      title: "Daily Sales",
      description: "Last 7 days sales",

      chart: websiteViewsChart,
    },
    {
      color: "white",
      title: "Monthly Sales",
      description: "Monthly sales in AED ",

      chart: dailySalesChart,
    },
    {
      color: "white",
      title: "Users",
      description: "Total User Registers",

      chart: completedTasksChart,
    },
  ];

  const statisticsCardsData = [
    {
      color: "gray",
      icon: BanknotesIcon,
      title: "Total Sales",
      link: "/admindashboard/orders",
      value: `AED ${totalSales}`,
      footer: {
        color: "text-green-500",
        value: "",
        label: "total sales till now",
      },
    },
    {
      color: "gray",
      icon: BsBox,
      link: "/admindashboard/orders",
      title: "Total Orders",
      value: totalOrders,
      footer: {
        color: "",
        value: "total orders till now",
      },
    },
    {
      color: "gray",
      icon: UsersIcon,
      link: "/admindashboard/users",
      title: "Total Users",
      value: totalUsers,
      footer: {
        color: "text-green-500",
        value: `${totalUsers - totalVendors} users`,
        label: `${totalVendors} vendors`,
      },
    },
    {
      color: "gray",
      icon: RiOrderPlayFill,
      title: "Total Products",
      link: "/admindashboard/products",
      value: totalProducts,
      footer: {
        color: "text-green-500",
        value: "total listed products",
      },
    },
  ];

  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    getAllOrders();
    fetchUsers();
    getAllProducts();
  }, []);
  const [dialog, setDialog] = useState(false);
  const closeDialog = () => {
    return setDialog(false);
  };
  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      // setProducts(response.data);
      setTotalProducts(
        response?.data?.filter((i) => {
          return i?.approved === true;
        })?.length
      );
      // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  function calculateUserCountByMonth(users) {
    const userCountByMonth = new Array(12).fill(0); // Initialize array with 12 months, each having 0 users
    users.forEach((user) => {
      const createdAtDate = new Date(user.createdAt);
      const month = createdAtDate.getMonth(); // getMonth() returns zero-based index
      userCountByMonth[month]++;
    });
    return userCountByMonth;
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/getUsers`
      );
      // setUsers(response.data);
      // setUsers(response?.data?.);
      setTotalUsers(response?.data?.length);
      setTotalVendors(
        response?.data?.filter((i) => {
          return i?.role === "vendor";
        })?.length
      );
      // // console.log("users", response?.data);
      // Calculate the number of users registered per month
      const userCountByMonthArray = calculateUserCountByMonth(response?.data);
      setUserCountByMonth(userCountByMonthArray);
      // // console.log(userCountByMonthArray);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      setOrders(response.data.orders);
      setTotalOrders(response?.data?.orders?.length);
      const totalAmountSum = response?.data?.orders?.reduce((sum, obj) => {
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
        // Extract createdAt and totalAmount from the order object
        const { createdAt, totalAmount } = order;

        // Convert createdAt string to a Date object
        const orderDate = new Date(createdAt);

        // Get the month (0-based index in JavaScript)
        const month = orderDate.getMonth();

        // Add the totalAmount to the corresponding month's total sales
        monthlySales[month] += totalAmount;
      });

      setSalesAmountArray(monthlySales);

      // // console.log("ordersr", response.data.orders, totalAmountSum);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, link, title, footer, ...rest }) => (
          <Link to={link} key={title}>
            <StatisticsCard
              {...rest}
              title={title}
              icon={React.createElement(icon, {
                className: "w-6 h-6 text-white",
              })}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer.color}>{footer.value}</strong>
                  &nbsp;{footer.label}
                </Typography>
              }
            />
          </Link>
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart key={props.title} {...props} />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Recent Orders
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon
                  strokeWidth={3}
                  className="h-4 w-4 text-blue-gray-200"
                />
                <strong>{totalOrders} done</strong> this month
              </Typography>
            </div>
            {/* <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu> */}
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full border-collapse">
              <thead className="">
                <tr className="text-[#363F4D] font-[700] plus-jakarta plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Order Date</th>
                </tr>
              </thead>
              <tbody className="">
                {orders?.slice(0, 10)?.map((item, index) => {
                  return (
                    <tr key={index} className="">
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
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
