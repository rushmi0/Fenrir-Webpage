import {useState} from "react";

export const NavigationBar = () => {


    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    return (
        <nav
            className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-white/30 backdrop-blur-lg shadow-md rounded-2xl">

            {/* Left - Logo & Menu */}
            <div className="flex items-center space-x-6">

                <img src="/src/assets/fenrir.png" alt="Fenrir Logo" width="50" className="h-auto"/>

                <div className="hidden md:flex space-x-4 text-gray-700">

                    {/*
                    <div className="relative group">
                        <button className="flex items-center">
                            Categories <span className="ml-1">▼</span>
                        </button>
                        <div
                            className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-md rounded-md w-40">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Tech</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Business</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Sports</a>
                        </div>
                    </div>

                    <div className="relative group">
                        <button className="flex items-center">
                            Pages <span className="ml-1">▼</span>
                        </button>
                        <div
                            className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-md rounded-md w-40">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Home</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">About</a>
                        </div>
                    </div>
                     */}

                    <a href="#" className="text-sm sm:text-[12px] md:text-[15px] lg:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">
                        Home
                    </a>
                    <a href="#" className="text-sm sm:text-[12px] md:text-[15px] lg:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">
                        Relay Operator
                    </a>
                    <a href="#" className="text-sm sm:text-[12px] md:text-[15px] lg:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">
                        About Us
                    </a>


                </div>
            </div>

            {/* Middle - Search Bar */}
            {/*
            <div className="relative w-1/3">
                <input
                    type="text"
                    placeholder="Search Anything"
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-gray-400 outline-none"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M21 21l-4.35-4.35M16.5 10a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0z"/>
                </svg>
            </div>
            */}

            {/* Right - Profile & Icons */}
            <div className="flex items-center space-x-4 relative">

                <div className="w-10 h-10 rounded-[8px] overflow-hidden border border-gray-300">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Profile" />
                </div>

                {/* dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="hover:text-[#935CD1] p-2 text-sm sm:text-[12px] md:text-[15px] lg:text-[15px]"
                    >
                        rushmi0
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-40 z-10">
                            <a href="#" className="hover:text-[#935CD1] block px-4 py-2 hover:bg-gray-100">Profile</a>
                            <a href="#" className="hover:text-[#935CD1] block px-4 py-2 hover:bg-gray-100">Settings</a>
                            <a href="#" className="hover:text-[#935CD1] block px-4 py-2 hover:bg-gray-100">Logout</a>
                        </div>
                    )}
                </div>
            </div>


        </nav>
    );
};
