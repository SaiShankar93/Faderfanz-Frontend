import { IoClose } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useRef, useState } from "react";
import { IoCloseOutline, IoStar, IoStarOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { DashboardAppContext } from "@/context/DashboardContext";
import { MainAppContext } from "@/context/MainContext";
import { FaStar } from "react-icons/fa";

const RatingForm2 = ({ activeReview }) => {
  // console.log(activeReview);
  const { isAdminRatingFormOpen, setIsAdminRatingFormOpen } =
    useContext(MainAppContext);

  function closeModal() {
    setIsAdminRatingFormOpen(false);
  }

  const [starRating, setStarRating] = useState(0);
  const [review, setReview] = useState({
    id: activeReview?._id,
    rating: activeReview?.rating,
    title: activeReview?.title,
    body: activeReview?.comment,
    // order_item: order.id,
    customer: activeReview?.userId?.name,
  });

  const { title, body } = review;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setReview({
      ...review,
      [name]: value,
    });
  };

  const inputRef = useRef(null);

  const submitReview = async (e) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?._id;
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/review`,
        {
          title: review.title,
          productId: productId,
          userId: review.userId._id,
          rating: review.rating,
          comment: review.body,
        }
      );
      toast.success(response.data.message);
      setIsAdminRatingFormOpen(false);
      // Handle successful response
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    }
  };

  const editReview = async (e) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?._id;
      const reviewId = review.id; // Assuming review.id contains the ID of the review to be edited
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/review/${reviewId}`, // Include reviewId in the URL
        {
          title: review.title,
          rating: review.rating,
          comment: review.body,
        }
      );
      toast.success(response.data.message);
      setIsAdminRatingFormOpen(false);
      // Handle successful response
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    }
  };

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
    <>
      <div className="  fixed inset-0 w-full min-h-[100vh] flex items-center justify-center bg-black/30 overflow-hidden z-40 ">
        <div
          onClick={() => {
            setIsAdminRatingFormOpen(false);
          }}
          className="w-full h-full z-40"
        ></div>
        <div className="w-full absolute z-50  max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
          <h3
            as="h3"
            className="text-lg mb-4 flex items-center justify-between font-medium leading-6 text-gray-900"
          >
            Ratings and Review
            <IoCloseOutline
              className=" text-[23px] cursor-pointer"
              onClick={() => {
                setIsAdminRatingFormOpen(false);
              }}
            />
          </h3>
          <form className="w-full max-w-lg">
            <div className=" flex justify-evenly px-2 sm:px-4 items-center gap-3 sm:gap-5 mt-3 mb-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  onClick={() => {
                    setStarRating(index);
                    setReview({ ...review, rating: index });
                  }}
                  className="relative cursor-pointer group"
                >
                  {starRating >= index ? (
                    <IoStar className="text-black text-[27px]" />
                  ) : (
                    <IoStarOutline className="text-black text-[27px]" />
                  )}
                </div>
              ))}
            </div>
            <div className=" flex items-center ">
              Ratings by User :
              <Stars stars={activeReview?.rating} /> ({activeReview?.rating})
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full px-3">
                <label
                  className="block capitalize tracking-wide text-black text-sm font-semibold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="appearance-none block w-full text-black border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white bg-transparent focus:border-gray-500"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  autoFocus
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                />
              </div>
              <div className="w-full px-3">
                <label
                  className="block capitalize tracking-wide text-black text-sm font-semibold mb-2"
                  htmlFor="body"
                >
                  Share Your Review
                </label>
                <textarea
                  className="appearance-none block w-full text-black border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white bg-transparent focus:border-gray-500"
                  id="body"
                  rows={5}
                  name="body"
                  type="text"
                  placeholder="Share your user experience"
                  value={body}
                  onChange={handleOnChange}
                  required
                />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                activeReview ? editReview(e) : submitReview(e); // Call submitReview function
              }} // Set type to submit
              disabled={starRating === 0}
              className="w-full flex items-center justify-center disabled:bg-gray-500 bg-yellow-500 text-black font-semibold py-3 rounded-lg"
            >
              Submit My Review{" "}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RatingForm2;
