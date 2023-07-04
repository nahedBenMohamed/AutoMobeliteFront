import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {differenceInCalendarDays, isSameDay} from "date-fns";


export default function RentalForm({ id }) {

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [price, setPrice] = useState("");
    const [registration, setRegistration] = useState("");
    const [status, setStatus] = useState("");
    const [email,setEmail] = useState('');
    const [startTime,setStartTime] =  useState('')
    const [endTime,setEndTime] = useState('')
    const [images, setImages] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [goToRental, setGoToRental] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState('reserved');

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };
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
                    setAvailabilityDates(carData.availability.map((avail) => new Date(avail.date)));
                    setRegistration(carData.registration);
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

    useEffect(() => {
        if (startDate && endDate) {
            const days = differenceInCalendarDays(endDate, startDate) + 1;
            setTotal(days * price);
        }
    }, [startDate, endDate, price]);

    async function rental(ev) {
        ev.preventDefault();

        if (!email || !startTime || !endTime || !startDate || !endDate) {
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
            carId:id,
            email,
            startTime,
            endTime,
            total,
            status: selectedStatus, // Ajoutez la valeur de selectedStatus à la propriété "status"
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
        };

        try {
            if (id) {
                await axios.post(`/api/admin/reservation/reservation/`, { ...data, id }, { withCredentials: true });
            } /*else {
                await axios.post("/api/admin/reservation/reservation" ,data, { withCredentials: true });
            }*/
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

    const handleDateChange = (date) => {
        if (!startDate) {
            setStartDate(date);
        } else if (!endDate && date > startDate) {
            setEndDate(date);
        } else {
            setStartDate(date);
            setEndDate(null);
        }
    };

    if (goToRental) {
        router.push("/admin/dashboard/reservations");
    }

    function goBack (){
        router.push("/admin/dashboard/reservations/new");
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
                    Create Rental
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="w-full h-48 mb-4 relative">
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
                                dayClassName={(date) =>
                                    availabilityDates.some((availableDate) => isSameDay(date, availableDate))
                                        ? 'available-day'
                                        : ''
                                }
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                    <form onSubmit={rental} className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
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
                                    placeholder="Car Status"
                                />
                            </div>
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(ev) => setEmail(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Email"
                                />
                            </div>
                            <div>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Start Date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="End Date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <input
                                    id="startHour"
                                    name="startHour"
                                    type="time"
                                    value={startTime}
                                    onChange={(ev) => setStartTime(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Start Hour"
                                />
                            </div>
                            <div>
                                <input
                                    id="endHour"
                                    name="endHour"
                                    type="time"
                                    value={endTime}
                                    onChange={(ev) => setEndTime(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="End Hour"
                                />
                            </div>
                            <div>
                                <select id="rentalStatus" value={selectedStatus} onChange={handleStatusChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="reserved">Reserved</option>
                                    <option value="ongoing">On going</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-xl font-bold">Total: {total} DT</p>
                        </div>
                        <div className="mt-8 flex justify-end">

                            <button
                                type="submit"
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Rental
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
