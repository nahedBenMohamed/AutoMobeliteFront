import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BeatLoader} from "react-spinners";
import {MdEdit} from "react-icons/md";
import {useRouter} from "next/router";

const SuperAdminMaintenancetable = () => {

    const [maintenance, setMaintenance] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [maintenancePerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/super-admin/manage-maintenance/maintenance', { withCredentials: true })
            .then((response) => {
                setMaintenance(response.data.reverse());
            })
            .catch((error) => {
                if (error.response) {
                    toast.warning('An error occurred while loading data');
                }
            });
    }, []);

    // Pagination logic
    const indexOfLastParking = currentPage * maintenancePerPage;
    const indexOfFirstParking = indexOfLastParking - maintenancePerPage;
    const currentMaintenance = maintenance.slice(indexOfFirstParking, indexOfLastParking);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const closeDetailsModal = () => {
        setDetailsModalIsOpen(false);
    };

    const openModal = (maintenance) => {
        setSelectedCar(maintenance);
        setDetailsModalIsOpen(true);
    };

    function goToCars() {
        setIsLoadingNew(true)
        router.push('/super-admin/dashboard/cars/');
    }

    function goEditMaintenance(id) {
        router.push(`/super-admin/dashboard/maintenance/edit/${id}`);
    }
    return (
        <div className="mt-16">
            <div className="mb-4 flex justify-between">
                <button onClick={goToCars} className=" uppercase bg-blue-500 text-white p-2 rounded mx-1">
                    {isLoadingNew ? "Add Car Maintenance" : "Add Car Maintenance"}
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
            ) : (
                maintenance.length === 0 ? (
                    <div className="flex justify-center items-center h-full w-full">
                        <div className="flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
                            <img className="h-full w-full object-cover" src="/no-maintenance.png" alt="No maintenance" />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="uppercase text-2xl font-bold">You do not have a maintenance planned</div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="border rounded-md p-4">
                            <table className="min-w-full">
                                <thead className="text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Agency Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Brand
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registration
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="px-6 py-3 text-x font-medium text-gray-500 tracking-wider">
                                {currentMaintenance
                                    .filter(maintenance =>
                                        maintenance.car.brand.toLowerCase().includes(search.toLowerCase()) ||
                                        maintenance.car.registration.toLowerCase().includes(search.toLowerCase()) ||
                                        maintenance.car.Agency.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((maintenance) => (
                                        <tr key={maintenance.id}>
                                            <td className="text-center">{maintenance.car.Agency ? maintenance.car.Agency.name : "N/A"}</td>
                                            <td className="uppercase text-center">{maintenance.car.brand}</td>
                                            <td className="uppercase text-center">{maintenance.car.registration}</td>
                                            <td>{new Date(maintenance.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(maintenance.endDate).toLocaleDateString()}</td>
                                            <td>{maintenance.cost} DT</td>
                                            <td className="px-6 py-4 justify-center flex space-x-2">
                                                <button
                                                    onClick={() => goEditMaintenance(maintenance.id)}
                                                    className="bg-blue-500 text-white p-2 rounded mx-1">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button className="bg-green-500 text-white p-2 rounded mx-1" onClick={() => openModal(maintenance)}>
                                                    <FiInfo size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            {/*Pagination here*/}
                        </div>
                        <Modal isOpen={detailsModalIsOpen}>
                            {selectedCar && (
                                <div className="flex justify-center items-center fixed inset-0 z-50 overflow-auto modal-overlay">
                                    <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                                        <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                            MAINTENANCE DETAILS
                                        </h2>
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="w-full sm:w-1/2 mx-4">
                                                <div className="rounded-lg p-4">
                                                    {selectedCar.car.image ? (
                                                        <img src={selectedCar.car.image} alt="Car" className="w-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                                            <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img" /></span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4">
                                                    <label className="font-bold">Description Maintenance:</label>
                                                    <textarea
                                                        value={selectedCar.description}
                                                        disabled
                                                        style={{resize: 'none', height: '4em', lineHeight: '1.1em'}}
                                                        className="w-full bg-gray-100 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                                    />
                                                </div>
                                                <div className="mt-2 flex justify-between">
                                                    <button
                                                        onClick={closeDetailsModal}
                                                        className="uppercase bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-1/2 mx-4 mt-4 sm:mt-0">
                                                <div className="rounded-lg p-4 space-y-4">
                                                    <h2 className="text-xl sm:text-2xl font-bold">{selectedCar.car.brand} {selectedCar.car.model}</h2>
                                                    <p><span className="font-bold">Start Date:</span>&nbsp;{new Date(selectedCar.startDate).toLocaleDateString()}</p>
                                                    <p><span className="font-bold">End Date:</span>&nbsp;{new Date(selectedCar.endDate).toLocaleDateString()}</p>
                                                    <p><span className="font-bold">Agency:</span>&nbsp;{selectedCar.car.Agency.name}</p>
                                                    <p><span className="font-bold">Total Maintenance:</span>&nbsp;{selectedCar.cost} DT</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Modal>
                    </>
                )
            )}
        </div>
    );
};

export default SuperAdminMaintenancetable;
