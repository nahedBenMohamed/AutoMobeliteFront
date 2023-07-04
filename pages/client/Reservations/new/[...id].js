import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {protectRoute} from "@/utils/auth";
import ReservationForm from "@/components/client/Reservations";
import {TogglersProvider} from "@/components/context/togglers";
import HeaderConnected from "@/components/client/Connected";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import Footer from "@/components/client/Footer";



export default function EditCar(){

    const [carInfo,setCarInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/auth/AllCars?id='+id,{ withCredentials: true }).then(response =>{
            setCarInfo(response.data);
        })
    }, [id]);

    return(
        <main className='overflow-hidden'>
            <TogglersProvider>
                <HeaderConnected/>
                <MobileNavConnected/>
                <div className="mt-30">
                    {carInfo && (
                        <ReservationForm {...carInfo}/>
                    )}
                </div>

                <Footer/>
            </TogglersProvider>
        </main>
    )
}

