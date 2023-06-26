import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardCards = () => {
    const [agences, setAgences] = useState([]);

    useEffect(() => {
        const fetchAgences = async () => {
            try {
                const response = await axios.get('/api/admin/agence', {
                    withCredentials: true,
                });
                setAgences(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAgences();
    }, []);

    return (
        <div className="grid grid-cols-2 gap-8">
            {agences.map((agence) => (
                <div key={agence.id} className="border border-lighter-grey bg-white rounded-b-3xl">
                    <div className="p-6 space-y-6">
                        <h1 className="font-bold text-xl lg:text-2xl">
                            {agence.totalParkings}
                        </h1>
                    </div>
                    <div className="p-6 space-y-6">
                        <h1 className="font-bold text-xl lg:text-2xl">
                            {agence.totalCars}
                        </h1>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardCards;
