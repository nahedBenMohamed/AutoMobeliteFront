import React, {useEffect, useState} from 'react';
import 'boxicons/css/boxicons.min.css';
import {protectRoute} from "@/utils/auth";
import initializeSidebar from '/components/script';
import axios from "axios";


export default function SuperAdminNavbar({ session }) {

    const [image, setImage] = useState(null);

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

    return (
        <nav className="flex items-center justify-between h-16 bg-none text-gray-800 px-4 w-full">
            <i className='bx bx-menu' ></i>
            <div className="flex items-center">
                <span className="text-xl font-bold">Hi, {session.name}</span>
                {image && <img src={image} alt="Profile Picture" className="ml-4 rounded-full h-12 w-12"/>}
            </div>
        </nav>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};

