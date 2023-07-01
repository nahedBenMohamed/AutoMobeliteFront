import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Parkingtable = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [parkings, setParkings] = useState([]);
    const [parkingToDelete, setParkingToDelete] = useState(null);
    const [selectedParck, setSelectedParck] = useState(null);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [parkingsPerPage] = useState(5);
    const [search, setSearch] = useState("");


    useEffect(() => {
        axios.get('/api/admin/manage-parking/parking', { withCredentials: true })
            .then((response) => {
                setParkings(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    toast.warning('An error occurred while loading data',
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
            });
    }, []);

    // Pagination logic
    const indexOfLastParking = currentPage * parkingsPerPage;
    const indexOfFirstParking = indexOfLastParking - parkingsPerPage;
    const currentParkings = parkings.slice(indexOfFirstParking, indexOfLastParking);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const closeDetailsModal = () => {
        setDetailsModalIsOpen(false); // Fermer la modal de suppression
    };

    const openModal = (parking) => {
        setSelectedParck(parking);
        setDetailsModalIsOpen(true);
    };

    const handleDeleteParking = async () => {
        try {
            await axios.delete(`/api/admin/manage-parking/parking?id=${parkingToDelete.id}`, { withCredentials: true });
            const updatedParkings = parkings.filter((parking) => parking.id !== parkingToDelete.id);
            setParkings(updatedParkings);
            setModalIsOpen(false);
            setParkingToDelete(null);
            toast.success('The parking has been deleted successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        } catch (error) {
            if (error.response) {
                toast.warning('An error occurred while deleting the parking',
                    {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                    });
            }
        }
    };

    return (
        <div className="flex">
            <main className="flex-grow">
                <div className="bg-none rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Link href="/admin/dashboard/parking/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Parking
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
                                        Parck Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        City
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentParkings
                                    .filter(parking => parking.name.toLowerCase().includes(search.toLowerCase()) ||
                                        parking.city.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((parking) => (
                                    <tr key={parking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{parking.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{parking.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{parking.city}</td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <Link href={`/admin/dashboard/parking/edit/${parking.id}`} className="text-blue-500 hover:text-blue-700 mx-1">
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
                                            <button
                                                className="hover:text-black-700 mx-1"
                                                onClick={() => openModal(parking)}>
                                                <FiInfo size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        {parkings.length > parkingsPerPage && (
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
                        )}
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
                <Modal isOpen={detailsModalIsOpen}>
                {selectedParck && (
                        <div className="flex justify-center items-center fixed inset-0 z-50 overflow-auto modal-overlay">
                            <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                                <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    PARKING'S DETAILS
                                </h2>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-1/2 mx-4">
                                        <div className="rounded-lg p-4">
                                            {selectedParck.image ? (
                                                <img src={selectedParck.image} alt="Car" className="w-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                                    <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img" /></span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 flex justify-between">
                                            <button
                                                onClick={closeDetailsModal}
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                            >
                                                Close
                                            </button>

                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2 mx-4 mt-4 sm:mt-0">
                                        <div className="rounded-lg p-4 space-y-4">
                                            <h2 className="text-xl sm:text-2xl font-bold">{selectedParck.name}</h2>
                                            <p><span className="font-bold">Address:</span>&nbsp;{selectedParck.address}</p>
                                            <p><span className="font-bold">City:</span>&nbsp;{selectedParck.city} km</p>
                                            <p><span className="font-bold">Agency Name:</span>&nbsp;{selectedParck.Agency?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
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
                    contentClassName="custom-modal-content">
                    <h2 className="text-2xl font-bold text-center mb-4">Confirmation</h2>
                    {parkingToDelete && (
                        <div>
                            <p className="text-center mt-4 mb-4">
                                Êtes-vous sûr de vouloir supprimer le parking&nbsp;
                                <span className="text-blue-500">
                                    {parkingToDelete.name}
                                </span> ?
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
            </main>
        </div>
    );
};

export default Parkingtable;
