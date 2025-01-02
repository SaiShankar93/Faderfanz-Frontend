import React, { useContext, useEffect, useState } from "react";

import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { IoAddCircle, IoAddCircleOutline } from "react-icons/io5";
import { RiSubtractLine } from "react-icons/ri";
import { MainAppContext } from "@/context/MainContext";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { MdOutlineDelete } from "react-icons/md";

const Materials = () => {
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [attrDialog, setAttrDialog] = useState("");
  const [currAttribute, setCurrAttribute] = useState("");
  const [newAttributes, setNewAttributes] = useState([]);
  const [materials, setMaterials] = useState([]);

  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
    getMaterials();
  }, []);

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { name: attrDialog, value: "", price: "0", materialImage: "" },
    ]);
  };

  const handleRemoveAttribute = () => {
    if (attributes?.length > 0) {
      const newArray = attributes?.slice(0, -1);
      setAttributes(newArray);
    } else {
      return;
    }
  };

  const handleAttributeInputChange = (index, fieldName, fieldValue) => {
    const updatedAttributes = [...attributes];
    if (fieldName === "materialImage") {
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        materialImage: fieldValue,
      };
    } else {
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        [fieldName]: fieldValue,
      };
    }
    setAttributes(updatedAttributes);
  };

  const handleAddMaterial = () => {
    const newGroupedArray = attributes.reduce((acc, obj) => {
      const { name, ...rest } = obj;
      const foundIndex = acc.findIndex((item) => item.name === name);
      if (foundIndex !== -1) {
        acc[foundIndex].details.push(obj);
      } else {
        acc.push({ name, details: [obj] });
      }
      return acc;
    }, []);
    newGroupedArray.forEach((group) => {
      group.details.forEach((detail) => {
        delete detail.name;
      });
    });
    uploadMaterials(newGroupedArray);
  };

  const handleAttributeInputChange2 = (
    index,
    fieldName1,
    fieldValue1,
    fieldName2,
    fieldValue2
  ) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [fieldName1]: fieldValue1,
      [fieldName2]: fieldValue2,
    };
    setAttributes(updatedAttributes);
  };

  const uploadMaterials = async (materials) => {
    try {
      const formData = new FormData();

      materials.forEach((group) => {
        group.details.forEach((detail) => {
          Object.entries(detail).forEach(([key, value]) => {
            if (key === "materialImage") {
              formData.append(`materialImages`, value);
            }
          });
        });
      });

      if (materials.length > 0 && materials[0].name === "") {
        formData.append("name", "");
        formData.append("details", JSON.stringify([]));
      } else {
        materials.forEach((material) => {
          formData.append("name", material.name);
          const updatedDetails = material.details.map((detail) => {
            if (
              detail.materialImage &&
              typeof detail.materialImage === "object"
            ) {
              detail.materialImage = detail.materialImage.name || "";
            }
            return detail;
          });
          formData.append("details", JSON.stringify(updatedDetails));
        });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/material`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error uploading materials:", error);
      toast.error(error.response.data.message);
    }
  };

  const getMaterials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/material`
      );
      console.log(response.data);
      setMaterials(response.data);
    } catch (error) {
      console.error("Error getting materials:", error);
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/material/${id}`
      );
      toast.success(response.data.message);
      getMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {loading ? (
        <div className=" w-full flex items-center justify-center py-3">
          <img
            src="/Images/loader.svg"
            alt="loading..."
            className=" object-contain w-[60px] h-[60px]"
          />
        </div>
      ) : (
        <div className=" w-full min-h-[100vh] h-fit bg-[#F8F9FA]  dark:bg-black px-[1%] py-4 md:py-10">
          <div className=" flex items-center justify-between ">
            <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
              Materials
            </p>
          </div>

          <div className=" md:px-[1%] flex flex-col items-center lg:items-start lg:grid grid-cols-1 md:m-6 mb-14  ">
            <div className="  md:m-0 flex flex-col gap-5 col-span-3 ">
              <div className=" md:m-0 mt-4 py-5 bg-white dark:bg-white/5 rounded-md col-span-5 ">
                <div className=" flex items-baseline justify-between border-b border-gray-200 mb-1.5">
                  <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta   dark:text-gray-400 text-[#363F4D]  ">
                    Add Materials
                  </h4>
                  <div className=" flex items-center gap-2">
                    <input
                      name={`attributeName`}
                      placeholder="Name"
                      type="text"
                      required
                      className=" w-[200px] border border-black rounded-md mt-1 p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                      value={attrDialog}
                      onChange={(e) => {
                        setAttrDialog(e.target.value);
                      }}
                    />
                    <button
                      onClick={() => {
                        const selectedAttribute = attrDialog;
                        if (
                          !newAttributes.find(
                            (i) => i.name === selectedAttribute
                          )
                        ) {
                          const newArr = [
                            ...newAttributes,
                            {
                              name: selectedAttribute,
                              variables: [{ value: "", price: 0 }],
                            },
                          ];
                          //console.log(newArr);
                          setNewAttributes(newArr);
                          setCurrAttribute(selectedAttribute);
                        }
                      }}
                      className="bg-[#FF7004] px-4 py-2.5 my-1 w-fit font-medium text-[11.2px] md:text-[13px] text-white mr-3"
                    >
                      Add{" "}
                    </button>
                  </div>
                </div>
                <>
                  <div className=" p-2 ">
                    <div className="">
                      {newAttributes.map((item, index) => {
                        return (
                          <div key={index}>
                            <div
                              onClick={() => {
                                setAttrDialog((prev) =>
                                  prev === item?.name ? "" : item?.name
                                );
                              }}
                              className=" py-2 cursor-pointer px-4 bg-gray-200 mt-1"
                            >
                              <div className=" flex items-center justify-between px-4">
                                <h4>{item.name}</h4>
                                <FaChevronDown className=" text-[11px]" />
                              </div>
                            </div>
                            {attrDialog === item?.name && (
                              <div className=" border border-black p-2">
                                <div className=" grid grid-cols-5 gap-1">
                                  <label
                                    className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[13.7px] mb-1 "
                                    htmlFor={`attributeValue`}
                                  >
                                    Attribute Value
                                  </label>
                                  <label
                                    className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[13.7px] mb-1 "
                                    htmlFor={`attributePrice`}
                                  >
                                    Attribute Price
                                  </label>
                                  <label
                                    className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[13.7px] mb-1 "
                                    htmlFor={`materialImage`}
                                  >
                                    Image
                                  </label>
                                </div>
                                {attributes.map((attribute, index) => {
                                  if (attribute.name === attrDialog) {
                                    return (
                                      <div key={index}>
                                        <div className="grid grid-cols-5 gap-1">
                                          <input
                                            name={`attributeValue${index}`}
                                            placeholder="Value"
                                            type="text"
                                            required
                                            className=" w-full mt-1 p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                                            value={attribute.value}
                                            onChange={(e) => {
                                              handleAttributeInputChange2(
                                                index,
                                                "name",
                                                attrDialog,
                                                "value",
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <input
                                            name={`attributePrice${index}`}
                                            placeholder="Attribute Price"
                                            type="number"
                                            required
                                            className=" w-full mt-1 p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                                            value={attribute.price}
                                            onChange={(e) =>
                                              handleAttributeInputChange(
                                                index,
                                                "price",
                                                e.target.value
                                              )
                                            }
                                          />
                                          <input
                                            name={`materialImage${index}`}
                                            placeholder="Attribute image"
                                            type="file"
                                            multiple
                                            className=" w-full mt-1 dark:text-gray-400 col-span-3  text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                                            value={attribute?.file}
                                            onChange={(e) =>
                                              handleAttributeInputChange(
                                                index,
                                                "materialImage",
                                                e.target.files[0]
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null; // Skip rendering if attribute.name !== attrDialog
                                })}

                                <div className=" flex items-center ">
                                  <IoAddCircleOutline
                                    onClick={() => {
                                      handleAddAttribute();
                                    }}
                                    className=" text-[22px] ml-2 mt-1  cursor-pointer"
                                  />
                                  <RiSubtractLine
                                    onClick={() => {
                                      handleRemoveAttribute(0);
                                    }}
                                    className=" border border-black rounded-full text-[19px] ml-2 mt-1 cursor-pointer"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
                <button
                  onClick={handleAddMaterial}
                  className="bg-[#FF7004] px-4 py-2.5 my-1 w-fit font-medium text-[11.2px] md:text-[13px] text-white ml-2"
                >
                  Add Material
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-6 ml-10">
            {materials.map((material) => (
              <div
                key={material._id}
                className="relative w-60 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
              >
                <button
                  onClick={() => handleDeleteMaterial(material._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <MdOutlineDelete />
                </button>
                <h3 className="text-lg font-semibold dark:text-gray-400 text-[#363F4D]">
                  {material.name}
                </h3>
                {material.details.map((detail, index) => (
                  <div key={index} className="mt-2">
                    <p className="text-sm dark:text-gray-400">
                      Name: {detail.value}
                    </p>
                    {detail.materialImage && (
                      <img
                        src={`${detail.materialImage}`}
                        alt={detail.value}
                        className="w-full h-32 object-cover mt-2 rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Materials;
