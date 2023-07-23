import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Link from 'next/link';
import axios from 'axios';
import { FiEdit, FiInfo, FiTrash2} from 'react-icons/fi';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {FaCog} from "react-icons/fa";
import {useRouter} from "next/router";
import {BeatLoader} from "react-spinners";
const VehicleTable = () => {

    const router = useRouter();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [carToDelete, setCarToDelete] = useState(null);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(1);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);

    useEffect(() => {
        setIsLoadingNew(true)
        axios.get('/api/admin/manage-cars/cars', { withCredentials: true })
            .then((response) => {
                setCars(response.data.reverse());
                setIsLoadingNew(false)
            })
            .catch((error) => {
                setIsLoadingNew(false)
                if (error.response) {
                    toast.warning('An error occurred while loading data');
                }
            });
    }, []);

    // Pagination logic
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

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
            toast.success('The car has been deleted successfully!');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403 && error.response.data.message === "The car is reserved and cannot be deleted.") {
                    toast.warning('The car is reserved and cannot be deleted.');
                } else {
                    toast.warning('An error occurred while deleting the car');
                }
            }
        }

    };

    const handleNextBtn = () => {
        setCurrentPage(currentPage + 1);
        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + carsPerPage);
            setMinPageNumberLimit(minPageNumberLimit + carsPerPage);
        }
    };
    const handlePrevBtn = () => {
        setCurrentPage(currentPage - 1);
        if ((currentPage - 1) % carsPerPage === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - carsPerPage);
            setMinPageNumberLimit(minPageNumberLimit - carsPerPage);
        }
    };
    function addToMaintenance(id) {
        router.push(`/admin/dashboard/maintenance/new/${id}`);
    }

    function addCar() {
        setIsLoading(true);
        router.push(`/admin/dashboard/cars/new/`);
    }
    function goEditCars(id) {
        router.push(`/admin/dashboard/cars/edit/${id}`);
    }

    return (
        <div className="container mt-16">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
            <div className="flex items-center justify-between mt-8 mb-8">
                <button onClick={addCar} className="uppercase bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {isLoading ? "Add Car" : "Add Car"}
                    {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ml-4 py-2 px-4 border border-gray-300 rounded-3xl"
                />
            </div>
            {isLoadingNew ? (
                <div className="flex justify-center">
                    <div className="spinner"></div>
                </div>
            ) : (
                cars.length === 0 ? (
                    <div className="flex justify-center items-center h-full w-full ">
                        <div className="flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
                            <img className="h-full w-full object-cover" src="/no-cars.jpeg" alt="No cars" />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="uppercase text-2xl font-bold">you do not have a car</div>
                        </div>
                    </div>

                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {currentCars
                                .filter((car) =>
                                    car.brand.toLowerCase().includes(search.toLowerCase()) ||
                                    car.model.toLowerCase().includes(search.toLowerCase()) ||
                                    car.year.toString().includes(search) ||
                                    car.mileage.toString().includes(search) ||
                                    car.price.toString().includes(search) ||
                                    car.registration.toLowerCase().includes(search.toLowerCase()) ||
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
                                                <button onClick={() => goEditCars(car.id)} className="text-blue-500 hover:text-blue-700 mx-1">
                                                    <FiEdit size={18} />
                                                </button>
                                                <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => {
                                                    setDeleteModalIsOpen(true); // Open the delete modal
                                                    setCarToDelete(car);
                                                }}>
                                                    <FiTrash2 size={18} />
                                                </button>
                                                <button onClick={() => openModal(car)}>
                                                    <FiInfo size={18} />
                                                </button>
                                                <button onClick={() => addToMaintenance(car.id)} className="text-blue-500 hover:text-blue-700 mx-1">
                                                    <FaCog size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex justify-center mt-4">
                            {cars.length > carsPerPage && (
                                <ul className="flex items-center">
                                    {currentPage !== 1 &&
                                        <>
                                            <li>
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                    First
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handlePrevBtn}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                    Prev
                                                </button>
                                            </li>
                                        </>
                                    }
                                    <li>
                                        <button
                                            className={`bg-blue-500 text-white font-bold py-2 px-4 mx-1 rounded`}
                                        >
                                            {currentPage}
                                        </button>
                                    </li>
                                    {currentPage !== Math.ceil(cars.length / carsPerPage) &&
                                        <>
                                            <li>
                                                <button
                                                    onClick={handleNextBtn}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                    Next
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => setCurrentPage(Math.ceil(cars.length / carsPerPage))}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                    Last
                                                </button>
                                            </li>
                                        </>
                                    }
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
                                                        className="uppercase bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
                    </>
                )
            )}
        </div>
        );
};

export default VehicleTable;
