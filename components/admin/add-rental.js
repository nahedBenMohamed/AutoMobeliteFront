import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import Link from "next/link";

function AddRental() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(6);
    const [paginationRange, setPaginationRange] = useState([]);



    useEffect(() => {
        axios
            .get("/api/admin/manage-cars/cars", { withCredentials: true })
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    toast.warning("An error occurred while loading data", {
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

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const range = [];
        const totalPages = Math.ceil(cars.length / carsPerPage);
        const maxButtonsToShow = 5; // Adjust the number of buttons to show

        let startPage, endPage;
        if (totalPages <= maxButtonsToShow) {
            // Show all buttons
            startPage = 1;
            endPage = totalPages;
        } else {
            // Determine the range of buttons to show
            const middlePage = Math.floor(maxButtonsToShow / 2);
            if (currentPage <= middlePage) {
                // Show first n buttons
                startPage = 1;
                endPage = maxButtonsToShow;
            } else if (currentPage + middlePage >= totalPages) {
                // Show last n buttons
                startPage = totalPages - maxButtonsToShow + 1;
                endPage = totalPages;
            } else {
                // Show middle n buttons
                startPage = currentPage - middlePage;
                endPage = currentPage + middlePage;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }

        setPaginationRange(range);
    }, [currentPage, cars, carsPerPage]);

    const openModal = (car) => {
        setSelectedCar(car);
        setModalIsOpen(true);
    };


    const closeModal = () => {
        setModalIsOpen(false);
    };


    return (
        <div className="container mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {currentCars.map((car) => (
                    <div key={car.id} className="border border-lighter-grey bg-white rounded">
                        <div className="image-container">
                            {car.image ? (
                                <img src={car.image} alt="Car" className="w-full" />
                            ) : (
                                <img src="/placeholder.png" alt="Default" />
                            )}
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div>
                                        <h1 className="-mt-6  font-bold text-xl lg:text-2xl">{car.brand}</h1>
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
                            <div className="flex space-x-4">
                                <button
                                    className="block text-center bg-blue-600 p-2 font-bold text-white rounded w-full"
                                >
                                    <Link href={"/admin/dashboard/reservations/form/" + car.id}>
                                    Book now
                                    </Link>
                                </button>
                                <button
                                    className="block text-center bg-blue-600 p-2 font-bold text-white rounded w-full"
                                    onClick={() => openModal(car)}
                                >
                                    More details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                {paginationRange.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        className={`mx-2 px-2 py-1 rounded ${
                            currentPage === pageNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                        onClick={() => paginate(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
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
                                            <img src="/placeholder.png" alt="Default" />
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
                                        <p><span className="font-bold">Status:</span>&nbsp;{selectedCar.status}</p>
                                        <p><span className="font-bold">Parking:</span>&nbsp;{selectedCar.parking?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default AddRental;
