import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiInfo, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast} from "react-toastify";

const SuperAdminAgencetable = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [agencyToDelete, setAgencyToDelete] = useState(null);
    const [agences, setAgences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [agencesPerPage] = useState(5);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get('/api/super-admin/manage-agence/agence').then((response) => {
            setAgences(response.data);
        });
    }, []);

    // Pagination logic
    const indexOfLastAgence = currentPage * agencesPerPage;
    const indexOfFirstAgence = indexOfLastAgence - agencesPerPage;
    const currentAgences = agences.slice(indexOfFirstAgence, indexOfLastAgence);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteCar = async () => {
        try {
            await axios.delete(`/api/super-admin/manage-agence/agence?id=${agencyToDelete.id}`, { withCredentials: true });
            const updatedAgences = agences.filter((agence) => agence.id !== agencyToDelete.id);
            setAgences(updatedAgences);
            setModalIsOpen(false);
            setAgencyToDelete(null);
            toast.success('The agency has been deleted successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        } catch (error) {
            if (error.response) {
                toast.warning('An error occurred while deleting the car',
                    {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                    });
            }
        }
    };

    return (
        <div className="flex">
            <main className="flex-grow">
                <div className="bg-none rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Link  href="/super-admin/dashboard/manage-admin/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Agency
                        </Link>
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Agence Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Address
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Phone
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {currentAgences
                                    .filter((agence) =>
                                        agence.name.toLowerCase().includes(search.toLowerCase()) ||
                                        agence.address.toLowerCase().includes(search.toLowerCase()) ||
                                        agence.email.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((agence) => (
                                    <tr key={agence.id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap">{agence.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{agence.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{agence.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{agence.telephone}</td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <Link href={"/super-admin/dashboard/agence/edit/" + agence.id} className="text-blue-500 hover:text-blue-700 mx-1">
                                                <FiEdit size={18} />
                                            </Link>
                                                <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => {
                                                    setModalIsOpen(true);
                                                    setAgencyToDelete(agence);
                                                }}>
                                                    <FiTrash2 size={18} />
                                                </button>
                                            <Link href={"/super-admin/dashboard/agence/details/" + agence.id} className="text-gray-500 hover:text-gray-700 mx-1" >
                                                <FiInfo size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        {agences.length > agencesPerPage && (
                            <ul className="flex items-center">
                                {Array.from({ length: Math.ceil(agences.length / agencesPerPage) }).map((_, index) => (
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
                <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Confirmation Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        maxWidth: '400px',
                        width: '90%',
                        height: '35%',
                        margin: 'auto',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    },
                }}
                contentClassName="custom-modal-content"
                >
                <h2 className="text-2xl font-bold text-center mb-4">Confirmation</h2>
                {agencyToDelete && (
                    <div>
                        <p className="text-center mt-4 mb-4">
                            Are you sure you want to delete the agency
                            &nbsp;
                            <span className="text-blue-500">
                                {agencyToDelete.name}
                            </span>
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleDeleteCar}
                            >
                                YES
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setModalIsOpen(false)}
                            >
                                NO
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
            </main>
        </div>
    );
};

export default SuperAdminAgencetable;
