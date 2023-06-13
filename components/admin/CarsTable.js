import React, {useEffect, useState} from 'react';
import Link from "next/link";
import axios from "axios";

const VehicleTable = () => {
    const[cars, setCars] = useState([])

    useEffect(() => {
        axios.get('/api/cars/cars', { withCredentials: true })
            .then(response => {
                setCars(response.data);
            })
    }, [])


    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Agence</th>
                    <th className="px-4 py-2">Marque</th>
                    <th className="px-4 py-2">Modèle</th>
                    <th className="px-4 py-2">Matricule</th>
                    <th className="px-4 py-2">Année</th>
                    <th className="px-4 py-2">Prix</th>
                    <th className="px-4 py-2">Etat</th>
                    <th className="px-4 py-2">Kilométrage</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {cars.map(car => (
                    <tr key={car.id}>
                        <td className="border px-4 py-2">{car.agenceName}</td>
                        <td className="border px-4 py-2">{car.marque}</td>
                        <td className="border px-4 py-2">{car.modele}</td>
                        <td className="border px-4 py-2">{car.matricule}</td>
                        <td className="border px-4 py-2">{car.annee}</td>
                        <td className="border px-4 py-2">{car.prix} DT</td>
                        <td className="border px-4 py-2">{car.etat}</td>
                        <td className="border px-4 py-2">{car.kilometrage} Km</td>
                        <td className="border px-4 py-2">
                            <Link href={'/admin/dashboard/cars/edit/'+car.id} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Éditer
                            </Link>
                            <Link href={'/admin/dashboard/cars/delete/'+car.id} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                                Supprimer
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4">
                <Link  href={'/admin/dashboard/cars/new'} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Ajouter un véhicule
                </Link>
            </div>

            {/* Pagination */}
            <div className="mt-4">
            </div>
        </div>
    );
};

export default VehicleTable;
