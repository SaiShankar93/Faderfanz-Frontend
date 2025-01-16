import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from '@mui/icons-material';
import { FaUserCircle } from 'react-icons/fa';
export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  console.log(isLoggedIn)
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'My Feed', href: '/feed' },
    { name: 'Curators', href: '/curator/all' },
    { name: 'Events', href: '/events/all/all' },
    { name: 'Blogs', href: '/blogs/all' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us ', href: '/contact ' },
  ];

  return (
    <div className="bg-[#0E0F13] text-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="kazi_logo.png"
                className="h-16 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-400">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end pr-2">
            {
              isLoggedIn ? (
                <a href="/profile" className="text-sm/6 font-semibold text-gray-400">
                  <FaUserCircle className="text-white" size={20}/> 
                </a>
              ) : (
                <a href="/login" className="text-sm/6 font-semibold text-gray-400">
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
              )
            }          </div>
        </nav>

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <Dialog as="div" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
              {/* Backdrop */}
              <Dialog.Overlay>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)} // Close when clicking on the overlay
                />
              </Dialog.Overlay>

              {/* Sidebar */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed inset-y-0 left-0 z-50 w-3/4 bg-[#0E0F13] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
              >
                <div className="flex items-center justify-between">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img alt="" src="kazi_logo.png" className="h-8 w-auto" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-md p-2.5 text-gray-400"
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-700">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-300 hover:bg-gray-800"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="py-6">
                      {isLoggedIn ? (
                        <a
                          href="/profile"
                          className="-mx-3  rounded-lg px-3 py-2.5 text-base font-semibold text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                        >
                          Profile
                        </a>
                      ) : (
                        <a
                          href="/login"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-300 hover:bg-gray-800"
                        >
                          Log in
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </header>
    </div >
  );
}
