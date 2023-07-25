import React, { useEffect,  useState} from "react";
import axios from "axios";
import {FiInfo} from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from "next/router";
import {MdDelete} from "react-icons/md";
import {toast, ToastContainer} from "react-toastify";

function CancelledRental() {

    const [rental, setRental] = useState([]);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(1);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rentalPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const indexOfLastCar = currentPage * rentalPerPage;
    const indexOfFirstCar = indexOfLastCar - rentalPerPage;
    const currentRental = rental.slice(indexOfFirstCar, indexOfLastCar);
    const [search, setSearch] = useState("");
    const router = useRouter();


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
        axios.get('/api/admin/manage-reservation/cancelled')
            .then(response => {
                setRental(response.data.reverse());
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            });
    }, []);

    function goDetails(id) {
        router.push(`/admin/dashboard/reservations/details/${id}`);
    }

    const deleteRental = async (rentalId) => {
        try {
            await axios.delete(`/api/admin/manage-reservation/cancelled?id=${rentalId}`, { withCredentials: true })
            toast.success('rental deleted successfully');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error(error.message);
        }
    };

    const deleteAll = async () => {
        try {
            await axios.delete(`/api/admin/manage-reservation/delete-all-cancelled`, { withCredentials: true });
            toast.success('All rentals deleted successfully');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error(error.message);
        }
    };

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
                <button
                    className="uppercase bg-red-600 text-white p-2 mb-4 rounded mx-1"
                    onClick={deleteAll}>Delete All
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
                            <div className="uppercase text-2xl font-bold">you do not have a canceled reservation</div>
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
                                                <button className="bg-green-500 text-white p-2 rounded mx-1" onClick={() => goDetails(rental.id)} >
                                                    <FiInfo size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteRental(rental.id)}
                                                    className="uppercase bg-red-500 text-white p-2 rounded mx-1">
                                                    <MdDelete size={18}/>
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
                    </>
                )
            )}
        </div>
    );

}

export default CancelledRental;
