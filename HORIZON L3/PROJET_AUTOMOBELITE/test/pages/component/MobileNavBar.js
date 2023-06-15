import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex items-center justify-end text-blue-600 p-4">
            <button className="md:hidden" onClick={toggleNavbar}>
                {isOpen ? <HiX className="text-blue-600" /> : <HiMenu className="text-blue-600" />}
            </button>
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <ul className="flex flex-col space-y-2">
                    <li><a href="#">Login</a></li>
                    <li><a href="#">Register</a></li>
                </ul>
            </div>
            <div className="hidden md:block ml-4 text-xl font-bold"></div>
        </div>
    );
};

export default MobileNavbar;
