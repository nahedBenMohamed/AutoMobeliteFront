import React, { useState, useEffect, useRef } from "react";
import { useTogglersContext } from "@/components/context/togglers";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineUser } from "react-icons/ai";

function HeaderConnected() {
    const router = useRouter();
    const { setMobileNavbar } = useTogglersContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const decodedToken = jwt_decode(accessToken);
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);

                if (decodedToken.exp < currentTimeInSeconds) {
                    await router.push("/authentification/login");
                    return;
                }
            }

            await router.push("/authentification/login");
        } catch (error) {
            console.error("Une erreur s'est produite lors de la déconnexion", error);
        }
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

    return (
        <header className="w-full absolute z-10">
            <nav className="max-w-[1740px] mx-auto flex justify-between items-center sm:px-16 px-16 py-4 bg-transparent">
                <Link href="/client/HomeConnected" className="text-2xl mt-3 justify-center items-center">
                    AUTO<span className="text-blue-600">MOBELITE</span>
                </Link>

                <div className="relative ml-auto  lg:block">
                    <button
                        className="hover:text-blue-600 transition-all duration-600 ease-linear"
                        onClick={toggleDropdown}
                    >
                        <AiOutlineUser size={30}  />
                    </button>
                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-md">
                            <Link href="/client/Editprofile">
                                <p className="block px-4 py-2 hover:bg-gray-200">Edit Profile</p>
                            </Link>
                            <Link href="/client/ManageReservations">
                                <p className="block px-4 py-2 hover:bg-gray-200">Manage Reservations</p>
                            </Link>
                            <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200 w-full text-left">
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </nav>
        </header>
    );
}

export default HeaderConnected;
