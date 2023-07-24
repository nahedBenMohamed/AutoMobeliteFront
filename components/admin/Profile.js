import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {HiEye, HiEyeOff,  HiLockClosed, HiMail, HiUser} from 'react-icons/hi';
import {FiPlus, FiTrash2} from "react-icons/fi";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from "next/router";

function Profile() {

    const [firstname, setFirstName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isModified, setIsModified] = useState(false);
    const router = useRouter()


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/manage-profile/profile', { withCredentials: true });
                const { name, firstname, image, email } = response.data.userAgency;
                setName(name);
                setFirstName(firstname);
                setImages(image ? [image] : []);
                setEmail(email);
            } catch (error) {
                if (error.response) {
                    toast.warning('An error occurred while loading data');
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

        if (isModified && newPassword !== confirmPassword && newPassword !== '') {
            toast.warning('Different password');
            return;
        }

        if (isModified && newPassword.length < 8 && newPassword !== '') {
            toast.error('The password must have at least 8 characters.');
            return;
        }

        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
        if (isModified && !passwordRegex.test(newPassword) && newPassword !== '') {
            toast.info('The password must contain at least Aa1@');
            return;
        }

        const data = {
            name,
            firstname,
            email,
            image: images?.length > 0 ? images[0] : null,
            oldPassword,
            newPassword
        };
        try {
            const response = await axios.put(
                '/api/manage-profile/profile',
                {...data},
                {withCredentials: true}
            );
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsEditingPassword(false);
            toast.success('Successfully updated');
            setTimeout(() => {
                router.push('/admin/dashboard/home')
            }, 1000);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.error);
            }
        }
    }
    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            data.append("file", files[0]);
            try {
                const res = await axios.post("/api/manage-profile/upload", data, {withCredentials: true});
                const {message, imagePath} = res.data;
                if (message === "Image uploaded successfully") {
                    setImages([imagePath]);
                    toast.info("Image uploaded successfully");
                } else {
                    toast.warning("Upload failed");
                }
            } catch (error) {
                if (error.response) {
                    toast.warning('An error occurred while downloading the image');
                }
            }
        }
    }


    async function deleteImage() {
        if (images.length === 0) {
            toast.error("No image to delete");
            return;
        }
        setImages([]);
        try {
            await axios.delete("/api/manage-profile/delete", {withCredentials: true});
            toast.success("Image deleted successfully!");
            setImages([]);

        } catch (error) {
            toast.error("An error occurred while deleting the image.");
        }
    }


    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
        setIsModified(true);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setIsModified(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsModified(true);
    };

    const handleEditPassword = () => {
        setIsEditingPassword(true);
    };

    const handleCancelEditPassword = () => {
        setIsEditingPassword(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="flex flex-col items-center justify-center max-w-6xl">
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
            <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-1 ml-8">
                    <div className="flex flex-col items-center mr-8">
                        <div className="w-full h-48 relative">
                            {images && images.length > 0 ? (
                                <img src={images[0]} alt="Car" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                    <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img" /></span>
                                </div>
                            )}
                        </div>
                        <div className=" mt-4 flex flex-row space-x-2">
                            <div className="mt-1">
                                <input type="file" id="image" name="image" onChange={uploadImage} hidden/>
                                <label htmlFor="image" className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                    <FiPlus size={18} />
                                </label>
                            </div>
                            <button type="button" className="mr-2 text-red-500 hover:text-red-700" onClick={deleteImage}>
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <form onSubmit={handleSubmit} className="flex-1 ml-32 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
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
                                    <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
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
                                    <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
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
                                                <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
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
                                                <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
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
                                                <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
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
    );
}

export default Profile;
