import React, { useEffect } from "react";
import { useTogglersContext } from "../context/togglers";
import MenuIcon from '@mui/icons-material/Menu';
import Link from "next/link";

//import {AiOutlineClose} from "react-icons/ai";

function MobileNavbar() {
    const { mobileNavbar, setMobileNavbar } = useTogglersContext();
    useEffect(() => {
        document.body.style.overflowY = mobileNavbar ? "hidden" : "auto";
    }, [mobileNavbar]);

    return (
        <section id="mobile-navbar">
            <nav className={`fixed inset-y-0 right-0 bg-white ${
                mobileNavbar ? "left-0" : "left-[150%]"} z-50 transition-all duration-300 ease-linear p-8 flex items-center justify-center flex-col`}>
                <button className="text-3xl absolute top-10 right-10 hover:text-blue-600 transition-all duration-300 ease-linear"
                        onClick={() => setMobileNavbar(false)}>
                    <MenuIcon />
                </button>
                <ul className="flex flex-col items-center gap-8 font-medium text-2xl">
                    <button className="hover:text-blue-600 transition-all duration-300 ease-linear">
                        <Link href="/Login">Sign In</Link>
                    </button>
                    <button className="bg-blue-600 py-3 px-7 text-white shadow-blue-500 hover:shadow--bottom-hov transition-all duration-300 ease-linear rounded">
                        <Link href="/Signup">Sign Up</Link>
                    </button>
                    <button className="text-3xl transition-all duration-300 ease-linear hover:text-custom-orange"
                        onClick={() => setMobileNavbar(true)}>
                    </button>
                </ul>
            </nav>
        </section>
    );
}

export default MobileNavbar;
