import React, { useState } from 'react';

const VehicleTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [vehiclesPerPage] = useState(2); // Nombre de véhicules affichés par page

    const [showModal, setShowModal] = useState(false);

    // Exemple de données de véhicules
    const vehicles = [
        {
            marque: 'Toyota',
            matricule: 'ABC123',
            model: 'Camry',
            couleur: 'Noir',
            annee: '2022',
            prix: '$25,000',
            disponibilite: 'Disponible',
            kilometre: '10,000',
        },
        {
            marque: 'Toyota',
            matricule: 'ABC123',
            model: 'Camry',
            couleur: 'Noir',
            annee: '2022',
            prix: '$25,000',
            disponibilite: 'Disponible',
            kilometre: '10,000',
        },
        {
            marque: 'Toyota',
            matricule: 'ABC123',
            model: 'Camry',
            couleur: 'Noir',
            annee: '2022',
            prix: '$25,000',
            disponibilite: 'Disponible',
            kilometre: '10,000',
        },
        // Ajoute d'autres objets de véhicule ici
    ];

    const handleEdit = (index) => {
        // Logique pour l'édition d'une ligne
        console.log(`Édition de la ligne ${index}`);
    };

    const handleDelete = (index) => {
        // Logique pour la suppression d'une ligne
        console.log(`Suppression de la ligne ${index}`);
    };

    const [formData, setFormData] = useState({
        marque: '',
        matricule: '',
        model: '',
        couleur: '',
        annee: '',
        prix: '',
        disponibilite: '',
        kilometre: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Effectuer des actions avec les données du formulaire, par exemple, ajouter un véhicule à la liste
        console.log(formData);
        // Réinitialiser le formulaire après la soumission
        setFormData({
            marque: '',
            matricule: '',
            model: '',
            couleur: '',
            annee: '',
            prix: '',
            disponibilite: '',
            kilometre: '',
        });
        // Fermer le modal
        setShowModal(false);
    };

    // Index du dernier véhicule de la page
    const lastVehicleIndex = currentPage * vehiclesPerPage;
    // Index du premier véhicule de la page
    const firstVehicleIndex = lastVehicleIndex - vehiclesPerPage;
    // Véhicules à afficher sur la page courante
    const currentVehicles = vehicles.slice(firstVehicleIndex, lastVehicleIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // Calcul du nombre total de pages
    const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
    // Tableau de numéros de pages
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Marque</th>
                    <th className="px-4 py-2">Matricule</th>
                    <th className="px-4 py-2">Modèle</th>
                    <th className="px-4 py-2">Couleur</th>
                    <th className="px-4 py-2">Année</th>
                    <th className="px-4 py-2">Prix</th>
                    <th className="px-4 py-2">Disponibilité</th>
                    <th className="px-4 py-2">Kilométrage</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentVehicles.map((vehicle, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{vehicle.marque}</td>
                        <td className="border px-4 py-2">{vehicle.matricule}</td>
                        <td className="border px-4 py-2">{vehicle.model}</td>
                        <td className="border px-4 py-2">{vehicle.couleur}</td>
                        <td className="border px-4 py-2">{vehicle.annee}</td>
                        <td className="border px-4 py-2">{vehicle.prix}</td>
                        <td className="border px-4 py-2">{vehicle.disponibilite}</td>
                        <td className="border px-4 py-2">{vehicle.kilometre}</td>
                        <td className="border px-4 py-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={() => handleEdit(index)}
                            >
                                Éditer
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => handleDelete(index)}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4">
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowModal(true)}
                >
                    Ajouter un véhicule
                </button>
            </div>

            {/* Pagination */}
            <div className="mt-4">
                {pageNumbers.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        className={`${
                            currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                        } font-bold py-2 px-4 rounded mr-2`}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>


            {showModal && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white p-4 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Ajouter un véhicule</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-wrap">
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="marque" className="block text-gray-700">Marque:</label>
                                    <input
                                        type="text"
                                        id="marque"
                                        name="marque"
                                        value={formData.marque}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="matricule" className="block text-gray-700">Matricule:</label>
                                    <input
                                        type="text"
                                        id="matricule"
                                        name="matricule"
                                        value={formData.matricule}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="model" className="block text-gray-700">Modèle:</label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="couleur" className="block text-gray-700">Couleur:</label>
                                    <input
                                        type="text"
                                        id="couleur"
                                        name="couleur"
                                        value={formData.couleur}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="annee" className="block text-gray-700">Annee:</label>
                                    <input
                                        type="text"
                                        id="annee"
                                        name="annee"
                                        value={formData.annee}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="prix" className="block text-gray-700">Prix:</label>
                                    <input
                                        type="text"
                                        id="prix"
                                        name="prix"
                                        value={formData.prix}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="disponibilite" className="block text-gray-700">Disponibilite:</label>
                                    <input
                                        type="text"
                                        id="disponibilite"
                                        name="disponibilite"
                                        value={formData.disponibilite}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 px-2 mb-2">
                                    <label htmlFor="kilometre" className="block text-gray-700">Kilometre:</label>
                                    <input
                                        type="text"
                                        id="kilometre"
                                        name="kilometre"
                                        value={formData.kilometre}
                                        onChange={handleChange}
                                        className="border border-gray-400 p-2 w-full"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Ajouter
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Fermer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleTable;
