import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { AiFillDelete } from "react-icons/ai";
import parse from "html-react-parser";
import axiosInstance from "@/configs/axiosConfig";

const Blogs = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogContent, setBlogContent] = useState("");
  const [tags, setTags] = useState([]); // Updated to an array
  const [tagInput, setTagInput] = useState(""); // For handling tag input
  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null); // Track which blog is being edited

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

  const [author, setAuthor] = useState(""); // New state for author
  const [category, setCategory] = useState("");

  const getBlogs = async () => {
    try {
      const response = await axiosInstance.get(`/blogs`);
      if (response.data.success) setBlogs(response.data.data);
      else throw new Error("Fetching Blogs failed");
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    }
  };
  useEffect(() => {
    getBlogs();
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", blogTitle);
      formData.append("content", blogContent);
      formData.append("tags", JSON.stringify(tags)); // Convert tags array to JSON string
      formData.append("blogImage", blogImage);
      formData.append("author", author); // Include author
      formData.append("category", category); // Include category

      const response = await axiosInstance.post(`/blogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      console.log(data)
      if (data.success) {
        toast.success("Blog added successfully");
        getBlogs();
      } else toast.error("Blog Not Added");
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Failed to add blog");
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      console.log(id)
      const response = await axiosInstance.delete(`/blogs/${id}`);
      console.log("Delter",response.data)
      if (response.data.success) {
        toast.success("Blog deleted successfully");
        getBlogs();
      } else toast.error("Blog Not Deleted");
      
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const truncateContent = (htmlContent, wordLimit) => {
    const textContent = htmlContent.replace(/<[^>]+>/g, "");
    const words = textContent.split(/\s+/);
    if (words.length <= wordLimit) {
      return htmlContent;
    }
    const truncatedText = words.slice(0, wordLimit).join(" ") + "...";
    return parse(truncatedText);
  };

  // Populate form for editing
  const handleEditBlog = (blog) => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
    setEditingBlogId(blog._id);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setTags(blog.tags || []);
    setAuthor(blog.author || "");
    setCategory(blog.category || "");
    setBlogImage(null); // User can upload a new image if desired
  };

  // Update blog
  const handleUpdateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", blogTitle);
      formData.append("content", blogContent);
      formData.append("tags", JSON.stringify(tags));
      formData.append("author", author);
      formData.append("category", category);
      if (blogImage) formData.append("blogImage", blogImage);

      const response = await axiosInstance.put(`/blogs/${editingBlogId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      if (data.success) {
        toast.success("Blog updated successfully");
        getBlogs();
        // Reset form
        setEditingBlogId(null);
        setBlogTitle("");
        setBlogContent("");
        setTags([]);
        setAuthor("");
        setCategory("");
        setBlogImage(null);
      } else toast.error("Blog Not Updated");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    }
  };

  // Reset form (for canceling edit)
  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setBlogTitle("");
    setBlogContent("");
    setTags([]);
    setAuthor("");
    setCategory("");
    setBlogImage(null);
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
          <label className="text-sm mt-3" htmlFor="tags">
            Tags
          </label>
          <div className="flex items-center gap-2">
            <input
              name="tags"
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3 flex-grow"
            />
            <button
              onClick={handleAddTag}
              className="bg-blue-500 text-white px-3 py-2 rounded-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-300 text-black px-3 py-1 rounded-full flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="author">
            Author
          </label>
          <input
            name="author"
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author Name"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
        </div>
        <div className="px-6 md:w-[95%] flex-col flex gap-1">
          <label className="text-sm mt-3" htmlFor="category">
            Category
          </label>
          <input
            name="category"
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
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
          onClick={editingBlogId ? handleUpdateBlog : handleAddBlog}
        >
          {editingBlogId ? "Update Blog" : "Add Blog"}
        </button>
        {editingBlogId && (
          <button
            className="bg-gray-400 mt-2 w-full md:w-[55%] text-black hover:bg-gray-500 font-semibold text-sm py-3"
            onClick={handleCancelEdit}
            type="button"
          >
            Cancel Edit
          </button>
        )}
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
                    src={blog.image}
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Tags:</strong> {blog.tags.join(", ")}
                </p>
              </div>
              <div className="flex flex-row gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => handleEditBlog(blog)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <AiFillDelete size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
