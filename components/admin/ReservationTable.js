import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RentalTable = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        // Appeler l'API pour récupérer les réservations
        axios.get('/api/admin/reservations')
            .then(response => {
                setReservations(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <table className="min-w-full bg-white rounded-b-3xl ">
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
                {reservations.map((reservation, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{reservation.client.nom}</td>
                        <td className="border px-4 py-2">{reservation.client.prenom}</td>
                        <td className="border px-4 py-2">{reservation.voiture.marque}</td>
                        <td className="border px-4 py-2">{reservation.voiture.modele}</td>
                        <td className="border px-4 py-2">{reservation.dateDeDebut}</td>
                        <td className="border px-4 py-2">{reservation.dateDeFin}</td>
                        <td className="border px-4 py-2">{reservation.total}</td>
                        <td className="border px-4 py-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                <a href={`/admin/dashboard/reservations/details/${reservation.id}`}>Voir les détails</a>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RentalTable;
