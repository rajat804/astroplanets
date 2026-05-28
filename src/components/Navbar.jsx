// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineMenu, 
  HiOutlineX, 
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineUserCircle,
  HiOutlineChevronDown,

} from "react-icons/hi";
import assets from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

// CTA Button - Red gradient (kept as is)
const CTAButton = ({ children, onClick, to }) => (
  <Link
    to={to}
    onClick={onClick}
    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transform transition-all duration-300 active:scale-95 text-sm md:text-base"
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

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.fullName?.split(' ')[0] || user.fullName || 'User';
  };

  // Navigation links with Home added
  const navLinks = [
    { name: "Home", path: "/", icon: null },
    { name: "Services", path: "/services", icon: null },
    { name: "Courses", path: "/courses", icon: null },
    { name: "Products", path: "/products", icon: null },
    { name: "About", path: "/about", icon: null },
    { name: "Contact", path: "/contact", icon: null },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 shadow-lg border-b border-green-800/30"
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 25%, #047857 50%, #065f46 75%, #064e3b 100%)"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-5">
            {/* Logo - Larger size */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src={assets.logo} 
                className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-lg" 
                alt="Logo" 
              />
            </Link>

            {/* Desktop nav - White text on green background */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white hover:text-amber-300 transition text-base lg:text-lg font-medium whitespace-nowrap flex items-center gap-1"
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Cart Button */}
              <button 
                onClick={() => setCartDrawerOpen(true)}
                className="hidden sm:block p-2 rounded-md hover:bg-white/10 transition relative"
              >
                <HiOutlineShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Auth buttons */}
              <div className="hidden sm:flex gap-3 items-center">
                {isAuthenticated ? (
                  <div className="relative user-menu">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-white/20 transition text-sm md:text-base"
                    >
                      <HiOutlineUserCircle className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="hidden sm:inline">{getUserDisplayName()}</span>
                      <HiOutlineChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName}</p>
                            <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
                            >
                              <HiOutlineUser className="w-4 h-4" />
                              My Profile
                            </Link>
                            <Link
                              to="/my-bookings"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
                            >
                              <HiOutlineShoppingCart className="w-4 h-4" />
                              My Bookings
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition border-t border-gray-100 mt-1"
                            >
                              <HiOutlineLogout className="w-4 h-4" />
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

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setOpen(!open)}
                  className="p-2 rounded-md hover:bg-white/10 transition"
                >
                  {open ? <HiOutlineX className="w-6 h-6 text-white" /> : <HiOutlineMenu className="w-6 h-6 text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu - Green background */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-green-700/30"
              style={{
                background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)"
              }}
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-white hover:text-amber-300 transition text-base font-medium"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.name}
                  </Link>
                ))}
                
                {/* Cart in mobile menu */}
                <button
                  onClick={() => {
                    setOpen(false);
                    setCartDrawerOpen(true);
                  }}
                  className="w-full flex items-center justify-between py-2.5 text-white hover:text-amber-300 transition text-base font-medium"
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {cartCount} items
                    </span>
                  )}
                </button>
                
                {/* User Info in Mobile Menu */}
                {isAuthenticated && user && (
                  <div className="pt-3 pb-2 border-t border-green-700/30 mt-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <HiOutlineUserCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-green-200 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block py-2 text-white hover:text-amber-300 transition text-base font-medium"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setOpen(false)}
                      className="block py-2 text-white hover:text-amber-300 transition text-base font-medium"
                    >
                      My Bookings
                    </Link>
                  </div>
                )}
                
                <div className="pt-3">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition text-sm"
                    >
                      <HiOutlineLogout className="w-4 h-4" />
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