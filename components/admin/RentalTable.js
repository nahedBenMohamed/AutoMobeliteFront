import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from "next/link";
import {FiEdit, FiInfo, FiTrash2} from "react-icons/fi";
import {ToastContainer} from "react-toastify";

const RentalTable = () => {

    const [rental, setRental] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rentalPerPage] = useState(5);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Appeler l'API pour récupérer les réservations
        axios.get('/api/admin/manage-reservation/reservation')
            .then(response => {
                setRental(response.data.reverse());
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // Pagination logic
    const indexOfLastCar = currentPage * rentalPerPage;
    const indexOfFirstCar = indexOfLastCar - rentalPerPage;
    const currentRental = rental.slice(indexOfFirstCar, indexOfLastCar);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex">
            <main className="flex-grow">
                <div className="bg-none rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Link href="/admin/dashboard/reservations/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Rental
                        </Link>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ml-4 py-2 px-4 border border-gray-300 rounded-3xl"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <div className="inline-block min-w-full overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Brand
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Model
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {currentRental
                                    .filter(rental => rental.client.name.toLowerCase().includes(search.toLowerCase()) ||
                                        rental.status.toLowerCase().includes(search.toLowerCase()))
                                    .map((rental) => (
                                    <tr key={rental.id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap">{rental.client.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{rental.car.brand}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{rental.car.model}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(rental.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(rental.endDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{rental.total} DT</td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <Link href={`/admin/dashboard/reservations/edit/${rental.id}`} className="text-blue-500 hover:text-blue-700 mx-1">
                                                <FiEdit size={18} />
                                            </Link>
                                            <Link href={`/admin/dashboard/reservations/details/${rental.id}`} className="text-gray-500 hover:text-gray-700 mx-1">
                                                <FiInfo size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="flex justify-center mt-4">
                            {rental.length > rentalPerPage && (
                                <ul className="flex items-center">
                                    {Array.from({ length: Math.ceil(rental.length / rentalPerPage) }).map((_, index) => (
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
                            )}
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick={true}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={true}
                    pauseOnHover={false}
                    theme="colored"
                />
            </main>
        </div>
    );
};




export default RentalTable;
