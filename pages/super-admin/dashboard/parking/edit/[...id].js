import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminParkingform from "@/components/super-admin/super-admin-parkingform";




export default function EditParking({session}){

    const [parkingInfo,setParkingInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/super-admin/parking-agence/parking?id='+id).then(response =>{
            setParkingInfo(response.data);
        })
    }, [id]);

    return(

        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session}/>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 40px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Manage Parking's {'\u{1F17F}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '20px 0px' }}>
                    {parkingInfo && (
                        <SuperAdminParkingform {...parkingInfo}/>
                    )}
                </div>

            </section>
        </main>

    )
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
