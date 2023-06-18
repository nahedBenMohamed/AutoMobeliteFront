import React, { useState } from "react";
import { useRouter } from 'next/router';
import {HiEye, HiEyeOff, HiLockClosed, HiMail, HiUser} from "react-icons/hi";

const RegisterAdmin = () => {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible]= useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Vérification des données côté client (facultatif)
        if (!name || !firstname || !email || !password) {
            setErrorMessage('Veuillez remplir tous les champs.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Le mot de passe doit avoir au moins 8 caractères.");
            return;
        }

        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMessage("Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.");
            return;
        }

        try {
            const response = await fetch('/api/admin/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, firstname,email, password, role: 'admin' }),
            });

            if (response.ok) {
                await router.push('/admin/auth/login');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
            }
        } catch (errorData) {
           setErrorMessage(errorData.message)
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign Up in Automobelite
                </h2>


                <div className=" mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} >
                        <div className=" mt-4 grid grid-cols-2 gap-4">
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
                                        value={firstname} onChange={(e) => setFirstName(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block font-semibold">
                                    Last Name
                                </label>
                                <div className="relative" >
                                    < HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        value={name} onChange={(e) => setName(e.target.value)}
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
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
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

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                        Confirm password
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
                                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="mt-8 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Create an account
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href="/admin/auth/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterAdmin;
