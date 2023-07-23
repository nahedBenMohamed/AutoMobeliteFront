import React, { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import axios from 'axios';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {MdEdit} from "react-icons/md";
import {useRouter} from "next/router";
import {BeatLoader} from "react-spinners";

const Maintenancetable = () => {

    const [maintenance, setMaintenance] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [maintenancePerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(1);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const router = useRouter();


    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/admin/manage-maintenance/maintenance', { withCredentials: true })
            .then((response) => {
                setMaintenance(response.data.reverse());
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                if (error.response) {
                    toast.warning('An error occurred while loading data');
                }
            });
    }, []);

    // Pagination logic
    const indexOfLastParking = currentPage * maintenancePerPage;
    const indexOfFirstParking = indexOfLastParking - maintenancePerPage;
    const currentMaintenance = maintenance.slice(indexOfFirstParking, indexOfLastParking);


    const closeDetailsModal = () => {
        setDetailsModalIsOpen(false);
    };

    const openModal = (maintenance) => {
        setSelectedCar(maintenance);
        setDetailsModalIsOpen(true);
    };
    const handleNextBtn = () => {
        setCurrentPage(currentPage + 1);
        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + maintenancePerPage);
            setMinPageNumberLimit(minPageNumberLimit + maintenancePerPage);
        }
    };
    const handlePrevBtn = () => {
        setCurrentPage(currentPage - 1);
        if ((currentPage - 1) % maintenancePerPage === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - maintenancePerPage);
            setMinPageNumberLimit(minPageNumberLimit - maintenancePerPage);
        }
    };

    function goToCars() {
        setIsLoadingNew(true)
        router.push('/admin/dashboard/cars/');
    }

    function goEditMaintenance(id) {
        router.push(`/admin/dashboard/maintenance/edit/${id}`);
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
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="px-6 py-3 text-x font-medium text-gray-500 tracking-wider">
                                {currentMaintenance
                                    .filter(maintenance => maintenance.car.brand.toLowerCase().includes(search.toLowerCase()) ||
                                        maintenance.car.registration.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((maintenance) => (
                                        <tr key={maintenance.id}>
                                            <td className="uppercase text-center">{maintenance.car.brand}</td>
                                            <td className="uppercase text-center">{maintenance.car.registration}</td>
                                            <td>{new Date(maintenance.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(maintenance.endDate).toLocaleDateString()}</td>
                                            <td className="text-center">{maintenance.description}</td>
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
                            {maintenance.length > maintenancePerPage && (
                                <ul className="flex items-center">
                                    {currentPage !== 1 &&
                                        <>
                                            <li>
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                                                >
                                                    First
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handlePrevBtn}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                                                >
                                                    Prev
                                                </button>
                                            </li>
                                        </>
                                    }
                                    <li>
                                        <button
                                            className={`bg-blue-500 text-white font-bold py-2 px-4 mx-1 rounded`}
                                        >
                                            {currentPage}
                                        </button>
                                    </li>
                                    {currentPage !== Math.ceil(maintenance.length / maintenancePerPage) &&
                                        <>
                                            <li>
                                                <button
                                                    onClick={handleNextBtn}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                                                >
                                                    Next
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => setCurrentPage(Math.ceil(maintenance.length / maintenancePerPage))}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                                                >
                                                    Last
                                                </button>
                                            </li>
                                        </>
                                    }
                                </ul>
                            )}
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

export default Maintenancetable;
