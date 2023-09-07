import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {FiPlus, FiTrash2} from "react-icons/fi";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isSameDay } from 'date-fns';

import {FaCar} from "react-icons/fa";
import {BeatLoader} from "react-spinners";



export default function Carform({ id }) {

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [price, setPrice] = useState("");
    const [registration, setRegistration] = useState("");
    const [images, setImages] = useState([]);
    const [fuel, setFuel] = useState("");
    const [door, setDoor] = useState("");
    const [gearBox, setGearBox] = useState("");
    const [startDate,setStartDate] =useState('')
    const [endDate,setEndDate] =useState('')
    const [description, setDescription] = useState("");
    const [parkingName, setParkingName] = useState("");
    const [goToCars, setGoToCars] = useState(false);
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const [maintenanceDates, setMaintenanceDates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get("/api/admin/manage-cars/cars?id=" + id, { withCredentials: true })
                .then((response) => {
                    const carData = response.data;
                    setBrand(carData.brand);
                    setModel(carData.model);
                    setYear(carData.year.toString());
                    setMileage(carData.mileage.toString());
                    setPrice(carData.price.toString());
                    setDoor(carData.door.toString());
                    setFuel(carData.fuel);
                    setGearBox(carData.gearBox);
                    setDescription(carData.description);
                    setImages(carData.image ? [carData.image] : []);
                    setAvailabilityDates(carData.availability.map((avail) => new Date(avail.date)));
                    const reservedDates = [];
                    for (const rental of carData.rentals) {
                        let date = new Date(rental.startDate);
                        let endDate = new Date(rental.endDate);
                        while (date <= endDate) {
                            reservedDates.push(new Date(date));
                            date.setDate(date.getDate() + 1);
                        }
                    }
                    const maintenanceDates = [];
                    for (const maintenance of carData.maintenances) {
                        let date = new Date(maintenance.startDate);
                        let endDate = new Date(maintenance.endDate);
                        while (date <= endDate) {
                            maintenanceDates.push(new Date(date));
                            date.setDate(date.getDate() + 1);
                        }
                    }

                    setMaintenanceDates(maintenanceDates);
                    setReservedDates(reservedDates);
                    setRegistration(carData.registration);
                    setParkingName(carData.parking.name);
                })
                .catch((error) => {
                    if (error.response) {
                        toast.warning("An error occurred while loading data");
                    }
                });
        }
    }, [id]);


    async function saveCar(ev) {
        ev.preventDefault();
        setIsLoading(true);

        if (!brand || !model || !year || !mileage || !price || !registration || !fuel || !door|| !gearBox) {
            toast.error('Please complete all fields.');
            setIsLoading(false);
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
            description,
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            image: images.length > 0 ? images[0] : null,
            parkingName: parkingName !== "" ? parkingName : null,
        };

        try {
            if (id) {
                await axios.put(`/api/admin/manage-cars/cars?id=${id}`, { ...data, id }, { withCredentials: true });
            } else {
                await axios.post("/api/admin/manage-cars/cars/" ,data, { withCredentials: true });
            }
            toast.success('The car has been successfully registered!');
            setIsLoading(false);
            setTimeout(() => {
                setGoToCars(true);
            }, 1000);
        } catch (error) {
            if (error.response) {
                if (error.response.data.error) {
                    toast.warning(error.message);
                    setIsLoading(false);
                    return;
                    }
                }
            toast.error(error.message);
            setIsLoading(false);
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
                    toast.info(res.data.message);
                } else {
                    toast.warning("Upload failed");
                }
            } catch (error) {
                if (error.response) {
                    toast.warning(error.response.data.error);
                }
            }
        }
    }

    async function deleteImage() {
        if (images.length === 0) {
            toast.error("No image to delete");
            return;
        }
        setImages([]);
        try {
            await axios.delete(`/api/admin/manage-cars/delete?id=${id}`, { withCredentials: true });
            toast.success("Image deleted successfully!");
            setImages([]);
        } catch (error) {
            if (error.response) {
                toast.error("An error occurred while deleting the image.");
            }
        }
    }


    function goBack (){
        router.push("/admin/dashboard/cars");
    }

    const handleDateChange = (date) => {
        if (!startDate) {
            setStartDate(date);
        } else if (!endDate && date > startDate) {
            let currentDate = new Date(startDate);
            let nextDate = new Date(startDate);
            nextDate.setDate(nextDate.getDate() + 1);

            while (currentDate < date) {
                const isReserved = reservedDates.some((reservedDate) =>
                    isSameDay(nextDate, reservedDate)
                );
                const isMaintenance = maintenanceDates.some((maintenanceDate) =>
                    isSameDay(nextDate, maintenanceDate)
                );

                if (isReserved || isMaintenance) {
                    setEndDate(null);
                    return;
                }

                currentDate.setDate(currentDate.getDate() + 1);
                nextDate.setDate(nextDate.getDate() + 1);
            }

            setEndDate(currentDate);
        } else {
            setStartDate(date);
            setEndDate(null);
        }
    };

    return (
        <div className="flex">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
            <div className="flex-grow flex flex-col space-y-5 -ml-7 mr-8">
                <div className="uppercase ml-7 mt-4 mb-4 text-black text-xl font-extrabold">
                    {id ? "edit your car informations" : "put your car informations"}
                </div>
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <div className="flex flex-row justify-center items-center mt-4 mb-4 rounded-lg">
                        <form onSubmit={saveCar} className="flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="parkingName" className="block text-xs mb-1">Parking:</label>
                                    <div className="relative">
                                        <input
                                            id="parkingName"
                                            value={parkingName}
                                            onChange={(ev) => setParkingName(ev.target.value)}
                                            placeholder="Parking"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="brand" className="block text-xs mb-1">Brand:</label>
                                    <div className="relative">
                                        <input
                                            id="brand"
                                            value={brand}
                                            onChange={(ev) => setBrand(ev.target.value)}
                                            placeholder="brand"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="model" className="block text-xs mb-1">Model:</label>
                                    <div className="relative">
                                        <input
                                            id="model"
                                            value={model}
                                            onChange={(ev) => setModel(ev.target.value)}
                                            placeholder="model"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="year" className="block text-xs mb-1">Year:</label>
                                    <div className="relative">
                                        <input
                                            id="year"
                                            value={year}
                                            onChange={(ev) => setYear(ev.target.value)}
                                            placeholder="year"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="kilometer" className="block text-xs mb-1">Kilometer:</label>
                                    <div className="relative">
                                        <input
                                            id="kilometer"
                                            value={mileage}
                                            onChange={(ev) => setMileage(ev.target.value)}
                                            placeholder="kilometer"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="price" className="block text-xs mb-1">Price:</label>
                                    <div className="relative">
                                        <input
                                            id="price"
                                            value={price}
                                            onChange={(ev) => setPrice(ev.target.value)}
                                            placeholder="price"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="matricule" className="block text-xs mb-1">Registration:</label>
                                    <div className="relative">
                                        <input
                                            id="matricule"
                                            value={registration}
                                            onChange={(ev) => setRegistration(ev.target.value)}
                                            placeholder="Registration"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                {id && (
                                    <>
                                        <div className="mb-4">
                                            <label htmlFor="startDate" className="block text-xs mb-1">Start Availability Date</label>
                                            <input
                                                type="text"
                                                value={startDate ? startDate.toLocaleDateString('fr-FR') : ''}
                                                onChange={(event) => setStartDate(new Date(event.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Start Date"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="endDate" className="block text-xs mb-1">End Availability Date</label>
                                            <input
                                                type="text"
                                                value={endDate ? endDate.toLocaleDateString('fr-FR') : ''}
                                                onChange={(event) => setEndDate(new Date(event.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="End Date"
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="mb-4">
                                    <label htmlFor="gearBox" className="block text-xs mb-1">Gear Box:</label>
                                    <div className="relative">
                                        <input
                                            id="gearBox"
                                            value={gearBox}
                                            onChange={(ev) => setGearBox(ev.target.value)}
                                            placeholder="Gear Box"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="fuel" className="block text-xs mb-1">Fuel:</label>
                                    <div className="relative">
                                        <input
                                            id="fuel"
                                            value={fuel}
                                            onChange={(ev) => setFuel(ev.target.value)}
                                            placeholder="fuel"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="door" className="block text-xs mb-1">Door:</label>
                                    <div className="relative">
                                        <input
                                            id="door"
                                            value={door}
                                            onChange={(ev) => setDoor(ev.target.value)}
                                            placeholder="door"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white h-48 p-5 rounded-lg">
                                <div className="flex flex-col h-full">
                                    <div className="relative overflow-auto">
                                        <label htmlFor="door" className="block text-xs mb-1">Description:</label>
                                      <textarea
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                          value={description}
                                          onChange={(ev) => setDescription(ev.target.value)}
                                          rows={5}
                                          placeholder="Enter a description..."
                                      />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="uppercase ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    onClick={goBack}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="uppercase ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    {isLoading ? "Wait" : id ? "Update" : "Save"}
                                    {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex-grow-0">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className=" justify-items-center mt-4 w-full h-full">
                        <div className=" justify-items-center mt-4 w-full h-full">
                            {images.length > 0 ? (
                                <img src={images[0]} alt="Car" className="max-w-56 max-h-56 mb-4 rounded-lg" />
                            ) : (
                                <div className="max-w-56 max-h-56 flex items-center justify-center bg-gray-200 rounded-lg">
                                    <img src="/placeholder.png" alt="img" className="w-1/2" />
                                </div>
                            )}
                            <div className="mt-4 flex items-center">
                                <FaCar size={20} className="text-blue-500" />
                                <p className="ml-2 text-xl text-blue-700 font-bold">{brand}</p>
                            </div>
                            <div className="flex flex-col mb-4">
                                <p className="ml-2 text-sm">{model}</p>
                            </div>
                            {id ? (
                                <div className="-mt-16 flex flex-row-reverse">
                                    <div className="mt-1 mr-4">
                                        <input type="file" id="image" name="image" onChange={uploadImage} hidden />
                                        <label htmlFor="image" className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                            <FiPlus size={18} />
                                        </label>
                                    </div>
                                    <button type="button" className="mr-2 text-red-500 hover:text-red-700" onClick={deleteImage}>
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="mt-16 mb-16">
                        <label className="mt-4 mb-4 flex items-center text-sm font-medium text-gray-700">
                            Availability:
                            <div className="flex flex-row space-x-2 ml-2">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <p className="text-sm font-medium">Open</p>
                                <div className="w-4 h-4 bg-red-500 rounded-full ml-2"></div>
                                <p className="text-sm font-medium">Close</p>
                                <div className="w-4 h-4 bg-yellow-500 rounded-full ml-2"></div>
                                <p className="text-sm font-medium">Maintenance</p>
                            </div>
                        </label>
                        <div className="flex flex-row justify-center items-center mt-8 mb-8 rounded-lg">
                            <DatePicker
                                selected={null}
                                inline
                                minDate={new Date()}
                                highlightDates={[
                                    {
                                        selectable: false,
                                        startDate,
                                        endDate,
                                        dates: availabilityDates.filter((date) =>
                                            isSameDay(date, startDate) || isSameDay(date, endDate)
                                        ),
                                    },
                                    {
                                        selectable: true,
                                        dates: availabilityDates,
                                    },
                                ]}
                                dayClassName={(date) => {
                                    if (reservedDates.some((reservedDate) => isSameDay(date, reservedDate))) {
                                        return "reserved-day";
                                    } else if (
                                        maintenanceDates.some((maintenanceDate) => isSameDay(date, maintenanceDate))
                                    ) {
                                        return "maintenance-day";
                                    } else if (
                                        availabilityDates.some((availableDate) => isSameDay(date, availableDate))
                                    ) {
                                        return "available-day";
                                    } else {
                                        return "unavailable-day"; // Ajout d'une classe pour les jours non disponibles
                                    }
                                }}
                                onChange={handleDateChange}
                                excludeDates={[...reservedDates, ...maintenanceDates]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}