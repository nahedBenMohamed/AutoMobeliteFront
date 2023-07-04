import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {eachDayOfInterval, isSameDay} from "date-fns";



export default function MaintenanceEdit({ id }) {

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [images, setImages] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [price, setPrice] = useState("");
    const [goToRental, setGoToRental] = useState(false);
    const [reservedDates, setReservedDates] = useState([]);
    const [maintenanceDates, setMaintenanceDates] = useState([]);
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [total, setTotal] = useState(0);
    const [carId,setCarId] = useState(null);
    const [selectedCarStatus, setSelectedCarStatus] = useState('available');
    const [selectedStatus, setSelectedStatus] = useState('reserved');
    const router = useRouter();

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleCarStatusChange = (event) => {
        setSelectedCarStatus(event.target.value);
    };

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/admin/manage-maintenance/maintenance?id=${id}`, { withCredentials: true })
                .then((response) => {
                    const maintenanceData = response.data;
                    setCarId(maintenanceData.car.id);
                    setBrand(maintenanceData.car.brand);
                    setModel(maintenanceData.car.model);
                    setPrice(maintenanceData.cost);
                    setSelectedCarStatus(maintenanceData.car.status);
                    setImages(maintenanceData.car.image ? [maintenanceData.car.image] : []);

                    // Récupérer les dates de réservation
                    const reservedDates = maintenanceData.car.rentals.reduce((dates, rental) => {
                        const startDate = new Date(rental.startDate);
                        const endDate = new Date(rental.endDate);
                        const rentalDates = eachDayOfInterval({ start: startDate, end: endDate });
                        return [...dates, ...rentalDates];
                    }, []);
                    // Récupérer les dates de maintenance
                    const maintenanceDates = [];
                    let currentDate = new Date(maintenanceData.startDate);
                    const endDate = new Date(maintenanceData.endDate);
                    while (currentDate <= endDate) {
                        maintenanceDates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                    }

                    // Récupérer les dates de disponibilité
                    const availabilityDates = maintenanceData.car.availability.map((availability) => new Date(availability.date));
                    setReservedDates(reservedDates);
                    setAvailabilityDates(availabilityDates);
                    setMaintenanceDates(maintenanceDates);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    async function rental(ev) {
        ev.preventDefault();

        if (!startDate || !endDate) {
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
            rentalId: id,
            carId: setCarId,
            carStatus: selectedCarStatus,
        };

        try {
            if (id) {
                await axios.put(`/api/admin/manage-reservation/reservation/`, { ...data, id }, { withCredentials: true });
            }
            toast.success('reservation created with success', {
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
                setGoToRental(true);
            }, 2000);
        } catch (error) {
            if (error.response) {
                if (error.response.data.error) {
                    if (error.response.data.error === "Parking not found") {
                        toast.warning("Parking not found", {
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
                    } else if (error.response.data.error === "Invalid Parking name") {
                        toast.warning("Invalid Parking name", {
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
                }
                toast.error("Verify your informations", {
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

    if (goToRental) {
        router.push("/admin/dashboard/reservations");
    }

    function goBack (){
        router.push("/admin/dashboard/reservations");
    }

    return (
        <div className="flex flex-col items-center justify-center max-w-6xl">
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
            <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Update Maintenance
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="w-auto h-auto mb-4 relative">
                            {images.length > 0 ? (
                                <img src={images[0]} alt="Car" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                  <span className="text-gray-500 text-lg">
                                    <img src="/placeholder.png" alt="Placeholder" />
                                  </span>
                                </div>
                            )}
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
                                    { "reserved-day": reservedDates },
                                    { "available-day": availabilityDates },
                                    { "maintenance-day": maintenanceDates },
                                ]}
                                dayClassName={(date) =>
                                    reservedDates.some((reservedDate) => isSameDay(date, reservedDate))
                                        ? "reserved-day"
                                        : availabilityDates.some((availableDate) => isSameDay(date, availableDate))
                                            ? "available-day"
                                            : maintenanceDates.some((maintenanceDate) => isSameDay(date, maintenanceDate))
                                                ? "maintenance-day"
                                                : ""
                                }
                            />
                        </div>
                    </div>
                    <form onSubmit={rental} className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    disabled={true}
                                    value={brand}
                                    onChange={(ev) => setBrand(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Name"
                                />
                            </div>
                            <div>
                                <input
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    disabled={true}
                                    value={model}
                                    onChange={(ev) => setModel(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <DatePicker
                                    selected={startDate ? new Date(startDate) : null}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Start Date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    highlightDates={[
                                        { "reserved-day": reservedDates },
                                        { "maintenance-day": maintenanceDates },
                                        { "available-day": availabilityDates }
                                    ]}
                                    dayClassName={(date) =>
                                        reservedDates.some((reservedDate) => isSameDay(date, reservedDate))
                                            ? "reserved-day"
                                            : maintenanceDates.some((maintenanceDate) => isSameDay(date, maintenanceDate))
                                                ? "maintenance-day"
                                                : availabilityDates.some((availabilityDate) => isSameDay(date, availabilityDate))
                                                    ? "available-day"
                                                    : ""
                                    }
                                    filterDate={(date) =>
                                        !reservedDates.some((reservedDate) => isSameDay(date, reservedDate)) &&
                                        !maintenanceDates.some((maintenanceDate) => isSameDay(date, maintenanceDate))
                                    }
                                />
                            </div>
                            <div>
                                <DatePicker
                                    selected={endDate ? new Date(endDate) : null}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="End Date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    highlightDates={[
                                        { "reserved-day": reservedDates },
                                        { "maintenance-day": maintenanceDates },
                                        { "available-day": availabilityDates }
                                    ]}
                                    dayClassName={(date) =>
                                        reservedDates.some((reservedDate) => isSameDay(date, reservedDate))
                                            ? "reserved-day"
                                            : maintenanceDates.some((maintenanceDate) => isSameDay(date, maintenanceDate))
                                                ? "maintenance-day"
                                                : availabilityDates.some((availabilityDate) => isSameDay(date, availabilityDate))
                                                    ? "available-day"
                                                    : ""
                                    }
                                    filterDate={(date) =>
                                        !reservedDates.some((reservedDate) => isSameDay(date, reservedDate)) &&
                                        !maintenanceDates.some((maintenanceDate) => isSameDay(date, maintenanceDate))
                                    }
                                />
                            </div>
                            <div>
                                <label>Car status</label>
                                <select id="carStatus" value={selectedCarStatus} onChange={handleCarStatusChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="available">Available</option>
                                    <option value="rented">Rented</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-xl font-bold">Total Maintenance: {price} DT</p>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Update Maintenance
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
