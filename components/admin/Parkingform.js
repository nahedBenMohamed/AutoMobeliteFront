import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiLocationMarker, HiMail, HiUser } from "react-icons/hi";
import axios from "axios";
import Link from "next/link";
import {parseCookies} from "nookies";
import jwt from "jsonwebtoken";

const ParkingForm = ({ id }) => {
    const router = useRouter();
    const [agency, setAgency] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [goToParkings, setGoToParkings] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(true);

    useEffect(() => {
        const { token } = parseCookies();
        // Verify JWT and extract payload
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                // Set agency name from JWT
                setAgency(decodedToken.agency);
            } catch (error) {
                console.error("Invalid token.");
            }
        } else {
            console.error("No cookies found.");
        }

        if (id) {
            axios
                .get("/api/admin/parking?id=" + id, { withCredentials: true })
                .then((response) => {
                    const parkingData = response.data;
                    setName(parkingData.name);
                    setAddress(parkingData.address);
                    setCity(parkingData.city);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    async function saveParking(ev) {
        ev.preventDefault();

        // Vérification des données côté client (facultatif)
        if (!name || !city || !address) {
            setErrorMessage("Veuillez remplir tous les champs.");
            setErrorMessageVisible(true); // Set this to true when you want to show the error message
            setTimeout(() => {
                setErrorMessageVisible(false); // Set this to false after 5 seconds
            }, 5000);
            return;
        }

        const data = { name, address, city,agency };
        try {
            if (id) {
                // Update
                await axios.put("/api/admin/parking/", { ...data, id },{ withCredentials: true });
            } else {
                // Create
                await axios.post("/api/admin/parking/", data,{ withCredentials: true });
            }
            setGoToParkings(true);
        } catch (error) {
            if (error.response) {
            setErrorMessage(error.response.data.message);
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
        }
    }

}

    if (goToParkings) {
        router.push("/admin/dashboard/parking");
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {id ? "Edit Parck" : "Add Parck"}
                </h2>
                <div className=" mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={saveParking}>
                        <div>
                            <div>
                                <label htmlFor="name" className="block font-semibold">
                                    Name Parck
                                </label>
                                <div className="relative">
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="given-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                Address
                            </label>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="address"
                                        name="address"
                                        type="address"
                                        autoComplete="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                    City
                                </label>
                            </div>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="city"
                                        name="city"
                                        type="city"
                                        autoComplete="new-tel"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mt-2 mb-4">
                                {errorMessageVisible && errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    type="submit"
                                    className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                                    Save
                                </button>
                                <Link
                                    href={"/admin/dashboard/parking"}
                                    type="button"
                                    className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                                    Annuler
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ParkingForm;
