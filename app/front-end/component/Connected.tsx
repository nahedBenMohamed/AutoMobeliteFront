import React, { useState } from "react";
import {AiOutlineMenu, AiOutlineUser} from "react-icons/ai";
import { useTogglersContext } from "../context/togglers";
//import { useAuthContext } from "../context/auth";



function HeaderConn() {
    const { setMobileNavbar } = useTogglersContext();
    //const { logout } = useAuthContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        // logout();
        // Rediriger l'utilisateur vers la page de connexion ou une autre page appropriée

    };

    return (
        <section id="top header">
            <header className="absolute top-6 inset-x-6 lg:inset-x-28 flex items-center justify-between z-50">
                <div className="text-2xl">
                    <a href="/Homec">
                        AUTO<span className="text-blue-600">MOBELITE</span>
                    </a>
                </div>
                <div className="hidden lg:flex items-center gap-4 font-medium relative">
                    <button
                        onClick={toggleDropdown}
                        className="hover:text-blue-600 transition-all duration-600 ease-linear"
                    >
                        <AiOutlineUser className="inline-block mr-4 text-2xl" />
                    </button>
                    {isDropdownOpen && (
                        <ul className="absolute top-full right-0 bg-white rounded-md shadow-md py-2 mt-2">
                            <li>
                                <a
                                    href="/Editprofile"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    Edit Profile
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                                >
                                    Logout
                                </button>
                            </li>
                            <li>
                                <a
                                    href="/Reservations"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    Manage Reservations
                                </a>
                            </li>
                        </ul>
                    )}
                </div>
                <div className="lg:hidden">
                    <button
                        className="text-3xl transition-all duration-300 ease-linear hover:text-custom-orange"
                        onClick={() => setMobileNavbar(true)}
                    >
                        <AiOutlineMenu />
                    </button>
                </div>
            </header>
        </section>
    );
}

export default HeaderConn;
