import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { AiFillDelete } from "react-icons/ai";
import parse from 'html-react-parser';

const NewsPage = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogImage, setBlogImage] = useState(null); 
  const [blogContent, setBlogContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [blogs, setBlogs] = useState([]);

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
    const getBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs");
      }
    };

    getBlogs();
  }, []);

  const handleAddBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", blogTitle);
      formData.append("content", blogContent);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("blogImage", blogImage);

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/createBlog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Blog added successfully");
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Failed to add blog");
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/admin/blog/${id}`);
      toast.success("Blog deleted successfully");
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const truncateContent = (htmlContent, wordLimit) => {
    const textContent = htmlContent.replace(/<[^>]+>/g, ''); 
    const words = textContent.split(/\s+/); 
    if (words.length <= wordLimit) {
      return htmlContent;
    }
    const truncatedText = words.slice(0, wordLimit).join(' ') + '...';
    return parse(truncatedText);
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px]">
        Add News Blog
      </p>

      <div className="flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5">
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="blogTitle">
            Blog Title
          </label>
          <input
            name="blogTitle"
            id="blogTitle"
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Blog Title"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="blogImage">
            Blog Image
          </label>
          <input
            name="blogImage"
            id="blogImage"
            type="file"
            onChange={(e) => setBlogImage(e.target.files[0])}
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="metaTitle">
            Meta Title
          </label>
          <input
            name="metaTitle"
            id="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Meta Title"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="metaDescription">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Meta Description"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1 pb-8 border-b border-gray-400">
          <label className="text-sm mt-3" htmlFor="blogContent">
            Blog Content
          </label>

          <div className="flex flex-col pb-14">
            <ReactQuill
              className="h-[250px] w-full"
              theme="snow"
              value={blogContent}
              onChange={(textValue) => setBlogContent(textValue)}
              formats={formats}
            />
          </div>
        </div>
        <button
          className="bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm py-3"
          onClick={handleAddBlog}
        >
          Add Blog
        </button>
      </div>

      <div className="mt-10 w-full">
        <h2 className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px]">
          All Blogs
        </h2>
        <div className="flex flex-col mt-5">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex flex-col md:flex-row justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-md mb-3"
            >
              <div className="w-full md:w-1/3">
                {blog.imageLink && (
                  <img
                    src={blog.imageLink}
                    alt={blog.title}
                    className="max-w-full h-auto rounded-md"
                  />
                )}
              </div>
              <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-4">
                <h3 className="font-semibold text-lg">{blog.title}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {truncateContent(blog.content, 60)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Meta Title:</strong> {blog.metaTitle}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong>Meta Description:</strong> {blog.metaDescription}</p>
              </div>
              <button
                onClick={() => handleDeleteBlog(blog._id)}
                className="text-red-600 hover:text-red-800 mt-4 md:mt-0"
              >
                <AiFillDelete size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
