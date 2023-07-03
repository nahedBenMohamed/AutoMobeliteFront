import React, { useEffect, useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import { protectRoute } from "@/utils/auth";
import initializeSidebar from '/components/script';
import axios from "axios";
import {FaBell} from "react-icons/fa";

export default function Navbar({ session }) {
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
    return (
        <nav className="navbar" style={{ justifyContent: 'space-between' }}>
            <i className="bx bx-menu"></i>
            <FaBell onClick="" />
            <span className="text-xl font-bold">
            Hi, {session.name} {session.firstname}
        </span>
            {image && (
                <img src={image} alt="Profile Picture" className="ml-4 rounded-full h-12 w-12" />
            )}
        </nav>
    );

}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
