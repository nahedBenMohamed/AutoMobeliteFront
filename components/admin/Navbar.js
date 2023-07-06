import React, { useEffect, useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import { protectRoute } from "@/utils/auth";
import initializeSidebar from '/components/script';
import axios from "axios";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {BellIcon, ChevronDownIcon} from '@heroicons/react/20/solid'
import { io } from "socket.io-client";
import {useRouter} from "next/router";


let socket;

export default function Navbar({ session }) {
    const [image, setImage] = useState(null);
    const [newReservations, setNewReservations] = useState([]);
    const [showMessages, setShowMessages] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
        // Créer une connexion Socket.IO
        socket = io('http://localhost:8000', { transports: ['websocket'] });

        // Écouter les événements 'newReservation'
        socket.on('newReservation', (data) => {
            // Ajouter l'ID de la réservation à l'objet de notification
            const reservation = { id: data.id, ...data };
            // Ajouter la nouvelle réservation à l'état
            setNewReservations((prevReservations) => [...prevReservations, reservation]);
        });

        // Assurez-vous de nettoyer en déconnectant la socket lorsque le composant est démonté
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleBellClick = () => {
        setShowMessages(!showMessages);
    };

    const handleNotificationClick = (reservation) => {
        // Supprimez la réservation de la liste de notifications
        setNewReservations(prevReservations => prevReservations.filter(res => res.carId !== reservation.carId));

        // Redirigez vers la page des détails de la réservation en utilisant l'ID de la réservation
        router.push(`/admin/dashboard/reservations/details/${reservation.id}`);
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <nav className="navbar" style={{ justifyContent: 'space-between' }}>
            <i className="bx bx-menu"></i>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                        <BellIcon className="h-8 w-8" aria-hidden="true" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1 overflow-y-auto max-h-40">
                            <Menu.Item>
                                {({ active }) => (
                                    <>
                                        <li
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            You have {newReservations.length} new notifications
                                        </li>
                                        {newReservations.map((reservation, index) => (
                                            <li
                                                className="bg-gray-100 text-gray-900"
                                                key={index}
                                                onClick={() => handleNotificationClick(reservation)}
                                            >
                                                <div className="text-gray-700 block px-4 py-2 text-sm">
                                                    <h4 className="cursor-pointer">{reservation.email}</h4>
                                                </div>
                                            </li>
                                        ))}
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                    </>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            <span className="text-xl font-bold">
                Hi, {session.name} {session.firstname}
            </span>
            {image && <img src={image} alt="Profile Picture" className="ml-4 rounded-full h-12 w-12" />}
        </nav>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
