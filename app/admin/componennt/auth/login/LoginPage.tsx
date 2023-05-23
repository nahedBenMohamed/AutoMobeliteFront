import Link from "next/link";
import React from "react";
import {HiLockClosed, HiMail} from "react-icons/all";

function LoginPage() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-bold text-center text-gray-700 ">Welcome Back</h1>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <div className="col-span-2">
                                <label htmlFor="email" className="block font-semibold">
                                    Email
                                </label>
                                <div className="relative">
                                    <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        //required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block font-semibold">
                                    Password
                                </label>

                                <div className="text-sm">
                                    <Link href="/admin/dashboard/auth/forget" className="font-semibold text-blue-600 hover:text-indigo-500">
                                        Forgot password??
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-2">
                                <div className="relative">
                                    <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        //required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <button className=" w-full px-4 py-2 text-center text-white transition-colors duration-200 transform  bg-blue-600  focus:outline-none focus:bg-gray-600">
                                <Link href="/admin/dashboard/home" >
                                    Login
                                </Link>
                            </button>

                        </div>
                    </form>

                    <div className="relative flex items-center justify-center w-full mt-6 border border-t">
                        <div className="absolute px-5 bg-white">Or</div>
                    </div>

                    <p className="mt-4 text-sm text-center text-gray-700">
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        Don't have an account?{" "}
                        <Link
                            href="/admin/dashboard/auth/register"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default LoginPage;