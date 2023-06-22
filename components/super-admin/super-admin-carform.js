import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {FiPlus, FiTrash2} from "react-icons/fi";

export default function SuperAdminCarform({ id }) {

    const [agencyName, setAgencyName] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [price, setPrice] = useState("");
    const [registration, setRegistration] = useState("");
    const [status, setStatus] = useState("");
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [parkingName, setParkingName] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [goToCars, setGoToCars] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageVisible, setErrorMessageVisible] = useState(true);


    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get("/api/super-admin/cars?id=" + id, { withCredentials: true })
                .then((response) => {
                    const carData = response.data;
                    setAgencyName(carData.Agency.name);
                    setBrand(carData.brand);
                    setModel(carData.model);
                    setYear(carData.year.toString());
                    setMileage(carData.mileage.toString());
                    setPrice(carData.price.toString());
                    setStatus(carData.status);
                    setImages(carData.image ? [carData.image] : []);
                    setRegistration(carData.registration);
                    setParkingName(carData.parking?.name);
                    setDescription(carData.description);
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage("Erreur lors du chargement depuis la base de données");
                });
        }
    }, [id]);

    async function saveCar(ev) {
        ev.preventDefault();

        // Vérification des données côté client (facultatif)
        if ( !brand || !model || !year || !mileage || !price || !registration || !status || !agencyName || !parkingName ) {
            setErrorMessage("Veuillez remplir tous les champs.");
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }

        const data = {
            agencyName: agencyName,
            brand,
            model,
            year: parseInt(year),
            mileage: parseInt(mileage),
            price: parseFloat(price),
            registration,
            status,
            image: images.length > 0 ? images[0] : null,
            parkingName,
            description,
        };
        try {
            if (id) {
                // Update car
                await axios.put("/api/super-admin/cars", { ...data, id, parkingName });
            } else {
                // Create
                await axios.post("/api/super-admin/cars", data);
            }
            setGoToCars(true);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
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
                const res = await axios.post("/api/super-admin/upload", data);
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
                await axios.delete(`/api/super-admin/imagedelete?id=${id}`, {withCredentials: true});
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

    if (goToCars) {
        router.push("/super-admin/dashboard/cars");
    }
    function goBack (){
        router.push("/super-admin/dashboard/cars");
    }

            return (
                <div className="flex items-center justify-center min-w-full bg-gray-100">
                    <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                        <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            {id ? "Edit Car" : "Add Car"}
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
                            <form onSubmit={saveCar} className="flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            id="agencyId"
                                            name="agencyId"
                                            type="text"
                                            value={agencyName}
                                            onChange={(ev) => setAgencyName(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="agency"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="parking"
                                            name="parking"
                                            type="text"
                                            value={parkingName}
                                            onChange={(ev) => setParkingName(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="parking"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="brand"
                                            name="brand"
                                            type="text"
                                            value={brand}
                                            onChange={(ev) => setBrand(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Brand"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="model"
                                            name="model"
                                            type="text"
                                            value={model}
                                            onChange={(ev) => setModel(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Model"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="year"
                                            name="year"
                                            type="text"
                                            value={year}
                                            onChange={(ev) => setYear(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Year"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="mileage"
                                            name="mileage"
                                            type="text"
                                            value={mileage}
                                            onChange={(ev) => setMileage(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Mileage"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="price"
                                            name="price"
                                            type="text"
                                            value={price}
                                            onChange={(ev) => setPrice(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Price"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="registration"
                                            name="registration"
                                            type="text"
                                            value={registration}
                                            onChange={(ev) => setRegistration(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="registration"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="status"
                                            name="status"
                                            type="text"
                                            value={status}
                                            onChange={(ev) => setStatus(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="status"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(ev) => setDescription(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows={4}
                                    placeholder="Enter a description..."
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
        }
