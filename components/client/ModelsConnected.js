import React, {useEffect, useState} from 'react';
import { AiFillCar, AiFillStar, AiFillTool } from "react-icons/ai";
import { GiCarDoor } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import axios from "axios";
import Modal from "./Modal";
import {router} from "next/router";

function Modelsconnected() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        axios.get("/api/auth/AllCars").then((response) => {
            setCars(response.data);
        });
    }, []);

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

    return (
        <section id="models-main">
            <div className="py-8 px-8 lg:px-48 lg:py-16 my-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
                        <div key={car.id} className="border border-lighter-grey bg-white rounded">
                            <div className="image-container">
                                <img src={car.image} alt="" />
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div>
                                            <h1 className="font-bold text-xl lg:text-2xl">{car.brand}</h1>
                                        </div>
                                        <div className="text-[#ffc933] flex items-center">
                      <span>
                        <AiFillStar />
                      </span>
                                            <span>
                        <AiFillStar />
                      </span>
                                            <span>
                        <AiFillStar />
                      </span>
                                            <span>
                        <AiFillStar />
                      </span>
                                            <span>
                        <AiFillStar />
                      </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h1 className="font-bold text-xl lg:text-2xl">{car.price} DT</h1>
                                        <p className="text-custom-grey">per day</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2">
                    <span>
                      <AiFillCar />
                    </span>
                                        <span>{car.model}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{car.name}</span>
                                        <span>4</span>
                                        <span>
                      <GiCarDoor />
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2">
                    <span>
                      <AiFillTool />
                    </span>
                                        <span>{car.parkingName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{car.registration}</span>
                                        <span>
                      <BsFillFuelPumpFill />
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

export default Modelsconnected;