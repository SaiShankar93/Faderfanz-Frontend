import React, { useContext, useEffect, useState } from "react";
import VendorDetailsDialog from "../VendorDetailsDialog";
import { useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

const Reviews = () => {
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
  const OrdersData = [
    {
      id: 1,
      reviewId: "257",
      name: "selem",
      product: "Gorton’s Beer Battered Fish Fillets with soft paper",
      date: "March 17, 2024, 5:46 a.m.",
      rating: "5",
      review: "Very good prduct",
    },
  ];
  const [dialog, setDialog] = useState(false);
  const closeDialog = () => {
    return setDialog(false);
  };
  return (
    <div className=" quicksand w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black px-[4%] py-4 md:py-10">
      <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Reviews
      </p>

      <div className=" flex flex-col mt-7 overflow-x-auto rounded-md bg-white dark:bg-white/5 p-3 md:p-5 ">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="">
              <tr className=" text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                <th className="py-2 px-4">#ID</th>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Rating</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {OrdersData.map((item, index) => {
                return (
                  <tr key={index} className="">
                    {dialog && (
                      <VendorDetailsDialog
                        close={closeDialog}
                        data={item}
                        heading={"Review"}
                      />
                    )}
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                      #{item.reviewId}
                    </td>
                    <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 text-[#FF7004] font-[600] plus-jakarta">
                      #{item.product}
                    </td>
                    <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                      {item.name}
                    </td>
                    <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                      {item.rating}
                    </td>
                    <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                      {item.date}
                    </td>
                    <td className=" py-2 px-4">
                      <button
                        onClick={() => {
                          setDialog(true);
                        }}
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
        </div>
      </div>
    </div>
  );
};

export default Reviews;
