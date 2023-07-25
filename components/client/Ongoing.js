import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {FiInfo} from "react-icons/fi";
import Modal from "react-modal";

function Ongoing() {

    const [rental, setRental] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rentalPerPage] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(1);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const indexOfLastCar = currentPage * rentalPerPage;
    const indexOfFirstCar = indexOfLastCar - rentalPerPage;
    const currentRental = rental.slice(indexOfFirstCar, indexOfLastCar);
    const openModal = (rental) => {
        setSelectedRental(rental);
        setModalIsOpen(true);
    };
    const closeModal = () => {
        setModalIsOpen(false); // Fermer la modal d'informations
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


    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/client/reservationOngoing')
            .then((response) => {
                setRental(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    toast.warning('An error occurred while loading data');
                }
            });
    }, []);

    return (
        <div>
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
                                        Brand
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
                                    .map((rental) => (
                                        <tr key={rental.id}>
                                            <td  className="text-left">{rental.car.brand}</td>
                                            <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                                            <td>{rental.total} DT</td>
                                            <td className=" px-6 py-4  justify-center flex space-x-2">
                                                <button className="bg-green-500 text-white p-2 rounded mx-1" onClick={() => openModal(rental)}>
                                                    <FiInfo size={18} />
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
                        <Modal isOpen={modalIsOpen}>
                            {selectedRental && (
                                <div className="flex justify-center items-center fixed inset-0 z-50 overflow-auto modal-overlay">
                                    <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                                        <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                            RENTAL DETAILS
                                        </h2>
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="w-full sm:w-1/2 mx-4">
                                                <div className="rounded-lg p-4">
                                                    {selectedRental.car.image ? (
                                                        <img src={selectedRental.car.image} alt="Car" className="w-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                                            <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex justify-between">
                                                    <button
                                                        onClick={closeModal}
                                                        className="uppercase bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-1/2 mx-4 mt-4 sm:mt-0">
                                                <div className="rounded-lg p-4 space-y-4">
                                                    <h2 className="text-xl sm:text-2xl font-bold">{selectedRental.car.brand} {selectedRental.car.model}</h2>
                                                    <p><span className="font-bold">Mileage:</span>&nbsp;{selectedRental.car.mileage} km</p>
                                                    <p><span className="font-bold">Gear Box:</span>&nbsp;{selectedRental.car.gearBox}</p>
                                                    <p><span className="font-bold">Fuel:</span>&nbsp;{selectedRental.car.fuel}</p>
                                                    <p><span className="font-bold">Door:</span>&nbsp;{selectedRental.car.door}</p>
                                                    <p><span className="font-bold">Start Date:</span>&nbsp;{new Date(selectedRental.startDate).toLocaleDateString()}</p>
                                                    <p><span className="font-bold">End Date:</span>&nbsp;{new Date(selectedRental.endDate).toLocaleDateString()}</p>
                                                    <p><span className="font-bold">Total Price:</span>&nbsp;{selectedRental.total} DT</p>
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
}

export default Ongoing;
