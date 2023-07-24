import React, {useEffect, useRef, useState} from 'react';
import 'boxicons/css/boxicons.min.css';
import { protectRoute } from "@/utils/auth";
import initializeSidebar from '/components/script';
import axios from "axios";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {BellIcon} from '@heroicons/react/20/solid'
import { io } from "socket.io-client";
import {useRouter} from "next/router";
import moment from "moment";

let socket;

export default function Navbar({ session }) {
    const [image, setImage] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };
    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    const handleLogout = async () => {
        const res = await fetch('/api/admin/logout', {
            method: 'POST',
        });

        if (res.ok) {
            await router.push('/admin/auth/login');
        } else {
            // handle error
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/manage-profile/profile', { withCredentials: true });
                const { image } = response.data.userAgency;
                setImage(image);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProfile();
        initializeSidebar();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 0) {
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

// Client code
    useEffect(() => {
        const agencyId = session.agencyId;

        socket = io('http://localhost:8000', {
            transports: ['websocket'],
            query: { agencyId: agencyId },
        });

        socket.on('unreadNotifications', (notifications) => {
            console.log('Unread notifications:', notifications);
            setNotifications(notifications);
        });

        socket.on('newNotification', (notification) => {
            console.log('New notification:', notification);
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
            const audio = new Audio('/COMCell_Message 1 (ID 1111)_LS.mp3');
            audio.play();
        });

        // Add a new listener for 'editReservation' notifications
        socket.on('editNotification', (notification) => {
            console.log('Edited reservation notification:', notification);
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
            const audio = new Audio('/COMCell_Message 1 (ID 1111)_LS.mp3');
            audio.play();
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    const markNotificationAsRead = async (notification) => {
        const response = await axios.post(`http://localhost:8000/notification/${notification.id}/read`);
        const updatedNotification = response.data;
        console.log('Updated notification:', updatedNotification);

        setNotifications((prevNotifications) => prevNotifications.map(notif => {
            if (notif.id === updatedNotification.id) {
                return updatedNotification;
            }
            return notif;
        }));

        // Redirection to the reservation page
        if(updatedNotification.reservationId) {
            await router.push(`/admin/dashboard/reservations/details/${updatedNotification.reservationId}`);
        }
    };

function Profile(){
    router.push("/admin/dashboard/profile")
}

    return (
        <nav className="navbar flex justify-between">
            <div className="flex items-center">
                <i className="bx bx-menu"></i>
                <span className="text-xl font-bold ml-4">
                    Hi, {session.name} {session.firstname}
                </span>
            </div>
            <div className="flex items-center">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="relative inline-flex justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                            <BellIcon className="h-10 w-10" aria-hidden="true" />
                            {notifications.length > 0 && (
                                <span className="absolute top-[8px] right-[8px] inline-block w-5 h-5 text-amber-100  text-xs rounded-full bg-red-500 transform transition-all duration-200 hover:scale-125 hover:opacity-75">
                                  {notifications.length}
                                </span>
                            )}
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100 transform"
                        enterFrom="opacity-0 scale-95 -translate-y-2"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-75 transform"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 -translate-y-2"
                    >
                        <Menu.Items
                            className="absolute right-0 w-80 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                        >
                            <div className="py-1 overflow-y-auto max-h-60">
                                <Menu.Item>
                                    {({ active }) => (
                                        <div
                                            className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block px-4 py-2 text-sm`}
                                        >
                                            You have {notifications.length} new notifications
                                        </div>
                                    )}
                                </Menu.Item>
                                {notifications.map((notification, index) => (
                                    <Menu.Item key={index}>
                                        {({ active }) => {
                                            const createdAt = moment(notification.createdAt);
                                            const now = moment();
                                            const diffMinutes = now.diff(createdAt, 'minutes');
                                            const diffHours = now.diff(createdAt, 'hours');
                                            const diffDays = now.diff(createdAt, 'days');

                                            let timeElapsed;
                                            if (diffMinutes < 1) {
                                                timeElapsed = 'just now';
                                            } else if (diffMinutes < 60) {
                                                timeElapsed = `${diffMinutes} minutes ago`;
                                            } else if (diffHours < 24) {
                                                timeElapsed = `${diffHours} hours ago`;
                                            } else {
                                                timeElapsed = `${diffDays} days ago`;
                                            }
                                            return (
                                                <div
                                                    className={`${
                                                        active ? 'bg-gray-100 text-black' : 'text-black'
                                                    } block px-4 py-2 text-sm cursor-pointer`}
                                                    onClick={() => markNotificationAsRead(notification)}
                                                >
                                                    <div className="flex justify-between">
                                                        <h4 className="text-black">{notification.message}</h4>
                                                        <p className="text-gray-500 text-xs ml-2">{timeElapsed}</p>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
                <button
                    className="flex items-center text-black gap-2 hover:text-blue-600 transition-all duration-600 ease-linear -mr-6"
                    onClick={toggleDropdown}
                >
                    {image ? (
                        <img src={image} alt="Profile Picture" className="ml-4 rounded-full h-12 w-12"/>
                    ) : (
                        <div className="ml-4 w-10 h-10 object-cover rounded-full flex items-center justify-center bg-gray-200">
                            <i className='bx bx-user'></i>
                        </div>
                    )}
                </button>
                {isDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-md overflow-hidden"
                    >
                        <button
                            onClick={Profile}
                            className="text-left block px-4 py-2 cursor-pointer hover:bg-blue-600 w-full">
                            My Account
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-left block px-4 py-2 w-full hover:bg-blue-600"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

Navbar.getInitialProps = async (context) => {
    const session = await protectRoute(context);
    return { session: session };
};
