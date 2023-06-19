import React, { useState } from "react";
import { useRouter } from "next/router";
import VehicleSearchForm from "@/components/client/VehicleSearchForm";

function HeaderConnected() {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (res.ok) {
            await router.push('/authentification/login');
        } else {
            // handle error
        }
    };

    return (
        <section id="w-full  absolute z-10">
            <header className="min-w-[1740px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 ">
                <div className="text-2xl">
                    <a href="/client/HomeConnected">
                        AUTO<span className="text-blue-600">MOBELITE</span>
                    </a>
                </div>
                <div className="relative ml-auto">
                    <button
                        onClick={toggleDropdown}
                        className="hover:text-blue-600 transition-all duration-600 ease-linear"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Outline"
                            viewBox="0 0 24 24"
                            width="25"
                            height="23"
                        >
                            <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z" />
                            <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-md">
                            <a
                                href="/client/Editprofile"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Edit Profile
                            </a>
                            <button
                                onClick={handleLogout}
                                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                            >
                                Logout
                            </button>
                            <a
                                href="/client/ManageReservations"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Manage Reservations
                            </a>
                        </div>
                    )}
                </div>
            </header>
        </section>
    );
}

export default HeaderConnected;
