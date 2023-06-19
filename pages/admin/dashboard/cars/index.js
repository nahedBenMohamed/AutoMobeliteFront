import DashboardHeader from "@/components/admin/Header";
import VehicleTable from "@/components/admin/CarsTable";
import {protectRoute} from "@/utils/auth";


export default function Car ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '60px 90px' }}>
                <VehicleTable />
            </div>
        </div>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};