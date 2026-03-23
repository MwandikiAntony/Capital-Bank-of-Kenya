import { useState } from "react";
import { Link } from "react-router-dom";
import NavbarDropdown from '../components/NavbarDropdown'

export function MobileMenu({ currentUser }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-md focus:outline-none">
        <span className="sr-only">Toggle menu</span>
        {/* Hamburger Icon */}
        <div className={`w-6 h-0.5 bg-blue-900 mb-1 transition-all ${open ? "rotate-45 translate-y-1.5" : ""}`}></div>
        <div className={`w-6 h-0.5 bg-blue-900 mb-1 transition-all ${open ? "opacity-0" : ""}`}></div>
        <div className={`w-6 h-0.5 bg-blue-900 transition-all ${open ? "-rotate-45 -translate-y-1" : ""}`}></div>
      </button>

      {open && (
        <div className="absolute right-6 mt-2 w-48 bg-white dark:bg-gray-950 rounded-lg shadow-lg flex flex-col py-2">
          {!currentUser && (
            <>
              <Link to="/register" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                Open Account
              </Link>
              <Link to="/login" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                Login
              </Link>
            </>
          )}
          {currentUser && <NavbarDropdown currentUser={currentUser} />}
          <Link to="/help" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
            Help
          </Link>
        </div>
      )}
    </div>
  );
}
