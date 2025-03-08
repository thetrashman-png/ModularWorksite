import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const toolsRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Toggle dropdown menu
    const toggleToolsMenu = () => {
        setIsToolsOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (toolsRef.current && !toolsRef.current.contains(event.target)) {
                setIsToolsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hide Navbar when user is not logged in
    if (!user) {
        return (
            <nav className="bg-gray-800 p-4 text-white w-full h-full">
                <div className="w-full flex justify-between items-center px-4">
                    <div className="text-lg font-bold">Welcome to ModularWorksite</div>
                    <div>
                        <Link to="/login" className="text-white mx-2">
                            Login
                        </Link>
                        <Link to="/register" className="text-white mx-2">
                            Register
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-gray-800 p-4 text-white w-full h-full">
            <div className="w-full flex items-center justify-between px-4 h-full">

                {/* Business Name (Will be replaced with Logo in the future) */}
                <div className="text-lg font-bold whitespace-nowrap">My Business</div>

                {/* Center: Tools Dropdown */}
                <div className="relative" ref={toolsRef}>
                    <button
                        onClick={toggleToolsMenu}
                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 focus:outline-none"
                    >
                        Tools ▼
                    </button>
                    {isToolsOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                            <ul className="py-2">
                                <li className="hover:bg-gray-200 px-4 py-2 cursor-pointer">Schedule</li>
                                <li className="hover:bg-gray-200 px-4 py-2 cursor-pointer">Pay</li>
                                <li className="hover:bg-gray-200 px-4 py-2 cursor-pointer">Expenses</li>
                                <li className="hover:bg-gray-200 px-4 py-2 cursor-pointer">Connections</li>
                                <li className="hover:bg-gray-200 px-4 py-2 cursor-pointer">Insights</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Side: Account, Settings, and Log Out */}
                <div className="flex space-x-4">
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                        Account
                    </button>
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;