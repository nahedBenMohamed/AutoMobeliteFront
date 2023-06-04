import React, { useState } from 'react';

const RentalTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rentalsPerPage] = useState(1); // Nombre de locations affichées par page

    // Exemple de données de locations de véhicules
    const rentals = [
        {
            nom: 'Doe',
            prenom: 'John',
            marque: 'Toyota',
            model: 'Camry',
            dateDebut: '2023-06-01',
            dateFin: '2023-06-05',
            prix: '50 DT / jour',
        },
        {
            nom: 'Smith',
            prenom: 'Jane',
            marque: 'Honda',
            model: 'Accord',
            dateDebut: '2023-06-02',
            dateFin: '2023-06-06',
            prix: '60 DT / jour',
        },
    ];

    // Index du dernier véhicule de la page
    const lastRentalIndex = currentPage * rentalsPerPage;
    // Index du premier véhicule de la page
    const firstRentalIndex = lastRentalIndex - rentalsPerPage;
    // Locations à afficher sur la page courante
    const currentRentals = rentals.slice(firstRentalIndex, lastRentalIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcul du nombre total de pages
    const totalPages = Math.ceil(rentals.length / rentalsPerPage);
    // Tableau de numéros de pages
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Prénom</th>
                    <th className="px-4 py-2">Marque</th>
                    <th className="px-4 py-2">Modèle</th>
                    <th className="px-4 py-2">Date début</th>
                    <th className="px-4 py-2">Date fin</th>
                    <th className="px-4 py-2">Prix</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentRentals.map((rental, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{rental.nom}</td>
                        <td className="border px-4 py-2">{rental.prenom}</td>
                        <td className="border px-4 py-2">{rental.marque}</td>
                        <td className="border px-4 py-2">{rental.model}</td>
                        <td className="border px-4 py-2">{rental.dateDebut}</td>
                        <td className="border px-4 py-2">{rental.dateFin}</td>
                        <td className="border px-4 py-2">{rental.prix}</td>
                        <td className="border px-4 py-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                <a href="/admin/dashboard/reservations/details">Voir les détails</a>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-8">
                {pageNumbers.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        className={`${
                            currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                        } font-bold py-2 px-4 rounded mr-2`}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RentalTable;
