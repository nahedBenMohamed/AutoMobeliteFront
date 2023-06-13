import React, { useState } from 'react';
import axios from 'axios';
import { HiSearch } from 'react-icons/hi';
import {useRouter} from "next/router";

const VehicleSearchForm = () => {
    const [marque, setMarque] = useState('');
    const [prix, setPrix] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Effectuer une requête à l'API de filtrage
        axios.get('/api/cars/filter', {
            params: {
                marque,
                prix,
                returnDate,
            },
        })
            .then(response => {
                // Stocker les résultats de la recherche dans l'état local
                setSearchResults(response.data);

                // Rediriger le client vers la page de résultats de recherche
                router.push({
                    pathname: '/search',
                    query: { results: JSON.stringify(response.data) },
                });
            })
            .catch(error => {
                console.log(error);
            });
    };


    return (
        <div className="mt-20 flex flex-col md:flex-row items-center rounded-full bg-white p-2">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center">
                <input
                    type="text"
                    placeholder="Lieu de location"
                    value={marque}
                    onChange={(e) => setMarque(e.target.value)}
                    className="w-full md:w-72 px-2 py-2 rounded-l-full border border-transparent focus:border-blue-500 text-sm mb-2 md:mb-0 md:mr-2"
                />
                <input
                    type="text"
                    placeholder="Date de prise en charge"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
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
