import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineDelete } from "react-icons/md";
import { BsStar, BsStarFill } from "react-icons/bs";

const PopupAdmin = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [showAfterHours, setShowAfterHours] = useState("");
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/popup`
      );
      setPopups(response.data.popups);
    } catch (error) {
      console.error("Error fetching popups:", error);
      toast.error("Failed to fetch popups");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("popupImage", image);
    formData.append("link", link);
    formData.append("showAfterHours", showAfterHours);

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/popup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Popup created successfully");
      setTitle("");
      setImage(null);
      setLink("");
      setShowAfterHours("");
      fetchPopups();
    } catch (error) {
      console.error("Error creating popup:", error);
      toast.error("Failed to create popup");
    }
  };

  const handleDeletePopup = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/popup/${id}`);
      toast.success("Popup deleted successfully");
      fetchPopups();
    } catch (error) {
      console.error("Error deleting popup:", error);
      toast.error("Failed to delete popup");
    }
  };

  const handleMarkFeatured = async (id, isFeatured) => {
    try {
      await axios.patch(`${import.meta.env.VITE_SERVER_URL}/popup/feature/${id}`, {
        feature: !isFeatured,
      });
      toast.success("Popup updated successfully");
      fetchPopups();
    } catch (error) {
      console.error("Error updating popup:", error);
      toast.error("Failed to update popup");
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-gray-100 dark:bg-black rounded-lg px-8 py-6 md:py-10">
      <p className="text-gray-900 dark:text-gray-200 text-lg font-semibold mb-4">
        Create Popup
      </p>
      <form className="mt-4 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Upload Pop Image
          </label>
          <input
            type="file"
            id="image"
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="link"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Link on Popup Image
          </label>
          <input
            type="text"
            id="link"
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            placeholder="Enter link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="showAfterHours"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
          >
            Show After (hours)
          </label>
          <input
            type="number"
            id="showAfterHours"
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            placeholder="Enter hours"
            value={showAfterHours}
            onChange={(e) => setShowAfterHours(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white active:bg-indigo-700 text-sm font-semibold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
        >
          Submit
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popups.map((popup) => (
          <div
            key={popup._id}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-4 relative"
          >
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              onClick={() => handleDeletePopup(popup._id)}
            >
              <MdOutlineDelete />
            </button>
            <button
              className="absolute top-2 left-2 bg-transparent rounded-full p-2 z-10"
              onClick={() => handleMarkFeatured(popup._id, popup.feature)}
            >
              {popup.feature ? (
                <BsStarFill className="text-yellow-500" />
              ) : (
                <BsStar className="text-yellow-500" />
              )}
            </button>
            <p className="text-lg font-semibold mb-2 mt-6">{popup.title}</p>
            <img
              src={`${popup.imagePath.replace(/\\/g, "/")}`}
              alt={popup.title}
              className="w-full h-auto mb-2"
            />
            <p className="mb-2">{popup.link}</p>
            <p className="text-gray-500">
              Show After Hours: {popup.showAfterHours}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopupAdmin;
