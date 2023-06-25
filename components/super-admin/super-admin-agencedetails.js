import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/admin/Spinner";

const SuperAdminDetailsAgence = ({ id }) => {
    const [agencyData, setAgencyData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/super-admin/agence?id=${id}`, { withCredentials: true })
                .then((response) => {
                    setAgencyData(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    const handleGoBack = () => {
        router.push("/super-admin/dashboard/agence");
    };

    if (!agencyData) {
        return <p><Spinner /></p>;
    }

    const { name, address, email, telephone, AgencyUser,totalCars,totalParkings } = agencyData;

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
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
                                <p className="w-1/3 text-sm font-bold">Total parck:</p>
                                <p className="w-2/3 text-sm">{totalParkings}</p>
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

export default SuperAdminDetailsAgence;
