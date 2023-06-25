import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";
import DetailsParck from "@/components/admin/DetailsParck";




export default function DetailsParking ({session}){

    const [parkingInfo,setParkingInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/admin/manage-parking/parking?id='+id,{ withCredentials: true }).then(response =>{
            setParkingInfo(response.data);
        })
    }, [id]);

    return(

        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    {parkingInfo && (
                        <DetailsParck {...parkingInfo}/>
                    )}
                </div>

            </section>
        </main>

    )
}
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};

