import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {protectRoute} from "@/utils/auth";
import SuperAdminDetailsCars from "@/components/super-admin/super-admin-detailscar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";




export default function SuperDetailsCar ({session}){

    const [carInfo,setCarInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/super-admin/car-agence/cars?id='+id,{ withCredentials: true }).then(response =>{
            setCarInfo(response.data);
        })
    }, [id]);

    return(

        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    {carInfo && (
                        <SuperAdminDetailsCars {...carInfo}/>
                    )}
                </div>

            </section>
        </main>

    )
}
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};

