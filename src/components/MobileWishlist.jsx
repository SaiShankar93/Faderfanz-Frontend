import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { AppContext } from "../context/AppContext";
import { MainAppContext } from "@/context/MainContext";

const CartData = [
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
  {
    id: 1,
    image: "/Images/pan.png",
    name: "Cillum dolore tortor nisl fermentum",
    price: "29.00",
    quantity: 1,
  },
];

export default function MobileWishlist() {
  const { isCartOpen, SetIsCartOpen, currency, cart, setCart } =
    useContext(AppContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setToal] = useState(0);

  useEffect(() => {
    setCartProducts(cart);
    const total = cartProducts.reduce(
      (acc, obj) => acc + Number(obj.price) * obj.quantity,
      0
    );
    setToal(total);
  }, []);
  const { isDarkMode, SetIsDarkMode } = useContext(MainAppContext);

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${isDarkMode ? "dark" : ""} relative dark z-10`}
        onClose={SetIsCartOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-black shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-400">
                          Wishlist
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <RiCloseLine
                            onClick={() => {
                              SetIsCartOpen(false);
                            }}
                            className=" text-[30px] text-[#FF7004]"
                          />
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cart.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className=" relative w-[100%] grid grid-cols-4 gap-2 p-1  border-b border-gray-300 dark:text-gray-400 "
                                >
                                  <img
                                    className=" inline-block col-span-1 h-full md:h-[120px]  2xl:w-[150px] object-cover "
                                    src={item.image}
                                    alt="product-img"
                                  />
                                  <div className=" col-span-3 flex flex-col text-[13px] ">
                                    <p className=" font-semibold">
                                      {item.name}
                                    </p>
                                    <p className=" font-bold plus-jakarta">
                                      {currency}{" "}
                                      {currency === "OMR"
                                        ? (item.price * 0.1).toFixed(2)
                                        : item.price}
                                    </p>
                                    <p className="">
                                      Qty:
                                      <input
                                        className=" ml-1 w-[40px] dark:bg-transparent "
                                        type="number"
                                        autoFocus={false}
                                        disabled
                                        value={item.quantity}
                                      />
                                    </p>
                                    <RiCloseLine
                                      onClick={() => {
                                        const newArray = cart.filter(
                                          (obj) => obj.id !== item.id
                                        );
                                        setCart(newArray);
                                        setCartProducts(newArray);
                                        toast.error(
                                          "Product Removed from Wishlist"
                                        );
                                      }}
                                      className=" absolute right-2 text-[22px] text-[#00000088] dark:text-gray-400"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
