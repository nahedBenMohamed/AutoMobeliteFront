import React, { useEffect, useState } from 'react';
import 'boxicons/css/boxicons.min.css';

const Home = () => {
    const [agencyCount, setAgencyCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [clientCount, setClientCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/super-admin/rapport/rapport');
            const data = await response.json();

            setAgencyCount(data.agencyCount);
            setAdminCount(data.adminCount);
            setClientCount(data.clientCount);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    return (
        <main>
            <ul className="box-info">
                <li>
                    <i class='bx bxs-building-house'></i>
                    <span className="text">
                        <h3>{agencyCount}</h3>
                        <p>Total Agencies</p>
                  </span>
                </li>
                <li>
                    <i className="bx bxs-group"></i>
                    <span className="text">
                        <h3>{adminCount}</h3>
                        <p>Total Managers</p>
                    </span>
                </li>
                <li>
                    <i class='bx bxs-user'></i>
                    <span className="text">
                        <h3>{clientCount}</h3>
                        <p>Total Customers</p>
                    </span>
                </li>
            </ul>
        </main>
    );
};

export default Home;
