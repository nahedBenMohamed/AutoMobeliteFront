import React, { useState } from 'react';
import axios from 'axios';
import { HiSearch } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';

const VehicleSearchForm = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [marque, setMarque] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [departDate, setDepartDate] = useState('');

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Effectuer une requête à l'API de filtrage
        axios
            .get('/api/client/filter', {
                params: {
                    departDate: departDate,
                    returnDate: returnDate,
                },
            })
            .then((response) => {
                // Stocker les résultats de la recherche dans l'état local
                setSearchResults(response.data.cars);

                // Rediriger le client vers la page de résultats de recherche
                router.push({
                    pathname: '/search',
                    query: { cars: JSON.stringify(response.data.cars) },
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const handleSearchIconClick = () => {
        setShowSearch(true);
    };

    const handleMobileSearchClose = () => {
        setShowSearch(false);
    };

    return (
        <motion.div
            ref={ref}
            className={`mt-28 flex flex-col md:flex-row items-center rounded-full bg-gray-200 p-2 ${
                isMobile ? 'justify-center' : ''
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 3 : 0, y: inView ? 2 : 50 }}
            transition={{ duration: 0.9 }}
        >
            {!showSearch ? (
                <>
                    {!isMobile && (
                        <button
                            className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 focus:outline-none"
                            onClick={handleSearchIconClick}
                        >
                            <HiSearch className="text-white" />
                        </button>
                    )}
                    {isMobile && (
                        <button
                            className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 focus:outline-none"
                            onClick={handleSearchIconClick}
                        >
                            <HiSearch className="text-white" />
                            <span className="ml-2 text-sm">Search</span>
                        </button>
                    )}
                </>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center">
                    <input
                        type="text"
                        placeholder="Pick up"
                        value={marque}
                        onChange={(e) => setMarque(e.target.value)}
                        className="w-full md:w-72 px-2 py-2 rounded-l-full border border-transparent focus:border-blue-500 text-sm mb-2 md:mb-0 md:mr-2"
                    />
                    <input
                        type="date"
                        placeholder="Date de depart"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full md:w-auto outline-none px-2 py-1 rounded-r-full border border-transparent focus:border-blue-500 text-sm mb-2 md:mb-0 md:mr-2"
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
                    {showSearch && (
                        <button
                            className="flex items-center justify-center bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 focus:outline-none md:hidden mt-2"
                            onClick={handleMobileSearchClose}
                        >
                            Close
                        </button>
                    )}
                </form>
            )}
        </motion.div>
    );
};

export default VehicleSearchForm;