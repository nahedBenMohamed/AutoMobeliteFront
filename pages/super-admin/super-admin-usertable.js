import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from "react-modal";
import Link from "next/link";

const SuperAdminUsertable = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [search, setSearch] = useState("");

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
        <div className="flex">
            <main className="flex-grow">
                <div className="bg-none rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ml-4 py-2 px-4 border border-gray-300 rounded-3xl"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <div className="inline-block min-w-full overflow-hidden">
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
                                <tbody className="divide-y divide-gray-200">
                                    {currentUsers
                                        .filter((user) =>
                                            user.name.toLowerCase().includes(search.toLowerCase()) ||
                                            user.firstname.toLowerCase().includes(search.toLowerCase()) ||
                                            user.email.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((user) =>  (
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
                    </div>
                    <div className="flex justify-center mt-4">
                        {users.length > usersPerPage && (
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
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminUsertable;
