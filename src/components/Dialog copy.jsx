import { Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RiCloseCircleFill } from "react-icons/ri";
import { AppContext } from "../context/AppContext";

export default function MobileShopFilter() {
  const {
    isMobileFilterOpen,
    SetIsMobileFilterOpen,
    filters,
    handleFilterChange,
    expandedSections,
    toggleSection
  } = useContext(AppContext);

  // Define all filter options
  const allCategories = [
    'Adventure Travel',
    'Art Exhibitions',
    'Auctions & Fundraisers',
    'Beer Festivals',
    'Benefit Concerts',
    'Cultural Festivals',
    'Dance Events',
    'Food & Wine',
    'Gaming Events',
    'Music Festivals'
  ];

  const allFormats = [
    'Community Engagement',
    'Concerts & Performances',
    'Conferences',
    'Experiential Events',
    'Festivals & Fairs',
    'Workshops',
    'Seminars',
    'Virtual Events',
    'Hybrid Events',
    'Networking Events'
  ];

  const renderFilterSection = (title, items, type, showMore = true) => (
    <div className="mb-6">
      <h3 className="text-white text-base mb-4">{title}</h3>
      <div className="space-y-3">
        {items.slice(0, expandedSections[type] ? items.length : 5).map((item) => (
          <label key={item} className="flex items-center group cursor-pointer">
            <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
              <input
                type="checkbox"
                className="absolute inset-0 opacity-0 cursor-pointer"
                checked={filters[type].includes(item.toLowerCase())}
                onChange={() => handleFilterChange(type, item.toLowerCase())}
              />
              <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
              {filters[type].includes(item.toLowerCase()) && (
                <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
              )}
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors">{item}</span>
          </label>
        ))}
      </div>
      {showMore && items.length > 5 && (
        <button
          onClick={() => toggleSection(type)}
          className="text-[#00FFB3] text-sm mt-3 hover:text-[#00FFB3]/80"
        >
          {expandedSections[type] ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );

  return (
    <Transition.Root show={isMobileFilterOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => SetIsMobileFilterOpen(false)}
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
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#0E0F13]">
                    <div className="sticky top-0 z-10 bg-[#0E0F13] px-4 py-4 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-xl font-semibold text-white">
                          Filters
                        </Dialog.Title>
                        <button
                          onClick={() => SetIsMobileFilterOpen(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <RiCloseCircleFill className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 px-4 py-6">
                      {/* Price Filter */}
                      <div className="mb-6">
                        <h3 className="text-white text-base mb-4">Price</h3>
                        <div className="space-y-3">
                          {['Free', 'Paid'].map((price) => (
                            <label key={price} className="flex items-center group cursor-pointer">
                              <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
                                <input
                                  type="checkbox"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  checked={filters.price.includes(price.toLowerCase())}
                                  onChange={() => handleFilterChange('price', price.toLowerCase())}
                                />
                                <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
                                {filters.price.includes(price.toLowerCase()) && (
                                  <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
                                )}
                              </div>
                              <span className="text-gray-400 group-hover:text-white transition-colors">{price}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Date Filter */}
                      <div className="mb-6">
                        <h3 className="text-white text-base mb-4">Date</h3>
                        <div className="space-y-3">
                          {['Today', 'Tomorrow', 'This Week', 'This Weekend', 'Pick a Date'].map((date) => (
                            <label key={date} className="flex items-center group cursor-pointer">
                              <div className="relative w-5 h-5 mr-3 border border-gray-600 rounded group-hover:border-[#C5FF32] transition-colors">
                                <input
                                  type="checkbox"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  checked={filters.date.includes(date.toLowerCase())}
                                  onChange={() => handleFilterChange('date', date.toLowerCase())}
                                />
                                <div className="absolute inset-1 rounded-sm bg-[#C5FF32] opacity-0 group-hover:opacity-10"></div>
                                {filters.date.includes(date.toLowerCase()) && (
                                  <div className="absolute inset-1 rounded-sm bg-[#C5FF32]"></div>
                                )}
                              </div>
                              <span className="text-gray-400 group-hover:text-white transition-colors">{date}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Category Filter */}
                      {renderFilterSection('Category', allCategories, 'category')}

                      {/* Format Filter */}
                      {renderFilterSection('Format', allFormats, 'format')}
                    </div>

                    {/* Apply Filters Button - Fixed at bottom */}
                    <div className="sticky bottom-0 bg-[#0E0F13] px-4 py-4 border-t border-gray-800">
                      <button
                        onClick={() => SetIsMobileFilterOpen(false)}
                        className="w-full py-3 bg-[#C5FF32] text-black rounded-xl font-medium hover:bg-[#d4ff66] transition-colors"
                      >
                        Apply Filters
                      </button>
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
