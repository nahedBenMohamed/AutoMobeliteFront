import React, { useState } from "react";
import { useRouter } from 'next/router';
import {HiEye, HiEyeOff, HiLockClosed, HiMail} from "react-icons/hi";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BeatLoader} from "react-spinners";

const LoginAdmin = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible]= useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            toast.error('Please complete all fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                toast.success('successfully connected');
                setIsLoading(false);
                setTimeout(() => {
                    router.push('/admin/dashboard/home/');
                }, 1000);

            } else {
                const errorData = await response.json();
                toast.error(errorData.error)
                setIsLoading(false);
            }
        } catch (error) {
            toast.error('An error occurred while trying to log in. Please try again.')
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden rounded-lg shadow-lg ">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
            <div className="w-full p-4 bg-white rounded-lg shadow-lg lg:max-w-xl">
                <h1 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Welcome Back
                </h1>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4 grid grid-cols-2 gap-4"></div>
                        <div>
                            <div className="mt-2 mb-4">
                                <div className="relative">
                                    <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mt-2 mb-4">
                                <div className="relative">
                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Enter your password"
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
                            <div>
                                <div className="flex items-center justify-end mt-4 mb-2">
                                    <a href="/admin/auth/forget" className="font-semibold text-blue-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="uppercase mt-4 mb-4 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    {isLoading ? "Wait..." : "login"}
                                    {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
