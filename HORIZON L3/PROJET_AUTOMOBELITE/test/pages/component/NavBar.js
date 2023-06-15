import React from "react";
import VehicleSearchForm from "@/pages/component/VehicleSearchForm";
function NavBar() {


    return (
        <section id=" top header">
            <header className=" absolute top-6 inset-x-6 lg:inset-x-28 flex items-center justify-between z-50">
                <div className="text-2xl">
                    <a href={'/'}>
                        AUTO<span className="text-blue-600">MOBELITE</span>
                    </a>
                </div>

                <div className="hidden lg:flex items-center gap-4 font-medium">
                    <button className="hover:text-blue-600 transition-all duration-300 ease-linear">
                        <a href="/authentification/login">
                            Sign In
                        </a>
                    </button>
                    <button className="bg-blue-600 py-3 px-7 text-white   rounded">
                        <a href="/authentification/register">Register</a>
                    </button>

                </div>

            </header>
        </section>
    );
}

export default NavBar;
