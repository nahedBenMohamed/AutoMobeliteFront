import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/client/Modal';
import { useRouter } from 'next/router';
import Link from "next/link";
import CustomButton from "@/components/client/CustomButton";

const Models = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);


    useEffect(() => {
        axios.get('/api/auth/AllCars').then((response) => {
            setCars(response.data.reverse().slice(0, 3));
        });
    }, []);

    const router = useRouter();
    const handleScroll =()=>{

    }

    const openModal = (car) => {
        setSelectedCar(car);
    };

    const closeModal = () => {
        setSelectedCar(null);
    };

    const handleReservation = (car) => {
        router.push({
            pathname: '/client/Reservations',
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
            <div className="py-8 px-8 lg:px-32 lg:py-16 my-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
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



                                <div className="flex space-x-4">

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
                <div className=" flex justify-center transition-all duration-300 transform hover:scale-x-110">
                    <Link href="/Models">
                        <CustomButton
                            title="Explore more  Cars"
                            containerStyles="bg-primary-blue text-white rounded-full mt-10"
                            handleClick={handleScroll}
                        />
                    </Link>
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
};

export default Models;
