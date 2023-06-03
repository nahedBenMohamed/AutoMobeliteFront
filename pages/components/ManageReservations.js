import React from 'react';

function ManageReservations () {
    const reservations = [
        { id: 1, name: 'Berthonge M', date: '2023-05-19', status: 'Confirmed'},
        { id: 2, name: 'Berthonge M', date: '2023-05-23', status: 'Pending' },
        { id: 3, name: 'Berthonge M', date: '2023-04-24', status: 'Cancelled' },
        { id: 4, name: 'Berthonge M', date: '2023-05-19', status: 'Confirmed' },
        { id: 5, name: 'Berthonge M', date: '2023-05-23', status: 'Pending' },
        { id: 6, name: 'Berthonge M', date: '2023-04-24', status: 'Cancelled' },
        { id: 7, name: 'Berthonge M', date: '2023-05-19', status: 'Confirmed' },
        { id: 8, name: 'Berthonge M', date: '2023-05-23', status: 'Pending' },
        { id: 9, name: 'Berthonge M', date: '2023-04-24', status: 'Cancelled' },
        { id: 10, name: 'Berthonge M', date: '2023-05-19', status: 'Confirmed' },
        { id: 11, name: 'Berthonge M', date: '2023-05-23', status: 'Pending' },
        { id: 12, name: 'Berthonge M', date: '2023-04-24', status: 'Cancelled' },
    ];

    return (
        <div className="p-14 ">
            <h1 className="text-[1.0em]  text-center font-bold mb-6 relative">Manage Reservations</h1>
            <table className="w-full bg-white border border-blue-600 rounded-lg">
                <thead>
                <tr>
                    <th className="px-6 py-4 text-left bg-blue-600">ID</th>
                    <th className="px-6 py-4 text-left bg-blue-600">Name</th>
                    <th className="px-6 py-4 text-left bg-blue-600">Date</th>
                    <th className="px-6 py-4 text-left bg-blue-600">Status</th>
                    <th className="px-6 py-4 text-left bg-blue-600">Details</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-t border-gray-300">
                        <td className="px-6 py-4">{reservation.id}</td>
                        <td className="px-6 py-4">{reservation.name}</td>
                        <td className="px-6 py-4">{reservation.date}</td>

                        <td className="px-6 py-4">
                <span
                    className={`inline-block px-2 py-1 rounded-full ${
                        reservation.status === 'Confirmed'
                            ? 'bg-green-500 text-white'
                            : reservation.status === 'Pending'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-red-500 text-white'
                    }`}
                >
                  {reservation.status}
                </span>

                        </td>


                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageReservations;
