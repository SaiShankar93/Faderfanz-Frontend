import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

const Banner = () => {
  const [bannerNumber, setBannerNumber] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [bannerButtonContent, setBannerButtonContent] = useState("");
  const [slideNumber, setSlideNumber] = useState("slide1");
  const [slideFile, setSlideFile] = useState(null);
  const [slideLink, setSlideLink] = useState("");
  const [slideTitle, setSlideTitle] = useState("");
  const [slideDescription, setSlideDescription] = useState("");
  const [slideButtonContent, setSlideButtonContent] = useState("");
  const [catalogueImage, setCatalogueImage] = useState(null);
  const [catalogueLinks, setCatalogueLinks] = useState(["", "", ""]);
  const [partnerName, setPartnerName] = useState("");
  const [partnerLogo, setPartnerLogo] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [catalogue, setCatalogue] = useState({});
  const [banners, setBanners] = useState([]);
  const [partners, setPartners] = useState([]);
  const isMounted = useRef(false);
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (
      !isMounted.current &&
      (!user || user?.role !== "admin") &&
      (!user1 || user1?.role !== "admin")
    ) {
      navigate("/login");
    } else {
      isMounted.current = true;
      getSliders();
      getCatalogue();
      getAllBanners();
      getPartners();
    }
  }, []);

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...catalogueLinks];
    updatedLinks[index] = value;
    setCatalogueLinks(updatedLinks);
  };

  const handleBannerUpload = async () => {
    const formData = new FormData();
    formData.append("banner", bannerFile);
    formData.append("fileName", bannerNumber);
    formData.append("redirectUrl", bannerLink);
    formData.append("title", bannerTitle);
    formData.append("description", bannerDescription);
    formData.append("buttonContent", bannerButtonContent);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/uploadBanner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      getAllBanners();
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Error uploading banner");
    }
  };

  const handleCatalogueUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("catalogueImage", catalogueImage);
      formData.append("links", JSON.stringify(catalogueLinks));

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      getCatalogue(); // Fetch catalogue again to update the UI
    } catch (error) {
      console.error("Error updating catalogue:", error);
      toast.error("Error updating catalogue");
    }
  };

  const handleAddPartner = async () => {
    try {
      const formData = new FormData();
      formData.append("partnerLogo", partnerLogo);
      formData.append("partnerName", partnerName);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/partners`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      getPartners(); // Fetch partners again to update the UI
    } catch (error) {
      console.error("Error uploading partner:", error);
      toast.error("Error uploading partner");
    }
  };

  const handleAddSlider = async () => {
    try {
      const formData = new FormData();
      formData.append("name", slideNumber);
      formData.append("sliderImage", slideFile);
      formData.append("link", slideLink);
      formData.append("title", slideTitle);
      formData.append("description", slideDescription);
      formData.append("buttonContent", slideButtonContent);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/slider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      getSliders(); // Fetch sliders again to update the UI
    } catch (error) {
      console.error("Error adding slider:", error);
      toast.error("Error adding slider");
    }
  };

  const getSliders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/slider`
      );
      console.log(response.data);
      setSliders(response.data);
    } catch (error) {
      console.error("Error fetching slider:", error);
    }
  };

  const getCatalogue = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`
      );
      setCatalogue(response.data.catalogue);
    } catch (error) {
      console.error("Error fetching catalogue:", error);
    }
  };

  const getAllBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/banner`
      );
      console.log(response.data.banners);
      setBanners(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const getPartners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/partners`
      );
      console.log(response.data);
      setPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const handleDeleteSlider = async (sliderId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/slider/${sliderId}`
      );
      toast.success(response.data.message);
      setSliders(sliders.filter((slider) => slider._id !== sliderId));
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Error deleting slider");
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/admin/banner/${bannerId}`
      );
      toast.success(response.data.message);
      // Filter out the deleted banner from the state
      setBanners(banners.filter((banner) => banner._id !== bannerId));
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error deleting banner");
    }
  };

  const handleDeleteCatalogue = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`
      );
      toast.success(response.data.message);
      setCatalogue({});
    } catch (error) {
      console.error("Error deleting catalogue:", error);
      toast.error("Error deleting catalogue");
    }
  };

  const handleDeletePartner = async (partnerId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/partners/${partnerId}`
      );
      toast.success(response.data.message);
      setPartners(partners.filter((partner) => partner._id !== partnerId));
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Error deleting partner");
    }
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Home Image Slider
      </p>

      <div className="flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5 ">
        <div className="p-6 md:w-[55%] flex-col flex gap-3 pb-8 border-b border-gray-400">
          <label className="text-sm mt-3" htmlFor="slideNumber">
            Slide Number
          </label>
          <input
            name="slideNumber"
            id="slideNumber"
            type="text"
            value={slideNumber}
            onChange={(e) => setSlideNumber(e.target.value)}
            placeholder="Slide Number e.g. 1, 2, 3"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <label className="capitalize text-sm mt-3" htmlFor="slideLink">
            Slide No. {slideNumber} Link
          </label>
          <input
            name="slideLink"
            id="slideLink"
            type="link"
            value={slideLink}
            onChange={(e) => setSlideLink(e.target.value)}
            placeholder="Enter link of slide to redirect"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <label className="capitalize text-sm" htmlFor="slideImg">
            Add Slide No. {slideNumber} Image
          </label>
          <input
            name="slideImg"
            id="slideImg"
            type="file"
            onChange={(e) => setSlideFile(e.target.files[0])}
          />
          <label className="text-sm mt-3" htmlFor="slideTitle">
            Slide No. {slideNumber} Title
          </label>
          <input
            name="slideTitle"
            id="slideTitle"
            type="text"
            value={slideTitle}
            onChange={(e) => setSlideTitle(e.target.value)}
            placeholder="Enter title of slide"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <label className="text-sm mt-3" htmlFor="slideDescription">
            Slide No. {slideNumber} Description
          </label>
          <input
            name="slideDescription"
            id="slideDescription"
            type="text"
            value={slideDescription}
            onChange={(e) => setSlideDescription(e.target.value)}
            placeholder="Enter description of slide"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <label className="text-sm mt-3" htmlFor="slideButtonContent">
            Slide No. {slideNumber} Button Content
          </label>
          <input
            name="slideButtonContent"
            id="slideButtonContent"
            type="text"
            value={slideButtonContent}
            onChange={(e) => setSlideButtonContent(e.target.value)}
            placeholder="Enter button content of slide"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <button
          className="bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm w- py-3"
          onClick={handleAddSlider}
        >
          Add Slide
        </button>
      </div>

      <div className="mt-6">
        {sliders.length > 0 && (
          <>
            <h3 className="dark:text-gray-400 text-[#363F4D] font-bold text-lg">
              Uploaded Sliders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sliders.map((slider) => (
                <div key={slider._id} className="relative">
                  <button
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white dark:bg-black dark:bg-opacity-50 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
                    onClick={() => handleDeleteSlider(slider._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <img
                    src={`${slider.image}`}
                    alt={slider.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <p className="absolute bottom-2 left-2 bg-white bg-opacity-50 px-2 py-1 rounded-md text-sm font-semibold">
                    {slider.name}
                  </p>
                  {slider.title && (
                    <p className="absolute top-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded-md text-xs font-semibold">
                      Title: {slider.title}
                    </p>
                  )}
                  {slider.description && (
                    <p className="absolute top-8 left-2 bg-white bg-opacity-75 px-2 py-1 rounded-md text-xs font-semibold">
                      Description: {slider.description}
                    </p>
                  )}
                  {slider.buttonContent && (
                    <p className="absolute bottom-8 left-2 bg-white bg-opacity-75 px-2 py-1 rounded-md text-xs font-semibold">
                      Button: {slider.buttonContent}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mt-3 dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Edit Catalogue
      </p>

      <div className=" flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5 ">
        <div className=" p-6 md:w-[55%] flex-col flex gap-3 pb-8 border-b border-gray-400">
          <label className="capitalize text-sm mt-3" htmlFor="catalogue-link-1">
            Catalogue Link 1
          </label>
          <input
            name="catalogue-link-1"
            id="catalogue-link-1"
            type="text"
            placeholder="Catalogue Link 1"
            value={catalogueLinks[0]}
            onChange={(e) => handleLinkChange(0, e.target.value)}
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="capitalize text-sm mt-3" htmlFor="catalogue-link-2">
            Catalogue Link 2
          </label>
          <input
            name="catalogue-link-2"
            id="catalogue-link-2"
            type="text"
            placeholder="Catalogue Link 2"
            value={catalogueLinks[1]}
            onChange={(e) => handleLinkChange(1, e.target.value)}
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="capitalize text-sm mt-3" htmlFor="catalogue-link-3">
            Catalogue Link 3
          </label>
          <input
            name="catalogue-link-3"
            id="catalogue-link-3"
            type="text"
            placeholder="Catalogue Link 3"
            value={catalogueLinks[2]}
            onChange={(e) => handleLinkChange(2, e.target.value)}
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="capitalize text-sm" htmlFor="catalogueImage">
            Add Catalogue Image
          </label>
          <input
            name="catalogueImage"
            id="catalogueImage"
            type="file"
            onChange={(e) => setCatalogueImage(e.target.files[0])}
          />
        </div>
        <button
          className="bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm w- py-3"
          onClick={handleCatalogueUpdate}
        >
          Edit Catalogue
        </button>
      </div>

      <div className="mt-6 relative">
        {catalogue.image && (
          <>
            <h3 className="dark:text-gray-400 text-[#363F4D] font-bold text-lg">
              Uploaded Catalogue
            </h3>
            <div className="flex flex-col items-center mt-4 relative">
              <button
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-red-500 text-white hover:bg-white hover:text-red-500 dark:bg-black dark:bg-opacity-50 transition duration-300"
                onClick={handleDeleteCatalogue}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <img
                src={`${catalogue.image}`}
                alt="Catalogue"
                className="w-full md:w-1/2 h-64 object-cover rounded-md"
              />
              <div className="flex flex-col md:flex-row mt-4 gap-4">
                {catalogue.links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 p-2 rounded-md text-center"
                  >
                    Link {index + 1}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mt-3 dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Banner
      </p>

      <div className="flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5">
        <p className="text-[14.5px] font-semibold underline underline-offset-2 mt-3">
          To Redirect the user, when they click on banner add a redirect link
        </p>
        <div className="p-6 md:w-[55%] flex-col flex gap-3 pb-8 border-b border-gray-400">
          <label className="text-sm mt-3" htmlFor="bannerName">
            Banner Name
          </label>
          <input
            id="bannerName"
            name="bannerName"
            value={bannerNumber}
            onChange={(e) => setBannerNumber(e.target.value)}
            placeholder="Enter a name for banner"
            className="bg-gray-200 w-full text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="text-sm mt-3" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
            placeholder="Enter the title"
            className="bg-gray-200 w-full text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="text-sm mt-3" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={bannerDescription}
            onChange={(e) => setBannerDescription(e.target.value)}
            placeholder="Enter the description"
            className="bg-gray-200 w-full text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="text-sm mt-3" htmlFor="buttonContent">
            Button Content
          </label>
          <input
            id="buttonContent"
            name="buttonContent"
            value={bannerButtonContent}
            onChange={(e) => setBannerButtonContent(e.target.value)}
            placeholder="Enter the button content"
            className="bg-gray-200 w-full text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="capitalize text-sm mt-3" htmlFor="banner1">
            {bannerNumber} Link
          </label>
          <input
            name="banner1-link"
            id="banner1-link"
            type="link"
            value={bannerLink}
            onChange={(e) => setBannerLink(e.target.value)}
            placeholder="Enter link of banner 1 to redirect"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />

          <label className="capitalize text-sm" htmlFor="banner1">
            Add {bannerNumber} Image
          </label>
          <input
            name="banner1"
            id="banner1"
            type="file"
            onChange={(e) => setBannerFile(e.target.files[0])}
          />
        </div>
        <button
          className="bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm py-3"
          onClick={handleBannerUpload}
        >
          Add Banner
        </button>
      </div>

      <div className="mt-6">
        {banners.length > 0 && (
          <>
            <h3 className="dark:text-gray-400 text-[#363F4D] font-bold text-lg">
              Uploaded Banners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="relative bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <button
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
                    onClick={() => handleDeleteBanner(banner._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <img
                    src={`${banner.filePath}`}
                    alt={banner.fileName}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-[#363F4D]">
                      {banner.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      {banner.description}
                    </p>
                    <a
                      href={banner.redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-orange-400 text-white px-3 py-2 rounded-full hover:bg-orange-500 transition duration-300"
                    >
                      {banner.buttonContent}
                    </a>
                    <p className="mt-2 text-xs text-gray-500">
                      {banner.fileName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mt-3 dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Partners Images
      </p>

      <div className=" flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5 ">
        <div className=" p-6 md:w-[55%] flex-col flex gap-3 pb-8 border-b border-gray-400">
          <label className=" text-sm mt-3" htmlFor="bannerName">
            Partner Name
          </label>
          <input
            id="partnerName"
            name="partnerName"
            value={partnerName}
            onChange={(e) => {
              setPartnerName(e.target.value);
            }}
            placeholder="Enter the name of Partner"
            className=" bg-gray-200 w-full text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <label className=" capitalize text-sm" htmlFor="banner1">
            Add Partners Logo
          </label>
          <input
            name="partners"
            id="partners"
            type="file"
            onChange={(e) => setPartnerLogo(e.target.files[0])}
          />
        </div>
        <button
          className=" bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm w- py-3"
          onClick={handleAddPartner}
        >
          Add Partners
        </button>
      </div>

      <div className="mt-6">
        {partners.length > 0 && (
          <>
            <h3 className="dark:text-gray-400 text-[#363F4D] font-bold text-lg">
              Uploaded Partners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {partners.map((partner) => (
                <div key={partner._id} className="relative">
                  <button
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-red-500 text-white hover:bg-white hover:text-red-500 dark:bg-black dark:bg-opacity-50 transition duration-300"
                    onClick={() => handleDeletePartner(partner._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <img
                    src={`${partner.logo}`}
                    alt={partner.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <p className="absolute bottom-2 left-2 bg-white bg-opacity-50 px-2 py-1 rounded-md text-sm font-semibold">
                    {partner.name}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Banner;
