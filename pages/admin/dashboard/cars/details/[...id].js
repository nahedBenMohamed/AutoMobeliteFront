import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";
import DetailsCars from "@/components/admin/DetailsCars";



export default function Details({session}){

    const [carInfo,setCarInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/admin/cars?id='+id,{ withCredentials: true }).then(response =>{
            setCarInfo(response.data);
        })
    }, [id]);

    return(

        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    {carInfo && (
                        <DetailsCars {...carInfo}/>
                    )}
                </div>

            </section>
        </main>

    )
}
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};

