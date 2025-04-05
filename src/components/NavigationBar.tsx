import { useState } from "react";
import profileImg from "../assets/profile.gif";

export const NavigationBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-white/30 backdrop-blur-lg shadow-md rounded-2xl">
            {/* Left - Logo & Menu */}
            <div className="flex items-center space-x-6">
                <img src="/src/assets/fenrir.png" alt="Fenrir Logo" width="50" className="h-auto" />

                {/* Main Links (show only on screens >= 750px) */}
                <div className="hidden ms:flex space-x-4 text-gray-700">
                    <a href="#" className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">Home</a>
                    <a href="#" className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">Relay Operator</a>
                    <a href="#" className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">About Us</a>
                </div>
            </div>

            {/* Right - Profile & Dropdown */}
            <div className="flex items-center space-x-4 relative">
                <div className="w-10 h-10 rounded-[8px] overflow-hidden border border-gray-300">
                    <img src={profileImg} alt="Profile" />
                </div>

                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="hover:text-[#935CD1] p-2 text-xs sm:text-[12px] md:text-[15px]"
                    >
                        rushmi0
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-7 bg-white shadow-md rounded-md w-64 z-10">  {/* เพิ่ม w-56 */}
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Profile</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Settings</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Logout</a>

                            {/* 🟣 Move Links Here When Screen < 750px */}
                            <div className="ms:hidden border-t mt-2">
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Home</a>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Relay Operator</a>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">About Us</a>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
};
