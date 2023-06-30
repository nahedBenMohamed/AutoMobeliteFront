import React, { useState } from 'react';
import styles from '../../styles/SearchBarr.module.css';

const SearchBar = () => {
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [location, setLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('');

    // Ajoutez vos options de types de véhicules
    const vehicleTypes = ['SUV', 'Berline', 'Sportive', 'Utilitaire'];

    const handleSearch = (event) => {
        event.preventDefault();
        // Ici, vous pouvez rediriger l'utilisateur vers une page de résultats de recherche
    };

    return (
        <form className={styles.searchBar} onSubmit={handleSearch}>
            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required />
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lieu" required />

            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
                <option value="">Type de véhicule</option>
                {vehicleTypes.map(type => <option value={type} key={type}>{type}</option>)}
            </select>
            <button type="submit">Chercher</button>
        </form>
    );
};

export default SearchBar;
