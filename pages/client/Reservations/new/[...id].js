import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import ReservationForm from "@/components/client/Reservations";
import HeaderConnected from "@/components/client/HeaderConnected";
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
                <HeaderConnected/>
                <div className="mt-30">
                    {carInfo && (
                        <ReservationForm {...carInfo}/>
                    )}
                </div>

                <Footer/>

        </main>
    )
}

