import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events/all/all' },
    { name: 'Curators', href: '/curator/all' },
    { name: 'Sponsors', href: '/sponser/all' },
    { name: 'Crowd Funding', href: '/crowdfunding/:id' },
    { name: 'Blog', href: '/venue/all' },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-[#0E0F13] relative">
      <header className="py-4 px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1 items-center">
            <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <img alt="FaderFanz" src="/faderfanz.png" className="h-16 w-auto rounded" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-colors ${isActiveRoute(item.href)
                  ? "text-[#00FFB2]"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Sign up button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {isLoggedIn ? (
              <a href="/profile" className="text-sm font-semibold leading-6 text-gray-400">
                <FaUserCircle className="text-white" size={20} />
              </a>
            ) : (
              <a
                href="/register"
                className="rounded-md bg-[#00FFB2] px-6 py-2 text-sm font-semibold text-black hover:bg-[#00E6A0] transition-colors"
              >
                Signup
              </a>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween' }}
                  className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-[#0E0F13] px-6 py-6 sm:max-w-sm"
                >
                  {/* Mobile menu content */}
                  <div className="flex items-center justify-between">
                    <a href="/" className="-m-1.5 p-1.5">
                      <img alt="FaderFanz" src="faderfanz.png" className="h-8 w-auto" />
                    </a>
                    <button
                      type="button"
                      className="-m-2.5 rounded-md p-2.5 text-gray-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-700">
                      <div className="space-y-2 py-6">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                      <div className="py-6">
                        {isLoggedIn ? (
                          <a
                            href="/profile"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-400 hover:bg-gray-800"
                          >
                            Profile
                          </a>
                        ) : (
                          <a
                            href="/register"
                            className="flex w-full justify-center rounded-md bg-[#00FFB2] px-3 py-2 text-sm font-semibold text-black hover:bg-[#00E6A0]"
                          >
                            Signup
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
