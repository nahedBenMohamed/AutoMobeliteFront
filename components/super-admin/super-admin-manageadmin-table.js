import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiInfo, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BeatLoader} from "react-spinners";
import {MdDelete, MdEdit} from "react-icons/md";
import {useRouter} from "next/router";

const SuperAdminManageTable = () => {

    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [deleteAdminModalIsOpen, setDeleteAdminModalIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [admin, setAdmin] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [adminPerPage] = useState(5);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);

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
            toast.success('The User has been deleted successfully!');
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    function goAdminForm() {
        setIsLoadingNew(true);
        router.push('/super-admin/dashboard/manage-admin/new');
    }

    function goEditAdmin(id) {
        router.push(`/super-admin/dashboard/manage-admin/edit/${id}`);
    }

    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
            <div className="mb-4 flex justify-between">
                <button onClick={goAdminForm} className="uppercase bg-blue-500 text-white p-2 rounded mx-1">
                    {isLoadingNew ? "Add Admin" : "Add Admin"}
                    {isLoadingNew && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-2 px-4 border border-gray-300 rounded-3xl"
                />
            </div>
            {isLoading ? (
                <div className="flex justify-center">
                    <div className="spinner"></div>
                </div>
            ) : admin.length === 0 ? (
                <div className="flex justify-center items-center h-full w-full ">
                    <div className="flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
                        <img className="h-full w-full object-cover" src="/no-admin.jpeg" alt="No admin" />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="uppercase text-2xl font-bold">you do not have a admin</div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="border rounded-md p-4">
                        <table className="min-w-full">
                            <thead className="text-center">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    First Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agency
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="px-6 py-3  text-x font-medium text-gray-500 tracking-wider">
                            {currentAdmin
                                .filter((admin) =>
                                    admin.name.toLowerCase().includes(search.toLowerCase()) ||
                                    admin.firstname.toLowerCase().includes(search.toLowerCase()) ||
                                    admin.email.toLowerCase().includes(search.toLowerCase()) ||
                                    (admin.Agency && admin.Agency.name.toLowerCase().includes(search.toLowerCase()))
                                )
                                .map((admin) => (
                                    <tr key={admin.id}>
                                        <td className="text-center">{admin.name}</td>
                                        <td className="text-center">{admin.firstname}</td>
                                        <td className="text-center">{admin.email}</td>
                                        <td className="text-center">{admin.Agency ? admin.Agency.name : "N/A"}</td>
                                        <td className="px-6 py-4 justify-center flex space-x-2">
                                            <button onClick={() => goEditAdmin(admin.id)} className="bg-blue-500 text-white p-2 rounded mx-1">
                                                <MdEdit size={18} />
                                            </button>
                                            <button className="bg-green-500 text-white p-2 rounded mx-1" onClick={() => openModal(admin)}>
                                                <FiInfo size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteAdminModalIsOpen(true);
                                                    setAdminToDelete(admin);
                                                }}
                                                className="bg-red-500 text-white p-2 rounded mx-1"
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        {admin.length > adminPerPage && (
                            <ul className="flex items-center">
                                {currentPage !== 1 && (
                                    <>
                                        <li>
                                            <button onClick={() => setCurrentPage(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                First
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => setCurrentPage(currentPage - 1)} className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                Prev
                                            </button>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <button className={`bg-blue-500 text-white font-bold py-2 px-4 mx-1 rounded`}>{currentPage}</button>
                                </li>
                                {currentPage !== Math.ceil(admin.length / adminPerPage) && (
                                    <>
                                        <li>
                                            <button onClick={() => setCurrentPage(currentPage + 1)} className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                Next
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => setCurrentPage(Math.ceil(admin.length / adminPerPage))}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                                            >
                                                Last
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        )}
                    </div>
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
                </>
            )}
        </div>
    );
};

export default SuperAdminManageTable;
