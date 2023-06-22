import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import axios from 'axios';

const SuperAdminParkingtable = () => {
    const [parkings, setParkings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [parkingsPerPage] = useState(5);

    useEffect(() => {
        axios.get('/api/super-admin/parking').then((response) => {
            setParkings(response.data);
        });
    }, []);

    // Pagination logic
    const indexOfLastParking = currentPage * parkingsPerPage;
    const indexOfFirstParking = indexOfLastParking - parkingsPerPage;
    const currentParkings = parkings.slice(indexOfFirstParking, indexOfLastParking);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="overflow-x-auto">
            <div className="w-full">
                <div className="bg-white rounded-b-3xl shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Parck Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Addres
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    City
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Agence Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                            </thead>
                        <tbody>
                        {currentParkings.map((parking) => (
                            <tr key={parking.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{parking.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{parking.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{parking.city}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{parking.Agency?.name}</td>
                                <td className="px-6 py-4 flex justify-center">
                                    <Link href={"/super-admin/dashboard/parking/edit/"+parking.id} className="text-blue-500 hover:text-blue-700 mx-1">
                                            <FiEdit size={18} />
                                    </Link>
                                    <Link href={"/super-admin/dashboard/parking/delete/"+parking.id} className="text-red-500 hover:text-red-700 mx-1">
                                            <FiTrash2 size={18} />
                                    </Link>
                                    <Link href={"/super-admin/dashboard/parking/details/"+parking.id} className="text-gray-500 hover:text-gray-700 mx-1" >
                                            <FiInfo size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4">
                <Link href="/super-admin/dashboard/parking/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Parking
                </Link>
            </div>
            <div className="flex justify-center mt-4">
                <ul className="flex items-center">
                    {Array.from({ length: Math.ceil(parkings.length / parkingsPerPage) }).map((_, index) => (
                        <li key={index}>
                            <button
                                className={`${
                                    currentPage === index + 1
                                        ? 'bg-blue-500 hover:bg-blue-700 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                } font-bold py-2 px-4 mx-1 rounded`}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SuperAdminParkingtable;
