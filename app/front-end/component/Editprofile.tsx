import React, { useState, ChangeEvent, FormEvent } from "react";
import {HiLockClosed, HiMail, HiUser} from "react-icons/all";

const Editprofile = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Ajoutez ici votre logique de mise à jour du profil
        console.log(formData);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                <h2 className="text-2xl font-bold mb-4">Your account Information</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="flex items-center space-x-2 font-semibold">
                            First Name
                        </label>
                        <div className="relative">
                            <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastName" className="flex items-center space-x-2 font-semibold">
                            Last Name
                        </label>
                        <div className="relative">
                            <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="flex items-center space-x-2 font-semibold">
                            Email
                        </label>
                        <div className="relative">
                            <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="flex items-center space-x-2 font-semibold">
                            Password
                        </label>
                        <div className="relative">
                            <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="flex items-center space-x-2 font-semibold">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600"
                    >
                        <a href="/Homec">Save Changes</a>
                    </button>
                </form>
            </div>
        </div>

    );
}


export default Editprofile;
