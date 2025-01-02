import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { RiCloseCircleFill } from "react-icons/ri";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function MobileShopFilter() {
  const { isMobileFilterOpen, SetIsMobileFilterOpen } = useContext(AppContext);

  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      setCategories(response.data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [isMobileFilterOpen]);

  return (
    <Transition.Root show={isMobileFilterOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative dark z-50"
        onClose={SetIsMobileFilterOpen}
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="relative flex items-start justify-between">
                        <RiCloseCircleFill
                          onClick={() => SetIsMobileFilterOpen(false)}
                          className="z-30 absolute -top-4 text-[30px] text-[#FF7004]"
                        />
                      </div>
                      <div className="relative h-full flex flex-col">
                        <div className="lg:hidden w-full h-full p-2.5">
                          <p className="border-b-[1px] py-2.5 border-[#E5E5E5] text-[#363F4D] dark:text-gray-700 font-[700] plus-jakarta text-[13px] md:text-[14.5px] 2xl:text-[16px]">
                            CATEGORIES
                          </p>

                          {categories?.map((category, index) => {
                            const subCategories = category?.subcategories?.map(
                              (subcategory, i) => {
                                return (
                                  <Link
                                    to={`/shop/${category?.fileName}/${subcategory?.name}`}
                                    onClick={() => SetIsMobileFilterOpen(false)}
                                    key={i}
                                  >
                                    <p>{subcategory?.name}</p>
                                  </Link>
                                );
                              }
                            );

                            return (
                              <Menu key={index}>
                                <Menu.Button>
                                  {category?.name}
                                  <ChevronDownIcon className="w-[15px]" />
                                </Menu.Button>
                                <Menu.Items className="flex flex-col text-[13px] md:text-[13px] 2xl:text-[16px] dark:text-gray-600 bg-white pl-2 gap-2 w-full">
                                  {subCategories}
                                </Menu.Items>
                              </Menu>
                            );
                          })}
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
