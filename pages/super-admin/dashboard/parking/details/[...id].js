import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {protectRoute} from "@/utils/auth";
import SuperAdminDetailsParck from "@/components/super-admin/super-admin-detailsparking";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";




export default function DetailsParking ({session}){

    const [parkingInfo,setParkingInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/super-admin/parking-agence/parking?id='+id,{ withCredentials: true }).then(response =>{
            setParkingInfo(response.data);
        })
    }, [id]);

    return(

        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    {parkingInfo && (
                        <SuperAdminDetailsParck {...parkingInfo}/>
                    )}
                </div>

            </section>
        </main>

    )
}
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
