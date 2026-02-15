import React from 'react';

export default function Header() {
  return (
    <nav className="w-full max-w-4xl mx-auto mb-4 bg-black/60 backdrop-blur-md border-b border-white/30 flex items-center justify-between p-2 rounded-lg sticky top-4 z-50 shadow-lg">
      <button
        id="hamburger"
        aria-label="Open navigation"
        className="hidden flex-col justify-center items-center h-10 w-10 mr-4 z-30 md:hidden"
      >
        <span className="block w-7 h-0.5 bg-white my-1 rounded transition-transform duration-250"></span>
        <span className="block w-7 h-0.5 bg-white my-1 rounded transition-transform duration-250"></span>
        <span className="block w-7 h-0.5 bg-white my-1 rounded transition-transform duration-250"></span>
      </button>
      <div
        id="nav-links"
        className="flex items-center gap-4 flex-1 transition-all duration-250"
      >
        <a
          href="#/"
          className="text-white no-underline px-3 py-2 rounded-lg transition-all duration-180 hover:bg-white/20 hover:text-white font-medium"
        >
          Home
        </a>
        <a
          href="#/about"
          className="text-white no-underline px-3 py-2 rounded-lg transition-all duration-180 hover:bg-white/20 hover:text-white font-medium"
        >
          About
        </a>
        <a
          href="#/my-work"
          className="text-white no-underline px-3 py-2 rounded-lg transition-all duration-180 hover:bg-white/20 hover:text-white font-medium"
        >
          My Work
        </a>
        <a
          href="#/contact"
          className="text-white no-underline px-3 py-2 rounded-lg transition-all duration-180 hover:bg-white/20 hover:text-white font-medium"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
