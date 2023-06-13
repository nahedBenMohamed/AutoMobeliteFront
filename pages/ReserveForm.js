import React, { useState } from 'react';
import axios from 'axios';

const ReservationForm = () => {
    const [voitureId, setVoitureId] = useState('');
    const [dateDeDebut, setDateDeDebut] = useState('');
    const [dateDeFin, setDateDeFin] = useState('');
    const [methodePaiement, setMethodePaiement] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Effectuer une requête POST à l'API de réservations
        axios.post('/api/reservations/new', {
            voitureId,
            dateDeDebut,
            dateDeFin,
            methodePaiement,
        })
            .then(response => {
                // Traitement des données de réponse
                console.log(response.data);
                // Réinitialiser le formulaire
                setVoitureId('');
                setDateDeDebut('');
                setDateDeFin('');
                setMethodePaiement('');
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="voitureId">ID de la voiture :</label>
                <input
                    type="text"
                    id="voitureId"
                    value={voitureId}
                    onChange={(e) => setVoitureId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="dateDeDebut">Date de début :</label>
                <input
                    type="date"
                    id="dateDeDebut"
                    value={dateDeDebut}
                    onChange={(e) => setDateDeDebut(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="dateDeFin">Date de fin :</label>
                <input
                    type="date"
                    id="dateDeFin"
                    value={dateDeFin}
                    onChange={(e) => setDateDeFin(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="methodePaiement">Méthode de paiement :</label>
                <input
                    type="text"
                    id="methodePaiement"
                    value={methodePaiement}
                    onChange={(e) => setMethodePaiement(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Réserver</button>
        </form>
    );
};

export default ReservationForm;
