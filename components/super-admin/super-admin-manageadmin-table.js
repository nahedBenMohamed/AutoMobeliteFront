import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiInfo, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SuperAdminManageTable = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);

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

    const handleDeleteCar = async () => {
        try {
            await axios.delete(`/api/super-admin/manage-admin/admin?id=${adminToDelete.id}`, { withCredentials: true });
            const updatedAdmin = admin.filter((admin) => admin.id !== adminToDelete.id);
            setAdmin(updatedAdmin);
            setModalIsOpen(false);
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
        <div className="flex justify-center mt-16">
            <main className="flex-grow">
                <div className="table-auto">
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <div className="inline-block min-w-full overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        First Name
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
                                        Agency
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentAdmin.map((admin) => (
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
                                                setModalIsOpen(true);
                                                setAdminToDelete(admin);
                                            }}>
                                                <FiTrash2 size={18} />
                                            </button>
                                            <Link href={"/super-admin/dashboard/manage-admin/details/" + admin.id} className="text-gray-500 hover:text-gray-700 mx-1" >
                                                <FiInfo size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link
                            href="/super-admin/dashboard/manage-admin/new"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                    Add Admin
                </Link>
            </div>
            <div className="flex justify-center mt-4">
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

export default SuperAdminManageTable;
