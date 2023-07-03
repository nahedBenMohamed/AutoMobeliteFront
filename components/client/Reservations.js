import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {AiOutlineCalendar, AiOutlineClockCircle, AiOutlineEnvironment, AiOutlineHome, AiOutlineIdcard, AiOutlineMail, AiOutlinePhone, AiOutlineUser} from "react-icons/ai";
import {FaCar, FaEquals, FaMoneyBillWave} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSpring, animated } from 'react-spring';
import { DateRangePicker } from 'react-dates';
import moment from 'moment/moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import axios from "axios";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

function ReservationForm({ id }) {

    const [agencyName, setAgencyName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState([]);
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [carAvailability, setCarAvailability] = useState([]);
    const [selectedDates, setSelectedDates] = useState([moment(), moment()]);
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedReturnTime, setSelectedReturnTime] = useState('');
    const [focusedInput, setFocusedInput] = useState(null);
    const [name, setName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [numPermis, setNumPermis] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [step, setStep] = useState(1);
    const [clientInfo, setClientInfo] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios
                .get('/api/auth/AllCars?id='+id, { withCredentials: true })
                .then((response) => {
                    const carData = response.data;
                    setAgencyName(carData.Agency.name);
                    setBrand(carData.brand);
                    setPrice(carData.price.toString());
                    setImages(carData.image ? [carData.image] : []);
                    setAvailabilityDates(carData.availability.map((avail) => new Date(avail.date)));
                    setCarAvailability(carData.availability);
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
        const userToken = Cookies.get('authToken'); // Vérifiez le nom de votre cookie contenant le JWT
        if (userToken) {
            try {
                const decodedToken = jwt.decode(userToken);
                if (decodedToken) {
                    setClientInfo(decodedToken);
                    setName(decodedToken.name);
                    setFirstName(decodedToken.firstname);
                    setEmail(decodedToken.email);
                    setNumPermis(decodedToken.numPermis);
                    setTelephone(decodedToken.telephone);
                    setAddress(decodedToken.address);
                    setCity(decodedToken.city);
                }

            } catch (error) {
                console.log('Erreur de décodage du JWT :', error);
            }
        }
    }, []);

    const calculatePrice = () => {
        const pricePerDay = parseFloat(price);
        const differenceInDays = selectedDates.endDate
            ? (selectedDates.endDate.diff(selectedDates.startDate, 'days') )
            : 0;
        const totalPrice = pricePerDay * differenceInDays;

        return totalPrice.toFixed(1);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            carId:id,
            email,
            startDate: selectedDates.startDate.format(),
            endDate: selectedDates.endDate.format(),
            startTime: selectedStartTime,
            endTime: selectedReturnTime,
            total: parseFloat(calculatePrice()), // Ensure 'calculatePrice()' is defined and returns a number
            status: 'reserved',
        };
        try {
            const response = await axios.post(`/api/reservation/`, { ...data, id }, { withCredentials: true });
            if (response.status === 201) {
                console.log("Rental created successfully finally le Zeus!")
                await router.push("/");
            } else {
                console.error('Error creating rental:', response);
            }
        } catch (error) {
            console.error('Error creating rental:', error);
        }
    };

    const ProgressBar = ({ step }) => {
        const totalSteps = 3;
        const progress = (step / totalSteps) * 100;

        return (
            <div className=" w-full bg-gray-200 rounded h-2">
                <div
                    className="h-full text-center text-xs text-white bg-blue-500 rounded"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        );
    };
    const fade = useSpring({
        from: { opacity: 3 },
        to: { opacity: 6 },
        delay: 600,
    });

return(
    <form onSubmit={handleSubmit} className="mt-20 w-full mx-auto  p-6 rounded ">
        <ProgressBar step={step} />
        <div className="mt-4 text-center text-blue-600"> Etape {step}/3</div>
        {step === 1 && (
            <>

                <div className="mt-2 max-w-3xl mx-auto  p-6 rounded ">
                    <div className="mt-6 mx-auto flex flex-col md:flex-row">

                        <div className="-mt-4 md:w-1/2">
                            {images.length > 0 ? (
                                <img src={images[0]} alt="Car" className="w-full h-auto mb-6" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                    <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                                </div>
                            )}
                            <div className="bg-white p-5 rounded-lg shadow-lg flex flex-wrap justify-between items-start">
                                <div className="flex items-center  p-2 rounded-lg  mb-8 w-full md:w-auto md:flex-3">
                                    <FaCar size={20} className="text-blue-500" />
                                    <div className="ml-4">
                                        <p className="text-xl text-blue-700 font-bold">{brand}</p>
                                    </div>
                                </div>

                                <div className="flex items-center  p-2 rounded-lg  mb-6 w-full md:w-auto md:flex-2">
                                    <FaMoneyBillWave size={20} className="text-blue-500" />
                                    <div className="ml-4">
                                        <p className="text-xl text-blue-700 font-bold">{price} DT</p>
                                    </div>
                                </div>

                                <motion.div
                                    className=" flex items-center  p-2 rounded-lg shadow w-full md:w-auto md:flex-2"
                                    initial={{opacity: 0, y: -100}}
                                    animate={{opacity: 20, y: 0}}
                                    transition={{type: 'spring', stiffness: 90}}
                                >
                                    <FaEquals size={20} className="text-green-400" />
                                    <div className="ml-4">
                                        <p className="text-xl text-green-400 font-bold">{calculatePrice()} DT</p>
                                    </div>
                                </motion.div>
                            </div>

                        </div>
                        <div className="mt-12 md:w-1/2 md:pl-12">

                            <animated.div style={fade} className="-mt-8 mb-12 bg-blue-100 p-6 rounded-lg shadow">
                                <DateRangePicker
                                    startDate={selectedDates.startDate}
                                    startDateId="start_date_id"
                                    endDate={selectedDates.endDate}
                                    endDateId="end_date_id"
                                    onDatesChange={({ startDate, endDate }) => setSelectedDates({ startDate, endDate })}
                                    focusedInput={focusedInput}
                                    onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
                                    numberOfMonths={1}
                                    isOutsideRange={(day) => {
                                        // If the day is in availabilityDates, it's available (return false).
                                        // If it's not, it's unavailable (return true).
                                        return !availabilityDates.some(date =>
                                            date.getFullYear() === day.year() &&
                                            date.getMonth() === day.month() &&
                                            date.getDate() === day.date()
                                        );
                                    }}
                                />
                            </animated.div>
                            <animated.div style={fade} className="mb-8 bg-blue-100 p-6 rounded-lg shadow">
                                <div className="flex justify-between mb-6">
                                    <div className="w-1/2 pr-3">
                                        <div className="flex items-center mb-2">
                                            <AiOutlineCalendar className="mr-2" />
                                            <label className="text-gray-700">StartDate :</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={selectedDates.startDate ? selectedDates.startDate.format('DD/MM/YYYY') : ''}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="w-1/2 pl-2">
                                        <div className="flex items-center mb-2">
                                            <AiOutlineCalendar className="mr-2" />
                                            <label className="text-gray-700">EndDate :</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={selectedDates.endDate ? selectedDates.endDate.format('DD/MM/YYYY') : ''}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="w-1/2 pr-2">
                                        <div className="flex items-center mb-2">
                                            <AiOutlineClockCircle className="mr-2" />
                                            <label className="text-gray-700">Start time :</label>
                                        </div>
                                        <input
                                            type="time"
                                            value={selectedStartTime}
                                            onChange={(event) => setSelectedStartTime(event.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="w-1/2 pl-2">
                                        <div className="flex items-center mb-2">
                                            <AiOutlineClockCircle className="mr-2" />
                                            <label className="text-gray-700">End time :</label>
                                        </div>
                                        <input
                                            type="time"
                                            value={selectedReturnTime}
                                            onChange={(event) => setSelectedReturnTime(event.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </animated.div>
                        </div>
                    </div>



                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleNextStep}
                    >
                        Suivant
                    </button>
                </div>
            </>
        )}

        {step === 2 && (
            <div>
                {clientInfo && (
                    <>

                        <div className="mt-10 max-w-3xl mx-auto  p-6 rounded shadow-xl">
                            <h3 className=" text-center mb-4">Informations personnelles</h3>

                            <div className="flex flex-wrap -mx-2 mb-4">
                                <div className="w-full sm:w-1/2 px-2 mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(event) => setName(event.target.value)}
                                            required
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded pl-10"
                                        />
                                        <AiOutlineUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>
                                <div className="w-full sm:w-1/2 px-2 mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={firstname}
                                            onChange={(event) => setFirstName(event.target.value)}
                                            required
                                            placeholder="Enter your first name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded pl-10"
                                        />
                                        <AiOutlineUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>
                                <div className="w-full px-2 mb-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            required
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded pl-10"
                                        />
                                        <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>
                                <div className="w-full px-2 mb-4">
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={telephone}
                                            onChange={(event) => setTelephone(event.target.value)}
                                            required
                                            placeholder="Enter your phone number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded pl-10"
                                        />
                                        <AiOutlinePhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>
                                <div className="w-full px-2 mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(event) => setAddress(event.target.value)}
                                            required
                                            placeholder="Enter your address"
                                            className="w-full px-4 py-2 border border-gray-300 rounded pl-10"
                                        />
                                        <AiOutlineHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>
                                <div className="w-full px-2 mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(event) => setCity(event.target.value)}
                                            required
                                            placeholder="Enter your city"
                                            className="w-full px-4 py-2 border border-gray-300 rounded pl-10"
                                        />
                                        <AiOutlineEnvironment className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>
                                <div className="w-full px-2 mb-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={numPermis}
                                            onChange={(event) => setNumPermis(event.target.value)}
                                            required
                                            placeholder="Enter your driver's license number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded pl-10"
                                        />
                                        <AiOutlineIdcard className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>
                            </div>


                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    onClick={handlePreviousStep}
                                >
                                    Précédent
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    onClick={handleNextStep}
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}


        {step === 3 && (
            <>

                <h3 className="mt-12 text-center mb-6 text-lg font-bold">Recapitulatif</h3>
                <div className="mt-4  flex justify-between items-center  p-2 rounded-lg shadow">
                    <h3 className="  text-2xl text-black font-semibold">Agence</h3>
                    <p className="text-2xl text-black font-bold">{agencyName} </p>
                </div>
                <div className="mt-12 max-w-4xl mx-auto p-6 rounded ">
                    <div className="flex flex-col max-w-4xl md:flex-row">
                        <div className="-mt-2 md:w-1/3">
                            <img src={images} alt="" className="w-full h-auto mb-4 rounded" />
                        </div>
                        <div className="-mt-3 md:w-2/3 md:pl-4">

                            <div className="flex flex-wrap -mx-2">
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Prix initial:</h4>
                                        <p className="text-lg">{price} DT</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Dates de réservation:</h4>
                                        <p className="text-lg">  {selectedDates.startDate ? selectedDates.startDate.format('MM/DD/YYYY') : '...'} -
                                            {selectedDates.endDate ? selectedDates.endDate.format('MM/DD/YYYY') : '...'}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Heure de départ:</h4>
                                        <p className="text-lg">{selectedStartTime}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Heure de retour:</h4>
                                        <p className="text-lg">{selectedReturnTime}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Nom:</h4>
                                        <p className="text-lg">{name}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Prénom:</h4>
                                        <p className="text-lg">{firstname}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2 ">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2 ">Email:</h4>
                                        <p className="text-lg">{email}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Téléphone:</h4>
                                        <p className="text-lg">{telephone}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Adresse:</h4>
                                        <p className="text-lg">{address}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Ville:</h4>
                                        <p className="text-lg">{city}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Numéro de permis de conduire:</h4>
                                        <p className="text-lg">{numPermis}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Marque:</h4>
                                        <p className="text-lg">{brand}</p>
                                    </div>
                                </div>
                                <div className="w-full p-2">
                                    <div className="border p-4 rounded shadow">
                                        <h4 className="font-semibold mb-2">Total:</h4>
                                        <p className="text-lg text-green-600 ">{calculatePrice()} DT</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <button
                            type="button"
                            className="mr-20 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            onClick={handlePreviousStep}
                        >
                            Précédent
                        </button>
                        <button
                            type="button"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            Valider
                        </button>
                    </div>
                </div>

            </>
        )}
    </form>
);
}

export default ReservationForm;