import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PopupModal = ({ onClose }) => {
  const [featuredPopup, setFeaturedPopup] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    let renderCount = parseInt(localStorage.getItem("renderCount")) || 0;

    if (hasVisitedBefore && renderCount >= 5) {
      const renderInterval = Date.now() - parseInt(hasVisitedBefore);
      if (renderInterval < 24 * 60 * 60 * 1000) {
        setShowModal(false);
        return;
      }
    }

    localStorage.setItem("hasVisitedBefore", Date.now().toString());
    renderCount++;
    localStorage.setItem("renderCount", renderCount.toString());

    const fetchFeaturedPopup = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/popup/featured`
        );
        setFeaturedPopup(response.data.popup);
      } catch (error) {
        console.error("Error fetching featured popup:", error);
      }
    };

    fetchFeaturedPopup();

    const intervalId = setInterval(fetchFeaturedPopup, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/popup/response`,
        {
          popupId: featuredPopup._id,
          inputValue,
        }
      );

      console.log("Response from server:", response.data);
      toast.success(response.data.message);

      setInputValue("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    }
  };

  if (!showModal || !featuredPopup) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 overflow-auto">
      <div className="modal-overlay absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="modal-container bg-white square-modal mx-auto rounded-lg shadow-lg z-50 overflow-y-auto relative w-3/4 md:max-w-xl md:max-h-md flex flex-col justify-center h-[60vh]">
        <div className="modal-content text-left pr-6 relative z-10 text-center h-[100vh]">

          <div className="flex justify-between h-[100%]">
            <div className="w-[55%] pr-[20px]">
              <img
                src={featuredPopup.imagePath}
                style={{
                  width: "100%", // or specify a specific width if needed
                  height: "100%", // or specify a specific height if needed
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                alt="Popup Image"
              />
              {/* <div
                className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                style={{
                  backgroundImage: `url(${featuredPopup.imagePath})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div> */}
            </div>
            <div className="w-[45%]">
              <h2 className="text-2xl font-bold mb-8 text-black pt-[70px]">
                {featuredPopup.title}
              </h2>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your input"
                className="w-full border border-gray-400 font-[14px] rounded-md py-2 px-3 mb-3 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSubmit}
                className=" text-black border border-[#484848] font-bold py-2 px-3 rounded hover:bg-[#484848] hover:text-[#ffffff] focus:outline-none focus:bg-[#484848] w-full"
              >
                Submit
              </button>
              {/* <div className="mt-4 text-black">
                <a
                  href={featuredPopup.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Learn More
                </a>
              </div> */}

            </div>
          </div>
        </div>

        <div
          className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
          onClick={handleClose}
        >
          <svg
            className="fill-current text-black text-[16px]"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path d="M18 1.41L16.59 0 9 7.59 1.41 0 0 1.41 7.59 9 0 16.59 1.41 18 9 10.41 16.59 18 18 16.59 10.41 9 18 1.41z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
