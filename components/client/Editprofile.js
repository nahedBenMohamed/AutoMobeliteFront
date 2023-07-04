import React, {useEffect, useState} from 'react';
import {
    HiUser,
    HiMail,
    HiPhone,
    HiLockClosed,
    HiOfficeBuilding,
    HiLocationMarker,
    HiEyeOff,
    HiEye
} from 'react-icons/hi';
import {BiIdCard} from "react-icons/bi";
import {IoMdSettings} from "react-icons/io";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {getCountryCallingCode, parsePhoneNumberFromString} from "libphonenumber-js";
import {FiPlus, FiTrash2} from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';


const EditProfile = () => {
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [drivingLicense, setDrivingLicense] = useState('');
    const [telephone, setTelephone] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isModified, setIsModified] = useState(false);

    const getDefaultTelephone = () => {
        const defaultCountryCode = getCountryCallingCode('TN');
        return `+${defaultCountryCode}`;
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/client/profile', {withCredentials: true});
                const {name, firstname, email, telephone, numPermis, address, city, image} = response.data.user;
                setName(name);
                setFirstname(firstname);
                setDrivingLicense(numPermis);
                setTelephone(telephone);
                setCity(city);
                setAddress(address);
                setImages(image ? [image] : []);
                setEmail(email);
            } catch (error) {
                if (error.response) {
                    toast.warning('An error occurred while loading data',
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
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

        // Convert telephone to a string
        const telephoneString = String(telephone);

        // Validate the phone number using the country code for Tunisia (TN)
        const phoneNumber = parsePhoneNumberFromString(telephoneString, 'TN');

        // Additional validation for the phone number
        const phoneNumberRegex = /^\+216\d{8}$/; // Matches "+216" followed by 8 digits
        const isPhoneNumberValid = phoneNumber && phoneNumber.isValid() && phoneNumberRegex.test(telephoneString);

        if (!isPhoneNumberValid) {
            toast.error('Please enter a valid Tunisian phone number',
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            return;
        }

        if (isModified && newPassword !== confirmPassword && newPassword !== '') {
            toast.error('Different password',
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            return;
        }

        if (isModified && newPassword.length < 8 && newPassword !== '') {
            toast.error('The password must have at least 8 characters.',
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            return;
        }

        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
        if (isModified && !passwordRegex.test(newPassword) && newPassword !== '') {
            toast.info('The password must contain at least Aa1@',
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            return;
        }

        const data = {
            name,
            firstname,
            email,
            telephone,
            drivingLicense,
            address,
            city,
            image: images?.length > 0 ? images[0] : null,
            oldPassword,
            newPassword
        };
        try {
            const response = await axios.put(
                '/api/client/profile',
                {...data},
                {withCredentials: true}
            );
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsEditingPassword(false);
            toast.success('Successfully updated', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.error, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    }

    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            data.append("file", files[0]);
            try {
                const res = await axios.post("/api/client/upload", data, {withCredentials: true});
                const {message, imagePath} = res.data;
                if (message === "Image uploaded successfully") {
                    setImages([imagePath]);
                    toast.info("Image uploaded successfully",
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                } else {
                    toast.warning("Upload failed",
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
            } catch (error) {
                if (error.response) {
                    toast.warning('An error occurred while downloading the image',
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "colored",
                        });
                }
            }
        }
    }


    async function deleteImage() {
        if (images.length === 0) {
            toast.error("No image to delete", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        setImages([]);
        try {
            await axios.delete("/api/client/delete", {withCredentials: true});
            toast.success("Image deleted successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            setImages([]);

        } catch (error) {
            toast.error("An error occurred while deleting the image.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
        setIsModified(true);
    };

    const handleFirstNameChange = (e) => {
        setFirstname(e.target.value);
        setIsModified(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsModified(true);
    };

    const handleDrivingLicenseChange = (e) => {
        setDrivingLicense(e.target.value);
        setIsModified(true);
    };

    const handlePhoneNumberChange = (e) => {
        setTelephone(e.target.value);
        setIsModified(true);
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setIsModified(true);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
        setIsModified(true);
    };

    const handleEditPassword = () => {
        setIsEditingPassword(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsModified(true);
    };

    const handleCancelEditPassword = () => {
        setIsEditingPassword(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsModified(false);
    };

    return (
        <div className=" flex flex-col items-center justify-center min-h-screen">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme="colored"
            />
            <div className="mt-52 flex flex-col items-center justify-center max-w-6xl">
                <div className="flex items-center">
                    <div className="bold-text text-xl text-black">MANAGE YOUR PROFILE</div>
                    <IoMdSettings className="ml-2 text-blue-500" size={24}/>
                </div>
                <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-xl">
                    <div className="flex flex-col md:flex-row md:ml-8">
                        <div className="flex flex-col items-center md:mr-8">
                            <div className="w-full h-48 relative">
                                {images && images.length > 0 ? (
                                    <img src={images[0]} alt="Car" className="w-full h-full object-cover rounded-lg"/>
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                        <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8 flex flex-row space-x-2">
                                <input type="file" id="image" name="image" onChange={uploadImage} hidden/>
                                <label htmlFor="image"
                                       className="text-blue-500 hover:text-blue-700 mx-1 cursor-pointer">
                                    Add Image
                                </label>
                                <button type="button" className="text-red-500 hover:text-red-700" onClick={deleteImage}>
                                    Delete Image
                                </button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleSubmit} className="flex-1 ml-0 md:ml-32 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <HiUser
                                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="given-name"
                                            value={name}
                                            onChange={handleNameChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative">
                                        <HiUser
                                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            type="text"
                                            autoComplete="firstname"
                                            value={firstname}
                                            onChange={handleFirstNameChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative">
                                        <HiMail
                                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative">
                                        <BiIdCard
                                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                        <input
                                            id="drivingLicense"
                                            name="drivingLicense"
                                            type="text"
                                            autoComplete="off"
                                            value={drivingLicense}
                                            onChange={handleDrivingLicenseChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative">
                                        <HiPhone
                                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="text"
                                            autoComplete="off"
                                            value={telephone || getDefaultTelephone()}
                                            onChange={handlePhoneNumberChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative">
                                        <HiOfficeBuilding
                                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            autoComplete="off"
                                            value={city}
                                            onChange={handleCityChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="relative">
                                        <HiLocationMarker
                                            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            autoComplete="off"
                                            value={address}
                                            onChange={handleAddressChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                {!isEditingPassword ? (
                                    <button
                                        type="button"
                                        className="justify-end mt-4 text-blue-600 focus:outline-none"
                                        onClick={handleEditPassword}
                                    >
                                        Modifier
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="mt-4 text-red-600 focus:outline-none"
                                        onClick={handleCancelEditPassword}
                                    >
                                        Annuler
                                    </button>
                                )}
                                {!isEditingPassword ? (
                                    <p className="mt-2">*********</p>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="oldPassword"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Ancien mot de passe
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <div className="relative">
                                                <HiLockClosed
                                                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
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
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    {passwordVisible ? (
                                                        <HiEyeOff
                                                            className="h-5 w-5 text-gray-400 cursor-pointer"
                                                            onClick={() => setPasswordVisible(false)}
                                                        />
                                                    ) : (
                                                        <HiEye
                                                            className="h-5 w-5 text-gray-400 cursor-pointer"
                                                            onClick={() => setPasswordVisible(true)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <label
                                                htmlFor="newPassword"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Nouveau mot de passe
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <div className="relative">
                                                <HiLockClosed
                                                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
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
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    {passwordVisible ? (
                                                        <HiEyeOff
                                                            className="h-5 w-5 text-gray-400 cursor-pointer"
                                                            onClick={() => setPasswordVisible(false)}
                                                        />
                                                    ) : (
                                                        <HiEye
                                                            className="h-5 w-5 text-gray-400 cursor-pointer"
                                                            onClick={() => setPasswordVisible(true)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <label
                                                htmlFor="confirmPassword"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Confirmer le mot de passe
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <div className="relative">
                                                <HiLockClosed
                                                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
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
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    {passwordVisible ? (
                                                        <HiEyeOff
                                                            className="h-5 w-5 text-gray-400 cursor-pointer"
                                                            onClick={() => setPasswordVisible(false)}
                                                        />
                                                    ) : (
                                                        <HiEye
                                                            className="h-5 w-5 text-gray-400 cursor-pointer"
                                                            onClick={() => setPasswordVisible(true)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        type="submit"
                                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EditProfile;
