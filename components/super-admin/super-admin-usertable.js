import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from "react-modal";
import Link from "next/link";
import {FiEdit, FiInfo, FiTrash2} from "react-icons/fi";

const SuperAdminUsertable = () => {
    const [users, setUsers] = useState([]);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get('/api/super-admin/manage-user/user').then((response) => {
            setUsers(response.data);
        });
    }, []);


    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const closeDetailsModal = () => {
        setDetailsModalIsOpen(false);
    };

    const openModal = (parking) => {
        setSelectedUser(parking);
        setDetailsModalIsOpen(true);
    };


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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase tracking-wider">Actions</th>
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
                                            <td className={`className="px-6 py-4 whitespace-nowrap" ${user.emailVerified ? 'text-center text-green-500' : 'text-center text-red-500'}`}>
                                                {user.emailVerified ? 'Actif' : 'Inactif'}
                                            </td>

                                            <td className="px-6 py-4 flex justify-center">
                                                <Link href={`/super-admin/dashboard/users/edit/${user.id}`} className="text-blue-500 hover:text-blue-700 mx-1">
                                                    <FiEdit size={18} />
                                                </Link>
                                                <button
                                                    className="hover:text-black-700 mx-1"
                                                    onClick={() => openModal(user)}>
                                                    <FiInfo size={18} />
                                                </button>
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
                <Modal isOpen={detailsModalIsOpen}>
                    {selectedUser && (
                        <div className="flex justify-center items-center fixed inset-0 z-50 overflow-auto modal-overlay">
                            <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                                <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    USER'S DETAILS
                                </h2>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-1/2 mx-4">
                                        <div className="rounded-lg p-4">
                                            {selectedUser.image ? (
                                                <img src={selectedUser.image} alt="Car" className="w-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                                    <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img" /></span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 flex justify-between">
                                            <button
                                                onClick={closeDetailsModal}
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                            >
                                                Close
                                            </button>

                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2 mx-4 mt-4 sm:mt-0">
                                        <div className="rounded-lg p-4 space-y-4">
                                            <h2 className="text-xl sm:text-2xl font-bold">{selectedUser.name}</h2>
                                            <p><span className="font-bold">First Name:</span>&nbsp;{selectedUser.firstname}</p>
                                            <p><span className="font-bold">Email:</span>&nbsp;{selectedUser.email}</p>
                                            <p><span className="font-bold">Telephone:</span>&nbsp;{selectedUser.telephone}</p>
                                            <p><span className="font-bold">City:</span>&nbsp;{selectedUser.city}</p>
                                            <p><span className="font-bold">Licence number:</span>&nbsp;{selectedUser.numPermis}</p>
                                            <p><span className="font-bold">Address:</span>&nbsp;{selectedUser.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </main>
        </div>
    );
};

export default SuperAdminUsertable;
