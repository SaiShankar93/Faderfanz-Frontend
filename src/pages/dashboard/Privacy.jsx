import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";
import ReactQuill from "react-quill";

const PrivacyPolicy = () => {
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
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

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/privacy`
        );
        const { policy } = response.data;
        setPrivacyPolicyText(policy.content);
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
        toast.error("Failed to fetch privacy policy");
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const handleUpdatePolicy = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/admin/privacy`, {
        content: privacyPolicyText,
      });
      toast.success("Privacy policy updated successfully");
    } catch (error) {
      console.error("Error updating privacy policy:", error);
      toast.error("Failed to update privacy policy");
    }
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Privacy Policy
      </p>

      <div className=" flex flex-col items-center mt-3 md:mt-1 overflow-x-auto rounded-md dark:bg-black bg-white">
        <div className=" p-6 md:w-[55%] flex-col flex gap-3 pb-8 border-b border-gray-400">
          <label className=" text-sm mt-3" htmlFor="privacyPolicy">
            Privacy Policy
          </label>
          <div className="flex flex-col pb-14 ">
            <ReactQuill
              className="h-[250px] w-full"
              theme="snow"
              value={privacyPolicyText}
              onChange={(textValue) => setPrivacyPolicyText(textValue)}
              formats={formats}
            />
          </div>
        </div>
        <button
          className=" bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm w- py-3"
          onClick={handleUpdatePolicy}
        >
          Add PrivacyPolicy
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
