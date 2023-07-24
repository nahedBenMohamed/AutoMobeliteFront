import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { data } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        await router.push("/");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleLinkClick = (path) => {
        setIsDropdownOpen(false);
        router.push(path);
    };

    const isManageReservationsPage = router.pathname === "/manage-reservations";

    const isReservationPage = () => {
        return router.pathname.startsWith('/reservations/new/');
    }
    const isEditReservationPage = () => {
        return router.pathname.startsWith('/reservations/edit/');
    }

    return (
        <header className="w-full absolute z-10">
            <nav className="max-w-[1740px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent">
                <Link href="/" className="text-2xl justify-center items-center automobelite-link">
                    AUTO<span className="text-blue-600">MOBELITE</span>
                </Link>
                {isReservationPage() && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p
                            style={{
                                borderBottom: router.pathname === "/reservations/new/step1" ? '2px solid blue' : '2px solid transparent',
                                marginRight: '40px'
                            }}
                        >
                            Options
                        </p>
                        <p
                            style={{
                                borderBottom: router.pathname === "/reservations/new/step2" ? '2px solid blue' : '2px solid transparent',
                                marginRight: '40px',
                            }}
                        >
                            Coordonnees
                        </p>
                        <p
                            style={{ borderBottom: router.pathname === "/reservations/new/step3" ? '2px solid blue' : '2px solid transparent' }}
                        >
                            Documents
                        </p>
                    </div>
                )}
                {isEditReservationPage() && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p
                            style={{
                                borderBottom: router.pathname === "/reservations/edit/step1" ? '2px solid blue' : '2px solid transparent',
                                marginRight: '40px'
                            }}
                        >
                            Summary
                        </p>
                        <p
                            style={{
                                borderBottom: router.pathname === "/reservations/edit/step2" ? '2px solid blue' : '2px solid transparent',
                                marginRight: '40px',
                            }}
                        >
                            Options
                        </p>
                        <p
                            style={{ borderBottom: router.pathname === "/reservations/edit/step3" ? '2px solid blue' : '2px solid transparent' }}
                        >
                            Confirmation
                        </p>
                    </div>
                )}
                {!isReservationPage() && !isEditReservationPage() && (
                    <>
                    {data?.user ? (
                        <div className="relative flex items-center">
                            {isManageReservationsPage && (
                                <Link href={"/models/"} className="mr-6 ">
                                    Book
                                </Link>
                            )}
                            <span className="flex items-center">Hi, {data?.user?.name} </span>
                            <button
                                className="flex items-center text-black gap-2 hover:text-blue-600 transition-all duration-600 ease-linear -mr-6"
                                onClick={toggleDropdown}
                            >
                                <MdAccountCircle size={24} />
                            </button>
                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-md overflow-hidden"
                                >
                                    <Link href="/edit-profile">
                                        <button className="text-left block px-4 py-2 cursor-pointer hover:bg-blue-600 w-full">
                                            My Account
                                        </button>
                                    </Link>
                                    <Link href="/manage-reservations">
                                        <button className="text-left block px-4 py-2 cursor-pointer hover:bg-blue-600 w-full">
                                            Manage Reservations
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left block px-4 py-2 w-full hover:bg-blue-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        ) : (
                            <>
                                <div className="hidden lg:flex">
                                    <Link href="/authentification/login">
                                        <button className="mr-10 text-black mt-2 hover:text-blue-600 transition-all duration-600 ease-linear">
                                            Login
                                        </button>
                                    </Link>

                                    <Link href="/authentification/register">
                                        <button className="text-black  hover:text-blue-600 transition-all px-7 py-3 rounded-full bg-white duration-600 ease-linear">
                                            Register
                                        </button>
                                    </Link>
                                </div>

                                <div className="lg:hidden">
                                    <button
                                        className="hover:text-blue-600 transition-all duration-600 ease-linear"
                                        onClick={toggleDropdown}
                                    >
                                        <AiOutlineMenu size={30} className="mt-2" />
                                    </button>
                                    {isDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute top-full right-2 -mt-4 w-48 bg-white rounded-md shadow-md"
                                        >
                                            <Link href="/authentification/login">
                                                <p className="block px-4 py-2 hover:bg-blue-600 cursor-pointer">Login</p>
                                            </Link>
                                            <Link href="/authentification/register">
                                                <p className="block px-4 py-2 hover:bg-blue-600 cursor-pointer">Register</p>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </nav>
        </header>


    );
}

export default Header;