import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import {FaCalendar, FaCar, FaEquals, FaMoneyBillWave} from "react-icons/fa";
import { motion } from "framer-motion";
import moment from 'moment/moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import axios from "axios";
import {toast} from "react-toastify";
import {useSession} from "next-auth/react";
import {HiPhone, HiUser} from "react-icons/hi";
import {HiMapPin} from "react-icons/hi2";
import 'boxicons/css/boxicons.min.css';
import { BeatLoader } from "react-spinners";

function ReservationEdit({ id }) {

    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [carPrice, setCarPrice] = useState("");
    const [images, setImages] = useState([]);
    const [model, setModel] = useState("")
    const [livraison, setLivraison] = useState(20)
    const [telephone, setTelephone] = useState('');
    const [agencePhone, setAgencePhone] = useState('');
    const [agenceEmail, setAgenceEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [oldStartDate, setOldStartDate] = useState('')
    const [oldEndDate, setOldEndDate] = useState('');
    const [startTime,setStartTime] =  useState('')
    const [endTime,setEndTime] = useState('')
    const formattedPickupDate = moment(oldStartDate).format('DD MMMM');
    const formattedReturnDate = moment(oldEndDate).format('DD MMMM');
    const { data } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            axios
                .get('/api/client/reservation?id='+id, { withCredentials: true })
                .then((response) => {
                    const rentalData = response.data;
                    setAgencePhone(rentalData.car.Agency.telephone);
                    setAgenceEmail(rentalData.car.Agency.email);
                    setModel(rentalData.car.model)
                    setBrand(rentalData.car.brand);
                    setCarPrice(rentalData.car.price);
                    setPrice(rentalData.total.toString());
                    setImages(rentalData.car.image ? [rentalData.car.image] : []);
                    setOldStartDate(rentalData.startDate);
                    setOldEndDate(rentalData.endDate);
                    const formattedStartTime = moment(rentalData.startTime).format('HH:mm');
                    const formattedEndTime = moment(rentalData.endTime).format('HH:mm');
                    setStartTime(formattedStartTime);
                    setEndTime(formattedEndTime);

                })
                .catch((error) => {
                    if (error.response) {
                        toast.warning('An error occurred while loading data');
                    }
                });
        }
    }, [id]);


    useEffect(() => {
        if (data) {
            const {
                user: {  telephone, address, city },
            } = data;

            setTelephone(telephone);
            setAddress(address);
            setCity(city);
        }
    }, [data]);



    function goBack (){
        router.push("/manage-reservations");
    }
    const goStep2 = () => {
        setIsLoading(true);
        router.push(`/reservations/edit/step2?id=${id}`);
    };


    const UserInputForm = () => (
        <div className="flex">
            <div className="flex-grow flex flex-col space-y-5 mt-4 ml-16 mr-8">
                <h3 className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
                    my personal info
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="mb-4">
                        <label htmlFor="telephone" className="block text-xs mb-1">Téléphone:</label>
                        <div className="relative">
                            <HiPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                                id="telephone"
                                value={telephone}
                                disabled={true}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-xs mb-1">Ville:</label>
                        <div className="relative">
                            <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                                id="city"
                                value={city}
                                disabled={true}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-xs mb-1">Adresse:</label>
                        <div className="relative">
                            <HiMapPin className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                                id="address"
                                value={address}
                                disabled={true}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex text-justify text-xs">
                    <p>
                        En modifiant votre reservation, vous acceptez les
                        <a href="/your-url" target="_blank" rel="noopener noreferrer" className="underline text-blue-600"> Conditions les Conditions Générales de Location et la Politique de confidentialite </a>
                        de Automobelite
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex">
            <div className="flex-grow flex flex-col space-y-5 mt-4 ml-16 mr-8">
                <div className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
                    <h1>{`Hello, ${data?.user.name} ${data?.user.firstname}`}</h1>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    {data && (
                        <>
                            <UserInputForm/>
                        </>
                    )}
                </div>
                <div className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
                    <h1>Politique de modification d'une réservation</h1>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <div className="flex flex-col h-full">
                        <div className="overflow-auto">
                            <p className="mb-4">
                                Sur notre plateforme, nous comprenons que vos plans peuvent changer et que vous pourriez avoir besoin de modifier votre réservation de voiture. Voici notre politique de modification des réservations :
                            </p>
                            <h2 className="text-lg font-semibold mb-2">Comment modifier votre réservation :</h2>
                            <p className="mb-4">
                                Pour modifier votre réservation, veuillez suivre les étapes suivantes :
                                <br />
                                1. Connectez-vous à votre compte sur notre plateforme.
                                <br />
                                2. Accédez à la section "Mes réservations".
                                <br />
                                3. Sélectionnez la réservation que vous souhaitez modifier.
                                <br />
                                4. Cliquez sur le bouton "Modifier la réservation".
                                <br />
                                5. Suivez les instructions pour effectuer les modifications souhaitées.
                                <br />
                                6. Cliquez sur le bouton "EDIT RENTAL" sur votre droite pour commencer le processus.
                            </p>
                            <p className="mb-4">
                                Veuillez noter que les modifications de réservation ne sont autorisées que jusqu'à 24 heures avant le début de la location. Passé ce délai, aucune modification ne pourra être effectuée.
                            </p>
                            <p>
                                Pour toute question ou assistance supplémentaire concernant la modification de votre réservation, n'hésitez à contacter l'agence via leur mobile <a href={`tel:${agencePhone}`} className="font-semibold text-blue-500 hover:text-blue-600">{agencePhone} </a>
                                ou leur email <a href={`mailto:${agenceEmail}`} className="font-semibold text-blue-500 hover:text-blue-600">{agenceEmail}</a>.
                            </p>
                        </div>
                    </div>
                </div>
                <motion.div
                    className="flex mt-4 mb-4"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 20, y: 0 }}
                    transition={{ type: 'spring', stiffness: 90 }}
                >
                    <button
                        onClick={goBack}
                        className="uppercase w-32 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        cancel
                    </button>
                </motion.div>
            </div>
            <div className="flex-grow-0 mr-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="uppercase text-center mt-4 mb-4 text-black text-xl font-extrabold">
                        <h2>Your recent order</h2>
                    </div>
                    <div className="justify-items-center mt-4 w-full h-full">
                        {images.length > 0 ? (
                            <img src={images[0]} alt="Car" className="max-w-56 max-h-56 mb-4 rounded-lg" />
                        ) : (
                            <div className="max-w-56 max-h-56 flex items-center justify-center bg-gray-200 rounded-lg">
                                <img src="/placeholder.png" alt="img" className="w-1/2" />
                            </div>
                        )}
                        <div className="mt-4 flex items-center">
                            <FaCar size={20} className="text-blue-500" />
                            <p className="ml-2 text-xl text-blue-700 font-bold">{brand}</p>
                        </div>
                        <div className="flex flex-col mb-4">
                            <p className="ml-2 text-sm">{model}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <FaCalendar size={20} className="text-blue-500" />
                        <div className="h-4 mx-2"></div>
                        <p className="text-lg">Options selected </p>
                    </div>
                    <div className="flex items-center mt-4">
                        <i className=' text-blue-500 bx bx-map'></i>
                        <div className="border-l h-8 mx-2"></div>
                        <p className="text-xl">
                            {formattedPickupDate}, {startTime}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <i className='text-blue-500 bx bxs-map-pin'></i>
                        <div className="border-l h-8 mx-2"></div>
                        <p className="text-xl">
                            {formattedReturnDate}, {endTime}
                        </p>
                    </div>
                    <hr className="my-4" />
                    <h3 className="text-lg text-black font-extrabold  mb-2">Trajets :</h3>
                    <div className="flex flex-col">
                        <p className="mt-2 text-gray-600 flex items-center">
                            Delivery and collection : {livraison} <FaMoneyBillWave size={20} className="ml-4 text-blue-500" />
                        </p>
                        <p className="mt-2 text-gray-600 flex items-center">
                            Vehicle location : {carPrice}  <FaMoneyBillWave size={20} className="ml-4 text-blue-500" />
                        </p>
                    </div>

                    <hr className="my-4" />
                    <div className="flex flex-col">
                        <motion.div
                            className="flex items-center p-2 rounded-lg w-full"
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 20, y: 0 }}
                            transition={{ type: 'spring', stiffness: 90 }}
                        >
                            <h3 className="text-lg text-black font-extrabold mt-2 mb-2 mr-4">TOTAL </h3>
                            <FaEquals size={20} className="text-blue-400" />
                            <div className="ml-4">
                                <p className="text-xl text-blue-400 font-bold">{price} DT</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex justify-center mt-4 mb-4"
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 20, y: 0 }}
                            transition={{ type: 'spring', stiffness: 90 }}
                        >
                            <button
                                onClick={goStep2}
                                className="uppercase w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                {isLoading ? "Wait..." : "Edit rental"}
                                {isLoading && <BeatLoader color={"#ffffff"} size={10} css={`margin-left: 10px;`} />}
                            </button>
                        </motion.div>
                        <div className="flex text-justify text-sm">
                            <p>Une caution de 300€ sera demandée automatiquement le jour de votre location</p>
                        </div>
                        <div className="flex text-justify text-sm">
                            <p>Cette somme sera libérée 7 jours après le retour du véhicule sous réserve
                                que les conditions générales de location aient été respectées</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReservationEdit;