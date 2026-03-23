import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavbarDropdown({ currentUser }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {currentUser.name}
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-950 rounded-lg shadow-lg flex flex-col py-2">
          <Link to="/profile" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
            Profile
          </Link>
          <Link to="/logout" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
