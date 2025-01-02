import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" min-h-[50vh] my-10 flex flex-col items-center justify-center ">
      <img
        src="/Images/error.jpg"
        alt="error404"
        className=" h-[300px] object-contain"
      />
      <p className=" mt-4">OOPS !! Page not found </p>
      <Link className=" underline dark:text-white">Return Home</Link>
    </div>
  );
};

export default Error404;
