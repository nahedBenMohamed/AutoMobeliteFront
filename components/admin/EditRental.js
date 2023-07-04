import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [goToRental, setGoToRental] = useState(false);
    const [total, setTotal] = useState(0);
    const [carId,setCarId] = useState(null);

    const [selectedCarStatus, setSelectedCarStatus] = useState('available');
    const [selectedStatus, setSelectedStatus] = useState('reserved');

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleCarStatusChange = (event) => {
        setSelectedCarStatus(event.target.value);
    };



    const router = useRouter();

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
                    setSelectedCarStatus(rentalData.car.status);
                    setImages(rentalData.car.image ? [rentalData.car.image] : []);
                    setStartDate(rentalData.startDate ? new Date(rentalData.startDate) : null);
                    setEndDate(rentalData.endDate ? new Date(rentalData.endDate) : null);
                    setStartTime(rentalData.startTime ? new Date(rentalData.startTime).toLocaleTimeString() : null);
                    setEndTime(rentalData.endTime ? new Date(rentalData.endTime).toLocaleTimeString() : null);
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
            email,
            rentalStatus: selectedStatus,
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
                    Update Rental
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
                                    value={name}
                                    onChange={(ev) => setName(ev.target.value)}
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
                                    value={firstname}
                                    onChange={(ev) => setFirstName(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
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
                            <div>
                                <DatePicker
                                    selected={startDate ? new Date(startDate) : null}
                                    disabled={true}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Start Date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <DatePicker
                                    selected={endDate ? new Date(endDate) : null}
                                    disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
                                    value={endTime}
                                    onChange={(ev) => setEndTime(ev.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="End Hour"
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
                            <div>
                                <label>Rental status</label>
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
                                Update Rental
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
