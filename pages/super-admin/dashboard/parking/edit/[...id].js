import {useEffect, useState} from "react";
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
                <div style={{ margin: '60px 90px' }}>
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
