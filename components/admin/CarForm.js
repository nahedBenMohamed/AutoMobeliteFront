import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import Spinner from "@/components/admin/Spinner";
import Link from "next/link";

export default function CarForm({ id }) {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [price, setPrice] = useState("");
    const [registration, setRegistration] = useState("");
    const [status, setStatus] = useState("");
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [goToCars, setGoToCars] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [parkingName, setParkingName] = useState("");
    const [errorMessageVisible, setErrorMessageVisible] = useState(true);
    const router = useRouter();


    useEffect(() => {
        if (id) {
            axios
                .get(`/api/admin/cars?id=${id}`, { withCredentials: true })
                .then((response) => {
                    const carData = response.data;
                    setBrand(carData.brand);
                    setModel(carData.model);
                    setYear(carData.year.toString());
                    setMileage(carData.mileage.toString());
                    setPrice(carData.price.toString());
                    setStatus(carData.status);
                    setImages(carData.images)
                    setRegistration(carData.registration);
                    setParkingName(carData.parking.name);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    async function saveCar(ev) {
        ev.preventDefault();

        // Vérification des données côté client (facultatif)
        if ( !brand || !model || !year || !mileage || !price || !registration || !status ) {
            setErrorMessage("Veuillez remplir tous les champs.");
            setErrorMessageVisible(true); // Set this to true when you want to show the error message
            setTimeout(() => {
                setErrorMessageVisible(false); // Set this to false after 5 seconds
            }, 5000);
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
            images,
            parkingName,
        };

        try {
            if (id) {
                // Update car
                await axios.put("/api/admin/cars/", { ...data, id, parkingName},{ withCredentials: true });
            } else {
                // Create car
                await axios.post("/api/admin/cars", data,{ withCredentials: true });
            }
            setGoToCars(true);
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

    if (goToCars) {
        router.push("/admin/dashboard/cars");
    }

    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            data.append("id", id);
            try {
                const res = await axios.post("/api/admin/upload", data, { withCredentials: true });
                const { message, imagePath } = res.data;
                if (message === "Image uploaded successfully") {
                    setImages((oldImages) => [...oldImages, imagePath]);
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

    function updateImageOrder(images){
        setImages(images)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
                <div>
                        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            {id ? "Edit Car" : "Add Car"}
                        </h2>
                </div>
                <form onSubmit={saveCar} className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <input
                                id="parkingName"
                                name="parkingName"
                                type="text"
                                value={parkingName}
                                onChange={(ev) => setParkingName(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nom du parking"
                                defaultValue=""
                            />
                        </div>
                        <div>
                            <label htmlFor="brand" className="sr-only">
                                Brand
                            </label>
                            <input
                                id="brand"
                                name="brand"
                                type="text"
                                value={brand}
                                onChange={(ev) => setBrand(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Brand "
                            />
                        </div>
                        <div>
                            <label htmlFor="model" className="sr-only">
                                Model
                            </label>
                            <input
                                id="model"
                                name="model"
                                type="text"
                                value={model}
                                onChange={(ev) => setModel(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Model"
                            />
                        </div>
                        <div>
                            <label htmlFor="year" className="sr-only">
                                Year
                            </label>
                            <input
                                id="year"
                                name="year"
                                type="text"
                                value={year}
                                onChange={(ev) => setYear(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Year"
                            />
                        </div>
                        <div>
                            <label htmlFor="mileage" className="sr-only">
                                Mileage
                            </label>
                            <input
                                id="mileage"
                                name="mileage"
                                type="text"
                                value={mileage}
                                onChange={(ev) => setMileage(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mileage"
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="sr-only">
                                Price
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="text"
                                value={price}
                                onChange={(ev) => setPrice(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Price"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="sr-only">
                                Status
                            </label>
                            <input
                                id="status"
                                name="status"
                                type="text"
                                value={status}
                                onChange={(ev) => setStatus(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Status"
                            />
                        </div>
                        <div>
                            <label htmlFor="registration" className="sr-only">
                                Registration
                            </label>
                            <input
                                id="registration"
                                name="registration"
                                type="text"
                                value={registration}
                                onChange={(ev) => setRegistration(ev.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Registration"
                            />
                        </div>
                    </div>
                    <div className="mb-2 flex flex-wrap gap-2">
                        <ReactSortable
                            list={images}
                            className="flex flex-wrap gap-3"
                            setList={updateImageOrder}
                        >
                            {!!images?.length && images.map((images) => (
                                <div key={images} className="h-24">
                                    <img src={images} alt="" className="rounded-lg"/>
                                </div>
                            ))}
                        </ReactSortable>
                        {isUploading && (
                            <div className="h-24 p-1 flex items-center">
                                <Spinner />
                            </div>
                        )}
                        <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                />
                            </svg>

                            <div>Upload</div>
                            <input type="file" onChange={uploadImage} className="hidden" />
                        </label>
                    </div>
                    <div className="mt-2">
                        {errorMessageVisible && errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            type="submit"
                            className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3" />
                            Save
                        </button>
                        <Link
                            href={"/admin/dashboard/cars"}
                            type="button"
                            className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3" />
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
