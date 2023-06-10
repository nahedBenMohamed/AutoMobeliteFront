import React, { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

const VehicleSearchForm = () => {
    const [location, setLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Location:', location);
        console.log('Pickup Date:', pickupDate);
        console.log('Return Date:', returnDate);
    };

    return (
        <div className="mt-20 flex flex-col md:flex-row items-center rounded-full bg-white p-2">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center">
                <input
                    type="text"
                    placeholder="Lieu de location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full md:w-72 px-2 py-2 rounded-l-full border border-transparent focus:border-blue-500 text-sm mb-2 md:mb-0 md:mr-2"
                />
                <input
                    type="date"
                    placeholder="Date de prise en charge"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full md:w-auto px-2 py-1 border border-transparent focus:border-blue-500 text-sm mb-2 md:mb-0 md:mr-2"
                />
                <input
                    type="date"
                    placeholder="Date de retour"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full md:w-auto outline-none px-2 py-1 rounded-r-full border border-transparent focus:border-blue-500 text-sm mb-2 md:mb-0 md:mr-2"
                />
                <button
                    type="submit"
                    className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 focus:outline-none flex-shrink-0"
                >
                    <HiSearch className="text-white" />
                </button>
            </form>

        </div>
    );
};

export default VehicleSearchForm;
