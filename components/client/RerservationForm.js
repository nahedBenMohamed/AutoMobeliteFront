import React, { useState } from "react";

const ReservationForm = ({ vehicle, onSubmit }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    // Autres champs du formulaire

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation des données du formulaire
        // Appel à la fonction onSubmit avec les données de réservation
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Réservation de véhicule</h2>
            <div>
                <label>Nom complet :</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email :</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Téléphone :</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            {/* Autres champs du formulaire */}
            <div>
                <button type="submit">Confirmer la réservation</button>
            </div>
        </form>
    );
};

export default ReservationForm;
