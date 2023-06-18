import DashboardHeader from "@/components/admin/Header";
import ReservationDetails from "@/components/admin/DetailsReservation";
import {protectRoute} from "@/utils/auth";


export default function Car ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <ReservationDetails/>
            </div>
        </div>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};