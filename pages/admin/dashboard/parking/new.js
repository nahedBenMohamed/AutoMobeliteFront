import DashboardHeader from "@/components/admin/Header";
import ParkingForm from "@/components/admin/Parkingform";
import {protectRoute} from "@/utils/auth";


export default function Car ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '0px 90px' }}>
                <ParkingForm />
            </div>
        </div>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};