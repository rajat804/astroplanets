import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineMenu, 
  HiOutlineX, 
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineUserCircle,
  HiOutlineChevronDown
} from "react-icons/hi";
import assets from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

// CTA Button - Updated to red gradient with larger font
const CTAButton = ({ children, onClick, to }) => (
  <Link
    to={to}
    onClick={onClick}
    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transform transition-transform active:scale-95 text-base md:text-lg"
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  // Get user's display name (first name or full name)
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.fullName?.split(' ')[0] || user.fullName || 'User';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-offWhite/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-28">
            {/* Logo - Increased size significantly */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img 
                src={assets.logo} 
                className="w-36 sm:w-44 md:w-52 lg:w-52" 
                alt="Logo" 
              />
            </Link>

            {/* Desktop nav - Increased font sizes */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              <Link to="/services" className="text-gray-700 hover:text-red-600 transition text-base lg:text-lg font-medium">Services</Link>
              <Link to="/courses" className="text-gray-700 hover:text-red-600 transition text-base lg:text-lg font-medium">Courses</Link>
              <Link to="/products" className="text-gray-700 hover:text-red-600 transition text-base lg:text-lg font-medium">Products</Link>
              <Link to="/about" className="text-gray-700 hover:text-red-600 transition text-base lg:text-lg font-medium">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-red-600 transition text-base lg:text-lg font-medium">Contact</Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Cart Button with count - Larger icon */}
              <button 
                onClick={() => setCartDrawerOpen(true)}
                className="hidden sm:block p-2 rounded-md hover:bg-red-50 transition relative"
              >
                <HiOutlineShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs md:text-sm w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Auth buttons - Larger text */}
              <div className="hidden sm:flex gap-3 items-center">
                {isAuthenticated ? (
                  <div className="relative user-menu">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition group text-base md:text-lg"
                    >
                      <HiOutlineUserCircle className="w-5 h-5 md:w-6 md:h-6" />
                      <span>{getUserDisplayName()}</span>
                      <HiOutlineChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* User Dropdown Menu - Larger text */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-orange-100 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-red-50 to-orange-50">
                            <p className="text-base font-semibold text-gray-800">{user?.fullName}</p>
                            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                          </div>
                          <div className="py-2">
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-base text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                            >
                              <HiOutlineUser className="w-5 h-5" />
                              My Profile
                            </Link>
                            <Link
                              to="/my-bookings"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-base text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                            >
                              <HiOutlineShoppingCart className="w-5 h-5" />
                              My Bookings
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-base text-red-600 hover:bg-red-50 transition border-t border-orange-100 mt-1"
                            >
                              <HiOutlineLogout className="w-5 h-5" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <CTAButton to="/auth">Sign In</CTAButton>
                )}
              </div>

              {/* Mobile menu button - Larger icon */}
              <div className="md:hidden">
                <button
                  onClick={() => setOpen(!open)}
                  className="p-2 rounded-md hover:bg-red-50 transition"
                >
                  {open ? <HiOutlineX className="w-7 h-7" /> : <HiOutlineMenu className="w-7 h-7" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu - Larger font sizes */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-offWhite border-t border-orange-100"
            >
              <div className="px-4 py-5 space-y-3">
                {["Services","Courses","Products","About","Contact"].map((label) => (
                  <Link
                    key={label}
                    to={`/${label.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-gray-700 hover:text-red-600 transition text-lg font-medium"
                  >
                    {label}
                  </Link>
                ))}
                
                {/* Cart in mobile menu - Larger text */}
                <button
                  onClick={() => {
                    setOpen(false);
                    setCartDrawerOpen(true);
                  }}
                  className="w-full flex items-center justify-between py-2.5 text-gray-700 hover:text-red-600 transition text-lg font-medium"
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                      {cartCount} items
                    </span>
                  )}
                </button>
                
                {/* User Info in Mobile Menu - Larger text */}
                {isAuthenticated && user && (
                  <div className="pt-4 pb-2 border-t border-orange-100 mt-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <HiOutlineUserCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block py-2.5 text-gray-700 hover:text-red-600 transition text-lg font-medium"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setOpen(false)}
                      className="block py-2.5 text-gray-700 hover:text-red-600 transition text-lg font-medium"
                    >
                      My Bookings
                    </Link>
                  </div>
                )}
                
                <div className="pt-3 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition text-base"
                    >
                      <HiOutlineLogout className="w-5 h-5" />
                      Logout
                    </button>
                  ) : (
                    <CTAButton to="/auth" onClick={() => setOpen(false)}>Sign In</CTAButton>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default Navbar;