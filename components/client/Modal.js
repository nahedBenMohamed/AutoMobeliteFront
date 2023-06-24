import React from "react";

const Modal = ({ onClose, car }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white w-3/4 lg:w-1/2 p-4 rounded shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{car.brand}</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <div className="flex justify-center md:justify-start">
                        <img src={car.image} alt="" className="w-64 h-auto rounded" />
                    </div>
                    <div>
                        <p>Modèle: {car.model}</p>
                        <p>Année: {car.year}</p>
                        <p>Kilométrage: {car.mileage}</p>
                        <p>Prix: {car.price} DT</p>
                        <p>Enregistrement: {car.registration}</p>
                        <p>Nom du parking: {car.parkingName}</p>
                        <p>Status: {car.status}</p>
                        <p>Agence: {car.Agency?.name}</p>
                        <p>Description: {car.description}</p>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 bg-black opacity-10" onClick={onClose}></div>
        </div>
    );
};

export default Modal;