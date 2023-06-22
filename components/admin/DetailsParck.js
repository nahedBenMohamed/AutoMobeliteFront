import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/admin/Spinner";


const DetailsParck = ({ id }) => {
    const [parkingData, setParkingData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/admin/parking?id=${id}`, { withCredentials: true })
                .then((response) => {
                    setParkingData(response.data);
                })
                .catch((error) => {
                    setErrorMessage("Failed to fetch parking data");
                    console.log(error);
                });
        }
    }, [id]);

    const handleGoBack = () => {
        router.push("/admin/dashboard/parking");
    };

    if (!parkingData) {
        return <p><Spinner /></p>;
    }

    const { name, city, address, Agency } = parkingData;

    return (
        <div className="flex items-center justify-center min-w-fit bg-gray-100">
            <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Details Parking
                </h2>
                <div className="flex">
                    <div className="w-1/2 mx-4">
                        <div className="rounded-lg p-4">

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
                            <h2 className="text-2xl font-bold">{name}</h2>
                            <p><span className="font-bold">City:</span>&nbsp;{city}</p>
                            <p><span className="font-bold">Address:</span>&nbsp;{address}</p>
                            <p><span className="font-bold">Agency Name:</span>&nbsp;{Agency?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsParck;
