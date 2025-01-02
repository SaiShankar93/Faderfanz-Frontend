import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/order/getAllPayments`
        );
        setTransactions(response.data.payments);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/order/paymentStatus`,
        { transactionId, newStatus }
      );
      setTransactions(
        transactions.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status: newStatus }
            : transaction
        )
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Transactions
      </p>
      {loading ? (
        <div className="w-full flex items-center justify-center py-3">
          <img
            src="/Images/loader.svg"
            alt="loading..."
            className="object-contain w-[60px] h-[60px]"
          />
        </div>
      ) : (
        <div className="flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/5 bg-white p-3 md:p-5 ">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="">
                <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                  <th className="py-2 px-4">Transaction ID</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Payment Method</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="">
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta plus-jakarta">
                      {transaction.paymentId}
                    </td>
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  dark:text-gray-400 text-[#495058] font-[600] plus-jakarta plus-jakarta">
                      {transaction.amount}
                    </td>
                    <td className="py-2 px-4 my-2">{transaction.status}</td>
                    <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                      {transaction.paymentMethod}
                    </td>
                    <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                      {transaction.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
