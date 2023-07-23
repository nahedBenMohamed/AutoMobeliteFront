import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import {BeatLoader} from "react-spinners";
import {MdDelete, MdEdit} from "react-icons/md";
import {useRouter} from "next/router";

const SuperAdminParkingtable = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [parkings, setParkings] = useState([]);
    const [selectedParck, setSelectedParck] = useState(null);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [parkingToDelete, setParkingToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [parkingsPerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/super-admin/parking-agence/parking').then((response) => {
            setParkings(response.data);
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
            await axios.delete(`/api/super-admin/parking-agence/parking?id=${parkingToDelete.id}`, { withCredentials: true });
            const updatedParkings = parkings.filter((parking) => parking.id !== parkingToDelete.id);
            setParkings(updatedParkings);
            setModalIsOpen(false);
            setParkingToDelete(null);
            toast.success('The parking has been deleted successfully!');
        } catch (error) {
            if (error.response) {
                toast.warning('An error occurred while deleting the parking');
            }
        }
    };

    function goToParking() {
        setIsLoadingNew(true)
        router.push('/super-admin/dashboard/parking/new');
    }

    function goEditParking(id) {
        router.push(`/super-admin/dashboard/parking/edit/${id}`);
    }

    return (
        <div className="mt-16">
            <div className="mb-4 flex justify-between">
                <button onClick={goToParking} className=" uppercase bg-blue-500 text-white p-2 rounded mx-1">
                    {isLoadingNew ? "Add Parking" : "Add Parking"}
                    {isLoadingNew && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-2 px-4 border border-gray-300 rounded-3xl"
                />
            </div>
            {isLoading ? (
                <div className="flex justify-center">
                    <div className="spinner"></div>
                </div>
            ) : (
                parkings.length === 0 ? (
                    <div className="flex justify-center items-center h-full w-full">
                        <div className="flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
                            <img className="h-full w-full object-cover" src="/no-parking.png" alt="No maintenance" />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="uppercase text-2xl font-bold">You do not have a parking</div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="border rounded-md p-4">
                            <table className="min-w-full">
                                <thead className="text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Agency Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Parking Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        City
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="px-6 py-3 text-x font-medium text-gray-500 tracking-wider">
                                {currentParkings
                                    .filter(parking => parking.name.toLowerCase().includes(search.toLowerCase()) ||
                                        parking.city.toLowerCase().includes(search.toLowerCase()) ||
                                        parking.Agency.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((parking) => (
                                        <tr key={parking.id}>
                                            <td className="uppercase text-center">{parking.Agency ? parking.Agency.name : "N/A"}</td>
                                            <td className="uppercase text-center">{parking.name}</td>
                                            <td className="uppercase text-center">{parking.address}</td>
                                            <td className="uppercase text-center">{parking.city}</td>
                                            <td className="px-6 py-4 justify-center flex space-x-2">
                                                <button
                                                    onClick={() => goEditParking(parking.id)}
                                                    className="bg-blue-500 text-white p-2 rounded mx-1">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white p-2 rounded mx-1"
                                                    onClick={() => {
                                                        setModalIsOpen(true);
                                                        setParkingToDelete(parking);
                                                    }}
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                                <button className="bg-green-500 text-white p-2 rounded mx-1" onClick={() => openModal(parking)}>
                                                    <FiInfo size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            {/*Pagination here*/}
                        </div>
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
                            contentClassName="custom-modal-content"
                        >
                            <h2 className="text-2xl font-bold text-center mb-4">Confirmation</h2>
                            {parkingToDelete && (
                                <div>
                                    <p className="text-center mt-4 mb-4">
                                        Êtes-vous sûr de vouloir supprimer le parking&nbsp;
                                        <span className="text-blue-500">{parkingToDelete.name}</span> de l'agence{' '}
                                        <span className="text-blue-500">{parkingToDelete.Agency?.name}</span>
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
                    </>
                )
            )}
        </div>
    );
};

export default SuperAdminParkingtable;
