import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {FiEdit, FiInfo, FiTrash2} from "react-icons/fi";
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {FaCog} from "react-icons/fa";
import {useRouter} from "next/router";
import {BeatLoader} from "react-spinners";
import {MdDelete, MdEdit} from "react-icons/md";

const SuperAdminCartable = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [search, setSearch] = useState("");
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/super-admin/car-agence/cars').then((response) => {
            setCars(response.data);
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

    const handleDeleteCar = async () => {
        try {
            await axios.delete(`/api/super-admin/car-agence/cars?id=${carToDelete.id}`, { withCredentials: true });
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

    function addToMaintenance(id) {
        router.push(`/super-admin/dashboard/maintenance/new/${id}`);
    }

    function addCar() {
        setIsLoadingNew(true);
        router.push(`/super-admin/dashboard/cars/new/`);
    }
    function goEditCars(id) {
        router.push(`/super-admin/dashboard/cars/edit/${id}`);
    }
    return (
        <div className="mt-16">
            <div className="mb-4 flex justify-between">
                <button onClick={addCar} className=" uppercase bg-blue-500 text-white p-2 rounded mx-1">
                    {isLoadingNew ? "Add Car" : "Add Car"}
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
                cars.length === 0 ? (
                    <div className="flex justify-center items-center h-full w-full">
                        <div className="flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
                            <img className="h-full w-full object-cover" src="/no-agencies.png" alt="No car" />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="uppercase text-2xl font-bold">You do not have a car</div>
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
                                        Brand
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Model
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registration
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mileage
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="px-6 py-3 text-x font-medium text-gray-500 tracking-wider">
                                {currentCars
                                    .filter((car) =>
                                        car.Agency.name.toLowerCase().includes(search.toLowerCase()) ||
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
                                        <tr key={car.id}>
                                            <td className="text-center">{car.Agency ? car.Agency.name : "N/A"}</td>
                                            <td className="uppercase text-center">{car.brand}</td>
                                            <td className="uppercase text-center">{car.model}</td>
                                            <td className="uppercase text-center">{car.registration}</td>
                                            <td className="uppercase text-center">{car.price} DT</td>
                                            <td className="uppercase text-center">{car.mileage}</td>
                                            <td className="px-6 py-4 justify-center flex space-x-2">
                                                <button
                                                    onClick={() => goEditCars(car.id)}
                                                    className="bg-blue-500 text-white p-2 rounded mx-1">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white p-2 rounded mx-1"
                                                    onClick={() => {
                                                        setDeleteModalIsOpen(true);
                                                        setCarToDelete(car);
                                                    }}
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                                <button className="bg-green-500 text-white p-2 rounded mx-1" onClick={() => openModal(car)}>
                                                    <FiInfo size={18} />
                                                </button>
                                                <button
                                                    onClick={() => addToMaintenance(car.id)}
                                                    className="bg-blue-500 text-white p-2 rounded mx-1">
                                                    <FaCog size={18} />
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
                                                    <p><span className="font-bold">Parking:</span>&nbsp;{selectedCar.parking?.name ? selectedCar.parking.Agency.name : "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Modal>
                        <Modal
                            isOpen={deleteModalIsOpen}
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
                                </span> de l'agence <span className="text-blue-500">
                                     {carToDelete.Agency?.name}
                                </span>
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
                                            onClick={() => setDeleteModalIsOpen(false)}
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

export default SuperAdminCartable;
