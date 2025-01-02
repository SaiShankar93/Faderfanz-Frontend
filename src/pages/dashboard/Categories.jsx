import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import { FaStar } from "react-icons/fa";
import {
  IoAddCircleOutline,
  IoClose,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import { BsPlusCircle } from "react-icons/bs";
import { RiSubtractLine } from "react-icons/ri";

const Categories = () => {
  const [CategoriesName, setCategoriesName] = useState("");
  const [CategoriesImageFile, setCategoriesImageFile] = useState(null);
  const [CategoriesLogoFile, setCategoriesLogoFile] = useState(null);
  const [CategoriesLink, setCategoriesLink] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([
    {
      name: "",
      subCategories: [""],
    },
  ]);
  const [isCategory, setIsCategory] = useState(true);
  const [subCategoryLogoFile, setSubCategoryLogoFile] = useState(null);
  const [seriesName, setSeriesName] = useState("");
  const [seriesLogoFile, setSeriesLogoFile] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();

  const handleCategoriesUpload = async () => {
    const formData = new FormData();
    formData.append("categoryImage", CategoriesImageFile);
    formData.append("categoryLogo", CategoriesLogoFile);
    formData.append("fileName", CategoriesName);
    formData.append("redirectUrl", CategoriesLink);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      getCategoriesData();
    } catch (error) {
      console.error("Error uploading Categories:", error);
      toast.error("Error uploading Categories");
    }
  };

  const getCategoriesData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleMarkSelected = async (categoryId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/category/select`,
        { categoryId }
      );
      toast.success("Category marked as selected successfully");
      getCategoriesData();
    } catch (error) {
      console.error("Error marking category as selected:", error);
      toast.error("Error marking category as selected");
    }
  };

  const handleAddSubcategory = async () => {
    try {
      const formData = new FormData();
      formData.append("categoryId", selectedCategory);
      formData.append("name", inputText);
      formData.append("subcategoryLogo", subCategoryLogoFile);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/subcategory`,
        formData
      );
      toast.success("Subcategory added successfully");
      setInputText("");
      getCategoriesData();
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Error adding subcategory");
    }
  };

  const handleAddSeries = async () => {
    console.log(selectedSubcategory, seriesName);
    try {
      const formData = new FormData();
      formData.append("subcategoryId", selectedSubcategory);
      formData.append("name", seriesName);
      formData.append("seriesLogo", seriesLogoFile);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/series`,
        formData
      );
      toast.success("Series added successfully");
      setSeriesName("");
      setSeriesLogoFile(null);
      getCategoriesData();
    } catch (error) {
      console.error("Error adding series:", error);
      toast.error("Error adding series");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
    getCategoriesData();
  }, []);

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
          {isCategory ? "Categories" : "Add Sub Categories"}
        </p>
        <p
          onClick={() => {
            setIsCategory((prev) => !prev);
          }}
          className="dark:text-gray-400 flex items-center gap-1 text-[#363F4D] font-bold plus-jakarta cursor-pointer text-[12px] md:text-[15px] 2xl:text-[17px]"
        >
          <BsPlusCircle /> {!isCategory ? "Add Category" : "Add Sub-Categories"}
        </p>
      </div>
      {isCategory ? (
        <>
          <div className="flex flex-col items-center mt-3 md:mt-7 rounded-md dark:bg-white/10 bg-white p-3 md:p-5">
            <div className="md:w-[55%] flex-col flex gap-1 md:gap-3 pb-8 border-b border-gray-400">
              <label
                className="text-xs md:text-sm mt-3"
                htmlFor="CategoriesName"
              >
                Categories Name
              </label>
              <input
                id="newCategory"
                name="newCategory"
                type="text"
                placeholder="Add New Category"
                value={CategoriesName}
                onChange={(e) => {
                  setCategoriesName(e.target.value);
                }}
                className="bg-gray-200 w-[90%] md:w-full text-black placeholder:text-gray-600 rounded-sm p-3"
              />

              <label
                className="capitalize text-left text-xs md:text-sm"
                htmlFor="Categories1"
              >
                Add Image
              </label>
              <input
                name="categoryImage"
                id="CategoriesImage"
                type="file"
                className="bg-gray-200 text-xs md:text-sm w-[90%] md:w-full text-black placeholder:text-gray-600 rounded-sm p-3"
                onChange={(e) => setCategoriesImageFile(e.target.files[0])}
              />
              <label
                className="capitalize text-xs md:text-sm"
                htmlFor="Categories1"
              >
                Add Logo
              </label>
              <input
                name="categoryLogo"
                id="CategoriesLogo"
                type="file"
                className="bg-gray-200 text-xs md:text-sm w-[90%] md:w-full text-black placeholder:text-gray-600 rounded-sm p-3"
                onChange={(e) => setCategoriesLogoFile(e.target.files[0])}
              />
            </div>
            <button
              className="bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-xs md:text-sm py-3"
              onClick={handleCategoriesUpload}
            >
              Add Categories
            </button>
          </div>
          <p className="dark:text-gray-400 text-[#363F4D] mt-3 font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
            All Categories
          </p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="relative flex flex-col bg-white shadow-md shadow-black/30 p-4 rounded-md"
              >
                {category.selected ? (
                  <div className="flex items-center justify-end text-[19px] gap-1">
                    <IoStar
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => handleMarkSelected(category._id)}
                    />
                    <IoClose className="cursor-pointer" />
                  </div>
                ) : (
                  <div className="flex items-center justify-end text-[19px] gap-1">
                    <IoStarOutline
                      className="text-[19px] cursor-pointer absolute right-2 top-2"
                      onClick={() => handleMarkSelected(category._id)}
                    />
                    <IoClose className="cursor-pointer" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex flex-col font-semibold text-[13px] md:text-sm">
                      <p>Category Name: {category.fileName}</p>
                      <div className="flex items-center gap-2">
                        Subcategories:
                        <select
                          name="Category"
                          id="Category"
                          className="w-full p-2 border-none outline-none dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        >
                          {category?.subcategories?.map(
                            (subcategory, index) => (
                              <option key={index} value={subcategory.name}>
                                {subcategory.name} <IoClose />
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <img
                      className="object-cover h-[50px] w-[50px]"
                      src={category.logoLink}
                      alt="Category Logo"
                    />
                  </div>
                </div>
                <img
                  className="object-cover h-[250px] w-full mt-1"
                  src={category.imageLink}
                  alt="Category Image"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="md:m-0 mt-4 flex flex-col items-center justify-center======== py-5 bg-white dark:bg-white/5 rounded-md col-span-5">
          <div className="w-full flex flex-col items-center justify-center mb-1.5">
            <select
              name="mainCategory"
              id="main-Category"
              type="number"
              className="w-[50%] p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <option className="text-black">Select a Category</option>
              {categories.map((category, index) => (
                <option
                  className="text-black text-xs"
                  key={category._id}
                  value={category._id}
                >
                  {category.fileName}
                </option>
              ))}
            </select>
          </div>
          <input
            name={`subcategoryname`}
            placeholder="Subcategory Name"
            type="text"
            className="w-[50%] mt-1 p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <label className="text-xs md:text-sm w-[50%] text-left mt-2">
            Add Subcategory Logo
          </label>
          <input
            name={`subcategoryLogo`}
            placeholder="Subcategory Logo"
            type="file"
            className="w-[50%] mt-1 p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
            onChange={(e) => setSubCategoryLogoFile(e.target.files[0])}
          />
          <button
            className="bg-orange-300 py-2 w-[50%] mt-5 rounded-md text-xs md:text-sm font-semibold px-5"
            onClick={handleAddSubcategory}
          >
            Add Subcategory
          </button>
          <div className="w-full flex flex-col items-center justify-center mb-1.5 mt-3">
            <div className="w-full flex flex-col items-center justify-center mb-1.5">
              <select
                name="mainCategory"
                id="main-Category"
                className="w-[50%] p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                }}
              >
                <option className="text-black">Select a Category</option>
                {categories.map((category, index) => (
                  <option
                    className="text-black text-xs"
                    key={category._id}
                    value={category._id}
                  >
                    {category.fileName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col items-center justify-center mb-1.5">
              <select
                name="subCategory"
                id="sub-Category"
                className="w-[50%] p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                }}
              >
                <option className="text-black">Select a Subcategory</option>
                {categories
                  .find((category) => category._id === selectedCategory)
                  ?.subcategories.map((subcategory, index) => (
                    <option
                      className="text-black text-xs"
                      key={index}
                      value={subcategory._id}
                    >
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>
            <input
              name={`seriesName`}
              placeholder="Series Name"
              type="text"
              className="w-[50%] p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
              value={seriesName}
              onChange={(e) => {
                setSeriesName(e.target.value);
              }}
            />
            <label className="text-xs md:text-sm w-[50%] text-left mt-2">
              Add Series Logo
            </label>
            <input
              name={`seriesLogo`}
              placeholder="Series Logo"
              type="file"
              className="w-[50%] mt-1 p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
              onChange={(e) => setSeriesLogoFile(e.target.files[0])}
            />
            <button
              className="bg-orange-300 py-2 w-[50%] mt-5 rounded-md text-xs md:text-sm font-semibold px-5"
              onClick={handleAddSeries}
            >
              Add Series
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;