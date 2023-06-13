import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {ReactSortable} from "react-sortablejs";
import Spinner from "@/components/admin/Spinner";
import Link from "next/link";
export default function CarForm({
    id,
    agenceName: existingAgenceName,
    marque: existingMarque,
    annee: existingAnnee,
    kilometrage: existingKilometrage,
    modele: existingModele,
    prix: existingPrix,
    etat: existingEtat,
    matricule: existingMatricule,
    images: existingImages,
    }) {
    const [agenceName, setAgenceName] = useState(existingAgenceName || "");
    const [marque, setMarque] = useState(existingMarque || "");
    const [annee, setAnnee] = useState(existingAnnee || "");
    const [kilometrage, setKilometrage] = useState(existingKilometrage || "");
    const [modele, setModele] = useState(existingModele || "");
    const [prix, setPrix] = useState(existingPrix || "");
    const [etat, setEtat] = useState(existingEtat || "");
    const [matricule, setMatricule] = useState(existingMatricule || "");
    const [images, setImages] = useState(Array.isArray(existingImages) ? existingImages : []);
    const [isUploading,setIsUploading] = useState(false)
    const [goToCars, setGoToCars] = useState(false);
    const router = useRouter();
    console.log({ id });

    async function saveCar(ev) {
        ev.preventDefault();
        const data = { agenceName, marque, annee, kilometrage, modele, prix, etat,matricule,images };

        if (id) {
            // Update
            await axios.put("/api/cars/cars/", { ...data, id },{ withCredentials: true },);
        } else {
            // Create
            await axios.post("/api/cars/cars", data,{ withCredentials: true });
        }
        setGoToCars(true);
    }

    if (goToCars) {
        router.push("/admin/dashboard/cars");
    }

    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            data.append("id", id);
            const res = await axios.post("/api/cars/upload", data,{ withCredentials: true },);
            const { message, imagePath } = res.data;

            if (message === "Image uploaded successfully") {
                setImages((oldImages) => [...oldImages, imagePath]);
            } else {
                console.error("Upload failed");
            }
            setIsUploading(false);
        }
    }

    function updateImageOrder(images){
        setImages(images)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Gestion Flottes vehicules
                    </h2>
                </div>
                <form onSubmit={saveCar} className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="agence-name" className="sr-only">Nom Agence</label>
                            <input id="agence-name" name="agence-name" type="text" value={agenceName} onChange={(ev) => setAgenceName(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Nom Agence"/>
                        </div>
                        <div>
                            <label htmlFor="brand-car" className="sr-only">Marque Voiture</label>
                            <input id="brand-car" name="brand-car" type="text" value={marque} onChange={(ev) => setMarque(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Marque Voiture"/>
                        </div>
                        <div>
                            <label htmlFor="model-car" className="sr-only">Modèle Voiture</label>
                            <input id="model-car" name="model-car" type="text" value={modele} onChange={(ev) => setModele(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Modèle Voiture"/>
                        </div>
                        <div>
                            <label htmlFor="car-year" className="sr-only">Année Voiture</label>
                            <input id="car-year" name="car-year" type="text" value={annee} onChange={(ev) => setAnnee(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Année Voiture"/>
                        </div>
                        <div>
                            <label htmlFor="car-kilometer" className="sr-only">Kilométrage</label>
                            <input id="car-kilometer" name="car-kilometer" type="text" value={kilometrage} onChange={(ev) => setKilometrage(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Kilométrage"/>
                        </div>
                        <div>
                            <label htmlFor="car-price" className="sr-only">Prix Par Jour</label>
                            <input id="car-price" name="car-price" type="text" value={prix} onChange={(ev) => setPrix(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Prix Par Jour"/>
                        </div>
                        <div>
                            <label htmlFor="car-status" className="sr-only">Etat de la voiture</label>
                            <input id="car-status" name="car-status" type="text" value={etat} onChange={(ev) => setEtat(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Etat de la voiture"/>
                        </div>
                        <div>
                            <label htmlFor="matricule" className="sr-only">Matricule</label>
                            <input id="matricule" name="matricule" type="text" value={matricule} onChange={(ev) => setMatricule(ev.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Matricule"/>
                        </div>
                    </div>

                    <div className="mb-2 flex flex-wrap gap-2">
                        <ReactSortable
                            list={images}
                            className="flex flex-wrap gap-3"
                            setList={updateImageOrder}
                        >
                            {!!images?.length && images.map((images) => (
                                <div key={images} className="h-24">
                                    <img src={images} alt="" className="rounded-lg"/>
                                </div>
                            ))}
                        </ReactSortable>
                        {isUploading && (
                            <div className="h-24 p-1 flex items-center">
                                <Spinner/>
                            </div>
                        )}
                        <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                />
                            </svg>
                            <div>upload</div>
                            <input type="file" onChange={uploadImage} className="hidden" />
                        </label>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button type="submit" className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                            Save
                        </button>
                        <Link href={"/admin/dashboard/cars"} type="button" className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                           Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
