import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiLocationMarker, HiMail, HiPhone, HiUser } from "react-icons/hi";
import axios from "axios";
import Link from "next/link";
import {getCountryCallingCode, parsePhoneNumberFromString} from "libphonenumber-js";

const SuperAdminAgenceForm = ({ id }) => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [responsibleEmail, setResponsibleEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [goToAgency, setGoToAgency] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(true);


    // Function to set the default telephone value with country code
    const getDefaultTelephone = () => {
        const defaultCountryCode = getCountryCallingCode('TN');
        return `+${defaultCountryCode}`;
    };

    useEffect(() => {
        if (id) {
            axios
                .get("/api/super-admin/agence?id=" + id, { withCredentials: true })
                .then((response) => {
                    const agencyData = response.data;
                    setName(agencyData.name);
                    setAddress(agencyData.address);
                    setEmail(agencyData.email);
                    setTelephone(agencyData.telephone);
                    setResponsibleEmail(agencyData.AgencyUser?.email);
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage("Erreur lors du chargement depuis la base de données");
                });
        }
    }, [id]);

    async function saveAgence(ev) {
        ev.preventDefault();

        // Vérification des données côté client (facultatif)
        if (!name || !telephone || !email || !address || !responsibleEmail) {
            setErrorMessage("Please fill in all fields");
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }

        // Convert telephone to a string
        const telephoneString = String(telephone);

        // Validate the phone number
        const phoneNumber = parsePhoneNumberFromString(telephoneString, "TN");

        // Additional validation for the phone number
        const phoneNumberRegex = /^\+216\d{8}$/; // Matches "+216" followed by 8 digits
        const isPhoneNumberValid = phoneNumber && phoneNumber.isValid() && phoneNumberRegex.test(telephoneString);

        if (!isPhoneNumberValid) {
            setErrorMessage("Please enter a valid Tunisian phone number.");
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }

        const data = { name, address, email, telephone, responsibleEmail };
        try {
            if (id) {
                // Update
                await axios.put("/api/super-admin/agence/",{ ...data, id });
            } else {
                // Create
                await axios.post("/api/super-admin/agence", data);
            }
            setGoToAgency(true);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
        }
    }



    if (goToAgency) {
        router.push("/super-admin/dashboard/agence");

        return null;
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Add an Agency
                </h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={saveAgence}>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nameAgency" className="block font-semibold">
                                    Name Agency
                                </label>
                                <div className="relative">
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="nameAgency"
                                        name="nameAgency"
                                        type="text"
                                        autoComplete="given-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="responsable" className="block font-semibold">
                                    Responsable Email
                                </label>
                                <div className="relative">
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="responsable"
                                        name="responsable"
                                        type="text"
                                        autoComplete="responsable-name"
                                        value={responsibleEmail}
                                        onChange={(e) => setResponsibleEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                    Telephone
                                </label>
                            </div>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="phone"
                                        autoComplete="email"
                                        placeholder="Enter your Tunisia phone number"
                                        value={telephone || getDefaultTelephone()} // Set default value with country code
                                        onChange={(e) => setTelephone(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                        Location
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <div className="relative">
                                        <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            autoComplete="new-location"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 mb-8">
                                    {errorMessageVisible && errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button type="submit" className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                                        Save
                                    </button>
                                    <Link href={"/super-admin/dashboard/agence"} type="button" className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                                        Annuler
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAgenceForm;
