import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/admin/Spinner";


const SuperAdminDetailsAdmin = ({ id }) => {

    const [adminData, setAdminData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/super-admin/manage-admin/admin?id=${id}`, { withCredentials: true })
                .then((response) => {
                    setAdminData(response.data);
                })
                .catch((error) => {
                    setErrorMessage("Failed to fetch parking data");
                    console.log(error);
                });
        }
    }, [id]);

    const handleGoBack = () => {
        router.push("/super-admin/dashboard/manage-admin");
    };

    if (!adminData) {
        return <p><Spinner /></p>;
    }

    const { name, firstname, email, image,Agency } = adminData;

    return (
        <div className="flex items-center justify-center min-w-fit bg-gray-100">
            <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Details Admin
                </h2>
                <div className="flex">
                    <div className="w-1/2 mx-4">
                        <div className="rounded-full p-4 w-64 h-64">
                            {image ? (
                                <img src={image} alt="Car" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <p className="text-center text-2xl font-bold">NO PICTURE</p>
                            )}
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
                            <p><span className="font-bold">First Name:</span>&nbsp;{firstname}</p>
                            <p><span className="font-bold">Email:</span>&nbsp;{email}</p>
                            <p><span className="font-bold">Agency Name:</span>&nbsp;{Agency ? Agency.name : "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDetailsAdmin;
