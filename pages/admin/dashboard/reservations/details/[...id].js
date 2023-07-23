import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";
import ReservationDetails from "@/components/admin/DetailsReservation";
import Footer from "@/components/admin/Footer";



export default function DetailsRental({session}){

    const [rentalInfo,setRentalInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/admin/manage-reservation/reservation?id='+id,{ withCredentials: true }).then(response =>{
            setRentalInfo(response.data);
        })
    }, [id]);

    return(

        <main>
            <Sidebar session={session} />
            <section id="content">
                <Navbar session={session} />
                <div style={{ margin: '100px 20px' }}>
                    {rentalInfo && (
                        <ReservationDetails {...rentalInfo}/>
                    )}
                </div>
            </section>
        </main>

    )
}
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};

