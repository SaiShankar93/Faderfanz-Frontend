import { MainAppContext } from "@/context/MainContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isSocialTab, setIsSocialTab] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState({
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: "",
    linkedin: "",
  });
  const [menu, setMenu] = useState(null);
  const FormFields = [
    { name: "Bank Name", id: "bankName" },
    { name: "Account Number", id: "accountNumber" },
    { name: "Swift Code", id: "swiftCode" },
    { name: "Account Holder Name", id: "accountHolderName" },
    { name: "Country", id: "country" },
    { name: "PayPal Email", id: "payPalEmail" },
  ];
  const SocialFields = [
    { name: "Twitter", id: "twitter" },
    { name: "Facebook", id: "facebook" },
    { name: "Instagram", id: "instagram" },
    { name: "Youtube", id: "youtube" },
  ];
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "vendor" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, []);

  // Function to get social media profile
  const getSocialMedia = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/social`
      );
      // console.log("Social media profile:", response.data.socialMedia);
      // Handle the social media profile data as needed
    } catch (error) {
      console.error("Error getting social media profile:", error);
      // Handle error
    }
  };

  // Function to update social media profile
  const updateSocialMedia = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/social`,
        socialMediaData
      );
      // console.log("Social media profile updated:", response.data.message);
      // Handle success
    } catch (error) {
      console.error("Error updating social media profile:", error);
      // Handle error
    }
  };

  return (
    <div className=" quicksand w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black px-[4%] py-4 md:py-10">
      <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Profile setting
      </p>
      <div className=" flex flex-col mt-3 rounded-md bg-white dark:bg-white/5 p-3 md:p-5 ">
        <div className=" w-full grid grid-cols-1 lg:grid-cols-5">
          <div className=" flex flex-row lg:flex-col mb-4 lg:mb-0 col-span-1">
            <button
              onClick={() => {
                setIsSocialTab(false);
              }}
              className={`${
                !isSocialTab
                  ? "bg-[#3bb77d3f]  text-[#22754e]"
                  : " text-gray-500"
              } flex items-center justify-center gap-2 px-3 lg:px-7 py-2.5 h-fit w-fit lg:w-full font-semibold text-[12px] md:text-[15px]`}
            >
              Bank information
            </button>
            {/* <button
              onClick={() => {
                setIsSocialTab(true);
              }}
              className={`${
                isSocialTab
                  ? "bg-[#3bb77d51]  text-[#22754e]"
                  : " text-gray-500"
              } flex items-center justify-center gap-2 px-3 lg:px-7 py-2.5 h-fit w-fit lg:w-full font-semibold text-[12px] md:text-[15px]`}
            >
              Social Links
            </button> */}
          </div>

          <div className=" col-span-4">
            {!isSocialTab ? (
              <form className=" px-3 lg:px-10 flex flex-col gap-4">
                {FormFields.map((field, index) => {
                  return (
                    <div key={index} className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                        htmlFor={field.id}
                      >
                        {field.name}
                      </label>
                      <input
                        name={field.id}
                        id={field.id}
                        placeholder={field.name}
                        type="text"
                        className=" w-full p-2 text-[#323c4e] bg-[#f2f2f2] text-[14.2px] rounded-md dark:bg-white/10"
                      />
                    </div>
                  );
                })}
                <div className=" flex-col flex">
                  <label
                    className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    rows={5}
                    name="description"
                    id="description"
                    placeholder="Description"
                    type="text"
                    className=" w-full p-2 text-[#323c4e] bg-[#f2f2f2] text-[14.2px] rounded-md dark:bg-white/10"
                  />
                </div>
                <button className="bg-[#3BB77E] flex items-center justify-center gap-2 px-4 py-2.5 my-1 h-fit w-fit font-medium text-[11.2px] md:text-[13px] text-white">
                  Save changes
                </button>
              </form>
            ) : (
              <form className=" px-3 lg:px-10 flex flex-col gap-4">
                {SocialFields.map((field, index) => {
                  return (
                    <div key={index} className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                        htmlFor={field.id}
                      >
                        {field.name}
                      </label>
                      <input
                        name={field.id}
                        id={field.id}
                        placeholder={field.name}
                        type="text"
                        className=" w-full p-2 text-[#323c4e] bg-[#f2f2f2] text-[14.2px] rounded-md dark:bg-white/10"
                      />
                    </div>
                  );
                })}
                <button className="bg-[#3BB77E] flex items-center justify-center gap-2 px-4 py-2.5 my-1 h-fit w-fit font-medium text-[11.2px] md:text-[13px] text-white">
                  Save changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
