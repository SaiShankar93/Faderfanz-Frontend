import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { IoCloseOutline, IoStar, IoStarOutline } from "react-icons/io5";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

export default function RatingForm({ order }) {
  const { isRatingFormOpen, setIsRatingFormOpen } = useContext(AppContext);

  function closeModal() {
    setIsRatingFormOpen(false);
  }

  const [starRating, setStarRating] = useState(0);
  const [review, setReview] = useState({
    rating: 1,
    title: "",
    body: "",
    order_item: order.id,
    customer: order.customer,
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
    e.preventDefault();
    e.stopPropagation(); // Prevent event propagation

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/review`,
        {
          title: review.title,
          productId: review.productId,
          userId: review.userId,
          rating: review.rating,
          comment: review.comment,
        }
      );
      // console.log(response.data);
      // Handle successful response
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error
    }
  };

  return (
    <>
      <Transition appear show={isRatingFormOpen} as={Fragment}>
        <Dialog
          as="div"
          initialFocus={inputRef}
          className="relative z-10"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full  max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg mb-4 flex items-center justify-between font-medium leading-6 text-gray-900"
                  >
                    Ratings and Review
                    <IoCloseOutline
                      className=" text-[23px] cursor-pointer"
                      onClick={closeModal}
                    />
                  </Dialog.Title>
                  <form onSubmit={submitReview} className="w-full max-w-lg">
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
                    <div className="flex flex-wrap -mx-3 mb-2">
                      <div className="w-full px-3">
                        <label
                          className="block capitalize tracking-wide text-black text-sm font-semibold mb-2"
                          htmlFor="title"
                        >
                          Title
                        </label>
                        <input
                          ref={inputRef}
                          className="appearance-none block w-full text-black border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white bg-transparent focus:border-gray-500"
                          id="title"
                          name="title"
                          type="text"
                          placeholder="Title"
                          value={title}
                          autoFocus
                          onChange={handleOnChange}
                          required
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
                    <input type="text" tabIndex="0" className="sr-only" />
                    <button
                      disabled={starRating === 0}
                      className="w-full flex items-center justify-center disabled:bg-gray-500 bg-yellow-500 text-black font-semibold py-3 rounded-lg"
                    >
                      Submit My Review{" "}
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
