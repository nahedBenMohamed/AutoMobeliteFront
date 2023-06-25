import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';

const AdminHome = () => {
    const [statistics, setStatistics] = useState({
        totalCar: 0,
        parc: 0,
        totalSales: 0,
    });

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
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchStatistics();
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
                    <i className="bx bxs-dollar-circle"></i>
                    <span className="text">
                        <h3>{statistics.totalSales}</h3>
                        <p>Total Sales</p>
                    </span>
                </li>
            </ul>
            <div className="table-data">
                <div className="order">
                    <div className="head">
                        <h3>Recent Orders</h3>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Date Order</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminHome;
