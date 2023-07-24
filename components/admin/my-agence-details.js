import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/admin/Spinner";

function DetailsAgence  ({ session }) {
    const [agencyData, setAgencyData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const agencyId = session.agencyId

    useEffect(() => {
        if (agencyId) {
            axios
                .get(`/api/super-admin/manage-agence/agence?id=${agencyId}`, { withCredentials: true })
                .then((response) => {
                    setAgencyData(response.data);
                })
                .catch((error) => {
                    setErrorMessage("Failed to fetch agence data");
                    console.log(error);
                });
        }
    }, [agencyId]);

    const handleGoBack = () => {
        router.push("/admin/dashboard/home");
    };

    if (!agencyData) {
        return <p><Spinner /></p>;
    }

    const { name, address, email, image,telephone, AgencyUser,totalCars,totalParkings } = agencyData;

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 text-gray-900">
                    Details Agency
                </h2>
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2">
                        <div className="rounded-lg p-4 space-y-2">
                            {/* Contenu de la première colonne */}
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Name:</p>
                                <p className="w-2/3 text-sm">{name}</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Address:</p>
                                <p className="w-2/3 text-sm">{address}</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Email:</p>
                                <p className="w-2/3 text-sm">{email}</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Telephone:</p>
                                <p className="w-2/3 text-sm">{telephone}</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Manager Email:</p>
                                <p className="w-2/3 text-sm">{AgencyUser?.email}</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Manager Name:</p>
                                <p className="w-2/3 text-sm">{AgencyUser?.name}</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Total cars:</p>
                                <p className="w-2/3 text-sm">{totalCars}</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-sm font-bold">Total parking:</p>
                                <p className="w-2/3 text-sm">{totalParkings}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="rounded-lg p-4 space-y-2">
                            {/* Contenu de la deuxième colonne */}
                            <div className="flex items-center justify-center">
                                {image ? (
                                    <img src={image} alt="Car" className="w-48 h-48 object-cover rounded-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                        <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleGoBack}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>

    );

};

export default DetailsAgence;
