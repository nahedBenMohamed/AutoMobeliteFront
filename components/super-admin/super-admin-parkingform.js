import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {HiHome, HiLocationMarker, HiUser} from "react-icons/hi";
import axios from "axios";
import {FiPlus, FiTrash2} from "react-icons/fi";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BeatLoader} from "react-spinners";

const SuperAdminParkingForm = ({ id }) => {

    const router = useRouter();
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [images, setImages] = useState([]);
    const [goToParking, setGoToParking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (id) {
            axios
                .get("/api/super-admin/parking-agence/parking?id=" + id, { withCredentials: true })
                .then((response) => {
                    const parkingData = response.data;
                    setName(parkingData.name);
                    setAddress(parkingData.address);
                    setCity(parkingData.city);
                    setImages(parkingData.image ? [parkingData.image] : []);
                    setAgencyName(parkingData.Agency?.name);
                })
                .catch((error) => {
                    if (error.response) {
                        toast.warning('An error occurred while loading data');
                    }
                });
        }
    }, [id]);

    async function saveParking(ev) {
        ev.preventDefault();
        setIsLoading(true);

        // Vérification des données côté client (facultatif)
        if (!name || !city || !address) {
            toast.error('Please complete all fields.');
            setIsLoading(false);
            return;
        }

        const data = {
            name,
            address,
            city,
            image: images && images.length > 0 ? images[0] : null,
            agencyName
        };
        try {
            if (id) {
                // Update
                await axios.put("/api/super-admin/parking-agence/parking/", { ...data, id });
            } else {
                // Create
                await axios.post("/api/super-admin/parking-agence/parking/", data);
            }
            toast.success('The parking has been successfully registered!');
            setIsLoading(false);
            setTimeout(() => {
                setGoToParking(true);
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                toast.warning(errorMessage);
                setIsLoading(false);
            } else {
                toast.error('An error occurred. Please try again later.');
                setIsLoading(false);
            }
        }
    }


    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            data.append("file", files[0]);
            data.append("id", id);
            try {
                const res = await axios.post("/api/super-admin/parking-agence/upload", data);
                const {message, imagePath} = res.data;
                if (message === "Image uploaded successfully") {
                    setImages([imagePath]);
                    toast.info(res.data.message);
                } else {
                    toast.warning("Upload failed");
                }
            } catch (error) {
                if (error.response) {
                    toast.warning(error.response.data.error);
                }
            }
        }
    }

    async function deleteImage() {
        if (images.length === 0) {
            toast.error("No image to delete");
            return;
        }
        try {
            await axios.delete(`/api/super-admin/parking-agence/delete?id=${id}`, {withCredentials: true});
            toast.success("Image deleted successfully!");
            setImages([]);
        } catch (error) {
            if (error.response) {
                toast.error("An error occurred while deleting the image.");
            }
        }
    }

    if (goToParking) {
        router.push("/super-admin/dashboard/parking");
    }

    function goBack (){
        router.push("/super-admin/dashboard/parking");
    }

    return (
        <div className="flex flex-col items-center justify-center max-w-6xl">
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
            <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {id ? "Edit Parking" : "Add Parking"}
                </h2>
                <div className="flex flex-1 ml-8">
                    <div className="flex flex-col items-center mr-8">
                        <div className="w-48 h-48 mb-4 relative">
                            {images.length > 0 ? (
                                <img src={images[0]} alt="Car" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                    <span className="text-gray-500 text-lg"><img src="/placeholder.png" alt="img"/></span>
                                </div>
                            )}
                        </div>
                        {id ? (
                            <div className="flex flex-row space-x-2">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={uploadImage}
                                    hidden
                                />
                                <label htmlFor="image"
                                       className=" text-blue-500 hover:text-blue-700 mx-1 cursor-pointer">
                                    <FiPlus size={18}/>
                                </label>
                                <button type="button" className="-mt-1.5 text-red-500 hover:text-red-700"
                                        onClick={deleteImage}>
                                    <FiTrash2 size={18}/>
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <form onSubmit={saveParking} className="flex-1 ml-16 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="given-name"
                                    value={name}
                                    placeholder="Enter Parking Name"
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600"/>
                                <input
                                    id="nameAgency"
                                    name="nameAgency"
                                    type="text"
                                    autoComplete="given-name"
                                    value={agencyName}
                                    placeholder="Enter Agency Name"
                                    onChange={(e) => setAgencyName(e.target.value)}
                                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="new-location"
                                    value={city}
                                    placeholder="Enter City Name"
                                    onChange={(e) => setCity(e.target.value)}
                                    className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="relative">
                                <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    autoComplete="new-location"
                                    value={address}
                                    placeholder="Enter Address"
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="uppercase ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                {isLoading ? "Wait" : id ? "Update" : "Save"}
                                {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                            </button>
                            <button
                                type="button"
                                className="uppercase ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                onClick={goBack}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminParkingForm;
