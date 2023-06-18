import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import DashboardHeader from "@/components/admin/Header";
import Parkingform from "@/components/admin/Parkingform";


export default function EditAgence(){

    const [parkingInfo,setParkingInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/admin/parking?id='+id).then(response =>{
            setParkingInfo(response.data);
        })
    }, [id]);
    return(
            <div>
                <DashboardHeader/>
                {parkingInfo && (
                    <Parkingform {...parkingInfo}/>
                )}
            </div>

    )
}