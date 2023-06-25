import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {FiPlus, FiTrash2} from "react-icons/fi";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function CarForm({ id }) {

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [price, setPrice] = useState("");
    const [registration, setRegistration] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [parkingName, setParkingName] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [goToCars, setGoToCars] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [errorMessageVisible, setErrorMessageVisible] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/admin/manage-cars/cars?id=${id}`, { withCredentials: true })
                .then((response) => {
                    const carData = response.data;
                    setBrand(carData.brand);
                    setModel(carData.model);
                    setYear(carData.year.toString());
                    setMileage(carData.mileage.toString());
                    setPrice(carData.price.toString());
                    setStatus(carData.status);
                    setImages(carData.image ? [carData.image] : []);
                    setRegistration(carData.registration);
                    setParkingName(carData.parkingName);
                    setDescription(carData.description);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    async function saveCar(ev) {
        ev.preventDefault();

        if (!brand || !model || !year || !mileage || !price || !registration || !status) {
            setErrorMessage("Veuillez remplir tous les champs.");
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            toast.error('Veuillez remplir tous les champs.');
            return;
        }


        const data = {
            brand,
            model,
            year: parseInt(year),
            mileage: parseInt(mileage),
            price: parseFloat(price),
            registration,
            status,
            description,
            image: images.length > 0 ? images[0] : null,
            parkingName: parkingName !== "" ? parkingName : null,
        };

        try {
            if (id) {
                await axios.put(`/api/admin/manage-cars/cars?id=${id}`, { ...data, id }, { withCredentials: true });
            } else {
                await axios.post("/api/admin/manage-cars/cars", data, { withCredentials: true });
            }
            setGoToCars(true);
            toast.success('La voiture a été enregistrée avec succès !');
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
                setErrorMessageVisible(true);
                setTimeout(() => {
                    setErrorMessageVisible(false);
                }, 5000);
                toast.error('Une erreur est survenue lors de la sauvegarde de la voiture.');
            }
        }
    }

    if (goToCars) {
        router.push("/admin/dashboard/cars");
    }

    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            data.append("file", files[0]);
            data.append("id", id);
            try {
                const res = await axios.post("/api/admin/manage-cars/upload", data, { withCredentials: true });
                const { message, imagePath } = res.data;
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
            await axios.delete(`/api/admin/manage-cars/delete?id=${id}`, { withCredentials: true });
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

    function goBack (){
        router.push("/admin/dashboard/cars");
    }



    return (
        <div className="flex items-center justify-center min-w-full bg-gray-100">
            <ToastContainer />
            <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {id ? "Edit Car" : "Add Car"}
                </h2>
                <div className="flex">
                    <div className="flex flex-col items-center mr-8">
                        <div className="w-48 h-48 mb-4 relative">
                            {images.length > 0 && (
                                <img src={images[0]} alt="Car" className="w-full h-full object-cover rounded-lg" />
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
                            <label htmlFor="image" className=" text-blue-500 hover:text-blue-700 mx-1 cursor-pointer">
                                <FiPlus size={18} />
                            </label>
                            <button type="button" className="text-red-500 hover:text-red-700" onClick={deleteImage}>
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                    <form onSubmit={saveCar} className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
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
                            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
