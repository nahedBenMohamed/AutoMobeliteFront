import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';
import {FiEdit, FiInfo} from "react-icons/fi";
import Link from "next/link";

const AdminHome = () => {

    const [statistics, setStatistics] = useState({
        totalCar: 0,
        parc: 0,
        totalSales: 0,
        totalReservations: 0
    });

    const [reservations, setReservations] = useState([]);


    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('/api/admin/agence', {
                    withCredentials: true,
                });
                const [agence] = response.data;

                setStatistics({
                    totalCar: agence.totalCars,
                    parc: agence.totalParkings,
                    totalSales: agence.totalSales,
                    totalReservations : agence.totalReservations
                });
            } catch (error) {
                console.log(error);
            }
        };

        const fetchRental = async () => {
            try {
                const response = await axios.get('/api/admin/manage-reservation/reservation', {
                    withCredentials: true,
                });
                setReservations(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchStatistics();
        fetchRental();
    }, []);

    return (
        <main>
            <ul className="box-info">
                <li>
                    <i class='bx bxs-car'></i>
                    <span className="text">
                        <h3>{statistics.totalCar}</h3>
                        <p>Total Cars</p>
                    </span>
                </li>
                <li>
                    <i class='bx bxs-parking'></i>
                    <span className="text">
                        <h3>{statistics.parc}</h3>
                        <p>Total Parc</p>
                    </span>
                </li>
                <li>
                    <i className="bx bxs-calendar-check"></i>
                    <span className="text">
                        <h3>{statistics.totalReservations}</h3>
                        <p>Total Rentals</p>
                    </span>
                </li>
            </ul>
            <div className="table-data">
                <div className="order">
                    <div className="head">
                        <h3>Recent Orders</h3>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                        <tr>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Client</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Brand</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservations.map((rental) => (
                            <tr key={rental.id}>
                                <td className="px-2 py-2 whitespace-nowrap">{rental.client ? rental.client.name : '-'}</td>
                                <td className="px-2 py-2 whitespace-nowrap">{rental.car?.brand ?? '-'}</td>
                                <td className="px-2 py-2 whitespace-nowrap">{rental.status}</td>
                                <td>
                                    <Link href={`/admin/dashboard/reservations/details/${rental.id}`} className="text-blue-500 hover:text-blue-700 mx-1">
                                        <FiInfo size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminHome;
