import { MainAppContext } from "@/context/MainContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Coupon = () => {
  const [couponType, setCouponType] = useState("percentage");
  const [couponValue, setCouponValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [couponUsersString, setCouponUsersString] = useState("");
  const [toAll, setToAll] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [userList, setUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState("");
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/admin/coupons`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }
      const data = await response.json();
      setCoupons(data.coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    toast("Creating Coupon. Please wait");

    try {
      const couponData = {
        code: e.target.elements.couponCode.value,
        description: description,
        discountType: couponType,
        discountAmount:
          couponType === "percentage" ? couponValue : parseFloat(couponValue),
        expirationDate: expiryDate,
        all: toAll,
        ...(toAll
          ? {}
          : {
              emails: couponUsersString.split(",").map((email) => email.trim()),
            }),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/createCoupon`,
        couponData
      );

      toast.success("Coupon created successfully");
      fetchCoupons();

      // Clear form fields after successful submission
      e.target.reset();
      setCouponType("percentage");
      setCouponValue("");
      setExpiryDate("");
      setDescription("");
      setCouponUsersString("");
      setToAll(false);
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Error creating coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/admin/coupons/${id}`
      );
      if (response.status === 200) {
        toast.success("Coupon deleted successfully");
        // Update coupons state after successful deletion
        setCoupons(coupons.filter((coupon) => coupon._id !== id));
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/getUsers`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "color",
    "clean",
  ];

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Coupon
      </p>

      <div className="flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5 ">
        <form
          onSubmit={handleFormSubmit}
          className="md:w-[55%] flex-col flex gap-3"
        >
          <input
            name="couponCode"
            id="couponCode"
            type="text"
            required
            placeholder="Enter Coupon Code"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <div className="flex items-center relative">
            <input
              name="users"
              id="users"
              type="text"
              value={emails}
              onChange={(e) => {
                setCouponUsersString(e.target.value);
              }}
              placeholder="Enter Email of users who can use"
              className="bg-gray-200 w-full text-black placeholder:text-gray-600 rounded-sm p-3"
            />
            <BsChevronDown
              onClick={() => {
                setUserList((prev) => !prev);
              }}
              className="absolute right-0 shadow-sm shadow-black/30 cursor-pointer bg-white h-full px-4 text-[50px]  "
            />
            {userList && (
              <div className="absolute right-0 bg-white top-12 w-full z-30 border-2 border-blue-400 p-3 h-[300px] overflow-y-auto">
                <div className="overscroll-y-auto">
                  {users ? (
                    <>
                      {users?.map((item, index) => {
                        const isSelected = emails.includes(item.email);
                        return (
                          <div
                            onClick={() => {
                              const newEmail = item.email;
                              const newEmails = isSelected
                                ? emails.filter((email) => email !== newEmail)
                                : [...emails, newEmail];
                              setEmails(newEmails);
                              const newCouponUsersString = newEmails.join(", ");
                              setCouponUsersString(newCouponUsersString);
                            }}
                            key={index}
                            className={`my-1 border-b text-sm cursor-pointer ${
                              isSelected ? "bg-green-200" : ""
                            } border-gray-400 py-2 flex flex-col flex-wrap w-full`}
                          >
                            <p>{item?.name}</p>
                            <p>{item?.email}</p>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>No Users Found</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <input
              name="toAll"
              id="toAll"
              type="checkbox"
              className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
              onChange={(e) => {
                const emails = users.map((user) => user.email);
                setEmails((prevEmails) => {
                  if (JSON.stringify(prevEmails) === JSON.stringify(emails)) {
                    return "";
                  } else {
                    return emails;
                  }
                });
              }}
            />
            <label className="text-xs" htmlFor="toAll">
              Coupon Available to All
            </label>
          </div>
          <label className="text-sm mt-3" htmlFor="couponType">
            Select Discount Type
          </label>
          <select
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
            id="couponType"
            name="couponType"
            value={couponType}
            onChange={(e) => {
              setCouponType(e.target.value);
            }}
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          {couponType === "fixed" ? (
            <>
              <label className="text-sm mt-3" htmlFor="multiuse">
                Discount value
              </label>
              <input
                name="multiuse"
                id="multiuse"
                type="number"
                placeholder="Discount value"
                required
                className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
                onChange={(e) => setCouponValue(e.target.value)}
              />
            </>
          ) : (
            <>
              <label className="text-sm mt-3" htmlFor="multiuse">
                Discount Percentage
              </label>
              <input
                name="multiuse"
                id="multiuse"
                type="number"
                placeholder="Discount Percentage"
                required
                className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
                onChange={(e) => setCouponValue(e.target.value)}
              />
            </>
          )}
          <label className="text-sm mt-3" htmlFor="expiryDate">
            Expiry Date
          </label>
          <input
            name="expiryDate"
            id="expiryDate"
            type="date"
            required
            placeholder=" Minimum Price"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <label className="text-sm mt-3" htmlFor="desc">
            Coupon Description
          </label>
          <ReactQuill
            className="h-[150px]"
            theme="snow"
            formats={formats}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="bg-orange-400 mt-4 text-black hover:bg-orange-500 font-semibold text-sm py-3"
            type="submit"
          >
            Generate Coupon
          </button>
        </form>
      </div>
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] mt-10 ">
        Added Coupons
      </p>

      <div className="flex flex-col md:grid grid-cols-3 items-center max-h-[700px] overscroll-y-auto mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5 ">
        {coupons.map((coupon, index) => {
          return (
            <div
              key={index}
              className="flex flex-col relative border-b border-gray-500 text-sm p-2"
            >
              <MdDelete
                className="absolute right-2 text-[19px] hover:text-red-600 cursor-pointer"
                onClick={() => handleDeleteCoupon(coupon._id)}
              />
              <p>
                Code : <span className="font-medium">{coupon.code}</span>
              </p>
              <p>
                Discount Type :{" "}
                <span className="font-medium">{coupon.discountType}</span>
              </p>
              <p>
                Discount Amount :{" "}
                <span className="font-medium">{coupon.discountAmount}</span>
              </p>
              <p>
                Expires On :{" "}
                <span className="font-medium">
                  {coupon.expirationDate.split("T")[0]}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Coupon;
