import { useRouter } from 'next/router';
import React, {useEffect, useState} from "react";
import {AiFillCar, AiFillStar, AiFillTool} from "react-icons/ai";
import {GiCarDoor} from "react-icons/gi";
import {BsFillFuelPumpFill} from "react-icons/bs";
import Link from "next/link";
import Modal from "@/components/client/Modal";

const SearchResultsPage = () => {
    const router = useRouter();
    const { cars } = router.query;
    const [carsPage, setCarsPage] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(9);
    const [paginationRange, setPaginationRange] = useState([]);
    const openModal = (car) => {
        setSelectedCar(car);
    };

    const closeModal = () => {
        setSelectedCar(null);
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


    // Convertir les résultats de recherche en objet JavaScript
    const searchResults = JSON.parse(cars);

    return (
        <section id="models-main">
            <div className="py-8 px-8 lg:px-32 lg:py-16 my-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {searchResults.map((car) => (
                        <div key={car.id} className="border border-lighter-grey bg-white rounded">
                            <div className="image-container">
                                <img src={car.image} alt="" className="w-full transition-all duration-300 transform hover:scale-x-110 "/>
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
                                        <span className="-mt-5 ">{car.door}</span>
                                        <span><GiCarDoor className="-mt-5 text-blue-600" /></span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2">
                                        <span>
                                          <AiFillTool className="text-blue-600" />
                                        </span>
                                        <span>{car.gearBox}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{car.fuel}</span>
                                        <span>
                      <BsFillFuelPumpFill className="text-blue-600" />
                    </span>
                                    </div>
                                </div>
                                <div>
                                    <hr className="border border-lighter-grey" />
                                </div>
                                <div className="flex space-x-4">
                                    <Link href={`/client/Reservations/new/${car.id}`} className="block text-center bg-blue-600 p-2 font-bold text-white rounded w-full">
                                        Book now
                                    </Link>
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
                {carsPage.length > carsPerPage && (
                    <ul className="flex items-center">
                        {Array.from({ length: Math.ceil(carsPage.length / carsPerPage) }).map((_, index) => (
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
};

export default SearchResultsPage;
