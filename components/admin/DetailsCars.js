import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/admin/Spinner";

const DetailsCars = ({ id }) => {
    const [carData, setCarData] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/admin/manage-cars/cars?id=${id}`, { withCredentials: true })
                .then((response) => {
                    setCarData(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    const handleGoBack = () => {
        router.push("/admin/dashboard/cars");
    };

    if (!carData) {
        return <p><Spinner /></p>;
    }

    const { brand, model, year, mileage, fuel,door,gearBox,price, registration, status, parking, description, image } = carData;

    return (
        <div className="flex items-center justify-center min-w-fit bg-gray-100">
            <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Details Car
                </h2>
                <div className="flex">
                    <div className="w-1/2 mx-4">
                        <div className="rounded-lg p-4">
                            {image ? (
                                <img src={image} alt="Car" className="w-full" />
                            ) : (
                                <p className="text-center text-xl font-bold">NO PICTURE</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="font-bold">Description:</label>
                            <textarea
                                value={description}
                                disabled
                                className="w-full bg-gray-100 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="mt-4 flex-row justify-end">
                            <button
                                onClick={handleGoBack}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                    <div className="w-1/2 mx-4">
                        <div className="rounded-lg p-4 space-y-4">
                            <h2 className="text-2xl font-bold">{brand} {model}</h2>
                            <p><span className="font-bold">Year:</span>&nbsp;{year}</p>
                            <p><span className="font-bold">Mileage:</span>&nbsp;{mileage} km</p>
                            <p><span className="font-bold">Price:</span>&nbsp;{price} DT</p>
                            <p><span className="font-bold">Registration:</span>&nbsp;{registration}</p>
                            <p><span className="font-bold">Status:</span>&nbsp;{status}</p>
                            <p><span className="font-bold">Fuel:</span>&nbsp;{fuel}</p>
                            <p><span className="font-bold">Door:</span>&nbsp;{door}</p>
                            <p><span className="font-bold">Gear Box:</span>&nbsp;{gearBox}</p>
                            <p><span className="font-bold">Parking:</span>&nbsp;{parking.name || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default DetailsCars;
