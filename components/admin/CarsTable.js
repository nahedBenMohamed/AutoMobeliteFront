import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Link from 'next/link';
import axios from 'axios';
import {FiCrop, FiEdit, FiInfo, FiTrash2} from 'react-icons/fi';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {CogIcon} from "@heroicons/react/20/solid";
import {FaCog} from "react-icons/fa";


const VehicleTable = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [carToDelete, setCarToDelete] = useState(null);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(6);

    useEffect(() => {
        axios.get('/api/admin/manage-cars/cars', { withCredentials: true })
            .then((response) => {
                setCars(response.data.reverse());
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
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openModal = (car) => {
        setSelectedCar(car);
        setModalIsOpen(true);
    };


    const closeModal = () => {
        setModalIsOpen(false); // Fermer la modal d'informations
    };

    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false); // Fermer la modal de suppression
    };


    const handleDeleteCar = async () => {
        try {
            await axios.delete(`/api/admin/manage-cars/cars?id=${carToDelete.id}`, { withCredentials: true });
            const updatedCars = cars.filter((car) => car.id !== carToDelete.id);
            setCars(updatedCars);
            setModalIsOpen(false);
            setCarToDelete(null);
            toast.success('The car has been deleted successfully!', {
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
                if (error.response.status === 403 && error.response.data.message === "The car is reserved and cannot be deleted.") {
                    toast.warning('The car is reserved and cannot be deleted.',
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
                } else {
                    toast.warning('An error occurred while deleting the car',
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
        }

    };

    return (
        <div className="container mt-16">
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
            <div className="flex items-center justify-between mt-8 mb-8">
                <Link href="/admin/dashboard/cars/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Car
                </Link>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ml-4 py-2 px-4 border border-gray-300 rounded-3xl"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {currentCars
                    .filter((car) =>
                        car.brand.toLowerCase().includes(search.toLowerCase()) ||
                        car.model.toLowerCase().includes(search.toLowerCase()) ||
                        car.year.toString().includes(search) ||
                        car.mileage.toString().includes(search) ||
                        car.price.toString().includes(search) ||
                        car.registration.toLowerCase().includes(search.toLowerCase()) ||
                        car.status.toLowerCase().includes(search.toLowerCase()) ||
                        car.fuel.toLowerCase().includes(search.toLowerCase()) ||
                        car.door.toString().includes(search) ||
                        car.gearBox.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((car) => (
                        <div key={car.id} className="border border-lighter-grey bg-white rounded">
                            <div className="image-container">
                                {car.image ? (
                                    <img src={car.image} alt="Car" />
                                ) : (
                                    <img src="/placeholder.png" alt="Default" />
                                )}
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div>
                                            <h1 className="-mt-6  font-bold text-xl lg:text-2xl">{car.brand} </h1>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h1 className="font-bold text-xl lg:text-2xl">{car.price} DT</h1>
                                        <p className="text-custom-grey">per day</p>
                                    </div>
                                </div>
                                <div>
                                    <hr className="border border-lighter-grey" />
                                </div>
                                <div className="flex space-x-4 justify-center items-center">
                                    <Link href={`/admin/dashboard/cars/edit/${car.id}`} className="text-blue-500 hover:text-blue-700 mx-1">
                                        <FiEdit size={18} />
                                    </Link>
                                    <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => {
                                        setDeleteModalIsOpen(true); // Open the delete modal
                                        setCarToDelete(car);
                                    }}>
                                        <FiTrash2 size={18} />
                                    </button>
                                    <button onClick={() => openModal(car)}>
                                        <FiInfo size={18} />
                                    </button>
                                    <Link href={`/admin/dashboard/maintenance/new/${car.id}`} className="text-blue-500 hover:text-blue-700 mx-1">
                                        <FaCog size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="flex justify-center mt-4">
                {cars.length > carsPerPage && (
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
                )}
            </div>
                <Modal isOpen={modalIsOpen}>
                    {selectedCar && (
                        <div className="flex justify-center items-center fixed inset-0 z-50 overflow-auto modal-overlay">
                            <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                                <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    CAR'S DETAILS
                                </h2>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-1/2 mx-4">
                                        <div className="rounded-lg p-4">
                                            {selectedCar.image ? (
                                                <img src={selectedCar.image} alt="Car" className="w-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                                    <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <label className="font-bold">Description:</label>
                                            <textarea
                                                value={selectedCar.description}
                                                disabled
                                                style={{resize: 'none', height: '4em', lineHeight: '1.1em'}}
                                                className="w-full bg-gray-100 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                            />
                                        </div>
                                        <div className="mt-2 flex justify-between">
                                            <button
                                                onClick={closeModal}
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                            >
                                                Close
                                            </button>

                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2 mx-4 mt-4 sm:mt-0">
                                        <div className="rounded-lg p-4 space-y-4">
                                            <h2 className="text-xl sm:text-2xl font-bold">{selectedCar.brand} {selectedCar.model}</h2>
                                            <p><span className="font-bold">Year:</span>&nbsp;{selectedCar.year}</p>
                                            <p><span className="font-bold">Mileage:</span>&nbsp;{selectedCar.mileage} km</p>
                                            <p><span className="font-bold">Price:</span>&nbsp;{selectedCar.price} DT</p>
                                            <p><span className="font-bold">Registration:</span>&nbsp;{selectedCar.registration}</p>
                                            <p><span className="font-bold">Gear Box:</span>&nbsp;{selectedCar.gearBox}</p>
                                            <p><span className="font-bold">Fuel:</span>&nbsp;{selectedCar.fuel}</p>
                                            <p><span className="font-bold">Door:</span>&nbsp;{selectedCar.door}</p>
                                            <p><span className="font-bold">Status:</span>&nbsp;{selectedCar.status}</p>
                                            <p><span className="font-bold">Parking:</span>&nbsp;{selectedCar.parking?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
                <Modal
                    isOpen={deleteModalIsOpen}
                    onRequestClose={() => setDeleteModalIsOpen(false)}
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
                                    onClick={closeDeleteModal}
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

export default VehicleTable;
