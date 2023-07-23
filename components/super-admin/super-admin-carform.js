import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {FiPlus, FiTrash2} from "react-icons/fi";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isSameDay } from "date-fns";
import {BeatLoader} from "react-spinners";

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
    const [fuel, setFuel] = useState("");
    const [door, setDoor] = useState("");
    const [gearBox, setGearBox] = useState("");
    const [startDate,setStartDate] =useState(null)
    const [endDate,setEndDate] =useState(null)
    const [description, setDescription] = useState("");
    const [parkingName, setParkingName] = useState("");
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const [maintenanceDates, setMaintenanceDates] = useState([]);
    const [goToCars, setGoToCars] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (id) {
            axios
                .get("/api/super-admin/car-agence/cars?id=" + id, { withCredentials: true })
                .then((response) => {
                    const carData = response.data;
                    setAgencyName(carData.Agency.name);
                    setBrand(carData.brand);
                    setModel(carData.model);
                    setYear(carData.year.toString());
                    setMileage(carData.mileage.toString());
                    setPrice(carData.price.toString());
                    setDoor(carData.door.toString());
                    setFuel(carData.fuel);
                    setGearBox(carData.gearBox);
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
                    setDescription(carData.description);
                })
                .catch((error) => {
                        if (error.response) {
                            toast.warning('An error occurred while loading data',
                                {
                                    position: "top-center",
                                    autoClose: 3000,
                                    hideProgressBar: true,
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
        setIsLoading(true);

        // Vérification des données côté client (facultatif)
        if (!brand || !model || !year || !mileage || !price || !registration || !status) {
            toast.error('Please complete all fields.');
            setIsLoading(false);
            return;
        }
        const data = {
            agencyName: agencyName,
            brand,
            model,
            fuel,
            gearBox,
            registration,
            description,
            year: parseInt(year),
            mileage: parseInt(mileage),
            price: parseFloat(price),
            door: parseInt(door),
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            image: images.length > 0 ? images[0] : null,
            parkingName: parkingName !== "" ? parkingName : null,
        };

        try {
            if (id) {
                // Update car
                await axios.put("/api/super-admin/car-agence/cars", { ...data, id });
            } else {
                // Create car
                await axios.post("/api/super-admin/car-agence/cars", data);
            }
            toast.success('The car has been successfully registered!');
            setIsLoading(false);
            setTimeout(() => {
                setGoToCars(true);
            }, 2000);
        } catch (error) {
            if (error.response) {
                if (error.response.data.error) {
                    if (error.response.data.error === "Parking not found") {
                        toast.warning("Parking not found");
                        setIsLoading(false);
                        return;
                    } else if (error.response.data.error === "Invalid Parking name") {
                        toast.warning("Invalid Parking name");
                        setIsLoading(false);
                        return;
                    }
                }
                toast.error("Verify your informations");
                setIsLoading(false);
            }
        }
    }




    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            data.append("file", files[0]);
            data.append("id", id);
            try {
                const res = await axios.post("/api/super-admin/car-agence/upload", data);
                const {message, imagePath} = res.data;
                if (message === "Image uploaded successfully") {
                    setImages([imagePath]);
                    toast.info(res.data.message,
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
                else {
                    toast.warning("Upload failed",
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: true,
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
                            hideProgressBar: true,
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
                toast.error("No image to delete");
                return;
            }
            try {
                await axios.delete(`/api/super-admin/car-agence/delete?id=${id}`, {withCredentials: true});
                toast.success("Image deleted successfully!");
                setImages([]);
            } catch (error) {
                if (error.response) {
                    toast.error("An error occurred while deleting the image.");
                }
            }
        }


        if (goToCars) {
            router.push('/super-admin/dashboard/cars');
        }

    function goBack (){
        router.push("/super-admin/dashboard/cars");
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
            <div className="flex flex-col items-center justify-center max-w-6xl">
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop
                    closeOnClick={true}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={true}
                    pauseOnHover={false}
                    theme="colored"
                />
                <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
                    <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        {id ? "Edit Car" : "Add Car"}
                    </h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-full h-48 mb-4 relative">
                                {images.length > 0 ? (
                                    <img src={images[0]} alt="Car" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                        <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row space-x-2 mt-4">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={uploadImage}
                                    hidden
                                />
                                <label
                                    htmlFor="image"
                                    className="text-blue-500 hover:text-blue-700 mx-1 cursor-pointer"
                                >
                                    <FiPlus size={18} />
                                </label>
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={deleteImage}
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                            <div className="mt-8 mb-8">
                                <label className="mb-4 flex items-center text-sm font-medium text-gray-700">
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
                        <form onSubmit={saveCar} className="flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        id="agencyName"
                                        name="agencyName"
                                        type="text"
                                        value={agencyName}
                                        onChange={(ev) => setAgencyName(ev.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Agency Name"
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
                                { id && (
                                    <>
                                        <input
                                            type="text"
                                            value={startDate ? startDate.toLocaleDateString('fr-FR') : ''}
                                            onChange={(event) => setStartDate(new Date(event.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Start Date"
                                        />
                                        <input
                                            type="text"
                                            value={endDate ? endDate.toLocaleDateString('fr-FR') : ''}
                                            onChange={(event) => setEndDate(new Date(event.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="End date"
                                        />
                                    </>
                                )}
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
                                    className="uppercase ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    {isLoading ? "Wait" : id ? "Update" : "Save"}
                                    {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                                </button>
                                <button
                                    type="button"
                                    className="uppercase ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
