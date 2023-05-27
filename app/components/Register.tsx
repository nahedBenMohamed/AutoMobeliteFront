import React, {useState, FormEvent} from "react";
import {EmailOutline, LockOutline, AccountOutline} from "mdi-material-ui";
import Link from "next/link"

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Ajoutez votre logique de soumission de formulaire ici
        console.log(formData);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <div className="mt-6">
                <h1 className="text-[1.0em] font-bold text-center text-gray-700 ">Welcome</h1>
                </div>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto" >
                    <div className=" mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block font-semibold">
                                First Name
                            </label>
                            <div className="relative">
                                <AccountOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block font-semibold">
                                Last Name
                            </label>
                            <div className="relative" >
                                <AccountOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="email" className="block font-semibold">
                                Email
                            </label>
                            <div className="relative">
                                <EmailOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="password" className="block font-semibold">
                                Password
                            </label>
                            <div className="relative">
                                <LockOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="confirmPassword" className="block font-semibold">
                                Confirm password
                            </label>
                            <div className="relative">
                                <LockOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                    <Link href={"/authentification/Login"}>
                        <button type="submit" className="mt-6 bg-center w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                            Create an account
                        </button>
                    </Link>
                    <p className="mt-4 text-sm text-center text-gray-700">
                        already registered?{" "}
                        <Link href={"/authentification/Login"} className="font-medium text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>

    );
};

export default Register;