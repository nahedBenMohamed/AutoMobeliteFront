import React, {useEffect} from 'react';
import 'boxicons/css/boxicons.min.css';
import {protectRoute} from "@/utils/auth";
import initializeSidebar from '/components/script';


export default function Navbar({ session }) {

    useEffect(() => {
        initializeSidebar();
    }, []);
    return (
        <nav className="flex items-center justify-between h-16 bg-none text-gray-800 px-4 w-full">
            <i className='bx bx-menu' ></i>
            <div className="flex items-center">
                <span className="text-xl font-bold">Hi, {session.name} Manager of {session.agency}</span>
            </div>
        </nav>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};

