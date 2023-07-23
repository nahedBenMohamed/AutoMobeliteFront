import React, {useState} from "react";
import {useRouter} from "next/router";
import {BeatLoader} from "react-spinners";

const Modal = ({ onClose, car }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    function goReservations(id) {
        setIsLoading(true)
        router.push(`/reservations/new/step1?id=${id}`);
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
            <div className=" inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    CAR'S DETAILS
                </h2>
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/2 mx-4">
                        <div className="rounded-lg p-4">
                            {car.image ? (
                                <img src={car.image} alt="Car" className="w-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                    <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img" /></span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="font-bold">Description:</label>
                            <textarea
                                value={car.description}
                                disabled
                                style={{resize: 'none', height: '12em', lineHeight: '1.1em'}}
                                className="w-full bg-gray-100 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={onClose}
                                className="bg-blue-500 text-white py-2 px-4 rounded  hover:bg-red-500"
                            >
                                Close
                            </button>

                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 mx-4 mt-4 sm:mt-0">
                        <div className="rounded-lg p-4 space-y-4">
                            <h2 className="text-xl sm:text-2xl font-bold">{car.brand} {car.model}</h2>
                            <p><span className="font-bold">Year:</span>&nbsp;{car.year}</p>
                            <p><span className="font-bold">Mileage:</span>&nbsp;{car.mileage} km</p>
                            <p><span className="font-bold">Price:</span>&nbsp;{car.price} DT</p>
                            <p><span className="font-bold">Registration:</span>&nbsp;{car.registration}</p>
                            <p><span className="font-bold">Status:</span>&nbsp;{car.status}</p>
                            <p><span className="font-bold">Parking:</span>&nbsp;{car.parkingName}</p>
                            <p><span className="font-bold">Agency:</span>&nbsp;{car.Agency?.name}</p>
                            <button onClick={() => goReservations(car.id)} className="block text-center bg-blue-600 p-2 hover:bg-green-500 font-bold text-white rounded w-full">
                                {isLoading ? "Book now..." : "Book now"}
                                {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
