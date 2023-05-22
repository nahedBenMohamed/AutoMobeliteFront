import React, { useState } from "react";
import {HiLockClosed} from "react-icons/all";

const ForgetPage = () => {
    const [email, setEmail] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ajoutez ici la logique de soumission du formulaire
        console.log(email);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-xl text-center text-gray-700 ">Voulez-vous vraiment reinstialiser votre mot de passe ?</h1>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div>
                        <label htmlFor="email" className="block font-semibold">
                            Email
                        </label>
                        <div className="relative">
                            <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Reset your password
                    </button>
                    <p className="mt-4 text-sm text-center text-gray-700">
                        Login page ?{" "}
                        <a
                            href="/auth/login"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgetPage;
