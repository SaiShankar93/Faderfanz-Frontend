const Success = ({}) => {
  return (
    <>
      <div className="  fixed inset-0 w-full h-[100vh] flex items-center justify-center bg-black/30 overflow-hidden z-40 ">
        <div className=" relative w-[50%] h-[60%] flex items-center justify-center  dark:text-black bg-white p-10 capitalize">
          <img
            src="/Images/success.png"
            className=" w-[300px] h-[300px] object-contain"
            alt="success"
          />
          <p className=" font-bold text-green-500 text-3xl">
            Order Placed Successfully
          </p>
        </div>
      </div>
    </>
  );
};

export default Success;
