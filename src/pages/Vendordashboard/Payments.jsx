import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { sortProducts } from "../../utilities/SortMethod";
import { MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
export const sortMethods = [
  {
    id: 0,
    name: "  Date: New to Old",
    value: 0,
  },
  {
    id: 1,
    name: "Date: Old to New",
    value: 1,
  },

  {
    id: 4,
    name: "Amount: Low to High",
    value: 4,
  },
  {
    id: 5,
    name: "Amount: High to low",
    value: 5,
  },
];
const PaymentsData = [
  {
    id: 1,
    PaymentId: "12",
    fee: "0.0",
    total: "44.00",
    status: "pending",
    method: "Bank",
    date: "Mar 17, 2024",
    comment: "lkjhg",
  },
  {
    id: 2,
    PaymentId: "322",
    fee: "987.0",
    total: "98764.00",
    status: "received",
    method: "COD",
    date: "Feb 17, 2024",
    comment: "lkjouytgg",
  },
  {
    id: 3,
    PaymentId: "22",
    fee: "0.0",
    total: "908.00",
    status: "refunded",
    method: "Bank",
    date: "Dec 27, 2025",
    comment: "lkjouytgjhghfg",
  },
];
const filterMethods = [
  { id: 1, name: "See All", value: "" },
  { id: 2, name: "Received", value: "Received" },
  { id: 3, name: "Refunded", value: "Refunded" },
  { id: 4, name: "Pending", value: "Pending" },
  { id: 4, name: "bank", value: "bank" },
  { id: 4, name: "COD", value: "cod" },
];
const Payments = () => {
  const [sortMethod, setSortMethod] = useState(2);
  const [filterMethod, setFilterMethod] = useState("");
  const [sortedArray, setSortedArray] = useState([]);

  useEffect(() => {
    setSortedArray(sortProducts(sortMethod, PaymentsData));
  }, [PaymentsData, sortMethod]);
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (
      (user && user?.role !== "vendor") ||
      (user1 && user1?.role !== "vendor")
    ) {
      navigate("/login");
    }
  }, []);
  const { currency } = useContext(DashboardAppContext);

  return (
    <div className=" quicksand w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black px-[4%] py-4 md:py-10">
      <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Payments
      </p>
      <div className=" flex flex-col mt-3 rounded-md bg-white dark:bg-white/5 p-3 md:p-5 ">
        <div className="overflow-x-auto">
          <div className="  grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className=" flex flex-col">
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#495058]">
                Balance:
              </p>
              <p className="text-[14px] md:text-[17px] 2xl:text-[18px] mb-2 text-[#00B517] font-[700] plus-jakarta">
                {currency} 781.55
              </p>
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#495058]">
                Last Requested:
              </p>
              <p className="text-[14px] md:text-[17px] 2xl:text-[18px] mb-2 text-[#00B517] font-[700] plus-jakarta">
                {currency} 20.00
              </p>
            </div>

            <div className=" flex flex-col">
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#4F5D77] font-medium">
                Bank Name: National Bank
              </p>
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#4F5D77] font-medium">
                Account Number: 6546456
              </p>
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#4F5D77] font-medium">
                Swift Code: 4555H
              </p>
            </div>

            <div className=" flex flex-col">
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#4F5D77] font-medium">
                Country: United Arab Emirates
              </p>
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#4F5D77] font-medium">
                Account Name: Mohamed Selem
              </p>
              <p className=" text-[13px] md:text-[14px] 2xl:text-[15px] dark:text-gray-400 text-[#4F5D77] font-medium">
                Paypal Email: info@admin.com
              </p>
            </div>

            {/* <Link > */}
            <button className="bg-[#FF7004] flex items-center justify-center gap-2 px-4 py-2.5 my-1 h-fit w-fit font-medium text-[11.2px] md:text-[13px] text-white">
              Payment Request <MdPayment className=" text-[20px]" />
            </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
      <div className=" flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md bg-white dark:bg-white/5 p-3 md:p-5 ">
        <div className="overflow-x-auto">
          <div className=" flex flex-col md:flex-row md:items-center justify-between">
            <div className=" flex flex-col md:flex-row md:items-center gap-3 py-2">
              <select
                value={sortMethod}
                onChange={(e) => {
                  setSortMethod(e.target.value);
                }}
                className=" md:w-[250px] dark:bg-white/10 p-2 dark:text-gray-400 text-[#4F5D77] font-semibold bg-[#f2f2f2] text-[12.5px] md:text-[14.4px]"
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
                className=" w-full p-2 dark:bg-white/10 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] font-semibold text-[12.5px] md:text-[14.4px]"
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
          </div>
          <table className="w-full bPayment-collapse">
            <thead className="">
              <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                <th className="py-2 px-4">Transaction ID</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Fee</th>
                <th className="py-2 px-4">Method</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Comment</th>
              </tr>
            </thead>
            <tbody className="">
              {sortedArray
                .filter((i) => {
                  if (filterMethod !== "") {
                    return (
                      i.status.toLowerCase() === filterMethod.toLowerCase() ||
                      i.method.toLowerCase() === filterMethod.toLowerCase()
                    );
                  } else {
                    return i;
                  }
                })
                .map((item, index) => {
                  return (
                    <tr key={index} className="">
                      <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                        #{item.PaymentId}
                      </td>
                      <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 text-[#FF7004] font-[600] plus-jakarta">
                        {currency} {item.total}
                      </td>
                      <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 text-[#FF7004] font-[600] plus-jakarta">
                        {currency} {item.fee}
                      </td>
                      <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                        {item.method}
                      </td>
                      <td>
                        <p
                          className={`text-center ${
                            item.status.toLowerCase() === "pending"
                              ? "bg-orange-200 text-orange-600"
                              : item.status.toLowerCase() === "refunded"
                              ? "bg-red-200 text-red-700"
                              : item.status.toLowerCase() === "received"
                              ? "bg-green-200 text-green-700"
                              : "bg-blue-200 text-blue-600"
                          }
                          rounded-md py-1 text-sm font-semibold`}
                        >
                          {item.status}
                        </p>
                      </td>
                      <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                        {item.date}
                      </td>
                      <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                        {item.comment}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <p className=" text-[#FF7004] text-[11.2px] md:text-[13.5px] mt-2 font-semibold text-center ">
            No More Payments !
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payments;
