
import React from "react";
import {useTogglersContext} from "@/app/front-end/context/togglers";
import {AiOutlineMenu} from "react-icons/all";



function Header() {
    const { setMobileNavbar } = useTogglersContext();

    return (
        <section id="top header">
            <header className="absolute top-6 inset-x-6 lg:inset-x-28 flex items-center justify-between z-50">
                <div className="text-3xl">
                    <a href="/Home">AUTO<span className="text-blue-600">MOBELITE</span></a>
                </div>
                <div className="hidden lg:flex items-center gap-4 font-medium">
                    <a href="/authentification/Login" className="hover:text-blue-600 transition-all duration-300 ease-linear">
                        Login
                    </a>
                    <button className="bg-blue-600 py-3 px-7 text-white shadow-blue-500 hover:shadow--bottom-hov transition-all duration-300 ease-linear rounded">
                        <a href="/authentification/Signup">Signup</a>
                    </button>
                </div>
                <div className="lg:hidden">
                    <button
                        className="text-3xl transition-all duration-300 ease-linear hover:text-custom-orange"
                        onClick={() => setMobileNavbar(true)}
                    >
                        <AiOutlineMenu/>
                    </button>
                </div>

            </header>
        </section>
    );
}

export default Header;
