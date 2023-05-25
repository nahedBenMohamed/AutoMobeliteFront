import React, {useState} from "react";
import {useTogglersContext} from "@/app/context/togglers";
import MenuIcon from '@mui/icons-material/Menu';
import {Account} from 'mdi-material-ui'
import Link from "next/link";
import Image from "next/image";

function HeaderConnected() {
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
                <div>
                    <Link href={"/HomeConnected"}>
                        <Image
                            src="/images/logo.png"
                            alt="logo"
                            width={140}
                            height={140}
                            priority
                        />
                    </Link>
                </div>
                {/*<div className="text-2xl">
                    <Link href={'/Homec'}>
                        AUTO<span className="text-blue-600">MOBELITE</span>
                    </Link>
                </div>*/}
                <div className="hidden lg:flex items-center gap-4 font-medium relative">
                    <button
                        onClick={toggleDropdown}
                        className="hover:text-blue-600 transition-all duration-600 ease-linear"
                    >
                        <Account className="inline-block mr-4 text-2xl" />
                    </button>
                    {isDropdownOpen && (
                        <ul className="absolute top-full right-0 bg-white rounded-md shadow-md py-2 mt-2">
                            <li>
                                <Link href={"/accounts-settings"} className="block px-4 py-2 hover:bg-gray-200">
                                    Edit Profile
                                </Link>
                            </li>
                            <li>

                                    <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200 w-full text-left">
                                        <Link href={"/"}>
                                            Logout
                                        </Link>
                                    </button>
                            </li>
                            <li>
                                <Link href={'/ManageReservation'} className="block px-4 py-2 hover:bg-gray-200">
                                    Manage Reservations
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
                <div className="lg:hidden">
                    <button className="text-3xl transition-all duration-300 ease-linear hover:text-custom-orange" onClick={() => setMobileNavbar(true)}>
                        <MenuIcon />
                    </button>
                </div>
            </header>
        </section>
    );
}

export default HeaderConnected;
