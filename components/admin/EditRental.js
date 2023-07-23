import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {eachDayOfInterval, isSameDay} from "date-fns";
import {FaCar} from "react-icons/fa";



export default function EditRental({ id }) {

    const [name, setName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [numPermis, setNumPermis] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [startTime,setStartTime] =  useState('')
    const [endTime,setEndTime] = useState('')
    const [images, setImages] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const [maintenanceDates, setMaintenanceDates] = useState([]);
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [goToRental, setGoToRental] = useState(false);
    const [total, setTotal] = useState(0);
    const [carId,setCarId] = useState(null);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [selectedStatus, setSelectedStatus] = useState('reserved');
    const router = useRouter();

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/admin/manage-reservation/reservation?id=${id}`, { withCredentials: true })
                .then((response) => {
                    const rentalData = response.data;
                    setName(rentalData.client.name);
                    setFirstName(rentalData.client.firstname);
                    setEmail(rentalData.client.email);
                    setAddress(rentalData.client.address);
                    setCity(rentalData.client.city);
                    setTelephone(rentalData.client.telephone);
                    setNumPermis(rentalData.client.numPermis);
                    setCarId(rentalData.car.id);
                    setSelectedStatus(rentalData.status);
                    setBrand(rentalData.car.brand);
                    setModel(rentalData.car.model);
                    setImages(rentalData.car.image ? [rentalData.car.image] : []);
                    setStartDate(rentalData.startDate ? new Date(rentalData.startDate) : null);
                    setEndDate(rentalData.endDate ? new Date(rentalData.endDate) : null);
                    setStartTime(rentalData.startTime ? new Date(rentalData.startTime).toLocaleTimeString() : null);
                    setEndTime(rentalData.endTime ? new Date(rentalData.endTime).toLocaleTimeString() : null);
                    const reservedDates = [];
                    let currentDate = new Date(rentalData.startDate);
                    const endDate = new Date(rentalData.endDate);
                    while (currentDate <= endDate) {
                        reservedDates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    // Récupérer les dates de maintenance
                    const maintenanceDates = rentalData.car.maintenances.reduce((dates, maintenance) => {
                        const startDate = new Date(maintenance.startDate);
                        const endDate = new Date(maintenance.endDate);
                        const maintenanceDates = eachDayOfInterval({ start: startDate, end: endDate });
                        return [...dates, ...maintenanceDates];
                    }, []);

                    // Récupérer les dates de disponibilité
                    const availabilityDates = rentalData.car.availability.map((availability) => new Date(availability.date));
                    setReservedDates(reservedDates);
                    setAvailabilityDates(availabilityDates);
                    setMaintenanceDates(maintenanceDates);
                    setTotal(rentalData.total);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    async function rental(ev) {
        ev.preventDefault();

        if (!email || !startTime || !endTime || !startDate || !endDate) {
            toast.error('Please complete all fields.');
            return;
        }

        const data = {
            rentalId: id,
            carId: setCarId,
            email,
            rentalStatus: selectedStatus,
        };

        try {
            if (id) {
                await axios.put(`/api/admin/manage-reservation/reservation/`, { ...data, id }, { withCredentials: true });
            }
            toast.success('rental status updated with success');
            setTimeout(() => {
                setGoToRental(true);
            }, 1000);
        } catch (error) {
            if (error.response) {
                if (error.response.data.error) {
                    if (error.response.data.error === "Parking not found") {
                        toast.warning("Parking not found");
                        return;
                    } else if (error.response.data.error === "Invalid Parking name") {
                        toast.warning("Invalid Parking name");
                        return;
                    }
                }
                toast.error("Verify your informations");
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
            <div className="flex-grow flex flex-col space-y-5 mr-4">
                <div className="uppercase ml-7 mt-4 mb-4 text-black text-xl font-extrabold">
                    Update Rental
                </div>
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <div className="flex flex-row justify-center items-center mt-4 mb-4 rounded-lg">
                        <form onSubmit={rental} className="flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="year" className="block text-xs mb-1">Name Client:</label>
                                    <div className="relative">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            disabled={true}
                                            value={name}
                                            onChange={(ev) => setName(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Name"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="year" className="block text-xs mb-1">FirstName Client:</label>
                                    <div className="relative">
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            type="text"
                                            disabled={true}
                                            value={firstname}
                                            onChange={(ev) => setFirstName(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="First Name"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="kilometer" className="block text-xs mb-1">Email Client:</label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            disabled={true}
                                            value={email}
                                            onChange={(ev) => setEmail(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Email"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="price" className="block text-xs mb-1">Address:</label>
                                    <div className="relative">
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            disabled={true}
                                            value={address}
                                            onChange={(ev) => setAddress(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Address"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="carStatus" className="block text-xs mb-1">Phone Client:</label>
                                    <div className="relative">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="phone"
                                            disabled={true}
                                            value={telephone}
                                            onChange={(ev) => setTelephone(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Telephone"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="gearBox" className="block text-xs mb-1">City Client:</label>
                                    <div className="relative">
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            disabled={true}
                                            value={city}
                                            onChange={(ev) => setCity(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="City"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="gearBox" className="block text-xs mb-1">Driver's Licence Client:</label>
                                    <div className="relative">
                                        <input
                                            id="numPermis"
                                            name="numPermis"
                                            type="text"
                                            disabled={true}
                                            value={numPermis}
                                            onChange={(ev) => setNumPermis(ev.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Num Permis"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="startDate" className="block text-xs mb-1">Start Date</label>
                                    <input
                                        type="text"
                                        value={startDate ? startDate.toLocaleDateString('fr-FR') : ''}
                                        onChange={(event) => setStartDate(new Date(event.target.value))}
                                        disabled={true}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Start Date"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="endDate" className="block text-xs mb-1">End Date</label>
                                    <input
                                        type="text"
                                        value={endDate ? endDate.toLocaleDateString('fr-FR') : ''}
                                        onChange={(event) => setEndDate(new Date(event.target.value))}
                                        disabled={true}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="End Date"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="door" className="block text-xs mb-1">Rental Status:</label>
                                    <div className="relative">
                                        <select id="rentalStatus" value={selectedStatus} onChange={handleStatusChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <option value="reserved">Reserved</option>
                                            <option value="ongoing">On going</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="uppercase ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    {id ? "Update" : "Save"}
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
                                excludeDates={[...reservedDates, ...maintenanceDates]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
