import React, { useState, useEffect } from 'react';
//import { getUser, updateUser } from 'chemin/vers/userService';

function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    return (
        <div className="flex items-center justify-center h-29 bg-gray-100">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center space-x-5">
                            <div className="flex-grow">
                                <h2 className="text-gray-800 text-3xl font-semibold">Profil Utilisateur</h2>
                                <p className="text-gray-400">{email}</p>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="flex flex-col">
                                    <label htmlFor="first-name" className="leading-loose">
                                        Prénom :
                                    </label>
                                    <input
                                        type="text"
                                        id="first-name"
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        value={firstName}
                                        onChange={(event) => setFirstName(event.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="last-name" className="leading-loose">
                                        Nom de famille :
                                    </label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        value={lastName}
                                        onChange={(event) => setLastName(event.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="email" className="leading-loose">
                                        Adresse e-mail :
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex items-center space-x-4">
                                <button
                                    type="button"
                                    className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-indigo-500"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
