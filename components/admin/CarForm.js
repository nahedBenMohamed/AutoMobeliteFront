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
    const [fuel, setFuel] = useState("");
    const [door, setDoor] = useState("");
    const [gearBox, setGearBox] = useState("");
    const [images, setImages] = useState([]);
    const [startDate,setStartDate] =useState('')
    const [endDate,setEndDate] =useState('')
    const [parkingName, setParkingName] = useState("");
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [goToCars, setGoToCars] = useState(false);

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
                    setFuel(carData.fuel);
                    setDoor(carData.door.toString());
                    setGearBox(carData.gearBox);
                    setAvailabilityDates(carData.availability.map((avail) => new Date(avail.date)));
                })
                .catch((error) => {
                    if (error.response) {
                            toast.warning('An error occurred while loading data',
                            {
                                position: "top-center",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: false,
                                progress: undefined,
                                theme: "colored",
                            });
                    }
                });
        }
    }, [id]);


    async function saveCar(ev) {
        ev.preventDefault();

        if (!brand || !model || !year || !mileage || !price || !registration || !fuel || !door|| !gearBox|| !status) {
            toast.error('Please complete all fields.',
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            return;
        }

        const data = {
            brand,
            model,
            year: parseInt(year),
            mileage: parseInt(mileage),
            price: parseFloat(price),
            door: parseInt(door),
            fuel,
            gearBox,
            registration,
            status,
            description,
            startDate,
            endDate,
            image: images.length > 0 ? images[0] : null,
            parkingName: parkingName !== "" ? parkingName : null,
        };

        try {
            if (id) {
                await axios.put(`/api/admin/manage-cars/cars?id=${id}`, { ...data, id }, { withCredentials: true });
            } else {
                await axios.post("/api/admin/manage-cars/cars/" ,data, { withCredentials: true });
            }
            toast.success('The car has been successfully registered!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            setTimeout(() => {
                setGoToCars(true);
            }, 2000);
        } catch (error) {
            if (error.response) {
                toast.warning('An error occurred while saving the car',
                    {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    }

    if (goToCars) {
        router.push("/admin/dashboard/cars");
    }

    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            data.append("file", files[0]);
            data.append("id", id);
            try {
                const res = await axios.post("/api/admin/manage-cars/upload", data, {withCredentials: true});
                const {message, imagePath} = res.data;
                if (message === "Image uploaded successfully") {
                    setImages([imagePath]);
                    toast.info(res.data.message,
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                } else {
                    toast.warning("Upload failed",
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
            } catch (error) {
                if (error.response) {
                    toast.warning(error.response.data.error,
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
            }
        }
    }

    async function deleteImage() {
        if (images.length === 0) {
            toast.error("No image to delete", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        setImages([]);
        try {
            await axios.delete(`/api/admin/manage-cars/delete?id=${id}`, { withCredentials: true });
            toast.success("Image deleted successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            setImages([]);
        } catch (error) {
            if (error.response) {
                toast.error("An error occurred while deleting the image.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    }


    function goBack (){
        router.push("/admin/dashboard/cars");
    }

    return (
        <div className="flex items-center justify-center min-w-full bg-gray-100">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
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
                            <input type="file" id="image" name="image" onChange={uploadImage} hidden />
                            <label htmlFor="image" className="text-blue-500 hover:text-blue-700 mx-1 cursor-pointer">
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
                                    placeholder="Parking"
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
                                    placeholder="Registration"
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
                                    placeholder="Status"
                                />
                            </div>
                            { id && (
                                <>
                                    <div>
                                        <input
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={(ev) => setStartDate(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Start Date"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(ev) => setEndDate(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="End Date"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <input
                                    id="fuel"
                                    name="fuel"
                                    type="text"
                                    value={fuel}
                                    onChange={(ev) => setFuel(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Fuel"
                                />
                            </div>
                            <div>
                                <input
                                    id="door"
                                    name="door"
                                    type="number"
                                    value={door}
                                    onChange={(ev) => setDoor(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Door"
                                />
                            </div>
                            <div>
                                <input
                                    id="gearBox"
                                    name="gearBox"
                                    type="text"
                                    value={gearBox}
                                    onChange={(ev) => setGearBox(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Gear Box"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Availability:</label>
                                {availabilityDates.map((date, index) => (
                                    <div key={index}>
                                        {" "}
                                        {date.toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                ))}
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
