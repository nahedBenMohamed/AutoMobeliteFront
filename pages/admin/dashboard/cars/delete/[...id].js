import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import DashboardHeader from "@/components/admin/Header";

export default  function DeleteCarPage(){
    const router = useRouter()
    const [carInfo,setCarInfo] = useState('')
    const {id} = router.query;
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/api/cars/cars?id='+id).then(response =>{
            setCarInfo(response.data);
        });
    }, [id]);
    function goBack(){
        router.push('/admin/dashboard/cars');
    }

    async function deleteCar(){
        await axios.delete('/api/cars/cars?id=' + id)
        goBack()
    }
    return(
        <div>
            <DashboardHeader />
            <div className="flex items-center justify-center min-h-screen -mt-20">
                <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
                    <h1 className="text-center text-xl">
                        Do you really want to delete "{carInfo?.marque}"?
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={deleteCar} className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-red-500 hover:bg-red-700">
                            Yes
                        </button>
                        <button onClick={goBack} className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-500 hover:bg-gray-700">
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>


    )
}