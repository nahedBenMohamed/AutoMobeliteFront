import React from 'react';

function ReservationsAnnulees() {
    const reservations = [
        { id: 7, title: 'Réservation 7', status: 'annulée' },
        { id: 8, title: 'Réservation 8', status: 'annulée' },
        { id: 9, title: 'Réservation 9', status: 'annulée' },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold">Réservations annulées</h3>
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

export default ReservationsAnnulees;
