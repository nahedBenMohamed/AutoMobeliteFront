import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RentalTable = ({ agencyId }) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`/api/reservation`);
                setReservations(response.data);
                console.log(response.data); // Vérifiez les données renvoyées par l'API
            } catch (error) {
                console.log(error);
            }
        };

        fetchReservations();
    }, [agencyId]);

    return (
        <div>
            <table className="min-w-full bg-white rounded-b-3xl">
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
                {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                        <td className="border px-4 py-2">{reservation.client.name}</td>
                        <td className="border px-4 py-2">{reservation.client.firstname}</td>
                        <td className="border px-4 py-2">{reservation.car.brand}</td>
                        <td className="border px-4 py-2">{reservation.car.model}</td>
                        <td className="border px-4 py-2">{reservation.startDate}</td>
                        <td className="border px-4 py-2">{reservation.endDate}</td>
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
