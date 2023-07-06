import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
    const inactiveLink = 'flex gap-1 p-1';
    const activeLink = inactiveLink + ' bg-white text-blue-900 rounded-l-lg';
    const router = useRouter();
    const { pathname } = router;
    const [isHovered, setIsHovered] = useState(false);
    const [isLinkClicked, setIsLinkClicked] = useState(false);

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (res.ok) {
            await router.push('/admin/auth/login');
        } else {
            // handle error
        }
    };

    return (
        <section id="sidebar">
            <Link href="/admin/dashboard/home" className={`brand ${pathname === '/' ? activeLink : inactiveLink}`}>
                <img src="/mobelite.png" alt="logo" />
                <span className="text">Automobelite</span>
            </Link>

            <ul className="side-menu top">
                <li className={pathname === '/admin/dashboard/home' ? 'active' : ''}>
                    <Link href="/admin/dashboard/home">
                        <i class="bx bxs-home-smile"></i>
                        <span className="text">Dashboard</span>
                    </Link>
                </li>
                <li className={pathname === '/admin/dashboard/cars' ? 'active' : ''}>
                    <Link href="/admin/dashboard/cars">
                        <i class="bx bxs-car"></i>
                        <span className="text">My Cars</span>
                    </Link>
                </li>
                <li
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setIsLinkClicked(true)}
                >
                        <Link href="/admin/dashboard/reservations">
                            <div className="flex items-center space-x-2">
                                <i className="bx bxs-calendar"></i>
                                <span className="text">Rentals</span>
                            </div>
                        </Link>
                        {(isHovered || isLinkClicked) && (
                            <ul className="absolute top-8 left-0 w-48 rounded-md py-2">
                                <li>
                                    <Link href="/admin/dashboard/reservations/new" className="px-4 py-2 text-gray-800">
                                        <div className="flex items-center space-x-2">
                                            <i className="bx bxs-add-to-queue"></i>
                                            <span className="text">Add rental</span>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        )}
                </li>
                <li className={pathname === '/admin/dashboard/users' ? 'active' : ''}>
                    <Link href="/admin/dashboard/maintenance">
                        <i className="bx bxs-cog"></i>
                        <span className="text">Maintenance</span>
                    </Link>
                </li>
                <li className={pathname === '/admin/dashboard/parking' ? 'active' : ''}>
                    <Link href="/admin/dashboard/parking">
                        <i className="bx bxs-parking"></i>
                        <span className="text">Parking</span>
                    </Link>
                </li>
                <li className={pathname === '/admin/dashboard/parking' ? 'active' : ''}>
                    <Link href="/admin/dashboard/rapport">
                        <i className="bx bxs-book"></i>
                        <span className="text">Rapport</span>
                    </Link>
                </li>

            </ul>
            <ul className="side-menu">
                <li className={pathname === '/admin/dashboard/profile' ? 'active' : ''}>
                    <Link href="/admin/dashboard/profile">
                        <i class="bx bxs-user-pin"></i>
                        <span className="text">Profile</span>
                    </Link>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="bg-none color-white flex items-center px-4 py-2 text-sm text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Outline"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                        >
                            <path d="M22.829,9.172,18.95,5.293a1,1,0,0,0-1.414,1.414l3.879,3.879a2.057,2.057,0,0,1,.3.39c-.015,0-.027-.008-.042-.008h0L5.989,11a1,1,0,0,0,0,2h0l15.678-.032c.028,0,.051-.014.078-.016a2,2,0,0,1-.334.462l-3.879,3.879a1,1,0,1,0,1.414,1.414l3.879-3.879a4,4,0,0,0,0-5.656Z" />
                            <path d="M7,22H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7A1,1,0,0,0,7,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7a1,1,0,0,0,0-2Z" />
                        </svg>
                        <span className="ml-2">Logout</span>
                    </button>
                </li>
            </ul>
        </section>
    );
}
