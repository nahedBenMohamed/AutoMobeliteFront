import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    AiOutlineCalendar, AiOutlineClockCircle,
    AiOutlineEnvironment,
    AiOutlineHome,
    AiOutlineIdcard,
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineUser
} from "react-icons/ai";
import Link from "next/link";

function ReservationForm() {
    const router = useRouter();
    const { id, image, price,brand,Agency } = router.query;

    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedReturnTime, setSelectedReturnTime] = useState('');
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (id && image && price && brand && Agency) {
            // setCarDetails ici
        }
    }, [id, image, price, brand , Agency]);

    const calculatePrice = () => {
        const pricePerDay = parseFloat(price);
        const differenceInDays = (selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24);
        const totalPrice = pricePerDay * differenceInDays;

        return totalPrice.toFixed(2);
    };

    const handleDateChange = (date) => {
        setSelectedDates(date);
    };

    const handleStartTimeChange = (event) => {
        setSelectedStartTime(event.target.value);
    };

    const handleReturnTimeChange = (event) => {
        setSelectedReturnTime(event.target.value);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Ajoutez ici la logique de gestion de la réservation
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
return(
    <form onSubmit={handleSubmit} className="mt-20 max-w-4xl mx-auto bg-white p-6 rounded shadow-lg">
        {/*<ProgressBar step={step} />*/}
        <div className="text-center text-blue-600"> Etape {step}/3</div>
        {step === 1 && (
            <>

                <div className="mt-2 max-w-4xl mx-auto  p-6 rounded ">
                    <div className="mt-6 mx-auto flex flex-col md:flex-row">

                        <div className="md:w-1/2">
                            <img src={image} alt="" className="w-full h-auto mb-6" />
                            <div className="mt-4 flex justify-between items-center bg-blue-100 p-2 rounded-lg shadow mb-6">
                                <h3 className="text-2xl text-blue-500 font-semibold">Marque</h3>
                                <p className="text-2xl text-blue-700 font-bold">{brand} </p>
                            </div>
                            <div className="flex justify-between items-center bg-blue-100 p-2 rounded-lg shadow mb-6">
                                <h3 className="text-2xl text-blue-500 font-semibold">Prix initial</h3>
                                <p className="text-2xl text-blue-700 font-bold">{price} DT</p>
                            </div>

                            <div className="flex justify-between items-center bg-red-100 p-2 rounded-lg shadow">
                                <h3 className="text-2xl text-red-500 font-semibold">Total</h3>
                                <p className="text-2xl text-red-500 font-bold">{calculatePrice()} DT</p>
                            </div>



                        </div>
                        <div className="mt-4 md:w-1/2 md:pl-12">
                            <div className="mb-12 flex">
                                <div className="w-1/2 pr-2">
                                    <div className="flex items-center mb-2">
                                        <AiOutlineCalendar className="mr-2" />
                                        <label className="text-gray-700">StartDate :</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={selectedDates[0].toLocaleDateString()}
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
                                        value={selectedDates[1].toLocaleDateString()}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                            <div className="mb-12 flex">
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
                            <div className="mb-12">
                                <Calendar
                                    selectRange
                                    onChange={handleDateChange}
                                    value={selectedDates}
                                    className="border border-gray-300 rounded p-4 w-full"
                                />
                            </div>
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
            <>
                <div className="mt-10 max-w-xl mx-auto bg-white p-6 rounded shadow-lg">
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
                                    value={firstName}
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
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value)}
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
                                    value={licenseNumber}
                                    onChange={(event) => setLicenseNumber(event.target.value)}
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

        {step === 3 && (
            <>

                <h3 className="mt-12 text-center mb-6 text-lg font-bold">Recapitulatif</h3>
                <div className="mt-4 flex justify-between items-center  p-2 rounded-lg shadow">
                    <h3 className="text-2xl text-black font-semibold">Agence</h3>
                    <p className="text-2xl text-black font-bold">{Agency} </p>
                </div>
            <div className="mt-12 max-w-4xl mx-auto p-6 rounded ">
                <div className="flex flex-col max-w-4xl md:flex-row">
                    <div className="-mt-2 md:w-1/3">
                        <img src={image} alt="" className="w-full h-auto mb-4 rounded" />
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
                                    <p className="text-lg">{selectedDates[0].toLocaleDateString()} - {selectedDates[1].toLocaleDateString()}</p>
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
                                    <p className="text-lg">{firstName}</p>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-2">
                                <div className="border p-4 rounded shadow">
                                    <h4 className="font-semibold mb-2">Email:</h4>
                                    <p className="text-lg">{email}</p>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-2">
                                <div className="border p-4 rounded shadow">
                                    <h4 className="font-semibold mb-2">Téléphone:</h4>
                                    <p className="text-lg">{phone}</p>
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
                                    <p className="text-lg">{licenseNumber}</p>
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
                        onClick={handleNextStep}
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
