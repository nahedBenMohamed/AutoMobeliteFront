import React, { useEffect, useState } from "react";
import { AiFillCar, AiFillStar, AiFillTool } from "react-icons/ai";
import { GiCarDoor } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import axios from "axios";

function Models() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get('/api/auth/AllCars').then(response => {
            setCars(response.data);
        });
    }, []);

    return (
        <section id="models-main">
            <div className="py-8 px-8 lg:px-48 lg:py-16 my-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {cars.map(car => (
                        <div key={car.id} className="border border-lighter-grey bg-white rounded">
                            <div className="image-container">
                                <img
                                    src={car.images}
                                    alt=""
                                />
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div>
                                            <h1 className="font-bold text-xl lg:text-2xl">
                                                {car.brand}
                                            </h1>
                                        </div>
                                        <div className="text-[#ffc933] flex items-center">
                                            <span><AiFillStar /></span>
                                            <span><AiFillStar /></span>
                                            <span><AiFillStar /></span>
                                            <span><AiFillStar /></span>
                                            <span><AiFillStar /></span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h1 className="font-bold text-xl lg:text-2xl">
                                            {car.price} DT
                                        </h1>
                                        <p className="text-custom-grey">per day</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2">
                                        <span><AiFillCar /></span>
                                        <span>{car.model}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{car.name}</span>
                                        <span><GiCarDoor /></span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2">
                    <span>
                      <AiFillTool />
                    </span>
                                        <span>{/*{data.transmission}*/}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>{/*{data.fuel}*/}</span>
                                        <span>
                      <BsFillFuelPumpFill />
                    </span>
                                    </div>
                                </div>
                                <div>
                                    <hr className="border border-lighter-grey" />
                                </div>
                                <div>
                                    <a
                                        href="/authentification/login"
                                        className="block text-center bg-custom-blue p-3 font-bold text-white rounded  w-full"
                                    >
                                        Book Ride
                                    </a>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Models;
