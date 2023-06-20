import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Parkingtable = () => {

    const [parkings, setParking] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/parking', { withCredentials: true })
            .then(response => {
                setParking(response.data);
            })
    }, [])

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border-4 shadow-lg">
                <thead>
                <tr>
                    <th className="px-4 py-2">Name Parck</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">City</th>
                    <th className="px-4 py-2">Agency</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {parkings.map((parking) => (
                    <tr key={parking.id}>
                        <td className="border px-4 py-2 max-w-xs overflow-hidden">{parking.name}</td>
                        <td className="border px-4 py-2 max-w-xs overflow-hidden">{parking.address}</td>
                        <td className="border px-4 py-2 max-w-xs overflow-hidden">{parking.city}</td>
                        <td className="border px-4 py-2 max-w-xs overflow-hidden">{parking.Agency?.name}</td>
                        <td className="border px-4 py-2">
                            <Link
                                href={"/admin/dashboard/parking/edit/"+parking.id}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Edit
                            </Link>
                            <Link
                                href={"/admin/dashboard/parking/delete/"+parking.id}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                            >
                                Delete
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4">
                <Link href="/admin/dashboard/parking/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Parking
                </Link>
            </div>
            <div className="mt-4"></div>
        </div>
    );
};

export default Parkingtable;
