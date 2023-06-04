import React from 'react';

function ReservationsEnAttente() {
    const reservations = [
        { id: 4, title: 'Réservation 4', status: 'en attente' },
        { id: 5, title: 'Réservation 5', status: 'en attente' },
        { id: 6, title: 'Réservation 6', status: 'en attente' },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold">Réservations en attente</h3>
            <ul className="bg-white p-4 rounded-lg shadow-md">
                {reservations.map((reservation) => (
                    <li key={reservation.id} className="mb-2">
                        {reservation.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReservationsEnAttente;
