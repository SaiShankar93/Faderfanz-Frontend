import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { sortProducts } from "../../utilities/SortMethod";
import { IoClose, IoMail, IoStarOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RiStarFill } from "react-icons/ri";
import { MdStarOutline } from "react-icons/md";
import { MainAppContext } from "@/context/MainContext";
import { FaStar } from "react-icons/fa";
import RatingForm2 from "./RatingForm2";
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
    id: 6,
    name: " Email: a-z",
    value: 6,
  },
  {
    id: 7,
    name: " Email: z-a",
    value: 7,
  },
  {
    id: 8,
    name: "Id: High to low",
    value: 8,
  },
  {
    id: 9,
    name: "Id: Low to High",
    value: 9,
  },
];
const OrdersData = [
  {
    id: 1,
    orderId: "257",
    name: "Venodr 1",
    email: "selem@hhh.com",
    role: "vendor",
    adminApproved: true,
    phone: "987654568764",
    products: 6,
    status: "level 3",
    date: "Mar 17, 2024",
  },
  {
    id: 2,
    orderId: "397",
    name: "Venodr 2",
    role: "vendor",
    email: "minnadb@hhh.com",
    phone: "987654568764",
    adminApproved: false,
    products: 6,
    status: "level 2",
    date: "Feb 27, 2024",
  },
  {
    id: 3,
    orderId: "437",
    name: "Venodr 3",
    role: "vendor",
    email: "kaowihu@hhh.com",
    phone: "987654568764",
    adminApproved: false,
    products: 6,
    status: "level 1",
    date: "Jan 01, 2024",
  },
  {
    id: 4,
    orderId: "397",
    name: "Vendor 4",
    role: "vendor",
    email: "wirwnadb@hhh.com",
    phone: "987654568764",
    products: 6,
    adminApproved: true,
    status: "level 2",
    date: "Nov 27, 2023",
  },
  {
    id: 4,
    orderId: "637",
    name: "kljhg",
    role: "user",
    email: "fFewihu@hhh.com",
    phone: "987654568764",
    products: 6,
    adminApproved: true,
    status: "level 1",
    date: "Dec 01, 2024",
  },
];

