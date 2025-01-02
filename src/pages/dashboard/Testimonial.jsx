import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import {
  AiFillDelete,
  AiFillPlusCircle,
  AiFillMinusCircle,
} from "react-icons/ai";
import parse from "html-react-parser";

const TestimonialPage = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [testimonialsData, setTestimonialsData] = useState([]); // Array of testimonial objects
  const [newTestimonials, setNewTestimonials] = useState([""]); // Dynamic array of user-added testimonials

  const formats = [
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

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/testimonial`
        );
        if (response.data) {
          setTestimonialsData([response.data]); // Single testimonial data scenario
        } else {
          console.error(
            "API response does not contain a valid testimonial data"
          );
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const handleAddTestimonial = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("testimonialImage", image);
      formData.append("testimonials", JSON.stringify(newTestimonials));

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/testimonial/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Testimonial added successfully");

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/testimonial`
      );
      if (response.data) {
        setTestimonialsData([response.data]); // Update state with new testimonial data
      } else {
        console.error("API response does not contain a valid testimonial data");
      }

      setNewTestimonials([""]); // Reset dynamic input boxes
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast.error("Failed to add testimonial");
    }
  };

  const handleDeleteTestimonial = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/testimonial`
      );
      toast.success("Testimonial deleted successfully");
      setTestimonialsData([]); // Clear testimonial data after deletion
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  const handleAddNewTestimonialInput = () => {
    setNewTestimonials((prevTestimonials) => [...prevTestimonials, ""]);
  };

  const handleRemoveTestimonialInput = (index) => {
    setNewTestimonials((prevTestimonials) =>
      prevTestimonials.filter((_, i) => i !== index)
    );
  };

  const handleNewTestimonialChange = (index, value) => {
    setNewTestimonials((prevTestimonials) =>
      prevTestimonials.map((testimonial, i) =>
        i === index ? value : testimonial
      )
    );
  };

  const truncateDescription = (htmlContent, wordLimit) => {
    if (!htmlContent) {
      return "";
    }

    const textContent = htmlContent.replace(/<[^>]+>/g, "");
    const words = textContent.split(/\s+/);
    if (words.length <= wordLimit) {
      return htmlContent;
    }

    const truncatedText = words.slice(0, wordLimit).join(" ") + "...";
    return parse(truncatedText);
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px]">
        Add Testimonial
      </p>

      <div className="flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5">
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="title">
            Title
          </label>
          <input
            name="title"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="image">
            Image
          </label>
          <input
            name="image"
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1 pb-8 border-b border-gray-400">
          <label className="text-sm mt-3" htmlFor="description">
            Description
          </label>
          <div className="flex flex-col pb-14">
            <ReactQuill
              className="h-[250px] w-full"
              theme="snow"
              value={description}
              onChange={(textValue) => setDescription(textValue)}
              formats={formats}
            />
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <p className="font-semibold mb-2">Add Testimonials:</p>
          {newTestimonials.map((testimonial, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={testimonial}
                onChange={(e) =>
                  handleNewTestimonialChange(index, e.target.value)
                }
                className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3 flex-grow"
                placeholder="Enter testimonial"
              />
              <AiFillMinusCircle
                className="ml-2 text-red-500 cursor-pointer"
                onClick={() => handleRemoveTestimonialInput(index)}
              />
            </div>
          ))}
          <AiFillPlusCircle
            className="text-green-500 cursor-pointer"
            onClick={handleAddNewTestimonialInput}
          />
        </div>

        <button
          className="bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm py-3"
          onClick={handleAddTestimonial}
        >
          Add Testimonial
        </button>
      </div>

      <div className="mt-10 w-full">
        <h2 className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] mb-5">
          Testimonials
        </h2>
        <div className="flex flex-col gap-6 mt-5">
          {testimonialsData.length > 0 ? (
            testimonialsData.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-md mb-6 shadow-lg"
              >
                <div className="flex flex-col md:flex-row items-start mb-4">
                  <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    {testimonial.imagePath && (
                      <img
                        src={testimonial.imagePath}
                        alt={testimonial.title}
                        className="max-w-full h-auto rounded-md mb-2"
                      />
                    )}
                  </div>
                  <div className="w-full px-4 md:w-2/3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                        {testimonial.title}
                      </h3>
                      <button
                        className="text-red-600 hover:text-red-800 text-xl"
                        onClick={handleDeleteTestimonial}
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {truncateDescription(testimonial.description, 30)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                        Testimonials:
                      </h4>
                      {testimonial.testimonials.length > 0 ? (
                        <ul className="list-disc list-inside pl-5 space-y-2">
                          {testimonial.testimonials.map((item, index) => (
                            <li
                              key={index}
                              className="list-item text-gray-700 dark:text-gray-300"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          No testimonials available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No testimonials available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;
