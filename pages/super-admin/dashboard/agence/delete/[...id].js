import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import SuperAdminHeader from "@/components/super-admin/super-admin-header";
import {protectRoute} from "@/utils/auth";


export default  function DeleteCarPage(){
    const router = useRouter()
    const [agenceInfo,setAgenceInfo] = useState('')
    const {id} = router.query;

    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/api/super-admin/cars?id='+id).then(response =>{
            setAgenceInfo(response.data);
        });
    }, [id]);
    function goBack(){
        router.push('/super-admin/dashboard/agence');
    }

    async function deleteCar(){
        await axios.delete('/api/super-admin/cars?id='+id)
        goBack()
    }
    return(
        <div>
            <SuperAdminHeader />
            <div className="flex items-center justify-center min-h-screen -mt-20">
                <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
                    <h1 className="text-center text-xl">
                        Do you really want to delete "{agenceInfo?.marque}"?
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
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};