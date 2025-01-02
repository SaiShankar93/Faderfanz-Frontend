import { MainAppContext } from "@/context/MainContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { FaMinusCircle } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { RiSubtractLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Social = () => {
  const [isSocialTab, setIsSocialTab] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState({
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: "",
    linkedin: "",
  });
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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaData({
      ...socialMediaData,
      [name]: value,
    });
  };
  // Function to get social media profile
  // Function to update social media profile
  const updateSocialMedia = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/social`,
        socialMediaData
      );
      // console.log("Social media profile updated:", response.data.message);
      toast("Social media profile updated");
      setSocialMediaData({
        facebook: "",
        twitter: "",
        youtube: "",
        instagram: "",
        linkedin: "",
      });
      // Handle success
    } catch (error) {
      console.error("Error updating social media profile:", error);
      // Handle error
    }
  };
  const [navLinks, setNavLink] = useState([
    { title: "", url: "", subItems: [] },
  ]);
  const handleAddNavLink = () => {
    setNavLink([...navLinks, { title: "", url: "", subItems: [] }]);
  };

  const handleRemoveNavLink = () => {
    if (navLinks?.length > 1) {
      const newArray = navLinks?.slice(0, -1);
      setNavLink(newArray);
    } else {
      return;
    }
  };

  const handleNavLinkInputChange = (index, fieldName, fieldValue) => {
    const updatedAttributes = [...navLinks];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [fieldName]: fieldValue,
    };
    setNavLink(updatedAttributes);
  };
  const addSubLink = (index) => {
    const updatedNavLinks = [...navLinks];
    updatedNavLinks[index].subItems.push({ title: "", url: "" });
    setNavLink(updatedNavLinks);
  };
  const removeSubLink = (index) => {
    setNavLink((prevNavLinks) => {
      const updatedNavLinks = [...prevNavLinks];
      // if (updatedNavLinks[index].subItems?.length > 1) {
      updatedNavLinks[index] = {
        ...updatedNavLinks[index],
        subItems: updatedNavLinks[index].subItems.slice(0, -1),
        // };
      };
      return updatedNavLinks;
    });
  };

  const handleSublinkNameChange = (parentIndex, subIndex, e) => {
    const updatedNavLinks = [...navLinks];
    updatedNavLinks[parentIndex].subItems[subIndex].title = e.target.value;
    setNavLink(updatedNavLinks);
  };

  // Function to handle changes in sublink link
  const handleSublinkLinkChange = (parentIndex, subIndex, e) => {
    const updatedNavLinks = [...navLinks];
    updatedNavLinks[parentIndex].subItems[subIndex].url = e.target.value;
    setNavLink(updatedNavLinks);
  };

  // Function to handle menu update
  const handleUpdateMenu = async (updatedMenu) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/menu`,
        {
          items: updatedMenu,
        }
      );
      // setMenu(response.data.menu);
      toast.success("Menu updated successfully");
      setNavLink([{ title: "", url: "", subItems: [] }]);
      // console.log("Menu updated successfully");
    } catch (error) {
      console.error("Error updating menu:", error);
    }
  };

  return (
    <div className=" w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black px-[4%] py-4 md:py-10">
      <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
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
              Menu Links
            </button>
            <button
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
            </button>
          </div>

          <div className=" col-span-4">
            {!isSocialTab ? (
              <>
                {navLinks?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" grid grid-cols-2 md:grid-cols-4  px-2 md:px-7 gap-3"
                    >
                      <div className=" flex-col py-1 flex">
                        <label
                          className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                          htmlFor={`linkName${index}`}
                        >
                          Link{index + 1} Name
                        </label>
                        <input
                          name={`linkName${index}`}
                          id={`linkName${index}`}
                          placeholder="Link Name"
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            handleNavLinkInputChange(
                              index,
                              "title",
                              e.target.value
                            );
                          }}
                          className=" w-full p-2 text-[#323c4e] bg-[#f2f2f2] text-[14.2px] rounded-md dark:bg-white/10"
                        />
                      </div>
                      <div className=" flex-col py-1 flex">
                        <label
                          className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                          htmlFor={`link${index}`}
                        >
                          Link{index + 1}
                        </label>
                        <div className=" flex items-center">
                          <input
                            name={`link${index}`}
                            id={`link${index}`}
                            placeholder="Link "
                            type="text"
                            value={item.url}
                            onChange={(e) => {
                              handleNavLinkInputChange(
                                index,
                                "url",
                                e.target.value
                              );
                            }}
                            className=" w-full p-2 text-[#323c4e] bg-[#f2f2f2] text-[14.2px] rounded-md dark:bg-white/10"
                          />
                        </div>
                      </div>
                      <div className=" col-span-2">
                        {!item?.subItems?.length > 0 ? (
                          <div className=" flex items-center col-span-2">
                            <BsPlusCircle
                              className=" cursor-pointer"
                              onClick={() => {
                                addSubLink(index);
                              }}
                            />
                            <label
                              className=" ml-2 dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                              htmlFor={"menuLink"}
                            >
                              Add DropMenu
                            </label>
                          </div>
                        ) : (
                          item.subItems?.map((subItem, subIndex) => {
                            return (
                              <div
                                key={subIndex}
                                className=" grid grid-cols-2 gap-1 col-span-2"
                              >
                                <div className=" flex-col py-1 flex">
                                  <label
                                    className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                                    htmlFor={`subLinkName${subIndex}`}
                                  >
                                    subLink{subIndex + 1} Name
                                  </label>
                                  <input
                                    name={`sublinkName${subIndex}`}
                                    id={`sublinkName${subIndex}`}
                                    placeholder="Sub Link Name"
                                    type="text"
                                    value={subItem[subIndex]?.title}
                                    onChange={(e) => {
                                      handleSublinkNameChange(
                                        index,
                                        subIndex,
                                        e
                                      );
                                    }}
                                    className=" w-full p-2 text-[#323c4e] bg-[#f2f2f2] text-[14.2px] rounded-md dark:bg-white/10"
                                  />
                                </div>
                                <div className=" flex-col py-1 flex">
                                  <label
                                    className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                                    htmlFor={`subLink${subIndex}`}
                                  >
                                    Sub Link{subIndex + 1}
                                  </label>
                                  <div className=" flex items-center">
                                    <input
                                      name={`subLink${subIndex}`}
                                      id={`subLink${subIndex}`}
                                      placeholder="Link "
                                      type="text"
                                      value={subItem[subIndex]?.url}
                                      onChange={(e) => {
                                        handleSublinkLinkChange(
                                          index,
                                          subIndex,
                                          e
                                        );
                                      }}
                                      className=" w-full p-2 text-[#323c4e] bg-[#f2f2f2] text-[14.2px] rounded-md dark:bg-white/10"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                        {item?.subItems?.length > 0 && (
                          <div className=" flex items-center gap-3 mt-2 col-span-2">
                            <BsPlusCircle
                              className=" cursor-pointer"
                              onClick={() => {
                                addSubLink(index);
                              }}
                            />
                            <FaMinusCircle
                              className=" cursor-pointer"
                              onClick={() => {
                                removeSubLink(index);
                              }}
                            />
                          </div>
                        )}
                        ;
                      </div>
                    </div>
                  );
                })}
                <div className=" px-2 md:px-7 flex flex-col md:flex-row md:items-center gap-3 mt-2 col-span-2">
                  <button
                    className=" w-fit cursor-pointer bg-green-400 text-xs md:text-sm text-white px-6 rounded-md font-medium  py-2"
                    onClick={() => {
                      handleAddNavLink();
                    }}
                  >
                    Add Link
                  </button>
                  <button
                    className=" w-fit cursor-pointer bg-red-400 text-xs md:text-sm text-white px-6 rounded-md font-medium  py-2"
                    onClick={() => {
                      handleRemoveNavLink();
                    }}
                  >
                    Remove Link
                  </button>
                </div>
                <button
                  disabled={navLinks[0].title === "" || navLinks[0].url === ""}
                  className=" mx-2 md:mx-7 my-3 disabled:bg-gray-300 w-full cursor-pointer bg-green-400 text-sm text-white px-6 rounded-md font-medium  py-3"
                  onClick={() => {
                    handleUpdateMenu(navLinks);
                  }}
                >
                  Submit
                </button>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateSocialMedia(e);
                }}
                className=" px-3 lg:px-10 flex flex-col gap-4"
              >
                {SocialFields.map((field, index) => {
                  return (
                    <div key={index} className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13.5px] 2xl:text-[14.4px] mb-1 "
                        htmlFor={field.id}
                      >
                        {field.name}
                      </label>
                      <input
                        name={field.id}
                        id={field.id}
                        placeholder={field.name}
                        type="text"
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
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

export default Social;
