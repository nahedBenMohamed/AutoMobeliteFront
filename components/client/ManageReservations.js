import React, { useState, useEffect } from 'react';
import Link from "next/link";
import {FiEdit, FiInfo, FiTrash2} from "react-icons/fi";
import {ToastContainer} from "react-toastify";
import Modal from "react-modal";
import {FaMoneyBill} from "react-icons/fa";


const RentalDetails = () => {
    const [rental, setRental] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [rentalToDelete, setRentalToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rentalPerPage] = useState(5);
    const [search, setSearch] = useState("");


    useEffect(() => {
        const fetchRental = async () => {
            try {
                const response = await fetch('/api/client/reservation', {withCredentials:true});
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Une erreur s\'est produite lors de la récupération des réservations');
                }

                setRental(data);
            } catch (error) {
                console.error('Error fetching rental:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRental();
    }, []);

    // Pagination logic
    const indexOfLastCar = currentPage * rentalPerPage;
    const indexOfFirstCar = indexOfLastCar - rentalPerPage;
    const currentRental = rental.slice(indexOfFirstCar, indexOfLastCar);


    const handleDeleteRental = () => {

    };

    // Render rental details here

    return (
        <div className=" flex flex-col items-center justify-center min-h-screen">
        <div className="flex justify-center">
            <main className="w-full -mt-40 flex-grow">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center  ">
                        <div className="bold-text text-xl text-black   -mt-20">MANAGE YOUR RESERVATIONS</div>
                        <FaMoneyBill className="ml-2 text-blue-600 -mt-20" size={24} />
                    </div>
                </div>
                <div className="bg-none rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Link href="/client/Modelsconnected/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Rental
                        </Link>
                        <input
                            type="text"
                            placeholder="Search rentals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ml-4 py-2 px-4 border border-gray-300 rounded-3xl"
                        />
                    </div>
                </div>
                <div className="table-container">
                    <div className="mx-auto bg-white rounded-lg overflow-hidden">
                        <div className="inline-block min-w-3xl overflow-x-auto">
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
                                        Start Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        End Date
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
                                        Total
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {currentRental
                                    .filter(rental =>
                                        rental.car.brand.toLowerCase().includes(search.toLowerCase()) ||
                                        rental.car.model.toLowerCase().includes(search.toLowerCase()) ||
                                        rental.status.toLowerCase().includes(search) ||
                                        rental.total.toString().includes(search)
                                    )
                                    .map((rental) => (
                                        <tr key={rental.id} className="hover:bg-gray-100">
                                            <td className="px-6 py-4 whitespace-nowrap">{rental.car.brand}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{rental.car.model}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(rental.startDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(rental.endDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{rental.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{rental.total} DT</td>
                                            <td className="px-6 py-4 flex justify-center">
                                                <Link href={""} className="text-blue-500 hover:text-blue-700 mx-1">
                                                    <FiEdit size={18} />
                                                </Link>
                                                <Link href={""} className="text-gray-500 hover:text-gray-700 mx-1">
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
                    {rentalToDelete && (
                        <div>
                            <p className="text-center mt-4 mb-4 text-black">
                                Êtes-vous sûr de vouloir supprimer la réservation de la voiture&nbsp;
                                <span className="text-black">
                {rentalToDelete.car.brand} {rentalToDelete.car.model}
              </span> ?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleDeleteRental}
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
        </div>
    );

};

export default RentalDetails;
