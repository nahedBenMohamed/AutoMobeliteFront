import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {FiEdit, FiInfo, FiTrash2} from 'react-icons/fi';
import axios from 'axios';

const SuperAdminAgencetable = () => {
    const [agences, setAgences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [agencesPerPage] = useState(3);

    useEffect(() => {
        axios.get('/api/super-admin/agence').then((response) => {
            setAgences(response.data);
        });
    }, []);

    // Pagination logic
    const indexOfLastAgence = currentPage * agencesPerPage;
    const indexOfFirstAgence = indexOfLastAgence- agencesPerPage;
    const currentAgences = agences.slice(indexOfFirstAgence, indexOfLastAgence);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="overflow-x-auto">
            <div className="w-full">
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <div className="inline-block min-w-full overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Agence Name
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
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Phone
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Nbr Cars
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Nbr Parck
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Manager
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
                        {currentAgences.map((agence) => (
                            <tr key={agence.id} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap">{agence.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{agence.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{agence.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{agence.telephone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{agence.totalCars}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{agence.totalParkings}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {agence.AgencyUser?.firstname} {agence.AgencyUser?.name}
                                </td>
                                <td className="px-6 py-4 flex justify-center">
                                    <Link href={"/super-admin/dashboard/parking/edit/"+agence.id} className="text-blue-500 hover:text-blue-700 mx-1">
                                        <FiEdit size={18} />
                                    </Link>
                                    <Link href={"/super-admin/dashboard/parking/delete/"+agence.id} className="text-red-500 hover:text-red-700 mx-1">
                                        <FiTrash2 size={18} />
                                    </Link>
                                    <Link href={"/super-admin/dashboard/parking/details/"+agence.id} className="text-gray-500 hover:text-gray-700 mx-1" >
                                        <FiInfo size={18} />
                                    </Link>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <Link
                    href="/super-admin/dashboard/agence/new"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Agence
                </Link>
            </div>
            <div className="flex justify-center mt-4">
                <ul className="flex items-center">
                    {Array.from({ length: Math.ceil(agences.length / agencesPerPage) }).map((_, index) => (
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

export default SuperAdminAgencetable;
