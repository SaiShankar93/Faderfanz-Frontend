import { MainAppContext } from "@/context/MainContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(true);
  const param = useParams();
  const { blogId, setBlogId } = useContext(MainAppContext);

  const getAllBlogs = async (BlogId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/blogs`
      );
      setBlogs(response?.data);
      const blog = response?.data?.filter((i) => {
        return i._id === BlogId;
      });
      console.log(blog[0]);
      setBlog(blog[0]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const blogId2 = JSON.parse(sessionStorage.getItem("blogId"));
    getAllBlogs(blogId2);
    setLoading(false);
  }, []);

  return (
    <div className="dark:text-gray-400">
      <Helmet>
        <title>{blog?.metaTitle || "Blog Page"}</title>
        <meta name="description" content={blog?.metaDescription || "Blog description"} />
      </Helmet>
      <div className="px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7] dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between">
        <h2 className="uppercase text-[14px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400">
          {blog?.title?.slice(0, 50)}
        </h2>
        <div className="flex items-center font-[500] text-[12px] md:text-[13.6px]">
          <Link to="/">
            <span className="uppercase text-[#FF7004] cursor-pointer">Home</span>
          </Link>
          <span className="px-1">/</span>
          <span className="uppercase">Blogs</span>
        </div>
      </div>
      {loading || !blog ? (
        <div className="w-full flex items-center justify-center py-3">
          <img
            src="/Images/loader.svg"
            alt="loading..."
            className="object-contain w-[60px] h-[60px]"
          />
        </div>
      ) : (
        <section className="px-[4%] md:px-[8%] mt-4">
          <div className="flex flex-col md:gap-1">
            <img
              className="w-full h-[230px] md:h-[390px] object-cover"
              src={blog?.imageLink}
              alt="blog"
            />
            <div className="flex flex-col">
              <h3 className="text-[20px] md:text-[26px] uppercase text-[#363F4D] dark:text-gray-400 font-[700] plus-jakarta">
                {blog?.title}
              </h3>
              <p className="pb-10 text-[12.5px] md:text-[13.6px] font-[400] text-justify mt-2 md:mt-4 mb-5 md:mb-8 text-[#4d4d4d] dark:text-gray-600">
                {blog?.content && parse(blog?.content)}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blogs;
