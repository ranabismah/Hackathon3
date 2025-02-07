"use client";
import React, { useState } from "react";
import { BiUser } from "react-icons/bi";
import { BsSearch, BsHouseDoor, BsShop, BsPencilSquare } from "react-icons/bs";
import { PiTrolleyFill } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { MdContactMail } from "react-icons/md";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          <a href="/">Furniture</a>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 outline-none w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-gray-200 px-3 py-2">
            <BsSearch className="text-gray-600 w-5 h-5" />
          </button>
        </form>

        {/* Navigation Links */}
        <ul className="hidden md:flex md:space-x-8 text-gray-600 font-medium">
          <li><a href="/" className="hover:text-gray-800">Home</a></li>
          <li><a href="/shop" className="hover:text-gray-800">Shop</a></li>
          <li><a href="/blog" className="hover:text-gray-800">Blog</a></li>
          <li><a href="/contact" className="hover:text-gray-800">Contact</a></li>
        </ul>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <BiUser className="w-5 h-5 cursor-pointer text-gray-600" />
          <a href="/cart" className="relative">
            <PiTrolleyFill className="w-6 h-6 cursor-pointer text-gray-600" />
            {/* Add a cart count badge if needed */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-600 focus:outline-none">
          {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="md:hidden bg-white shadow-md text-gray-600 font-medium py-2">
          <li><a href="/" className="block py-4 px-6 hover:text-gray-800">Home</a></li>
          <li><a href="/shop" className="block py-4 px-6 hover:text-gray-800">Shop</a></li>
          <li><a href="/blog" className="block py-4 px-6 hover:text-gray-800">Blog</a></li>
          <li><a href="/contact" className="block py-4 px-6 hover:text-gray-800">Contact</a></li>
          {/* Search Bar for Mobile */}
          <li className="px-6">
            <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-gray-200 px-3 py-2">
                <BsSearch className="text-gray-600 w-5 h-5" />
              </button>
            </form>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;