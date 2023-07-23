import React, { useState } from "react";
import { useRouter } from 'next/router';
import {HiEye, HiEyeOff, HiHome, HiLocationMarker, HiLockClosed, HiMail, HiPhone, HiUser} from "react-icons/hi";
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js';
import {BiIdCard} from "react-icons/bi";
import {FaHandPeace} from "react-icons/fa";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BeatLoader} from "react-spinners";

const RegisterClient = () => {

    const router = useRouter();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [firstname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [numPermis, setNumPermis] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Function to set the default telephone value with country code
    const getDefaultTelephone = () => {
        const defaultCountryCode = getCountryCallingCode('TN');
        return `+${defaultCountryCode}`;
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Vérification des données côté client (facultatif)
        if (!name || !firstname || !email || !telephone || !numPermis || !password || !confirmPassword || !address || !city || !image) {
            toast.error('Please fill in all fields and upload the license image')
            setIsLoading(false);
            return;
        }

        // Convert telephone to a string
        const telephoneString = String(telephone);

        // Validate the phone number using the country code for Tunisia (TN)
        const phoneNumber = parsePhoneNumberFromString(telephoneString, 'TN');

        // Additional validation for the phone number
        const phoneNumberRegex = /^\+216\d{8}$/; // Matches "+216" followed by 8 digits
        const isPhoneNumberValid = phoneNumber && phoneNumber.isValid() && phoneNumberRegex.test(telephoneString);

        if (!isPhoneNumberValid) {
            toast.error('Please enter a valid Tunisian phone number')
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters')
            setIsLoading(false);
            return;
        }

        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('The password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('firstname', firstname);
        formData.append('email', email);
        formData.append('telephone', telephone);
        formData.append('numPermis', numPermis);
        formData.append('password', password);
        formData.append('address', address);
        formData.append('city', city);
        if (image instanceof File) { // Vérifiez que image est bien un objet File
            formData.append('image', image);
        }

        try {
            const response = await fetch('/api/auth/register-client', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setIsLoading(false);
                setTimeout(() => {
                    router.push('/redirect');
                }, 2000);
            } else {
                toast.error(data.message);
                setIsLoading(false);
            }
        } catch (error) {
            toast.error('An error has occurred.');
        }
    }

    return (
        <div className="flex flex-col  items-center justify-center min-h-screen">
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
            <div className="w-full mt-16 max-w-xl px-6 py-4 bg-white rounded-md shadow-md">
                <h2 className="mb-8 text-2xl font-bold text-center text-gray-900">
                      <span className="inline-flex items-center">
                        Welcome
                        <FaHandPeace className="ml-2 text-blue-600" size={26} />
                      </span>
                </h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="Enter your first name"
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    placeholder="Enter your last name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <div className="relative">
                            <BiIdCard className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                                id="permis"
                                name="permis"
                                type="text"
                                autoComplete="text"
                                placeholder="Enter your Tunisia permis drive"
                                value={numPermis}
                                onChange={(e) => setNumPermis(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="mr-2">
                            <div className="relative">
                                <HiPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="phone"
                                    name="phone"
                                    type="phone"
                                    autoComplete="phone"
                                    placeholder="Enter your Tunisia phone number"
                                    value={telephone || getDefaultTelephone()} // Set default value with country code
                                    onChange={(e) => setTelephone(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="ml-2">
                            <div className="relative">
                                <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    placeholder="Enter your city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 mt-4">
                        <div className="relative">
                            <HiHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                                id="address"
                                name="address"
                                type="text"
                                autoComplete="address"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <div className="relative">
                            <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={passwordVisible ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <label htmlFor="image" className="block mb-2 text-blue-600 ">
                        Upload your driving licence image here:
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full"
                    />
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="uppercase w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {isLoading ? "Wait..." : "Create account"}
                            {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                        </button>
                    </div>
                </form>
                <p className="mt-8 text-sm text-center text-gray-500">
                    Already have an account?{' '}
                    <a href="/authentification/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Login
                    </a>
                </p>
            </div>
        </div>

    );
};

export default RegisterClient;
