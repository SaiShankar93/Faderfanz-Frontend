import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { BsChevronDown } from "react-icons/bs";

const Newsletter = () => {
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "admin" && user1?.role !== "admin") {
      navigate("/login");
    }
  }, []);
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

  const [body, setBody] = useState("");
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState(false);
  const [subscribedEmails, setSubscribedEmails] = useState([]);

  const fetchUsersAndSubscribedUsers = async () => {
    try {
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/getUsers`
      );
      const subscribedResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/subscribe`
      );

      const subscribedEmails = subscribedResponse.data.map(
        (user) => user.email
      );

      setSubscribedEmails(subscribedEmails);

      const newSubscribedUsers = subscribedResponse.data.filter(
        (subscribedUser) =>
          !usersResponse.data.some(
            (user) => user.email === subscribedUser.email
          )
      );

      const combinedUsers = [...usersResponse.data, ...newSubscribedUsers];
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users and subscribed users:", error);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    const query = urlParams.get("email");
    if (query) {
      setEmails(query);
    }
    fetchUsersAndSubscribedUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {};
      if (sendToAll) {
        payload = {
          emails: "all",
          subject,
          message: body,
          all: true,
        };
      } else {
        payload = {
          emails: emails.split(",").map((email) => email.trim()),
          subject,
          message: body,
          all: false,
        };
      }

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/newsletter`,
        payload
      );

      setSubject("");
      setEmails("");
      setBody("");
      setSendToAll(false);
      toast.success("Newsletter sent successfully");
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Error sending newsletter");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allEmails = users.map((user) => user.email).join(", ");
      setEmails(allEmails);
    } else {
      setEmails("");
    }
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Newsletter
      </p>

      <div className="flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5 ">
        <form
          onSubmit={handleSubmit}
          className="md:w-[55%] flex-col flex gap-3"
        >
          <label
            htmlFor="email"
            className="dark:text-gray-400 text-[#000] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
          >
            Emails
          </label>
          <div className="flex items-center relative">
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Separate emails by a comma (,)"
              className="bg-gray-100 text-black rounded-sm p-3 w-full"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              required
            />
            <BsChevronDown
              onClick={() => {
                setUserList((prev) => !prev);
              }}
              className="absolute right-0 shadow-sm shadow-black/30 cursor-pointer bg-white h-full px-4 text-[50px]  "
            />
            {userList && (
              <div className="absolute right-0 bg-white top-12 w-full z-30 border-2 border-blue-400 p-3 h-[300px] overflow-y-auto">
                <div className="overscroll-y-auto">
                  {users ? (
                    <>
                      {users?.map((item, index) => {
                        const isSelected = emails.includes(item.email);
                        const isSubscribed = subscribedEmails.includes(
                          item.email
                        );
                        return (
                          <div
                            onClick={() => {
                              if (isSelected) {
                                const updatedEmails = emails
                                  .split(",")
                                  .filter(
                                    (email) =>
                                      email.trim() !== item.email.trim()
                                  )
                                  .join(", ");
                                setEmails(updatedEmails);
                              } else {
                                const newEmails = emails
                                  ? `${emails}, ${item.email}`
                                  : item.email;
                                setEmails(newEmails);
                              }
                            }}
                            key={index}
                            className={`my-1 border-b text-sm cursor-pointer ${
                              emails.includes(item?.email) ? "bg-green-200" : ""
                            } border-gray-400 py-2 flex flex-col flex-wrap w-full`}
                          >
                            <div className="flex justify-between">
                              <div>
                                <p>{item?.name}</p>
                                <p>{item?.email}</p>
                              </div>
                              {isSubscribed && (
                                <div className="bg-green-500 text-white px-2 rounded ml-2 flex items-center">
                                  Subscribed
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>No Users Found</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="selectAll"
              className="mr-2"
              onChange={handleSelectAll}
            />
            <label
              htmlFor="selectAll"
              className="dark:text-gray-400 text-[#000] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px]"
            >
              Select All
            </label>
          </div>
          <label
            htmlFor="subject"
            className="dark:text-gray-400 text-[#000] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
          >
            Subject
          </label>
          <input
            name="subject"
            id="subject"
            type="text"
            placeholder="Write subject of your email"
            className="bg-gray-200 text-black rounded-sm p-3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <div className="flex flex-col pb-14 mt-5 ">
            <label className="dark:text-gray-400 text-[#000] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 ">
              Editor Content
            </label>
            <ReactQuill
              className="h-[150px]"
              theme="snow"
              value={body}
              formats={formats}
              onChange={(textValue) => setBody(textValue)}
              required
            />
          </div>
          <button
            className="bg-orange-400 text-black hover:bg-orange-500 font-semibold text-sm py-3"
            type="submit"
          >
            Send E-Mail
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
