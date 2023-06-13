import React, { useState } from "react";
import { useRouter } from 'next/router';
import {HiEye, HiEyeOff, HiLockClosed, HiMail} from "react-icons/hi";

const LoginAdmin = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [passwordVisible, setPasswordVisible]= useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/user-agency/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            await router.push('/admin/dashboard/home');
        }
        else {
            const errorData = await response.json(); // Extraire les données de la réponse en cas d'erreur
            setMessage(errorData.error); // Utiliser le message d'erreur de la réponse
        }
    };


    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Welcome Back
                </h1>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4 grid grid-cols-2 gap-4">
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
                                        onChange={(e) => setEmail(e.target.value)}
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
                                <div className="text-sm">
                                    <a href="/admin/auth/forget" className="font-semibold text-blue-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="relative">
                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                            <div className="mt-2">
                                {message && <p style={{ color: message.includes('incorrect') ? 'red' : 'green' }}>{message}</p>}
                            </div>

                            <div>
                                <button type="submit" className="mt-8 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <a href="/admin/auth/register" className="font-bold leading-6 text-blue-600 hover:text-gray-500">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
