import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiLocationMarker, HiMail, HiUser } from "react-icons/hi";
import axios from "axios";
import Link from "next/link";

const ParkingForm = ({ id }) => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [goToParkings, setGoToParkings] = useState(false);

    useEffect(() => {
        if (id) {
            axios
                .get("/api/super-admin/parking?id=" + id, { withCredentials: true })
                .then((response) => {
                    const parkingData = response.data;
                    setName(parkingData.name);
                    setAddress(parkingData.address);
                    setCity(parkingData.city);
                    setAgencyName(parkingData.Agency?.name);
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage("Erreur lors du chargement depuis la base de données");
                });
        }
    }, [id]);

    async function saveParking(ev) {
        ev.preventDefault();

        // Vérification des données côté client (facultatif)
        if (!name || !city || !address || !agencyName) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        const data = { name, address, city, agencyName };
        try {
            if (id) {
                // Update
                await axios.put("/api/super-admin/parking/", { ...data, id });
            } else {
                // Create
                await axios.post("/api/super-admin/parking/", data);
            }
            setGoToParkings(true);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    }

    if (goToParkings) {
        router.push("/super-admin/dashboard/parking");
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {id ? "Edit Parking" : "Add Parking"}
                </h2>
                <div className=" mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={saveParking}>
                        <div className=" mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block font-semibold">
                                    Name Parking
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
                            <div>
                                <label htmlFor="agencyName" className="block font-semibold">
                                    Name Agency
                                </label>
                                <div className="relative">
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="agencyName"
                                        name="agencyName"
                                        type="text"
                                        autoComplete="responsable-id"
                                        value={agencyName}
                                        onChange={(e) => setAgencyName(e.target.value)}
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
                            <div className="mt-2 mb-8">
                                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
                                    href={"/super-admin/dashboard/parking"}
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
