import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import { HiMail, HiUser} from "react-icons/hi";
import axios from "axios";

const EditAdmin = ({id}) => {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [errorMessageVisible, setErrorMessageVisible] = useState(true);
    const [goToAdmin, setGoToAdmin] = useState(false);

    useEffect(() => {
        if (id) {
            axios
                .get("/api/super-admin/manage-admin?id=" + id, { withCredentials: true })
                .then((response) => {
                    const adminData = response.data;
                    setName(adminData.name);
                    setFirstName(adminData.firstname);
                    setEmail(adminData.email);
                    setAgencyName(adminData.Agency?.name);
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage("Erreur lors du chargement depuis la base de données");
                });
        }
    }, [id]);

    async function saveAdmin(ev) {
        ev.preventDefault();

        // Vérification des données côté client (facultatif)
        if (!name || !firstname || !email || !agencyName) {
            setErrorMessage("Veuillez remplir tous les champs.");
            setErrorMessageVisible(true);
            setTimeout(() => {
                setErrorMessageVisible(false);
            }, 5000);
            return;
        }

        const data = { name, firstname, email, agencyName };
        try {
            if (id) {
                // Update
                await axios.put("/api/super-admin/manage-admin/", { ...data, id });
            }
            setGoToAdmin(true);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
                setErrorMessageVisible(true);
                setTimeout(() => {
                    setErrorMessageVisible(false);
                }, 5000);
            }
        }
    }


    if (goToAdmin) {
        router.push("/super-admin/dashboard/manage-admin");
    }
    function goBack (){
        router.push('/super-admin/dashboard/manage-admin')
        return null
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Edit Admin</h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={saveAdmin}>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="mt-2 mb-4">
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
                            <div className="mt-2 mb-4">
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
                                    <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                    <input
                                        id="agencyName"
                                        name="agencyName"
                                        type="text"
                                        autoComplete="agencyName"
                                        placeholder="Enter agency name"
                                        value={agencyName}
                                        onChange={(e) => setAgencyName(e.target.value)}
                                        className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mt-2">
                                {errorMessageVisible && errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </div>
                        </div>
                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-1/2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save Admin
                            </button>
                            <button
                                type="button"
                                className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
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

export default EditAdmin;
