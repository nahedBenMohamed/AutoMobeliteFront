import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'boxicons/css/boxicons.min.css';
import { protectRoute } from "@/utils/auth";
import initializeSidebar from '/components/script';
import axios from "axios";
import UserTable from '@/components/admin/UserTable'
import CarsTable from "@/components/admin/CarsTable";
import Parkingtable from "@/components/admin/Parkingtable";
//import MaintenanceTable from "@/components/admin/MaintenanceTable"; // Nouveau composant à créer
import {HiSearch} from "react-icons/hi";

export default function Navbar({ session }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ type: null, data: [] });
    const [image, setImage] = useState(null);

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

    return (
        <nav className="navbar" style={{ justifyContent: 'space-between' }}>
            <i className="bx bx-menu"></i>
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
