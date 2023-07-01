import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiInfo, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SuperAdminManageTable = () => {

    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [deleteAdminModalIsOpen, setDeleteAdminModalIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [admin, setAdmin] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [adminPerPage] = useState(5);

    useEffect(() => {
        axios.get('/api/super-admin/manage-admin/admin').then((response) => {
            setAdmin(response.data);
        });
    }, []);

    // Pagination logic
    const indexOfLastAdmin = currentPage * adminPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminPerPage;
    const currentAdmin = admin.slice(indexOfFirstAdmin, indexOfLastAdmin);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const closeDetailsModal = () => {
        setDetailsModalIsOpen(false);
    };

    const openModal = (parking) => {
        setSelectedAdmin(parking);
        setDetailsModalIsOpen(true);
    };


    const handleDeleteCar = async () => {
        try {
            await axios.delete(`/api/super-admin/manage-admin/admin?id=${adminToDelete.id}`, { withCredentials: true });
            const updatedAdmin = admin.filter((admin) => admin.id !== adminToDelete.id);
            setAdmin(updatedAdmin);
            setDeleteAdminModalIsOpen(false);
            setAdminToDelete(null);
            toast.success('The User has been deleted successfully!', {
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
                toast.error(error.response.data.message,
                    {
                        position: "top-center",
                        autoClose: 5000,
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
                            Add Admin
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
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        First Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Agency
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentAdmin
                                    .filter((admin) =>
                                        admin.name.toLowerCase().includes(search.toLowerCase()) ||
                                        admin.firstname.toLowerCase().includes(search.toLowerCase()) ||
                                        admin.email.toLowerCase().includes(search.toLowerCase()) ||
                                        admin.Agency.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.firstname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{admin.Agency ? admin.Agency.name : "N/A"}</td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <Link href={"/super-admin/dashboard/manage-admin/edit/" + admin.id} className="text-blue-500 hover:text-blue-700 mx-1">
                                                <FiEdit size={18} />
                                            </Link>
                                            <button className="text-red-500 hover:text-red-700 mx-1" onClick={() => {
                                                setDeleteAdminModalIsOpen(true);
                                                setAdminToDelete(admin);
                                            }}>
                                                <FiTrash2 size={18} />
                                            </button>
                                            <button
                                                className="hover:text-black-700 mx-1"
                                                onClick={() => openModal(admin)}>
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
                {admin.length > adminPerPage && (
                    <ul className="flex items-center">
                        {Array.from({ length: Math.ceil(admin.length / adminPerPage) }).map((_, index) => (
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
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
                <Modal isOpen={detailsModalIsOpen}>
                    {selectedAdmin && (
                        <div className="flex justify-center items-center fixed inset-0 z-50 overflow-auto modal-overlay">
                            <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                                <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    ADMIN DETAILS
                                </h2>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="w-full sm:w-1/2 mx-4">
                                        <div className="rounded-lg p-4">
                                            {selectedAdmin.image ? (
                                                <img src={selectedAdmin.image} alt="Car" className="w-full" />
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
                                            <h2 className="text-xl sm:text-2xl font-bold">{selectedAdmin.name}</h2>
                                            <p><span className="font-bold">First Name:</span>&nbsp;{selectedAdmin.firstname}</p>
                                            <p><span className="font-bold">Email:</span>&nbsp;{selectedAdmin.email}</p>
                                            <p><span className="font-bold">Agency Name:</span>&nbsp;{selectedAdmin.Agency?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
                <Modal
                    isOpen={deleteAdminModalIsOpen}
                    onRequestClose={() => setDetailsModalIsOpen(false)}
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
                {adminToDelete && (
                    <div>
                        <p className="text-center mt-4 mb-4">
                            Are you sure you want to delete the admin&nbsp;
                            <span className="text-blue-500">
                            {adminToDelete.name} {adminToDelete.firstname}
                          </span> manager of&nbsp;
                            <span className="text-blue-500">
                            {adminToDelete.Agency ? adminToDelete.Agency.name : 'N/A'}
                          </span>
                        </p>
                        <div className="mt-8 flex justify-center space-x-4">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleDeleteCar}
                            >
                                YES
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteAdminModalIsOpen(false)}
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

export default SuperAdminManageTable;
