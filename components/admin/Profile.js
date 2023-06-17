import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiEye, HiEyeOff, HiLockClosed, HiMail, HiUser } from 'react-icons/hi';

function Profile() {
    const [firstname, setFirstName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isModified, setIsModified] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(true);
    const [successMessageVisible, setSuccessMessageVisible] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/gestion-profile-admin-superAdmin/get-profile', { withCredentials: true });
                const { name, firstname, email } = response.data.userAgency;
                setName(name);
                setFirstName(firstname);
                setEmail(email);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let isFormEmpty = true;

        if (firstname.trim() !== '' || name.trim() !== '' || email.trim() !== '') {
            isFormEmpty = false;
        }

        if (isFormEmpty) {
            return;
        }

        if (isModified && newPassword !== confirmPassword && newPassword !== '') {
            setMessage('Mot de passe différent');
            setErrorMessageVisible(true);
            setSuccessMessageVisible(false);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }

        if (isModified && newPassword.length < 8 && newPassword !== '') {
            setMessage('Le mot de passe doit avoir au moins 8 caractères.');
            setErrorMessageVisible(true);
            setSuccessMessageVisible(false);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }

        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
        if (isModified && !passwordRegex.test(newPassword) && newPassword !== '') {
            setMessage('Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.');
            setErrorMessageVisible(true);
            setSuccessMessageVisible(false);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }


        try {
            setIsLoading(true);
            setSuccessMessage('');

            const response = await axios.put(
                '/api/gestion-profile-admin-superAdmin/update-profile',
                { name, firstname, email, oldPassword, newPassword },
                { withCredentials: true }
            );

            setName(response.data.userAgency.name);
            setFirstName(response.data.userAgency.firstname);
            setEmail(response.data.userAgency.email);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsEditingPassword(false);
            setSuccessMessage('Mise à jour réussie');
            setSuccessMessageVisible(true);
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
                setErrorMessageVisible(true);
                setSuccessMessageVisible(false);
                setTimeout(() => {
                    setErrorMessageVisible(false);
                }, 5000);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
        setIsModified(true);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setIsModified(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsModified(true);
    };
    
    setTimeout(() => {
        setSuccessMessageVisible(false);
    }, 10000);

    const handleEditPassword = () => {
        setIsEditingPassword(true);
    };

    const handleCancelEditPassword = () => {
        setIsEditingPassword(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="flex items-center justify-center h-29 bg-gray-100">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center space-x-5">
                            <div className="flex-grow">
                                <h2 className="text-gray-800 text-3xl font-semibold">Profil Utilisateur</h2>
                            </div>
                        </div>
                        {isLoading ? (
                            <div>Chargement...</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                <form onSubmit={handleSubmit}>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block font-semibold">
                                                First Name
                                            </label>
                                            <div className="relative">
                                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                                <input
                                                    id="firstName"
                                                    name="firstName"
                                                    type="text"
                                                    autoComplete="given-name"
                                                    value={firstname}
                                                    onChange={handleFirstNameChange}
                                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="lastName" className="block font-semibold">
                                                Last Name
                                            </label>
                                            <div className="relative">
                                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                                <input
                                                    id="lastName"
                                                    name="lastName"
                                                    type="text"
                                                    autoComplete="family-name"
                                                    value={name}
                                                    onChange={handleNameChange} // Mise à jour de l'attribut onChange
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
                                                    value={email}
                                                    onChange={handleEmailChange} // Mise à jour de l'attribut onChange
                                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-5 mb-5">
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Password
                                        </label>
                                        {!isEditingPassword ? (
                                            <button type="button" className="text-blue-600 focus:outline-none" onClick={handleEditPassword}>
                                                Edit
                                            </button>
                                        ) : (
                                            <button type="button" className="text-red-600 focus:outline-none" onClick={handleCancelEditPassword}>
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                    {!isEditingPassword ? (
                                        <p className="mt-2">*********</p>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="oldPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Old Password
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <div className="relative">
                                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                                    <input
                                                        id="oldPassword"
                                                        name="oldPassword"
                                                        type={passwordVisible ? 'text' : 'password'}
                                                        autoComplete="new-password"
                                                        value={oldPassword}
                                                        onChange={(e) => {
                                                            setOldPassword(e.target.value);
                                                            setIsModified(true);
                                                        }}
                                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                    <div
                                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                                    >
                                                        {passwordVisible ? <HiEyeOff className="text-blue-600" /> : <HiEye className="text-blue-600" />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                                    New Password
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <div className="relative">
                                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                                    <input
                                                        id="newPassword"
                                                        name="newPassword"
                                                        type={passwordVisible ? 'text' : 'password'}
                                                        autoComplete="new-password"
                                                        value={newPassword}
                                                        onChange={(e) => {
                                                            setNewPassword(e.target.value);
                                                            setIsModified(true);
                                                        }}
                                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Confirm Password
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <div className="relative">
                                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                                    <input
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type={passwordVisible ? 'text' : 'password'}
                                                        autoComplete="new-password"
                                                        value={confirmPassword}
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value);
                                                            setIsModified(true);
                                                        }}
                                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-8 flex items-center space-x-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white justify-center items-center min-w-screen text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                                            disabled={!isModified}
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                    <div>
                                        <div className="mt-2">
                                            {errorMessageVisible && message && <p style={{ color: 'red' }}>{message}</p>}
                                            {successMessageVisible && successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
