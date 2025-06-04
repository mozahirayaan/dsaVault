import React from "react";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const items = [
    { name: "Dashboard", href: "/Dashboard" },
    { name: "Room", href: "/Room" },
    { name: "Contribute", href: "https://github.com/mozahirayaan/dsaVault" },
  ];

  return (
    <nav className="fixed my-auto mb-12 top-0 left-0 w-full z-50 backdrop-blur-lg bg-white bg-opacity-20 border-b border-white border-opacity-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 select-none"
          >
            dsaVault
          </a>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-10 text-white select-none">
            {items.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="hover:text-pink-400 transition-colors duration-300 font-semibold"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-1.5 rounded-lg font-medium text-white border border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20 transition">
              Sign Out
            </button>
            
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-white hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
