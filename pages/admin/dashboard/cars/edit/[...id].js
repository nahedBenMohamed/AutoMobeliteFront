import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import CarForm from "@/components/admin/CarForm";
import DashboardHeader from "@/components/admin/Header";


export default function EditCar(){

    const [carInfo,setCarInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/cars/cars?id='+id).then(response =>{
            setCarInfo(response.data);
        })
    }, [id]);
    return(
            <div>
                <DashboardHeader/>
                {carInfo && (
                    <CarForm {...carInfo}/>
                )}
            </div>

    )
}