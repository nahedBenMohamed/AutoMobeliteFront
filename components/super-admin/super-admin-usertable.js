import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdminUsertable = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(2);

    useEffect(() => {
        axios.get('/api/auth/client').then((response) => {
            setUsers(response.data);
        });
    }, []);


    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="overflow-x-auto">
            <div className="w-full">
                <div className="bg-white rounded-b-3xl shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firstname</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map((user) =>  (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.firstname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                <td className={`className="px-6 py-4 whitespace-nowrap" ${user.emailVerified ? 'text-center text-green-500' : 'text-center text-red-500'}`}>
                                    {user.emailVerified ? 'Actif' : 'Inactif'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <ul className="flex items-center">
                        {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
                            <li key={index}>
                                <button
                                    className={`${
                                        currentPage === index + 1
                                            ? 'bg-blue-500 hover:bg-blue-700 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                    } font-bold py-2 px-4 mx-1 rounded`}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminUsertable;
