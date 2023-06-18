import React, {useEffect, useState} from 'react';
import Link from "next/link";
import axios from "axios";

const VehicleTable = () => {
    const[cars, setCars] = useState([])

    useEffect(() => {
        axios.get('/api/admin/cars', { withCredentials: true })
            .then(response => {
                setCars(response.data);
            })
    }, [])


    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Agence</th>
                    <th className="px-4 py-2">Parking</th>
                    <th className="px-4 py-2">Brand</th>
                    <th className="px-4 py-2">Model</th>
                    <th className="px-4 py-2">Registration</th>
                    <th className="px-4 py-2">Year</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Mileage</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {cars.map(car => (
                    <tr key={car.id}>
                        <td className="border px-4 py-2">{car.Agency.name}</td>
                        <td className="border px-4 py-2">{car.parking?.name}</td>
                        <td className="border px-4 py-2">{car.brand}</td>
                        <td className="border px-4 py-2">{car.model}</td>
                        <td className="border px-4 py-2">{car.registration}</td>
                        <td className="border px-4 py-2">{car.year}</td>
                        <td className="border px-4 py-2">{car.price} DT</td>
                        <td className="border px-4 py-2">{car.status}</td>
                        <td className="border px-4 py-2">{car.mileage} Km</td>
                        <td className="border px-4 py-2">
                            <Link href={'/admin/dashboard/cars/edit/'+car.id} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Edit
                            </Link>
                            <Link href={'/admin/dashboard/cars/delete/'+car.id} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                                Delete
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4">
                <Link  href={'/admin/dashboard/cars/new'} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Car
                </Link>
            </div>

            {/* Pagination */}
            <div className="mt-4">
            </div>
        </div>
    );
};

export default VehicleTable;
