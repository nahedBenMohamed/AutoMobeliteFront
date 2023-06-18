import DashboardHeader from "@/components/admin/Header";
import RentalTable from "@/components/admin/ReservationTable";
import {protectRoute} from "@/utils/auth";


export default function Car ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <RentalTable/>
            </div>
        </div>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};