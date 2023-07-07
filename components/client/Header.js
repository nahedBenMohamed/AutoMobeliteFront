import Link from "next/link";

import {AiOutlineMenu} from "react-icons/ai";
import React, {useEffect, useRef, useState} from "react";


function Header () {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);


    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return(
        <header className='w-full  absolute z-10'>
            <nav className='max-w-[1740px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent'>
                <Link href="/" className="text-2xl justify-center items-center">
                    AUTO<span className="text-blue-600">MOBELITE</span>
                </Link>


                <div className="relative ml-auto lg:block">
                    <button
                        className="hover:text-blue-600 transition-all duration-600 ease-linear"
                        onClick={toggleDropdown}
                    >
                        <AiOutlineMenu size={30} className="mt-4"/>
                    </button>
                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-md"
                        >
                            <Link href="/authentification/login">
                                <p className="block px-4 py-2 hover:bg-gray-200">Sign in</p>
                            </Link>
                            <Link href="/authentification/register">
                                <p className="block px-4 py-2 hover:bg-gray-200">Register</p>
                            </Link>
                        </div>
                    )}
                </div>

            </nav>
        </header>
    );
}

export default Header;