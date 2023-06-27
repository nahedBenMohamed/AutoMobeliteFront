import React, { useEffect, useState } from "react";
import { AiFillCar, AiFillStar, AiFillTool } from "react-icons/ai";
import { GiCarDoor } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import axios from "axios";
import Modal from "@/components/client/Modal";
import { useRouter } from "next/router";

function Models() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(9);
    const [paginationRange, setPaginationRange] = useState([]);

    useEffect(() => {
        axios.get("/api/auth/AllCars").then((response) => {
            setCars(response.data);
        });
    }, []);

    const router = useRouter();

    const openModal = (car) => {
        setSelectedCar(car);
    };

    const closeModal = () => {
        setSelectedCar(null);
    };

    const handleReservation = (car) => {
        router.push({
            pathname: "/client/Reservations",
            query: {
                id: car.id,
                image: car.image,
                price: car.price,
                brand: car.brand,
                Agency: car.Agency?.name,
            },

        });
    };

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

    return (
        <section id="models-main">
            <div className="py-8 px-8 lg:px-32 lg:py-16 my-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {currentCars.map((car) => (
                        <div key={car.id} className="border border-lighter-grey bg-white rounded">
                            <div className="image-container">
                                <img src={car.image} alt="" />
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
                                <div className="flex items-center justify-between text-lg">
                                    <div className="-mt-8 flex items-center gap-2">
                    <span>
                      <AiFillCar className="text-blue-600" />
                    </span>
                                        <span>{car.brand}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{car.name}</span>
                                        <span className="-mt-5 ">4</span>
                                        <span>
                      <GiCarDoor className="-mt-5 text-blue-600" />
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2">
                    <span>
                      <AiFillTool className="text-blue-600" />
                    </span>
                                        <span>{car.model}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{car.registration}</span>
                                        <span>
                      <BsFillFuelPumpFill className="text-blue-600" />
                    </span>
                                    </div>
                                </div>
                                <div>
                                    <hr className="border border-lighter-grey" />
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleReservation(car)}
                                        className="block text-center bg-blue-600 p-2 font-bold text-white rounded w-full"
                                    >
                                        Book now
                                    </button>
                                    <button
                                        onClick={() => openModal(car)}
                                        className="block text-center bg-blue-600 p-2 font-bold text-white rounded w-full"
                                    >
                                        More details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
            {selectedCar && (
                <Modal onClose={closeModal} car={selectedCar}>
                    <h1 className="font-bold text-xl mb-4">{selectedCar.brand}</h1>
                    <p>Modèle: {selectedCar.model}</p>
                    <p>Année: {selectedCar.year}</p>
                    <p>Kilométrage: {selectedCar.mileage}</p>
                    <p>Prix: {selectedCar.price} DT</p>
                    <p>Enregistrement: {selectedCar.registration}</p>
                    <p>Nom du parking: {selectedCar.parkingName}</p>
                    <p>Agence: {selectedCar.Agency}</p>
                    <p>Locations: {selectedCar.rentals}</p>
                </Modal>
            )}
        </section>
    );
}

export default Models;
