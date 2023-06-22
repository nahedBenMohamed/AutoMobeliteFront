import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import SuperAdminHeader from "@/components/super-admin/super-admin-header";
import SuperAdminAgence from "@/components/super-admin/super-admin-agence";
import {protectRoute} from "@/utils/auth";

export default function EditAgence(){

    const [agenceInfo,setAgenceInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/super-admin/agence?id='+id).then(response =>{
            setAgenceInfo(response.data);
        })
    }, [id]);
    return(
            <div>
                <SuperAdminHeader/>
                {agenceInfo && (
                    <SuperAdminAgence {...agenceInfo}/>
                )}
            </div>

    )
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};