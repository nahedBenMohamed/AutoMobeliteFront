import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {HiHome, HiLocationMarker, HiMail, HiPhone, HiUser} from "react-icons/hi";
import axios from "axios";
import Link from "next/link";
import {FiPlus, FiTrash2} from "react-icons/fi";

const SuperAdminParkingForm = ({ id }) => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [goToParking, setGoToParking] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(true);

    useEffect(() => {
        if (id) {
            axios
                .get("/api/super-admin/parking-agence/parking?id=" + id, { withCredentials: true })
                .then((response) => {
                    const parkingData = response.data;
                    setName(parkingData.name);
                    setAddress(parkingData.address);
                    setCity(parkingData.city);
                    setImages(parkingData.image ? [parkingData.image] : []);
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
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }

        const data = {
            name,
            address,
            city,
            image: images.length > 0 ? images[0] : null,
            agencyName };
        try {
            if (id) {
                // Update
                await axios.put("/api/super-admin/parking-agence/parking/", { ...data, id });
            } else {
                // Create
                await axios.post("/api/super-admin/parking-agence/parking/", data);
            }
            setGoToParking(true);
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

    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            data.append("file", files[0]);
            data.append("id", id);
            try {
                const res = await axios.post("/api/super-admin/parking-agence/upload", data);
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
            await axios.delete(`/api/super-admin/parking-agence/delete?id=${id}`, {withCredentials: true});
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

    if (goToParking) {
        router.push("/super-admin/dashboard/parking");
    }

    function goBack (){
        router.push("/super-admin/dashboard/parking");
    }

    return (
        <div className="flex items-center justify-center min-w-full bg-gray-100">
            <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {id ? "Edit Parking" : "Add Parking"}
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
                    <form onSubmit={saveParking} className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="given-name"
                                    value={name}
                                    placeholder="Enter Parking Name"
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                <input
                                    id="nameAgency"
                                    name="nameAgency"
                                    type="text"
                                    autoComplete="given-name"
                                    value={agencyName}
                                    placeholder="Enter Agency Name"
                                    onChange={(e) => setAgencyName(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="new-location"
                                    value={city}
                                    placeholder="Enter City Name"
                                    onChange={(e) => setCity(e.target.value)}
                                    className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    autoComplete="new-location"
                                    value={address}
                                    placeholder="Enter Address"
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

export default SuperAdminParkingForm;
