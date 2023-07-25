import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from "axios";

export default function Sidebar({ session }) {

    const inactiveLink = 'flex gap-1 p-1';
    const activeLink = inactiveLink + ' bg-white text-blue-900 rounded-l-lg';
    const router = useRouter();
    const { pathname } = router;
    const [isHovered, setIsHovered] = useState(false);
    const [isLinkClicked, setIsLinkClicked] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isLinkClicked2, setIsLinkClicked2] = useState(false);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [agencyData, setAgencyData] = useState(null);

    const agencyId = session.agencyId



    useEffect(() => {
        const fetchUnreadNotificationsCount = async () => {
            try {
                const response = await axios.get('/api/admin/messages/messages', {
                    withCredentials: true,
                });
                const unreadNotifications = response.data.filter(notification => !notification.readStatus);
                setUnreadMessagesCount(unreadNotifications.length);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUnreadNotificationsCount();
    }, []);

    useEffect(() => {
        if (agencyId) {
            axios
                .get(`/api/super-admin/manage-agence/agence?id=${agencyId}`, { withCredentials: true })
                .then((response) => {
                    setAgencyData(response.data);
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [agencyId]);

    return (
        <section id="sidebar">
            <Link href="/admin/dashboard/home" className={`brand ${pathname === '/' ? activeLink : inactiveLink}`}>
                {agencyData?.image ? (
                    <img src={agencyData.image} alt="" className=" ml-4 w-10 h-10 object-cover rounded-full"/>
                ) : (
                    <div className="ml-4 w-10 h-10 object-cover rounded-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                    </div>
                )}
                <span className="text ml-4">{session.agency}</span>
            </Link>

            <ul className="side-menu top">
                <li className={pathname === '/admin/dashboard/home' ? 'active' : ''}>
                    <Link href="/admin/dashboard/home">
                        <i className="bx bxs-home-smile"></i>
                        <span className="text">Home</span>
                    </Link>
                </li>
                <li
                    className="relative"
                    onMouseEnter={() => setIsHovered2(true)}
                    onMouseLeave={() => setIsHovered2(false)}
                    onClick={() => setIsLinkClicked2(true)}
                >
                    <Link href="/admin/dashboard/agence">
                        <i className="bx bxs-building-house"></i>
                        <span className="text">My Agency</span>
                    </Link>
                    {(isHovered2 || isLinkClicked2) && (
                        <ul className="absolute top-8 left-0 w-48 rounded-md py-2">
                            <li>
                                <Link href="/admin/dashboard/agence/details/" className="px-4 py-2 text-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <i className="bx bxs-building-house"></i>
                                        <span className="text">Agency Details</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className={pathname === '/admin/dashboard/cars' ? 'active' : ''}>
                    <Link href="/admin/dashboard/cars">
                        <i className="bx bxs-car"></i>
                        <span className="text">My Cars</span>
                    </Link>
                </li>
                <li className={pathname === '/admin/dashboard/messages' ? 'active' : ''}>
                    <Link href="/admin/dashboard/messages">
                        <i className="bx bxs-message"></i>
                        <div className="flex items-center">
                            <span className="text">Notifications</span>
                            {unreadMessagesCount > 0 &&
                                <span className="w-5 h-5 text-xs rounded-full bg-red-500 text-white flex items-center justify-center ml-1">
                                    {unreadMessagesCount}
                                </span>
                            }
                        </div>
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
                <li className={pathname === '/admin/dashboard/maintenance' ? 'active' : ''}>
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
                <li className={pathname === '/admin/dashboard/rapport' ? 'active' : ''}>
                    <Link href="/admin/dashboard/rapport">
                        <i className="bx bxs-book"></i>
                        <span className="text">Rapport</span>
                    </Link>
                </li>
            </ul>
        </section>
    );
}
