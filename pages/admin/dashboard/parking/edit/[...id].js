import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import SuperAdminHeader from "@/components/super-admin/super-admin-header";
import SuperAdminParkingform from "@/components/super-admin/super-admin-parkingform";

export default function EditAgence(){

    const [parkingInfo,setParkingInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/super-admin/parking?id='+id).then(response =>{
            setParkingInfo(response.data);
        })
    }, [id]);
    return(
            <div>
                <SuperAdminHeader/>
                {parkingInfo && (
                    <SuperAdminParkingform {...parkingInfo}/>
                )}
            </div>

    )
}