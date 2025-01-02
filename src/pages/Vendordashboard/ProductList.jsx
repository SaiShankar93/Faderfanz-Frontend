import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { sortProducts } from "../../utilities/SortMethod";
import { HiPencil } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const ProductsData = [
  {
    id: 1,
    name: "Lalnjada Dry Ginger Ale – 2 L Bottle - 20",
    img: "/Images/chairs.png",
    price: "904.00",
    status: "active",
    date: "Mar 17, 2024",
  },
  {
    id: 2,
    name: "Canada Dry Ginger Ale – 2 L Bottle - 20",
    img: "/Images/chairs.png",
    price: "24.00",
    status: "out of stock",
    date: "Jan 17, 2022",
  },
  {
    id: 3,
    name: "MKnjb Dry Ginger Ale – 2 L Bottle - 20",
    img: "/Images/chairs.png",
    price: "2124.00",
    status: "inactive",
    date: "Nov 27, 2025",
  },
  {
    id: 4,
    name: "Mnwanada Dry Ginger Ale – 2 L Bottle - 20",
    img: "/Images/chairs.png",
    price: "98.00",
    status: "active",
    date: "Jul 07, 2021",
  },
];
const sortMethods = [
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
    id: 12,
    name: "Price: High to low",
    value: 12,
  },
  {
    id: 13,
    name: "Price: Low to High",
    value: 13,
  },
  {
    id: 10,
    name: " Name: a-z",
    value: 10,
  },
  {
    id: 11,
    name: " Name: z-a",
    value: 11,
  },
];
const filterMethods = [
  { id: 1, name: "See All", value: "" },
  { id: 2, name: "Active", value: "active" },
  { id: 3, name: "Inactive", value: "Inactive" },
  { id: 4, name: "Out Of Stock", value: "Out Of Stock" },
];
const VendorDetailsDialog = ({ userData, close }) => {
  return (
    <div className="  fixed inset-0 w-full h-[100vh] flex items-center justify-center bg-black/30 overflow-hidden overflow-y-auto  z-50 ">
      <div className=" relative w-[95%] h-[80%] md:w-[50%] md:h-[60%] overflow-y-auto   dark:text-black bg-white p-10 capitalize">
        <IoClose
          onClick={() => {
            close();
          }}
          className=" absolute -top-0 cursor-pointer right-0 bg-red-500 p-1 text-[29px]"
        />
        <div className=" grid grid-cols-2">
          <div>
            <h2 className=" font-bold plus-jakarta text-xl mb-3">
              Product Details
            </h2>
            <p>
              <span className=" text-md font-semibold mr-1">Id:</span>
              {userData?._id}
            </p>
            <p>
              <span className=" text-md font-semibold mr-1">name:</span>
              {userData?.title}
            </p>
            <p>
              <span className=" text-md font-semibold mr-1">email:</span>
              {userData?.email}
            </p>
            {userData?.city && userData?.state && userData?.zipCode && (
              <p>
                <span className=" text-md font-semibold mr-1">Address:</span>
                {userData?.city}
                {userData?.state}
                {userData?.zipCode}
              </p>
            )}
            <p>
              <span className=" text-md font-semibold mr-1">Available:</span>
              {userData?.available}{" "}
            </p>

            <p>
              <span className=" text-md font-semibold mr-1">createdAt:</span>
              {userData?.createdAt}
            </p>

            <p>
              <span className=" text-md font-semibold mr-1">description:</span>
              {userData?.description}
            </p>

            <p>
              <span className=" text-md font-semibold mr-1">
                discountValue:
              </span>
              {userData?.discountValue}
            </p>

            {/* <p> */}
            {/* <span className=" text-md font-semibold mr-1">editorContent:</span>{userData?.}</p> */}

            <p>
              <span className=" text-md font-semibold mr-1">height:</span>
              {userData?.height}
            </p>

            <p>
              <span className=" text-md font-semibold mr-1">width:</span>
              {userData?.width}
            </p>

            <p>
              <span className=" text-md font-semibold mr-1">mainCategory:</span>
              {userData?.mainCategory}
            </p>
            <p>
              <span className=" text-md font-semibold mr-1">pieces:</span>
              {userData?.pieces}
            </p>
            <p>
              <span className=" text-md font-semibold mr-1">price:</span>AED{" "}
              {userData?.price}
            </p>
            <p>
              <span className=" text-md font-semibold mr-1">promotional:</span>
              {userData?.promortional}
            </p>
            <p>
              <span className=" text-md font-semibold mr-1">sku:</span>
              {userData?.sku}
            </p>

            <p>
              <span className=" text-md font-semibold mr-1">VendorId:</span>
              {userData?.vendorId}
            </p>

            <div>
              <span className=" text-md font-semibold mr-1">status:</span>
              {userData?.status ? "Approved" : "Unapproved"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ProductList = () => {
  const [sortMethod, setSortMethod] = useState(2);
  const [filterMethod, setFilterMethod] = useState("");
  const [sortedArray, setSortedArray] = useState([]);
  const [products, setProducts] = useState([]);
  const { user } = useContext(MainAppContext);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [activeUserData, setActiveUserData] = useState({});
  const [sortedArrayCount, setSortedArrayCount] = useState(ProductsData.length);
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
  useEffect(() => {
    getAllProducts();
  }, []);
  const closeModal = () => {
    setDialog(false);
  };
  useEffect(() => {
    setSortedArray(sortProducts(sortMethod, ProductsData));
  }, [ProductsData, sortMethod]);
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      // console.log(response?.data);
      setProducts(
        response?.data?.filter((i) => {
          return i?.vendorId === user?._id;
        })
      );
      // // console.log(response.data);
      // setSortedArray1(response.data);
      // setSortedArray2(response.data);
      // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const { currency } = useContext(DashboardAppContext);

  return (
    <div className=" quicksand w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black px-[4%] py-4 md:py-10">
      <div className=" flex items-center justify-between">
        <div>
          <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
            ProductList
          </p>
          <p className=" dark:text-gray-400 text-[#4F5D77] text-[12px] md:text-[13px] 2xl:text-[14px] font-medium -mt-1 ">
            We found {products?.length} items for you!
          </p>
        </div>
        <Link to="/dashboard/add-product">
          <button className="bg-[#FF7004] flex items-center justify-center gap-2 px-4 py-2.5 my-1 w-fit font-medium text-[11.2px] md:text-[13px] text-white">
            Add product
          </button>
        </Link>
      </div>

      <div className=" flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md bg-white dark:bg-white/5 p-3 md:p-5 ">
        <div className="overflow-x-auto">
          <div className=" flex flex-col md:flex-row md:items-center justify-between">
            {/* <div className=" flex flex-col md:flex-row md:items-center gap-3 py-2">
              <select
                value={sortMethod}
                onChange={(e) => {
                  setSortMethod(e.target.value);
                }}
                className=" md:w-[250px] p-2 dark:bg-white/10 dark:text-gray-400 text-[#4F5D77] font-semibold bg-[#f2f2f2] text-[12.5px] md:text-[14.4px]"
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
            </div> */}
          </div>
          {loading ? (
            <div className=" w-full flex items-center justify-center py-3">
              <img
                src="/Images/loader.svg"
                alt="loading..."
                className=" object-contain w-[60px] h-[60px]"
              />
            </div>
          ) : (
            <>
              <div className=" flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/5 bg-white p-3 md:p-5 ">
                <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[15px] md:text-[21px] 2xl:text-[23px] ">
                  Unapproved Products
                </p>
                <div className="overflow-x-auto">
                  <div className=" flex flex-col md:flex-row md:items-center justify-between">
                    <div className=" flex flex-col md:flex-row md:items-center gap-3 py-2">
                      {/* <select
                value={sortMethod1}
                onChange={(e) => {
                  setSortMethod1(e.target.value);
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
              </select> */}
                      {/* <select
                value={filterMethod1}
                onChange={(e) => {
                  setFilterMethod1(e.target.value);
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
              </select> */}
                    </div>
                  </div>
                  <table className="w-full border-collapse">
                    <thead className="">
                      <tr className="text-[#363F4D] font-[700] plus-jakarta plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                        <th className="py-2 px-4">#ID</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Price</th>
                        <th className="py-2 px-4">Stock</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {products
                        .filter((i) => {
                          return i.approved !== true;
                        })
                        .map((item, index) => {
                          return (
                            <tr key={index} className="">
                              <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                                #{item._id}
                              </td>
                              {dialog && (
                                <VendorDetailsDialog
                                  userData={activeUserData}
                                  close={closeModal}
                                />
                              )}
                              <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  dark:text-gray-400 text-[#495058]  font-[600] plus-jakarta">
                                {item.title}
                              </td>
                              <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  text-[#FF7004] font-[600] plus-jakarta">
                                AED {item.price}
                              </td>
                              <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                                {item?.status}
                              </td>
                              <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                                <input type="checkbox" />
                                {item?.products}
                              </td>
                              {/* <td>
                        <select
                          className={`text-center ${
                            item.status.toLowerCase() === "level 3"
                              ? "bg-orange-200 text-orange-600"
                              : item.status.toLowerCase() === "level 1"
                              ? "bg-red-200 text-red-700"
                              : item.status.toLowerCase() === "level 2"
                              ? "bg-green-200 text-green-700"
                              : "bg-blue-200 text-blue-600"
                          }
                          rounded-md py-1 w-full outline-none text-sm font-semibold`}
                          value={item?.status}
                          onChange={(e) => {}}
                        >
                          <option
                            className=" bg-white text-black"
                            value="level 1"
                          >
                            level 1
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="level 3"
                          >
                            level 3
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="level 4"
                          >
                            level 4
                          </option>
                          <option
                            className=" bg-white text-black"
                            value="level 2"
                          >
                            level 2
                          </option>
                        </select>
                      </td> */}
                              <td className="  items-center gap-2 py-2 px-4">
                                <button
                                  onClick={() => {
                                    setActiveUserData(item);
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

              {/* approvend Products list -------------------------------------------------------------- */}
              <div className=" flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/5 bg-white p-3 md:p-5 ">
                <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[15px] md:text-[21px] 2xl:text-[23px] ">
                  Approved Products
                </p>
                <div className="overflow-x-auto">
                  <div className=" flex flex-col md:flex-row md:items-center justify-between">
                    <div className=" flex flex-col md:flex-row md:items-center gap-3 py-2">
                      {/* <select
                value={sortMethod2}
                onChange={(e) => {
                  setSortMethod2(e.target.value);
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
              </select> */}
                      {/* <select
                value={filterMethod2}
                onChange={(e) => {
                  setFilterMethod2(e.target.value);
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
              </select> */}
                    </div>
                  </div>
                  <table className="w-full border-collapse">
                    <thead className="">
                      <tr className="text-[#363F4D] font-[700] plus-jakarta plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                        <th className="py-2 px-4">#ID</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Price</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {/* {sortedArray2
                    .filter((i) => {
                      if (filterMethod2 !== "") {
                        return (
                          i.status.toLowerCase() ===
                            filterMethod2.toLowerCase() && i.approved === true
                        );
                      } else {
                        return i.approved === true;
                      }
                    }) */}
                      {products
                        ?.filter((i) => {
                          return i.approved === true;
                        })
                        ?.map((item, index) => {
                          return (
                            <tr key={index} className="">
                              <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                                #{item._id}
                              </td>
                              {dialog && (
                                <VendorDetailsDialog
                                  userData={activeUserData}
                                  close={closeModal}
                                />
                              )}
                              <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  dark:text-gray-400 text-[#495058]  font-[600] plus-jakarta">
                                {item.title}
                              </td>
                              <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2  text-[#FF7004] font-[600] plus-jakarta">
                                {item.price}
                              </td>
                              <td className="text-center py-2 px-4 dark:text-gray-400 text-[#495058] my-1 text-[13px] md:text-[15px] 2xl:text-[16px]">
                                {item?.status}
                              </td>
                              <td className="  items-center gap-2 py-2 px-4">
                                <button
                                  onClick={() => {
                                    setActiveUserData(item);
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
