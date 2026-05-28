// Footer.jsx
import React from "react";
import { GiCrystalBall } from "react-icons/gi";
import { HiMail, HiPhone } from "react-icons/hi";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaLinkedin, 
  FaPinterest,
  FaWhatsapp 
} from "react-icons/fa";
import assets from "../assets/assets";
import { Link } from "react-router-dom";

// Helper component: Accent - Updated to green (for heading)
const Accent = ({ children }) => (
  <span className="text-green-600">{children}</span>
);

// Footer component - Updated with professional theme
const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Logo & Contact */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <img src={assets.logo} className="w-32 h-auto mb-3" alt="Cosmic Wellness" />
              <div className="text-sm text-gray-300 text-center md:text-left">Align your stars. Find your calm.</div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <HiMail className="text-amber-400" /> contact@cosmicwellness.com
              </div>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <HiPhone className="text-amber-400" /> +91 99107 55649
              </div>
            </div>
          </div>

          {/* Column 2: Explore Links */}
          <div className="md:col-span-1">
            <div className="font-semibold mb-3 text-amber-400 text-lg">Explore</div>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><Link to="/services" className="hover:text-amber-400 transition">Services</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition">Courses</Link></li>
              <li><Link to="/products" className="hover:text-amber-400 transition">Products</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Follow Us Section - Social Media Handles */}
          <div className="md:col-span-1">
            <div className="font-semibold mb-3 text-amber-400 text-lg">Follow Us</div>
            
            {/* Social Media Icons with Handles */}
            <div className="space-y-3">
              <a 
                href="https://instagram.com/cosmicwellness" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-pink-400 transition group"
              >
                <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">@cosmic_wellness</span>
              </a>
              
              <a 
                href="https://facebook.com/cosmicwellness" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition group"
              >
                <FaFacebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">/cosmicwellness</span>
              </a>
              
              <a 
                href="https://twitter.com/cosmicwellness" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-blue-300 transition group"
              >
                <FaTwitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">@cosmic_tweets</span>
              </a>
              
              <a 
                href="https://youtube.com/cosmicwellness" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-red-500 transition group"
              >
                <FaYoutube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Cosmic Wellness</span>
              </a>
              
              <a 
                href="https://linkedin.com/company/cosmicwellness" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-blue-500 transition group"
              >
                <FaLinkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Cosmic Wellness</span>
              </a>
              
              <a 
                href="https://pinterest.com/cosmicwellness" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition group"
              >
                <FaPinterest className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">@cosmic_pins</span>
              </a>
              
              <a 
                href="https://wa.me/919910755649" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition group"
              >
                <FaWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+91 99107 55649</span>
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="md:col-span-1">
            <div className="font-semibold mb-3 text-amber-400 text-lg">Subscribe</div>
            <p className="text-sm text-gray-300">Get monthly horoscopes, class discounts and product drops.</p>
            <div className="mt-3 flex flex-col gap-2">
              <input 
                className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
                placeholder="Your email address" 
              />
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold transition shadow-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-white/20 pt-6 text-sm text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Cosmic Wellness • All rights reserved</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-amber-400 transition cursor-pointer">Privacy Policy</a>
            <a className="hover:text-amber-400 transition cursor-pointer">Terms of Service</a>
            <Link to="/admin/login" className="hover:text-amber-400 transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;