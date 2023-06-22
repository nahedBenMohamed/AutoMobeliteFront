import React from "react";

const ReservationSummary = ({ data }) => {
    return (
        <div>
            <h2>Récapitulatif de la réservation</h2>
            <p>Nom: {data.name}</p>
            <p>Email: {data.email}</p>
            <p>Téléphone: {data.phone}</p>
            <p>Date de début: {data.startDate}</p>
            <p>Date de fin: {data.endDate}</p>
            {/* Affichez d'autres informations de réservation ici */}
            <button>Confirmer la réservation</button>
        </div>
    );
};

export default ReservationSummary;
