import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";

const SuperAdminParkingtable = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [parkings, setParkings] = useState([]);
    const [parkingToDelete, setParkingToDelete] = useState(null);
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

    const handleDeleteParking = async () => {
        try {
            await axios.delete(`/api/super-admin/parking?id=${parkingToDelete.id}`, { withCredentials: true });
            const updatedParkings = parkings.filter((parking) => parking.id !== parkingToDelete.id);
            setParkings(updatedParkings);
            setModalIsOpen(false);
            setParkingToDelete(null);
        } catch (error) {
            console.log(error);
            // Gérer l'erreur de suppression de parking
        }
    };

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
                                    <button
                                        className="text-red-500 hover:text-red-700 mx-1"
                                        onClick={() => {
                                            setModalIsOpen(true);
                                            setParkingToDelete(parking);
                                        }}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
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
                {parkingToDelete && (
                    <div>
                        <p className="text-center mt-4 mb-4">
                            Êtes-vous sûr de vouloir supprimer le parking&nbsp;
                            <span className="text-blue-500">
                                {parkingToDelete.name}
                            </span> de l'agence <span className="text-blue-500">
                                     {parkingToDelete.Agency?.name}
                                </span>
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleDeleteParking}
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
        </div>
    );
};

export default SuperAdminParkingtable;
