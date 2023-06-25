import {protectRoute} from "@/utils/auth";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminDetailsAdmin from "@/components/super-admin/super-admin-details-admin";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";



export default function SuperDetailsCar ({session}){

    const [adminInfo,setAdminInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/super-admin/manage-admin/admin?id='+id,{ withCredentials: true }).then(response =>{
            setAdminInfo(response.data);
        })
    }, [id]);

    return(

        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    {adminInfo && (
                        <SuperAdminDetailsAdmin {...adminInfo}/>
                    )}
                </div>

            </section>
        </main>

    )
}
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};

