import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import {AiOutlineClockCircle} from "react-icons/ai";
import {FaCalendar, FaCar, FaEquals, FaMoneyBillWave} from "react-icons/fa";
import { motion } from "framer-motion";
import { DateRangePicker } from 'react-dates';
import moment from 'moment/moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import axios from "axios";
import {toast} from "react-toastify";
import 'boxicons/css/boxicons.min.css';
import {BeatLoader} from "react-spinners";

function ReservationEditStep2() {

    const router = useRouter();
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("")
    const [carPrice, setCarPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('')
    const [availabilityDates, setAvailabilityDates] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState([moment(), moment()]);
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedReturnTime, setSelectedReturnTime] = useState('');
    const [focusedInput, setFocusedInput] = useState(null);
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(false);
    const [isDelivery, setIsDelivery] = useState(true);
    const delivery = isDelivery ? 20 : 0;

    useEffect(() => {
        if (id) {
            axios
                .get('/api/client/reservation?id='+id, )
                .then((response) => {
                    const rentalData = response.data;
                    setModel(rentalData.car.model)
                    setBrand(rentalData.car.brand);
                    setCarPrice(rentalData.car.price);
                    setDescription(rentalData.car.description);
                    setImages(rentalData.car.image ? [rentalData.car.image] : []);
                    setAvailabilityDates(rentalData.car.availability.map((avail) => new Date(avail.date)));
                    const reservedDates = [];
                    for (const rental of rentalData.rentals) {
                        let date = new Date(rental.startDate);
                        let endDate = new Date(rental.endDate);
                        while (date <= endDate) {
                            reservedDates.push(new Date(date));
                            date.setDate(date.getDate() + 1);
                        }
                    }
                    setReservedDates(reservedDates);
                })
                .catch((error) => {
                    if (error.response) {
                        toast.warning('An error occurred while loading data');
                    }
                });
        }
    }, [id]);

    const isOutsideRangeStart = (day) => {
        const isBeforeToday = day.isBefore(moment().startOf('day'));
        const isReserved = reservedDates.some((date) =>
            date.getFullYear() === day.year() &&
            date.getMonth() === day.month() &&
            date.getDate() === day.date()
        );
        const isAvailable = availabilityDates.some((date) =>
            date.getFullYear() === day.year() &&
            date.getMonth() === day.month() &&
            date.getDate() === day.date()
        );

        return isBeforeToday || isReserved || !isAvailable;
    };

    const isOutsideRangeEnd = (day) => {
        const isBeforeToday = day.isBefore(moment().startOf('day'));
        const isReserved = reservedDates.some((date) =>
            date.getFullYear() === day.year() &&
            date.getMonth() === day.month() &&
            date.getDate() === day.date()
        );

        if (isReserved) {
            return true; // Désactive tous les jours après la première date indisponible
        }

        const startDate = selectedDates.startDate;
        const maxEndDate = moment(startDate).add(1, 'year'); // Date de fin maximale (1 an après la date de début choisie)
        const currentDate = moment(startDate);
        while (currentDate.isSameOrBefore(maxEndDate, 'day')) {
            const currentDay = currentDate.toDate();
            const isAvailable = availabilityDates.some((date) =>
                date.getFullYear() === currentDay.getFullYear() &&
                date.getMonth() === currentDay.getMonth() &&
                date.getDate() === currentDay.getDate()
            );

            if (!isAvailable) {
                break; // Arrête la boucle si on atteint la première date indisponible
            }

            if (currentDay.getFullYear() === day.year() &&
                currentDay.getMonth() === day.month() &&
                currentDay.getDate() === day.date()) {
                return false; // Le jour est disponible et ne doit pas être désactivé
            }

            currentDate.add(1, 'day'); // Passe au jour suivant
        }

        return true; // Désactive tous les jours après la première date indisponible
    };

    const calculatePrice = () => {
        const pricePerDay = parseFloat(carPrice);
        const differenceInDays = selectedDates.endDate
            ? (selectedDates.endDate.diff(selectedDates.startDate, 'days') )
            : 0;
        const totalPrice = pricePerDay * differenceInDays + delivery;
        return totalPrice.toFixed(1);
    };

    const totalPrice = calculatePrice();


    function generateTimeOptions(startHour, endHour, interval) {
        const options = [];

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += interval) {
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                const time = `${formattedHour}:${formattedMinute}`;
                options.push(
                    <option key={time} value={time}>
                        {time}
                    </option>
                );
            }
        }

        return options;
    }

    function goBack (){
        router.push(`/reservations/edit/step1?id=${id}`);
    }
    const goStep3 = () => {
        setIsLoading(true);
        const query = `pickupDate=${selectedDates.startDate.format('YYYY-MM-DD')}&returnDate=${selectedDates.endDate.format('YYYY-MM-DD')}&pickupTime=${selectedStartTime}&returnTime=${selectedReturnTime}&totalPrice=${totalPrice}`;
        router.push(`/reservations/edit/step3?id=${id}&${query}`);
    };

    const isDataComplete =   selectedDates.startDate && selectedDates.endDate && selectedStartTime && selectedReturnTime;

    return(
        <div className="flex">
            <div className="flex-grow flex flex-col space-y-5 mt-4 ml-16 mr-8">
                <div className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
                    <h1>CHOOSE YOUR new OPTIONS</h1>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <p>Add dates to see the price.</p>
                    <div className="flex flex-row justify-center items-center mt-4 mb-4 rounded-lg">
                        <DateRangePicker
                            startDate={selectedDates.startDate}
                            startDateId="start_date_id"
                            endDate={selectedDates.endDate}
                            endDateId="end_date_id"
                            onDatesChange={({ startDate, endDate }) => setSelectedDates({ startDate, endDate })}
                            focusedInput={focusedInput}
                            onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
                            numberOfMonths={1}
                            isOutsideRange={focusedInput === 'startDate' ? isOutsideRangeStart : isOutsideRangeEnd}
                            dayClassName={({ date }) => {
                                const isSelected =
                                    selectedDates.startDate &&
                                    selectedDates.endDate &&
                                    date.isSameOrAfter(selectedDates.startDate) &&
                                    date.isSameOrBefore(selectedDates.endDate);
                                const isStartDay = selectedDates.startDate && date.isSame(selectedDates.startDate, 'day');
                                const isEndDay = selectedDates.endDate && date.isSame(selectedDates.endDate, 'day');
                                const isInRange =
                                    selectedDates.startDate &&
                                    selectedDates.endDate &&
                                    date.isAfter(selectedDates.startDate) &&
                                    date.isBefore(selectedDates.endDate);

                                const classNames = ['DateRangePicker__day'];
                                if (isSelected) classNames.push('DateRangePicker__day--selected');
                                if (isStartDay) classNames.push('DateRangePicker__day--start');
                                if (isEndDay) classNames.push('DateRangePicker__day--end');
                                if (isInRange) classNames.push('DateRangePicker__day--in-range');

                                return classNames.join(' ');
                            }}
                        />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="mb-4">Select time</h2>
                    <div className="flex flex-row items-center mt-2">
                        <div className="flex items-center">
                            <AiOutlineClockCircle className="mr-2 text-blue-500"/>
                            <label className="text-gray-700 mr-2">Start time:</label>
                        </div>
                        <select
                            value={selectedStartTime}
                            onChange={(event) => setSelectedStartTime(event.target.value)}
                            required
                            className="appearance-none w-32 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">-- --</option>
                            {generateTimeOptions(8, 22, 15)}
                        </select>
                        <div className="flex items-center ml-4">
                            <AiOutlineClockCircle className="mr-2 text-blue-500"/>
                            <label className="text-gray-700 mr-2">End time:</label>
                        </div>
                        <select
                            value={selectedReturnTime}
                            onChange={(event) => setSelectedReturnTime(event.target.value)}
                            required
                            className="appearance-none w-32 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-center"
                        >
                            <option value="">-- --</option>
                            {generateTimeOptions(8, 22, 15)}
                        </select>
                    </div>
                    <div className=" mt-8 flex text-justify text-sm">
                        <p>
                            Dear user, please note that it is imperative to
                            specify the exact hours for your rental.
                            We kindly ask you to provide precise details of the
                            start and end times of your rental period.
                        </p>
                    </div>
                </div>
                <div className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
                    <h1>description</h1>
                </div>
                <div className="bg-white h-48 p-5 rounded-lg shadow-lg">
                    <div className="flex flex-col h-full">
                        <div className="overflow-auto">
                            <p className="text-justify mt-4">{description}</p>
                        </div>
                    </div>
                </div>
                <motion.div
                    className="flex mt-4 mb-4"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 20, y: 0 }}
                    transition={{ type: 'spring', stiffness: 90 }}
                >
                    <button
                        onClick={goBack}
                        className="uppercase w-32 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        back
                    </button>
                </motion.div>
            </div>
            <div className="flex-grow-0 mr-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="uppercase text-center mt-4 mb-4 text-black text-xl font-extrabold">
                        <h2>Your new order</h2>
                    </div>
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
                    <div className="flex items-center">
                        <FaCalendar size={20} className="text-blue-500" />
                        <div className="h-4 mx-2"></div>
                        <p className="text-lg">Options selected </p>
                    </div>
                    <div className="flex items-center mt-4">
                        <i className=' text-blue-500 bx bx-map'></i>
                        <div className="border-l h-8 mx-2"></div>
                        <p className="text-xl">
                            {selectedDates.startDate ? moment(selectedDates.startDate).format('DD MMMM') : ''}, {selectedStartTime}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <i className='text-blue-500 bx bxs-map-pin'></i>
                        <div className="border-l h-8 mx-2"></div>
                        <p className="text-xl">
                            {selectedDates.endDate ? moment(selectedDates.endDate).format('DD MMMM') : ''}, {selectedReturnTime}
                        </p>
                    </div>
                    <hr className="my-4" />
                    <h3 className="text-lg text-black font-extrabold  mb-2">Trajets :</h3>
                    <div className="flex flex-col">
                        <div className="mt-2 text-gray-600 flex items-center">
                            Delivery and collection : {delivery}
                            <FaMoneyBillWave size={20} className="ml-4 text-blue-500" />
                            <label
                                htmlFor="toggleB"
                                className="flex items-center ml-4 cursor-pointer"
                            >
                                <div className="relative">
                                    <input
                                        id="toggleB"
                                        type="checkbox"
                                        className="hidden"
                                        checked={isDelivery}
                                        onChange={(e) => setIsDelivery(e.target.checked)}
                                    />
                                    <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                                    <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 top-0 transition"></div>
                                </div>
                            </label>
                        </div>
                        <p className="mt-2 text-gray-600 flex items-center">
                            Vehicle location : {carPrice}  <FaMoneyBillWave size={20} className="ml-4 text-blue-500" />
                        </p>
                    </div>

                    <hr className="my-4" />
                    <div className="flex flex-col">
                        <motion.div
                            className="flex items-center p-2 rounded-lg w-full"
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 20, y: 0 }}
                            transition={{ type: 'spring', stiffness: 90 }}
                        >
                            <h3 className="text-lg text-black font-extrabold mt-2 mb-2 mr-4">TOTAL </h3>
                            <FaEquals size={20} className="text-blue-400" />
                            <div className="ml-4">
                                <p className="text-xl text-blue-400 font-bold">{calculatePrice()} DT</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex justify-center mt-4 mb-4"
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 20, y: 0 }}
                            transition={{ type: 'spring', stiffness: 90 }}
                        >
                            <button
                                onClick={goStep3}
                                className={`uppercase w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 ${!isDataComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!isDataComplete}
                            >
                                {isLoading ? "Ongoing..." : "Continue"}
                                {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                            </button>
                        </motion.div>
                        <div className="flex text-sm">
                            <p>A deposit of 300DT will be requested automatically on the day of your rental</p>
                        </div>
                        <div className="flex text-sm">
                            <p>This sum will be released 7 days after the return of the vehicle provided that
                                the general rental conditions have been respected.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReservationEditStep2;