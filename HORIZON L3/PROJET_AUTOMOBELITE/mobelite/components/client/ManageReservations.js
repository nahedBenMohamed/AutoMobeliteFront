import React, { useState } from 'react';
import ReservationsEffectuees from './ReservationsEffectuees';
import ReservationsEnAttente from './ReservationsEnAttente';
import ReservationsAnnulees from './ReservationsAnnulees';

function TabList() {
    const [activeTab, setActiveTab] = useState('effectuées');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex mb-4">
                <button
                    className={`mr-4 ${
                        activeTab === 'effectuées' ? 'font-semibold' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabClick('effectuées')}
                >
                    Effectuées
                </button>
                <button
                    className={`mr-4 ${
                        activeTab === 'en attente' ? 'font-semibold' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabClick('en attente')}
                >
                    En attente
                </button>
                <button
                    className={`mr-4 ${
                        activeTab === 'annulées' ? 'font-semibold' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabClick('annulées')}
                >
                    Annulées
                </button>
            </div>
            <div className="w-full max-w-2xl">
                {activeTab === 'effectuées' && <ReservationsEffectuees />}
                {activeTab === 'en attente' && <ReservationsEnAttente />}
                {activeTab === 'annulées' && <ReservationsAnnulees />}
            </div>
        </div>
    );
}

export default TabList;
