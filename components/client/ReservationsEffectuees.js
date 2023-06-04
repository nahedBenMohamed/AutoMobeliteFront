import React from 'react';

function ReservationsEffectuees() {
    const reservations = [
        { id: 1, title: 'Réservation 1', status: 'effectuée' },
        { id: 2, title: 'Réservation 2', status: 'effectuée' },
        { id: 3, title: 'Réservation 3', status: 'effectuée' },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold">Réservations effectuées</h3>
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

export default ReservationsEffectuees;
