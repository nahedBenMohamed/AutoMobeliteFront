import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Link from 'next/link';
import axios from 'axios';
import { FiEdit, FiInfo, FiTrash2 } from 'react-icons/fi';
import {useRouter} from "next/router";

const VehicleTable = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(5);
    const router = useRouter()


    useEffect(() => {
        axios.get('/api/admin/manage-cars/cars', { withCredentials: true }).then((response) => {
            setCars(response.data);
        });
    }, []);

    // Pagination logic
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const handleDeleteCar = async () => {
        try {
            await axios.delete(`/api/admin/manage-cars/cars?id=${carToDelete.id}`, { withCredentials: true });
            const updatedCars = cars.filter((car) => car.id !== carToDelete.id);
            setCars(updatedCars);
            setModalIsOpen(false);
            setCarToDelete(null);
        } catch (error) {
            console.log(error);
            // Gérer l'erreur de suppression de voiture
        }
    };


    return (
        <div className="flex">
            <main className="flex-grow">
                <div className="table-auto">
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <div className="inline-block min-w-full overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Brand
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Model
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Registration
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Year
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Mileage
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {currentCars.map((car) => (
                                    <tr key={car.id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap">{car.brand}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.registration}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.mileage}</td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <Link href={`/admin/dashboard/cars/edit/${car.id}`} className="text-blue-500 hover:text-blue-700 mx-1">
                                                <FiEdit size={18} />
                                            </Link>
                                            <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => {
                                                setModalIsOpen(true);
                                                setCarToDelete(car);
                                            }}>
                                                <FiTrash2 size={18} />
                                            </button>
                                            <Link href={`/admin/dashboard/cars/details/${car.id}`} className="text-gray-500 hover:text-gray-700 mx-1">
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
                        <Link href="/admin/dashboard/cars/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Car
                        </Link>
                    </div>
                    <div className="flex justify-center mt-4">
                        <ul className="flex items-center">
                            {Array.from({ length: Math.ceil(cars.length / carsPerPage) }).map((_, index) => (
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

                {/* Modal de confirmation */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Confirmation Modal"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        content: {
                            maxWidth: '400px',
                            width: '90%',
                            height: '35%',
                            margin: 'auto',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            top: '50%',
                            left: '55%',
                            transform: 'translate(-50%, -55%)',
                        },
                    }}
                    contentClassName="custom-modal-content"
                >
                    <h2 className="text-2xl font-bold text-center mb-4">Confirmation</h2>
                    {carToDelete && (
                        <div>
                            <p className="text-center mt-4 mb-4">
                                Êtes-vous sûr de vouloir supprimer la voiture
                                &nbsp;
                                <span className="text-blue-500">
                                    {carToDelete.brand} {carToDelete.model}
                                </span> ?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleDeleteCar}
                                >
                                    OUI
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => setModalIsOpen(false)}
                                >
                                    NON
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

            </main>
        </div>
    );
};

export default VehicleTable;