const filterMethods = [
  { id: 1, name: "See All", value: "" },
  { id: 2, name: "level 2", value: "level 2" },
  { id: 3, name: "level 1", value: "level 1" },
  { id: 4, name: "level 3", value: "level 3" },
];
const VendorDetailsDialog = ({ productId, close }) => {
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const { isAdminRatingFormOpen, setIsAdminRatingFormOpen } =
    useContext(MainAppContext);
  const getReview = async () => {
    setIsLoad(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/review/${productId}`
      );
      // console.log(productId, response.data.reviews);
      setReviews(response?.data?.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return []; // Return an empty array in case of error
    }
    setIsLoad(false);
  };
  useEffect(() => {
    getReview();
  }, []);
  const Stars = ({ stars }) => {
    const ratingStars = Array.from({ length: 5 }, (elem, index) => {
      return (
        <div key={index}>
          {stars >= index + 1 ? (
            <FaStar className=" dark:text-yellow-400 text-black" />
          ) : (
            <IoStarOutline className=" text-black dark:text-yellow-400 " />
          )}
        </div>
      );
    });
    return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
  };
  return (
    <div className="  fixed inset-0 w-full h-[100vh] flex items-center justify-center bg-black/30 overflow-hidden overflow-y-auto  z-50 ">
      <div className=" flex flex-col relative w-[95%] h-[80%] md:w-[50%] md:h-[70%] overflow-y-auto   dark:text-black bg-white p-10 capitalize">
        #{productId}
        <IoClose
          onClick={() => {
            close();
          }}
          className=" absolute -top-0 cursor-pointer right-0 bg-red-500 p-1 text-[29px]"
        />
        {isAdminRatingFormOpen && <RatingForm2 activeReview={activeReview} />}
        <div className=" grid">
          <h2 className=" font-bold plus-jakarta text-xl mb-3">
            Product Reviews
          </h2>

          {isLoad ? (
            <p>Loading ...</p>
          ) : (
            <>
              {reviews.length > 0 ? (
                <>
                  {reviews.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setActiveReview(item);

                          setIsAdminRatingFormOpen(true);
                        }}
                        className=" flexc cursor-pointer flex-col md:flex-row items-center justify-between shadow-sm shadow-black/30 bg-yellow-200 dark:bg-white/20 rounded-md my-2 p-5 "
                      >
                        <div>
                          <p>
                            Comment:
                            <span className=" ml-1  font-semibold">
                              {item.title}
                            </span>
                          </p>
                          <p className=" flex items-center gap-1">
                            Rating:
                            <Stars stars={item?.rating} />({item?.rating})
                          </p>
                          <p>
                            Review:
                            <span className=" ml-1  font-semibold">
                              {item.comment}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            By:
                            <span className=" ml-1  font-semibold">
                              {item?.userId?.name}
                            </span>
                          </p>
                          <p>
                            Date:
                            <span className=" ml-1  font-semibold">
                              {item.createdAt.split("T")[0]}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p>No Reviews Avialable for this product </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const Reviews = () => {
  const [sortMethod1, setSortMethod1] = useState(2);
  const [sortMethod2, setSortMethod2] = useState(2);
  const [filterMethod1, setFilterMethod1] = useState("");
  const [filterMethod2, setFilterMethod2] = useState("");
  const [sortedArray1, setSortedArray1] = useState([]);
  const [sortedArray2, setSortedArray2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingTab, setProcessingTab] = useState("");
  const [activeProductId, setActiveProductData] = useState({});
  // const [loading, setLoading] = useState(false);
  const [sortedArrayCount, setSortedArrayCount] = useState(OrdersData.length);
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, []);
  const closeModal = () => {
    setDialog(false);
  };
  useEffect(() => {
    setSortedArray1(sortProducts(sortMethod1, OrdersData));
  }, [OrdersData, sortMethod1]);
  useEffect(() => {
    setSortedArray2(sortProducts(sortMethod2, OrdersData));
  }, [OrdersData, sortMethod2]);
  const [dialog, setDialog] = useState(false);
  const [products, setProducts] = useState([]);

  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_SERVER_URL}/auth/getProducts`
  //     );
  //     setProducts(response.data);
  //     setSortedArray1(response.data);
  //     setSortedArray2(response.data);
  //     // console.log(response.data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      setProducts(response.data);
      // console.log(response.data);
      setSortedArray1(response.data);
      setSortedArray2(response.data);
      // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const approveProduct = async (product) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/approveProduct`,
        { product }
      );
      // console.log(response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error approving Product:", error);
      toast.error("Error approving Product");
    }
    setLoading(false);
  };

  const markFeatured = async (product) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/markFeatured`,
        { productId: product._id, featured: !product.featured }
      );
      toast.success(response.data.message);
      getAllProducts();
    } catch (error) {
      console.error("Error marking product as featured:", error);
      toast.error("Error marking product as featured");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  // Calculate the start index and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const totalPages = Math.ceil(
    sortedArray2.filter((i) => {
      if (filterMethod2 !== "") {
        return (
          i.status.toLowerCase() === filterMethod2.toLowerCase() &&
          i.approved === true
        );
      } else {
        return i.approved === true;
      }
    }).length / pageSize
  );

  // Function to handle changing the page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className=" w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Reviews
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
        <>
          <div className=" flex flex-col mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/5 bg-white p-3 md:p-5 ">
            <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[15px] md:text-[21px] 2xl:text-[23px] ">
              Reviews
            </p>
            <div className="overflow-x-auto">
              <div className=" flex flex-col md:flex-row md:items-center justify-between"></div>
              <table className="w-full border-collapse">
                <thead className="">
                  <tr className="text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[15px] 2xl:text-[16px] bg-[#e5e5e5]">
                    <th className="py-2 px-4">#ID</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Rating </th>
                    <th className="py-2 px-4">Reviews</th>
                  </tr>
                </thead>
                <tbody className="">
                  {sortedArray2
                    .filter((i) => {
                      if (filterMethod2 !== "") {
                        return (
                          i.status.toLowerCase() ===
                            filterMethod2.toLowerCase() && i.approved === true
                        );
                      } else {
                        return i.approved === true;
                      }
                    })
                    .slice(startIndex, endIndex)
                    .map((item, index) => {
                      return (
                        <tr key={index} className="">
                          <td className="text-center py-2 px-4 text-[13px] md:text-[15px] 2xl:text-[16px] my-2 dark:text-gray-400 text-[#495058] font-[600] plus-jakarta">
                            #{item._id}
                          </td>
                          {dialog && (
                            <VendorDetailsDialog
                              productId={activeProductId}
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
                            {item.avgRating}
                          </td>
                          <td className="  items-center gap-2 py-2 px-4">
                            <button
                              onClick={() => {
                                setActiveProductData(item._id);
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
                  Page <strong className="text-gray-900">{currentPage}</strong>{" "}
                  of
                  <strong className="text-gray-900">{totalPages}</strong>
                </p>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reviews;
