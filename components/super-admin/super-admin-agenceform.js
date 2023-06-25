import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiLocationMarker, HiMail, HiPhone, HiUser } from "react-icons/hi";
import axios from "axios";
import {FiPlus, FiTrash2} from "react-icons/fi";
import {getCountryCallingCode, parsePhoneNumberFromString} from "libphonenumber-js";

const SuperAdminAgenceForm = ({ id }) => {

    const router = useRouter();
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [responsibleEmail, setResponsibleEmail] = useState("");
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
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
                .get("/api/super-admin/manage-agence/agence?id=" + id, { withCredentials: true })
                .then((response) => {
                    const agencyData = response.data;
                    setName(agencyData.name);
                    setAddress(agencyData.address);
                    setEmail(agencyData.email);
                    setTelephone(agencyData.telephone);
                    setImages(agencyData.image ? [agencyData.image] : []);
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

        const data = {
            name,
            address,
            email,
            telephone,
            image: images.length > 0 ? images[0] : null,
            responsibleEmail };
        try {
            if (id) {
                // Update
                await axios.put("/api/super-admin/manage-agence/agence/",{ ...data, id });
            } else {
                // Create
                await axios.post("/api/super-admin/manage-agence/agence", data);
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


    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            data.append("file", files[0]);
            data.append("id", id);
            try {
                const res = await axios.post("/api/super-admin/manage-agence/upload", data);
                const {message, imagePath} = res.data;
                if (message === "Image uploaded successfully") {
                    setImages([imagePath]);
                } else {
                    setErrorMessage("Upload failed");
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data.error);
                    setErrorMessageVisible(true);
                    setTimeout(() => {
                        setErrorMessageVisible(false);
                    }, 5000);
                }
            } finally {
                setIsUploading(false);
            }
        }
    }

    async function deleteImage() {
        setImages([]);  // Ajoutez cette ligne
        try {
            await axios.delete(`/api/super-admin/manage-agence/delete?id=${id}`, {withCredentials: true});
            setImages([]);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
                setErrorMessageVisible(true);
                setTimeout(() => {
                    setErrorMessageVisible(false);
                }, 5000);
            } else {
                setErrorMessage("An error occurred while deleting the image.");
                setErrorMessageVisible(true);
                setTimeout(() => {
                    setErrorMessageVisible(false);
                }, 5000);
            }
        }
    }



    if (goToAgency) {
        router.push("/super-admin/dashboard/agence");

        return null;
    }
    function goBack (){
        router.push("/super-admin/dashboard/agence");
    }

    return (
        <div className="flex items-center justify-center min-w-full bg-gray-100">
            <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {id ? "Edit Agency" : "Add Agency"}
                </h2>
                <div className="flex">
                    <div className="flex flex-col items-center mr-8">
                        <div className="w-48 h-48 mb-4 relative">
                            {images.length > 0 && (
                                <img src={images[0]} alt="Car"
                                     className="w-full h-full object-cover rounded-lg"/>
                            )}
                        </div>
                        <div className="flex flex-row space-x-2">
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={uploadImage}
                                hidden
                            />
                            <label htmlFor="image"
                                   className=" text-blue-500 hover:text-blue-700 mx-1 cursor-pointer">
                                <FiPlus size={18}/>
                            </label>
                            <button type="button" className="text-red-500 hover:text-red-700"
                                    onClick={deleteImage}>
                                <FiTrash2 size={18}/>
                            </button>
                        </div>
                    </div>
                    <form onSubmit={saveAgence} className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                <input
                                    id="nameAgency"
                                    name="nameAgency"
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="Enter agency Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="responsable"
                                    name="responsable"
                                    type="text"
                                    autoComplete="responsable-name"
                                    placeholder="Enter responsible email"
                                    value={responsibleEmail}
                                    onChange={(e) => setResponsibleEmail(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Enter agency email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
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
                            <div className="relative">
                                <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    autoComplete="new-location"
                                    placeholder="Enter agency location"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="w-1/2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {id ? "Update" : "Save"}
                            </button>
                            <button
                                type="button"
                                className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                onClick={goBack}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAgenceForm;
