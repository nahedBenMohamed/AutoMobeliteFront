import React, { useState } from "react";
import { useRouter } from 'next/router';
import { HiLockClosed, HiMail, HiUser } from "react-icons/hi";

const AgenceAdd = () => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [responsableId, setResponsableId] = useState('');



    const handleSubmit = async (event) => {
        event.preventDefault();

        // Vérification des données côté client (facultatif)
        if (!name || !telephone || !email || !adresse || !responsableId) {
            setErrorMessage('Veuillez remplir tous les champs.');
            return;
        }
        try {
            console.log({ name, telephone,email, adresse,responsableId });
            const response = await fetch('/api/agence/add-agence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, telephone,email, adresse,responsableId }),
            });

            if (response.ok) {
                await router.push('/admin/auth/login');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
            }
        } catch (errorData) {
            setErrorMessage(errorData.message);
        }
    };


    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Add an Agency
                </h2>
                <div className=" mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} >
                        <div className=" mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nameAgency" className="block font-semibold">
                                    Name Agency
                                </label>
                                <div className="relative">
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="given-name"
                                        value={name} onChange={(e) => setName(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="responsable" className="block font-semibold">
                                    Responsable ID
                                </label>
                                <div className="relative">
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="responsable"
                                        name="responsable"
                                        type="number"
                                        autoComplete="responsable-id"
                                        value={responsableId} onChange={(e) => setResponsableId(parseInt(e.target.value))}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="tel" className="block text-sm font-medium leading-6 text-gray-900">
                                    Telephone
                                </label>
                            </div>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="tel"
                                        name="tel"
                                        type="tel"
                                        autoComplete="new-tel"
                                        value={telephone} onChange={(e) => setTelephone(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                        Location
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <div className="relative">
                                        <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            autoComplete="new-location"
                                            value={adresse} onChange={(e) => setAdresse(e.target.value)}
                                            className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="mt-8 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Create an agency
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgenceAdd;
