import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/auth/client');
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Prénom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Statut</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border px-4 py-2 text-center">{user.name}</td>
                        <td className="border px-4 py-2 text-center">{user.firstname}</td>
                        <td className="border px-4 py-2 text-center">{user.email}</td>
                        <td className={`border px-4 py-2 text-center ${user.emailVerified ? 'text-green-500' : 'text-red-500'}`}>
                            {user.emailVerified ? 'Actif' : 'Inactif'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
