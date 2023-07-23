import React, { useState } from 'react';
import { HiMail } from 'react-icons/hi';
import axios from 'axios';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from "next/router";
import {BeatLoader} from "react-spinners";

const ForgetPage = () => {
    const [email, setEmail] = useState('');
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!email) {
            toast.error('Please complete all fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/reset-password', { email });
            toast.success('Email sent successfully');
            setIsLoading(false);
            setTimeout(() => {
                router.push('/redirect-password');
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                toast.error(errorMessage);
            }  else {
                toast.error('An error has occurred.');
            }
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-4xl">
                <p className="mt-1 text-justify text-xl font-normal leading-9 tracking-tight text-gray-900">
                    Please enter below the e-mail address you use to log in to your https://www.automobelite.tn account.
                    You will receive an email with instructions on how to reset your password.
                </p>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <div className="mt-2">
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
                                <div>
                                    <button
                                        type="submit"
                                        className="uppercase mt-8 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {isLoading ? "Wait..." : "Reset your password"}
                                        {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                                    </button>
                                </div>
                            </div>
                        </form>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href="/authentification/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPage;