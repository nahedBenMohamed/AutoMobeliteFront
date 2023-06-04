import React, { useState } from "react";
import { useTogglersContext } from "@/components/context/togglers";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";

function HeaderConnected() {
    const router = useRouter()

    const { setMobileNavbar } = useTogglersContext();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const decodedToken = jwt_decode(accessToken);
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);

                if (decodedToken.exp < currentTimeInSeconds) {
                    await router.push('/authentification/login');
                    return;
                }
            }

            await router.push('/authentification/login');
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la déconnexion', error);
        }
    };

    return (
        <section id="top header">
            <header className="absolute top-6 inset-x-6 lg:inset-x-28 flex items-center justify-between z-50">
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
