import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/admin/Spinner";

const SuperAdminDetailsCars = ({ id }) => {
    const [carData, setCarData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/super-admin/car-agence/cars?id=${id}`, { withCredentials: true })
                .then((response) => {
                    setCarData(response.data);
                })
                .catch((error) => {
                    setErrorMessage("Failed to fetch car data");
                    console.log(error);
                });
        }
    }, [id]);

    const handleGoBack = () => {
        router.push("/super-admin/dashboard/cars");
    };

    if (!carData) {
        return <p><Spinner /></p>;
    }

    const { brand, model, year, mileage, price, registration, status, parkingName, description, image, Agency } = carData;

    return (
        <div className="flex items-center justify-center min-w-fit bg-gray-100">
            <div className="max-w-3xl w-full bg-white p-4 rounded-lg">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Details Car
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="rounded-full p-4 w-100 h-100 ">
                            {image ? (
                                <img src={image} alt="Car" className="w-full h-full object-cover"/>
                            ) : (
                                <p className="text-center text-2xl font-bold">NO PICTURE</p>
                            )}
                        </div>


                        <div className="mt-4">
                            <label className="font-bold">Description:</label>
                            <textarea
                                value={description || "N/A"}
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
                    <div>
                        <div className="rounded-lg p-4 space-y-2">
                            <h2 className="text-2xl font-bold">Agency {Agency.name}</h2>
                            <p><span className="font-bold">Brand:</span>&nbsp;{brand}</p>
                            <p><span className="font-bold">Model:</span>&nbsp;{model}</p>
                            <p><span className="font-bold">Year:</span>&nbsp;{year}</p>
                            <p><span className="font-bold">Mileage:</span>&nbsp;{mileage} km</p>
                            <p><span className="font-bold">Price:</span>&nbsp;{price} DT</p>
                            <p><span className="font-bold">Registration:</span>&nbsp;{registration}</p>
                            <p><span className="font-bold">Status:</span>&nbsp;{status}</p>
                            <p><span className="font-bold">Parking:</span>&nbsp;{parkingName || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDetailsCars;
