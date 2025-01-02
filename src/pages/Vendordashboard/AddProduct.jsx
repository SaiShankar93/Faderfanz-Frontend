import React, { useContext, useEffect, useRef, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { CurrencyList } from "../../utilities/Currency";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { IoAddCircleOutline } from "react-icons/io5";
import { RiSubtractLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPEG", "PNG", "GIF"];
import { FiUpload } from "react-icons/fi"; // Assuming you're using react-icons for icons
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import ChangingProgressProvider from "@/components/ChangingProgressProvider";
import { CircularProgressbar } from "react-circular-progressbar";

const OrdersData = [
  {
    id: 1,
    reviewId: "257",
    name: "selem",
    product: "Gorton’s Beer Battered Fish Fillets with soft paper",
    date: "March 17, 2024, 5:46 a.m.",
    rating: "5",
  },
];

const AddProduct = () => {
  const { currency, setCurrency } = useContext(DashboardAppContext);
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [attrDialog, setAttrDialog] = useState(-1);
  const [currAttribute, setCurrAttribute] = useState("");
  const [newAttributes, setNewAttributes] = useState([]);
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const isMounted = useRef(false);

  const handleChangeFile = (file) => {
    console.log(file);
    const additionalImagesArray = Array.from(file);
    setProductDetails({
      ...productDetails,
      additionalImages: additionalImagesArray,
    });
  };
  const handleChangeFile2 = (file) => {
    console.log(file);
    const mainImageFile = file[0];
    setProductDetails({ ...productDetails, mainImage: mainImageFile });
  };
  const handleUploadARFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        arFile: file,
      }));
    }
  };
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    console.log(user, user1);
    if (
      !isMounted.current &&
      user &&
      user?.role !== "vendor" &&
      user1 &&
      user1?.role !== "vendor"
    ) {
      navigate("/login");
    }
    getCategoriesData();
    getMaterials();
  }, []);
  const [textValue, settextValue] = useState("");
  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    discounts: false,
    discountValue: 0,
    price: "",
    currency: "AED",
    available: "",
    pieces: "",
    promotional: "",
    editorContent: "",
    width: "",
    height: "",
    weight: "",
    status: "available",
    sku: "",
    metaTitle: "",
    metaDescription: "",
    metaTags: "",
    attributes: attributes?.filter((i) => {
      return i?.value !== "" && i?.type !== "";
    }),
    mainImage: "",
    additionalImages: "",
    threeDiaLinkHor: "",
    threeDiaLinkVer: "",
    arFile: "",
    mainCategory: [],
    subCategory: [],
    series: [],
    tags: "",
  });

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

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { type: attrDialog, value: "", price: "0", attributeImage: "" },
    ]);
  };

  const handleRemoveAttribute = () => {
    if (attributes?.length > 1) {
      const newArray = attributes?.slice(0, -1);
      setAttributes(newArray);
    } else {
      return;
    }
  };

  const handleAttributeInputChange = (index, fieldName, fieldValue) => {
    const updatedAttributes = [...attributes];
    if (fieldName === "attributeImage") {
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        attributeImage: fieldValue,
      };
    } else {
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        [fieldName]: fieldValue,
      };
    }
    setAttributes(updatedAttributes);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setProductDetails({ ...productDetails, [name]: inputValue });
  };

  const handleSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    // Append product details to FormData
    Object.entries(productDetails).forEach(([key, value]) => {
      if (
        key === "mainImage" ||
        key === "additionalImages" ||
        key === "arFile"
      ) {
        if (Array.isArray(value)) {
          value.forEach((image) => {
            formData.append(key, image);
          });
        } else {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value);
      }
    });

    // console.log(attributes);

    // Append attribute images to FormData
    attributes.forEach((attribute) => {
      if (attribute.attributeImage) {
        formData.append(`attributeImages`, attribute.attributeImage);
      }
    });

    if (attributes.length > 0 && attributes[0].type === "") {
      formData.append("attributes", JSON.stringify([]));
    } else {
      attributes.forEach((attribute) => {
        if (
          attribute.attributeImage &&
          typeof attribute.attributeImage === "object"
        ) {
          attribute.attributeImage = attribute.attributeImage.name || "";
        }
      });

      formData.append("attributes", JSON.stringify(attributes));
    }

    const vendorId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))._id
      : null;

    if (vendorId) {
      formData.append("vendorId", vendorId);
    }

    // Send FormData to backend route /addProduct
    fetch(`${import.meta.env.VITE_SERVER_URL}/product/create`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Product added successfully:", data);
        if (data.error) {
          toast.error("Error adding product");
        } else toast.success("Product added successfully");
        clearFormEntries();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("Error adding product");
      });
  };

  const clearFormEntries = () => {
    // Reset productDetails to empty value
    const updatedProductDetails = {
      title: "",
      description: "",
      discounts: false,
      discountValue: "",
      price: "",
      currency: "",
      available: "",
      pieces: "",
      promotional: "",
      editorContent: "",
      width: "",
      height: "",
      weight: "",
      status: "available",
      sku: "",
      mainImage: [],
      additionalImages: [],
      superCategory: "",
      mainCategory: "",
      subCategory: "",
      tags: "",
    };

    // Update productDetails state with empty value
    setProductDetails(updatedProductDetails);
  };

  const getCategoriesData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      console.log(response.data.categories);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getMaterials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/material`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const mapMaterialsToAttributes = (selectedMaterialId) => {
    const selectedMaterial = materials.find((material) => {
      console.log(`Checking material ID: ${material._id}`);
      return material._id === selectedMaterialId;
    });

    if (!selectedMaterial) {
      console.error(`Material with ID "${selectedMaterialId}" not found`);
      return;
    }

    // Remove all existing material attributes
    let updatedAttributes = attributes.filter((attr) => {
      if (attr.type === "material") {
        console.log(`Removing attribute with type: ${attr.type}`);
        return false;
      }
      return true;
    });

    // Add the new material's attributes
    selectedMaterial.details.forEach((detail) => {
      updatedAttributes.push({
        type: "material",
        value: detail.value,
        price: detail.price,
        attributeImage: detail.materialImage,
      });
    });

    setAttributes(updatedAttributes);
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setProductDetails((prevState) => ({
      ...prevState,
      [field]: selectedOptions,
    }));
  };

  const getFilteredSubCategories = () => {
    if (productDetails.mainCategory.length === 0) return [];

    // Flatten subcategories from all selected main categories
    const subcategories = productDetails.mainCategory.flatMap(
      (mainCategory) => {
        const selectedMainCategory = categories.find(
          (cat) => cat.fileName === mainCategory
        );
        return selectedMainCategory?.subcategories || [];
      }
    );

    // Filter out duplicate entries
    const uniqueSubcategories = [];
    const seen = new Set();
    subcategories.forEach((subCat) => {
      if (!seen.has(subCat.name)) {
        uniqueSubcategories.push(subCat);
        seen.add(subCat.name);
      }
    });

    return uniqueSubcategories;
  };

  const getFilteredSeries = () => {
    if (productDetails.subCategory.length === 0) return [];

    // Flatten series from all selected subcategories
    const series = productDetails.subCategory.flatMap((subCategory) => {
      const selectedSubCategory = categories
        .flatMap((cat) => cat.subcategories)
        .find((subCat) => subCat.name === subCategory);
      return selectedSubCategory ? selectedSubCategory.series : [];
    });

    return series;
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div style={{ width: "100px", height: "100px" }}>
            <ChangingProgressProvider values={[0, 20, 40, 60, 80, 100]}>
              {(percentage) => (
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                />
              )}
            </ChangingProgressProvider>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className=" w-full min-h-[100vh] h-fit bg-[#F8F9FA]  dark:bg-black px-[1%] py-4 md:py-10"
        >
          <div className=" flex items-center justify-between ">
            <p className=" dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] px-[3%] ">
              Add New Product
            </p>
            <button
              type="submit"
              className="bg-[#FF7004] px-4 py-2.5 my-1 w-fit font-medium text-[11.2px] md:text-[13px] text-white"
            >
              Publish
            </button>
          </div>

          <div className=" md:px-[1%] flex flex-col items-center lg:items-start lg:grid grid-cols-6 md:m-6 mb-14  ">
            <div className="  md:m-0 flex flex-col gap-5 col-span-3 ">
              <div className=" bg-white dark:bg-white/5 rounded-md py-4 ">
                <div className=" flex flex-col ">
                  <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400  text-[#363F4D] mb-1.5 ">
                    Basic
                  </h4>

                  <div className=" md:mt-6 px-7 h-fit ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400  text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px]"
                        htmlFor="product-title"
                      >
                        Product title
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="title"
                        id="product-title"
                        type="text"
                        className="w-full p-2 dark:bg-white/10 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px]"
                        placeholder="Type here"
                        value={productDetails.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className=" md:mt-1 mb-10 px-7 ">
                    <div className=" flex-col flex">
                      <label
                        className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px]"
                        htmlFor="description"
                      >
                        Short Description{" "}
                        <span className="text-red-500 text-[24px]">*</span>
                      </label>
                      <ReactQuill
                        className="h-[150px]"
                        theme="snow"
                        value={productDetails.description}
                        formats={formats}
                        onChange={(textValue) =>
                          setProductDetails({
                            ...productDetails,
                            description: textValue,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className=" md:mt-10 px-7 flex items-center gap-2 ">
                    <input
                      name="discounts"
                      id="isDiscounts"
                      type="checkbox"
                      className=" border-[1.4px] border-[#999999] p-2  dark:text-gray-400 text-[#4F5D77] text-[14.4px]"
                      placeholder="isDiscounts"
                      value={productDetails.discounts}
                      onChange={handleInputChange}
                    />
                    <label
                      className=" dark:text-gray-400 text-[#363F4D] font-[600] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                      htmlFor="isDiscounts"
                    >
                      Product Has Discounts
                    </label>
                  </div>
                  {productDetails?.discounts && (
                    <div className="  px-7 flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Price"
                      >
                        Discount Value
                      </label>
                      <input
                        name="discountValue"
                        id="discountValue"
                        type="number"
                        className=" w-fit p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="eg- 23"
                        value={productDetails?.discountValue}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-1 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] "
                        htmlFor="Price"
                      >
                        Price
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="price"
                        id="Price"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="DH"
                        value={productDetails.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="currency"
                      >
                        Currency
                        <span className=" text-red-500 text-[24px]"></span>
                      </label>
                      <select
                        name="currency"
                        id="currency"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        value={productDetails.currency}
                        onChange={handleInputChange}
                      >
                        {CurrencyList.map((item, index) => {
                          return (
                            <option
                              className=" text-black  "
                              key={index}
                              value={item.currency.code}
                            >
                              ({item.currency.code})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-6 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="available"
                      >
                        Available
                      </label>
                      <input
                        name="available"
                        id="available"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Quantity in Stocks"
                        value={productDetails.available}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="price-per-piece"
                      >
                        Pieces/Set
                      </label>
                      <input
                        name="pieces"
                        id="price-per-piece"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Quantity for Pieces"
                        value={productDetails.pieces}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Super Category"
                      >
                        Promotional
                      </label>
                      <select
                        name="promotional"
                        id="promotional"
                        type="number"
                        className="w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        value={productDetails.promotional}
                        onChange={handleInputChange}
                      >
                        <option value="New">New</option>
                        <option value="Discount">Discount</option>
                        <option value="Hot">Hot</option>
                      </select>
                    </div>
                  </div>
                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-6 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="metaTitle"
                      >
                        Meta Title
                      </label>
                      <input
                        name="metaTitle"
                        id="metaTitle"
                        type="text"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Meta Title"
                        value={productDetails.metaTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="metaDescription"
                      >
                        Meta Description
                      </label>
                      <input
                        name="metaDescription"
                        id="metaDescription"
                        type="text"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Meta Description"
                        value={productDetails.metaDescription}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="metaHead"
                      >
                        Meta Tag
                      </label>
                      <input
                        name="metaTags"
                        id="metaTags"
                        type="text"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Meta Tags"
                        value={productDetails.metaTags}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col pb-14 px-7 mt-5 ">
                    <label className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 ">
                      Long Description
                    </label>
                    <ReactQuill
                      className="h-[150px]"
                      theme="snow"
                      value={productDetails.editorContent}
                      formats={formats}
                      onChange={(textValue) =>
                        setProductDetails({
                          ...productDetails,
                          editorContent: textValue,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className=" md:m-0 bg-white dark:bg-white/5 py-4 rounded-md col-span-3 ">
                <div className=" flex flex-col pb-9 ">
                  <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                    Dimensions
                  </h4>

                  <div className=" px-7 sm:grid grid-cols-2 gap-5 xl:gap-[3%] md:mt-6 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Width"
                      >
                        Width
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="width"
                        id="Width"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="inch"
                        value={productDetails.width}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Height"
                      >
                        Height
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="height"
                        id="Height"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="inch"
                        value={productDetails.height}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-6 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Weight"
                      >
                        Weight
                      </label>
                      <input
                        name="weight"
                        id="Weight"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="grams"
                        value={productDetails.weight}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="product-status"
                      >
                        Product status
                      </label>
                      <select
                        name="status"
                        id="product-status"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        value={productDetails.status}
                        onChange={handleInputChange}
                      >
                        <option className=" text-black " value="available">
                          Available
                        </option>
                        <option className=" text-black " value="outOfStock">
                          Out of Stock
                        </option>
                      </select>
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="sku"
                      >
                        SKU
                      </label>
                      <input
                        name="sku"
                        id="sku"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Product SKU"
                        value={productDetails.sku}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className=" border border-gray-200 md:m-0 bg-white dark:bg-white/5 rounded-md col-span-3 ">
                      <h4 className=" p-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                        Additional Images
                        <span className=" text-red-500 text-[24px]">*</span>
                      </h4>
                      <div className=" flex-col flex items-center justify-center px-5 py-3">
                        {/* <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="additional-image"
                      >
                        <img
                          className=" w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] object-contain"
                          src="/Images/uploadImg.png"
                          alt="upload-img"
                        />
                      </label> */}
                        <div className=" flex flex-col items-center text-sm justify-center relative w-full h-[300px]">
                          <FileUploader
                            multiple
                            handleChange={handleChangeFile}
                            name="file"
                            types={fileTypes}
                            required
                            style={{ height: "500px" }}
                            hoverTitle="Drop Your Product Images here"
                          />
                          <p className=" mt-1 text-gray-700">
                            {file
                              ? `File name: ${file[0].name}`
                              : "no files uploaded yet"}
                          </p>
                          <p className=" text-gray-700">
                            maximum upload size : 256 MB
                          </p>
                        </div>
                      </div>
                      <h4 className=" p-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                        Add 360 view of Product
                      </h4>
                      <p className=" text-red-400 font-[600] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] ml-5 ">
                        Need Help in creating 360 view of your product ?
                      </p>
                      <p className=" underline text-blue-600  font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] ml-5 mb-6 ">
                        <a
                          href="https://sirv.com/help/articles/manually-create-spin/#:~:text=Manually%20generate%20a%20spin%20file,-On%20this%20page&text=Spin%20files%20are%20automatically%20generated,file%20will%20not%20be%20generated."
                          target="_blank"
                        >
                          Refer: Create Your Product's 360 view easily for free
                        </a>
                      </p>
                      <p className=" text-gray-800 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] ml-5 ">
                        Add ( .spin ) link of your product
                      </p>
                      <p className=" text-xs sm:text-sm px-5 py-1">
                        Horizontal
                      </p>
                      <div className=" flex-col flex items-center justify-center px-5">
                        <input
                          name="threeDiaLinkHor"
                          type="url"
                          placeholder=" eg - https://demo.sirv.com/example.spin"
                          className=" w-full p-2 bg-gray-200 text-[#2b3548] placeholder:text-gray-600 border border-black  text-[14.4px]"
                          value={productDetails.threeDiaLinkHor}
                          onChange={handleInputChange}
                        />
                      </div>
                      <p className=" text-xs sm:text-sm px-5 py-1">Vertical</p>
                      <div className=" flex-col flex items-center justify-center px-5 pb-5">
                        <input
                          name="threeDiaLinkVer"
                          type="url"
                          placeholder=" eg - https://demo.sirv.com/example.spin"
                          className=" w-full p-2 bg-gray-200 text-[#2b3548] placeholder:text-gray-600 border border-black  text-[14.4px]"
                          value={productDetails.threeDiaLinkVer}
                          onChange={handleInputChange}
                        />
                      </div>
                      <h4 className="p-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200 dark:text-gray-400 text-[#363F4D] mb-1.5">
                        Add Product in GLB or GLTF Format
                      </h4>
                      <input
                        name="threeDiaLinkVer"
                        type="file"
                        className=" w-full p-2 bg-gray-200 text-[#2b3548] placeholder:text-gray-600   text-[14.4px]"
                        onChange={handleUploadARFile}
                      />
                    </div>
                  </div>
                </div>{" "}
              </div>
              <div className=" md:m-0 mt-4 py-5 bg-white dark:bg-white/5 rounded-md col-span-5 ">
                <div className=" flex items-baseline justify-between border-b border-gray-200 mb-1.5">
                  <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta   dark:text-gray-400 text-[#363F4D]  ">
                    Add Attribute
                  </h4>
                  <select
                    name="material"
                    id="material"
                    className="bg-gray-200 py-2 px-4 mr-5"
                    onChange={(e) => mapMaterialsToAttributes(e.target.value)}
                  >
                    <option value="">Materials</option>
                    {materials.map((material, index) => (
                      <option key={index} value={material._id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                  <select
                    onChange={(e) => {
                      const selectedAttribute = e.target.value;
                      if (
                        !newAttributes.find((i) => i.type === selectedAttribute)
                      ) {
                        const newArr = [
                          ...newAttributes,
                          {
                            type: selectedAttribute,
                            variables: [{ value: "", price: 0 }],
                          },
                        ];
                        console.log(newArr);
                        setNewAttributes(newArr);
                        setCurrAttribute(selectedAttribute);
                      }
                    }}
                    value={currAttribute}
                    className=" bg-gray-200 py-2 px-4 mr-5"
                  >
                    <option value="">Select Attribute</option>
                    <option value="color">Color</option>
                    <option value="size">Size</option>
                  </select>
                </div>

                <>
                  <div className=" p-2 ">
                    <div className="">
                      {newAttributes.map((item, index) => {
                        return (
                          <>
                            <div
                              onClick={() => {
                                setAttrDialog((prev) =>
                                  prev === item?.type ? -1 : item?.type
                                );
                              }}
                              className=" py-2 cursor-pointer px-4 bg-gray-200 mt-1"
                            >
                              <div className=" flex items-center justify-between px-4">
                                <h4>{item.type}</h4>
                                <FaChevronDown className=" text-[11px]" />
                              </div>
                            </div>
                            {attrDialog === item?.type && (
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
                                    htmlFor={`attributeImage`}
                                  >
                                    Image
                                  </label>
                                </div>
                                {attributes.map((attribute, index) => {
                                  if (attribute.type === attrDialog) {
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
                                                "type",
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
                                            name={`attributeImage${index}`}
                                            placeholder="Attribute image"
                                            type="file"
                                            multiple
                                            className=" w-full mt-1 dark:text-gray-400 col-span-3  text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                                            value={attribute?.file}
                                            onChange={(e) =>
                                              handleAttributeInputChange(
                                                index,
                                                "attributeImage",
                                                e.target.files[0]
                                              )
                                            }
                                          />
                                          {/* {attribute?.type?.toLowerCase() ===
                                            "color" && (
                                            <>
                                              <input
                                                name={`attributeHexcode${index}`}
                                                placeholder="Hexcode"
                                                type="text"
                                                required
                                                className=" w-full mt-1 p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                                                value={attribute?.color}
                                                onChange={(e) =>
                                                  handleAttributeInputChange(
                                                    index,
                                                    "hexcode",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </>
                                          )} */}
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null; // Skip rendering if attribute.type !== attrDialog
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
                          </>
                        );
                      })}
                    </div>

                    {/* <pre>{JSON.stringify(attributes, null, 2)}</pre> */}
                  </div>
                </>
              </div>
            </div>

            <div className=" w-full px-[2%] sm:px-[8%] flex flex-col justify-between gap-5  sm:m-8 md:m-0 md:mb-14 col-span-3 ">
              <div className=" md:m-0 bg-white dark:bg-white/5 rounded-md col-span-3 ">
                <h4 className=" px-7 py-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                  Main Image<span className=" text-red-500 text-[24px]">*</span>
                </h4>
                <div className=" flex-col flex items-center text-xs justify-center px-5 py-3">
                  <FileUploader
                    multiple={true}
                    handleChange={handleChangeFile2}
                    name="file"
                    types={fileTypes}
                    required
                    style={{ height: "500px" }}
                    hoverTitle="Drop Your Product Images here"
                  />
                  <p className=" mt-1 text-gray-700">
                    {file
                      ? `File name: ${file[0].name}`
                      : "no files uploaded yet"}
                  </p>
                  <p className=" text-gray-700">maximum upload size : 256 MB</p>
                </div>
              </div>

              <div className=" md:m-0 mt-4 py-5 bg-white dark:bg-white/5 rounded-md col-span-3 ">
                <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                  Categories
                </h4>

                <div className="flex-col flex mt-4 px-7">
                  <label
                    className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1"
                    htmlFor="main-Category"
                  >
                    Main Category
                  </label>
                  <select
                    name="mainCategory"
                    id="main-Category"
                    multiple
                    className="w-full p-2 border border-gray-300 dark:border-white/30 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10 rounded-lg"
                    value={productDetails.mainCategory}
                    onChange={(e) => handleMultiSelectChange(e, "mainCategory")}
                  >
                    <option
                      value=""
                      className="border-b border-gray-300 dark:border-white/40"
                    >
                      Select Main Categories
                    </option>
                    {categories.map((category, index) => (
                      <option
                        key={index}
                        value={category.fileName}
                        className="border-b border-gray-300 dark:border-white/40"
                      >
                        {category.fileName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-col flex mt-4 px-7">
                  <label
                    className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1"
                    htmlFor="sub-Category"
                  >
                    Sub Category
                  </label>
                  <select
                    name="subCategory"
                    id="sub-Category"
                    multiple
                    className="w-full p-2 border border-gray-300 dark:border-white/30 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10 rounded-lg"
                    value={productDetails.subCategory}
                    onChange={(e) => handleMultiSelectChange(e, "subCategory")}
                  >
                    <option
                      value=""
                      className="border-b border-gray-300 dark:border-white/40"
                    >
                      Select Sub Categories
                    </option>
                    {getFilteredSubCategories().map((subcategory, index) => (
                      <option
                        key={index}
                        value={subcategory.name}
                        className="border-b border-gray-300 dark:border-white/40"
                      >
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-col flex mt-4 px-7">
                  <label
                    className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1"
                    htmlFor="series"
                  >
                    Series
                  </label>
                  <select
                    name="series"
                    id="series"
                    multiple
                    className="w-full p-2 border border-gray-300 dark:border-white/30 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10 rounded-lg"
                    value={productDetails.series}
                    onChange={(e) => handleMultiSelectChange(e, "series")}
                  >
                    <option
                      value=""
                      className="border-b border-gray-300 dark:border-white/40"
                    >
                      Select a Series
                    </option>
                    {getFilteredSeries().map((series, index) => (
                      <option
                        key={index}
                        value={series.name}
                        className="border-b border-gray-300 dark:border-white/40"
                      >
                        {series.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className=" md:mt-6 px-7 ">
                  <div className=" flex-col flex">
                    <label
                      className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                      htmlFor="tags"
                    >
                      Tags
                    </label>
                    <input
                      name="tags"
                      id="tags"
                      type="text"
                      className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                      value={productDetails.tags}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddProduct;
