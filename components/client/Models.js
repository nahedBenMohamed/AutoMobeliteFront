import React, { useEffect, useState } from "react";
import { AiFillCar, AiFillTool } from "react-icons/ai";
import { GiCarDoor } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import axios from "axios";
import Modal from "@/components/client/Modal";
import { Checkbox } from "@material-ui/core"
import {useRouter} from "next/router";
import { BeatLoader } from "react-spinners";

function Models() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [carsPerPage] = useState(9);
    const [paginationRange, setPaginationRange] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [showAllGearBox, setShowAllGearBox] = useState(true);
    const [showDiesel, setShowDiesel] = useState(false);
    const [showEssence, setShowEssence] = useState(false);
    const [showElectric, setShowElectric] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [showAutomatic, setShowAutomatic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const router = useRouter();

    useEffect(() => {
        axios.get("/api/client/AllCars").then((response) => {
            setCars(response.data.reverse());
        });
    }, []);


    const openModal = (car) => {
        setSelectedCar(car);
    };

    const closeModal = () => {
        setSelectedCar(null);
    };


    // Pagination logic
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar,indexOfLastCar);
    // Change page

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    useEffect(() => {
        const range = [];
        const totalPages = Math.ceil(cars.length / carsPerPage);
        const maxButtonsToShow = 4; // Adjust the number of buttons to show

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

    function goReservations(id) {
        setIsLoading(true)
        router.push(`/reservations/new/step1?id=${id}`);
    }

    // Effectuer le filtrage chaque fois que l'état change
    useEffect(() => {
        const result = cars.filter(car => {
            let matchFuel = true, matchGearBox = true, matchSeats = true;

            if (showDiesel || showEssence || showElectric) {
                matchFuel = (showDiesel && car.fuel === 'Diesel') ||
                    (showEssence && car.fuel === 'Essence') ||
                    (showElectric && car.fuel === 'Electrique');
            }

            if (showManual || showAutomatic) {
                matchGearBox = (showManual && car.gearBox === 'Manuelle') ||
                    (showAutomatic && car.gearBox === 'Automatique');
            }

            return matchFuel && matchGearBox && matchSeats;
        });

        setFilteredCars(result);
    }, [showDiesel, showEssence, showElectric, showManual, showAutomatic,  cars]);


    function resetAllFilters() {
        setShowDiesel(false);
        setShowEssence(false);
        setShowElectric(false);
        setShowManual(false);
        setShowAutomatic(false);
        setShowAllGearBox(true);
    }
    function resetFuelFilters() {
        setShowDiesel(false);
        setShowEssence(false);
        setShowElectric(false);
    }

    function resetGearboxFilters() {
        setShowManual(false);
        setShowAutomatic(false);
        setShowAllGearBox(true);
    }

    // Pour les filtres de boîte de vitesse

    function handleAllGearBoxChange(e) {
        setShowAllGearBox(e.target.checked);
        if (e.target.checked) {
            resetGearboxFilters();
        }
    }
    function handleManualChange(e) {
        setShowManual(e.target.checked);
        if (e.target.checked) {
            setShowAutomatic(false);
            setShowAllGearBox(false);
        }
    }

    function handleAutomaticChange(e) {
        setShowAutomatic(e.target.checked);
        if (e.target.checked) {
            setShowManual(false);
            setShowAllGearBox(false);
        }
    }

    // Pour les filtres de carburant
    function handleDieselChange(e) {
        setShowDiesel(e.target.checked);
        if (e.target.checked) {
            setShowEssence(false);
            setShowElectric(false);
        }
    }

    function handleEssenceChange(e) {
        setShowEssence(e.target.checked);
        if (e.target.checked) {
            setShowDiesel(false);
            setShowElectric(false);
        }
    }
    function handleElectricChange(e) {
        setShowElectric(e.target.checked);
        if (e.target.checked) {
            setShowEssence(false);
            setShowDiesel(false);
        }
    }

    return (
        <section id="models-main">
            <div className="mt-8 -mb-16 flex justify-end">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-2 px-4 border border-gray-300 rounded-3xl"
                />
            </div>
            <div className="flex flex-col lg:flex-row py-8 px-8 lg:px-32 lg:py-16 my-8">
                <div className="w-full lg:w-1/3 px-2">
                    <div className="border border-gray-200 p-4 rounded">
                        <div className="flex justify-between">
                            <h2>+ of Filters</h2>
                            <small className="cursor-pointer" onClick={resetAllFilters}>Reset all</small>
                        </div>
                        <hr />
                        <div className="mt-4 py-2">
                            <div className="flex justify-between">
                                <h3>Gearbox</h3>
                                <small className="cursor-pointer" onClick={resetGearboxFilters}>réinitialiser</small>
                            </div>
                            <div className="mt-8">
                                <div className="flex justify-between"><div>All types</div><Checkbox checked={showAllGearBox} onChange={handleAllGearBoxChange} /></div>
                                <div className="flex justify-between"><div>Manual</div><Checkbox checked={showManual} onChange={handleManualChange} /></div>
                                <div className="flex justify-between"><div>Automatic</div><Checkbox checked={showAutomatic} onChange={handleAutomaticChange}/></div>
                            </div>
                        </div>
                        <hr />
                        <div className="mt-4 py-2">
                            <div className="flex justify-between">
                                <h3>Fuel</h3>
                                <small className="cursor-pointer" onClick={resetFuelFilters}>reset</small>
                            </div>
                            <div className="mt-8">
                                <div className="flex justify-between"><div>Diesel</div><Checkbox checked={showDiesel} onChange={handleDieselChange} /> </div>
                                <div className="flex justify-between"><div>Petrol</div><Checkbox checked={showEssence} onChange={handleEssenceChange} /></div>
                                <div className="flex justify-between"><div>Electric</div><Checkbox checked={showElectric} onChange={handleElectricChange} /></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-12/12 px-4">
                    <div className="grid grid-cols-1 gap-8">
                        {currentCars
                            .filter((car) =>
                                car.brand.toLowerCase().includes(search.toLowerCase()) ||
                                car.model.toLowerCase().includes(search.toLowerCase()) ||
                                car.year.toString().includes(search) ||
                                car.mileage.toString().includes(search) ||
                                car.price.toString().includes(search) ||
                                car.door.toString().includes(search)
                            )
                            .map((car) => {

                            return (
                                <div className="relative border border-lighter-grey bg-white rounded p-4">

                                    <div className="flex flex-col lg:flex-row">
                                        <div className="w-full lg:w-2/3 mb-4 lg:mb-0">
                                            <div className="image-container ">
                                                {car.image ? (
                                                    <img
                                                        src={car.image}
                                                        alt="Car"
                                                        className="w-full h-auto rounded-lg transition-all duration-300 transform hover:scale-x-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg transition-all duration-300 transform hover:scale-x-110">
                                                            <span className="text-gray-500 text-lg">
                                                              <img src="/placeholder.png" alt="img" />
                                                            </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-2 w-full lg:w-1/2">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="space-y-1">
                                                    <div>
                                                        <h1 className="-mt-6 font-bold text-xl lg:text-xl">{car.brand}</h1>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <h1 className="font-bold text-xl lg:text-xl">{car.price} DT</h1>
                                                    <p className="text-custom-grey">per day</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-lg mb-4">
                                                <div className="-mt-8 flex items-center gap-2">
                                                          <span>
                                                            <AiFillCar className="text-blue-600" />
                                                          </span>
                                                    <span>{car.model}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="-mt-5">{car.door}</span>
                                                    <span>
                                                        <GiCarDoor className="-mt-5 text-blue-600" />
                                                      </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-lg mb-2">
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
                                                <hr className="border border-lighter-grey mt-4" />
                                            </div>
                                            <div className="mt-4 flex space-x-4">
                                                <button
                                                    onClick={() => goReservations(car.id)}
                                                    className="flex justify-center items-center bg-blue-600 p-2 font-bold text-white rounded w-full"
                                                >
                                                    {isLoading ? "Book now..." : "Book now"}
                                                    {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
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
                                </div>

                            )
                        })}
                    </div>
                    <div className="flex justify-center mt-4">
                        {cars.length > carsPerPage && (
                            <ul className="flex items-center max-w-xs">
                                {paginationRange.map((pageNumber) => (
                                    <li key={pageNumber}>
                                        <button
                                            className={`${
                                                currentPage === pageNumber
                                                    ? 'bg-blue-500 hover:bg-blue-700 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                            } font-bold py-2 px-4 mx-1 rounded`}
                                            onClick={() => paginate(pageNumber)}
                                        >
                                            {pageNumber}
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
                </div>
            </div>
        </section>
    )
}

export default Models