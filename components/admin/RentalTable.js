import React, {useState, useEffect, Fragment, useRef} from 'react';
import axios from 'axios';
import { FiInfo} from "react-icons/fi";
import {toast, ToastContainer} from "react-toastify";
import {MdDelete, MdEdit} from "react-icons/md";
import Modal from "react-modal";
import {Dialog, Transition} from "@headlessui/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {useRouter} from "next/router";
import {BeatLoader} from "react-spinners";

const RentalTable = () => {
    const router = useRouter();
    const [rental, setRental] = useState([]);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(1);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rentalPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNew, setIsLoadingNew] = useState(false);
    const [rentalDelete, setRentalDelete] = useState(null);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const cancelButtonRef = useRef(null)
    const [search, setSearch] = useState("");

    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/admin/manage-reservation/reservation')
            .then(response => {
                setRental(response.data.reverse());
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            });
    }, []);


    // Pagination logic
    const indexOfLastCar = currentPage * rentalPerPage;
    const indexOfFirstCar = indexOfLastCar - rentalPerPage;
    const currentRental = rental.slice(indexOfFirstCar, indexOfLastCar);
    const handleDeleteRental = async () => {
        try {
            await axios.delete(`/api/admin/manage-reservation/reservation?id=${rentalDelete.id}`);
            const updatedRentals = rental.filter((rentalItem) => rentalItem.id !== rentalDelete.id);
            setRental(updatedRentals);
            window.location.reload();
            toast.success('This rental has been deleted successfully!');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    toast.error('An error occurred on the server while deleting the rental');
                } else if (error.response.status === 403 && error.response.data.message === "The car is reserved and cannot be deleted.") {
                    toast.warning('The car is reserved and cannot be deleted.');
                } else {
                    toast.warning('An error occurred while deleting the car');
                }
            }
        }

    };

    const handleNextBtn = () => {
        setCurrentPage(currentPage + 1);
        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + rentalPerPage);
            setMinPageNumberLimit(minPageNumberLimit + rentalPerPage);
        }
    };
    const handlePrevBtn = () => {
        setCurrentPage(currentPage - 1);
        if ((currentPage - 1) % rentalPerPage === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - rentalPerPage);
            setMinPageNumberLimit(minPageNumberLimit - rentalPerPage);
        }
    };
    function goNewReservations() {
        setIsLoadingNew(true);
        router.push('/admin/dashboard/reservations/new');
    }

    function goEditReservations(id) {
        router.push(`/admin/dashboard/reservations/edit/${id}`);
    }
    function goDetails(id) {
        router.push(`/admin/dashboard/reservations/details/${id}`);
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
                <button onClick={goNewReservations} className=" uppercase bg-blue-500 text-white p-2 rounded mx-1">
                    {isLoadingNew ? "Ongoing" : "Add New Rental"}
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
                rental.length === 0 ? (
                    <div className="flex justify-center items-center h-full w-full ">
                        <div className="flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
                            <img className="h-full w-full object-cover" src="/no-reservations.jpeg" alt="No reservations" />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="uppercase text-2xl font-bold">you do not have a reservation planned</div>
                        </div>
                    </div>

                ) : (
                    <>
                        <div className="border rounded-md p-4">
                            <table className="min-w-full">
                                <thead className="text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Clients
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Brand
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Model
                                    </th>
                                    <th scope="col" className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th scope="col" className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="px-6 py-3  text-x font-medium text-gray-500 uppercase tracking-wider">
                                {currentRental
                                    .filter(rental => rental.client.name.toLowerCase().includes(search.toLowerCase()) ||
                                        rental.status.toLowerCase().includes(search.toLowerCase()) ||
                                        rental.car.brand.toLowerCase().includes(search.toLowerCase()) ||
                                        rental.car.model.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((rental) => (
                                        <tr key={rental.id}>
                                            <td  className="text-center">{rental.client.name}</td>
                                            <td  className="text-left">{rental.car.brand}</td>
                                            <td  className="text-center">{rental.car.model}</td>
                                            <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(rental.endDate).toLocaleDateString()}</td>
                                            <td>{rental.total} DT</td>
                                            <td className=" px-6 py-4  justify-center flex space-x-2">
                                                <button  onClick={() => goEditReservations(rental.id)} className="bg-blue-500 text-white p-2 rounded mx-1">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button className="bg-green-500 text-white p-2 rounded mx-1" onClick={() => goDetails(rental.id)} >
                                                    <FiInfo size={18} />
                                                </button>
                                                <button onClick={() => {
                                                    setDeleteModalIsOpen(true); // Open the delete modal
                                                    setRentalDelete(rental);
                                                }}
                                                        className="bg-red-500 text-white p-2 rounded mx-1">
                                                    <MdDelete size={18} />
                                                </button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            {rental.length > rentalPerPage && (
                                <ul className="flex items-center">
                                    {currentPage !== 1 &&
                                        <>
                                            <li>
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                    First
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handlePrevBtn}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
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
                                    {currentPage !== Math.ceil(rental.length / rentalPerPage) &&
                                        <>
                                            <li>
                                                <button
                                                    onClick={handleNextBtn}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                    Next
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => setCurrentPage(Math.ceil(rental.length / rentalPerPage))}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded">
                                                    Last
                                                </button>
                                            </li>
                                        </>
                                    }
                                </ul>
                            )}
                        </div>
                        <Modal
                            isOpen={deleteModalIsOpen}
                            onRequestClose={() => setDeleteModalIsOpen(false)}>
                            {rentalDelete && (
                                <Transition.Root show={deleteModalIsOpen} as={Fragment}>
                                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setDeleteModalIsOpen(false)}>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                        </Transition.Child>
                                        <div className="fixed inset-0 z-10 overflow-y-auto">
                                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                >
                                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                            <div className="sm:flex sm:items-start">
                                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                                </div>
                                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                                        Delete reservation
                                                                    </Dialog.Title>
                                                                    <div className="mt-2">
                                                                        <p className="text-sm text-justify text-gray-500">
                                                                            Are you sure you want to delete car rental <span className="text-blue-500 uppercase">{rentalDelete.car.brand} {rentalDelete.car.model} </span>
                                                                            from customer <span className="text-blue-500 uppercase">{rentalDelete.client.name} {rentalDelete.client.firstname}</span> ? All data in this location will be deleted. This action cannot be undone.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                            <button
                                                                type="button"
                                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                                onClick={handleDeleteRental}
                                                            >
                                                                Delete
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                onClick={() => setDeleteModalIsOpen(false)}
                                                                ref={cancelButtonRef}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </Dialog.Panel>
                                                </Transition.Child>
                                            </div>
                                        </div>
                                    </Dialog>
                                </Transition.Root>
                            )}
                        </Modal>
                    </>
                )
            )}
        </div>
    );
};
export default RentalTable;
