import {useRouter} from "next/router";
import axios from "axios";
import {useEffect, useState} from "react";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import {protectRoute} from "@/utils/auth";


export default function DeleteParkingPage() {
    const router = useRouter();
    const [parkingInfo, setParkingInfo] = useState('');
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/super-admin/parking?id=' + id).then(response => {
            setParkingInfo(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/super-admin/dashboard/parking');
    }

    async function deleteParking() {
        await axios.delete('/api/super-admin/parking?id=' + id);
        goBack();
    }

    return (
        <div>
            <SuperAdminSidebar />
            <div className="flex items-center justify-center min-h-screen -mt-20">
                <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
                    <h1 className="text-center text-xl">
                        Do you really want to delete "{parkingInfo?.name}"?
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={deleteParking} className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-red-500 hover:bg-red-700">
                            Yes
                        </button>
                        <button onClick={goBack} className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-500 hover:bg-gray-700">
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
