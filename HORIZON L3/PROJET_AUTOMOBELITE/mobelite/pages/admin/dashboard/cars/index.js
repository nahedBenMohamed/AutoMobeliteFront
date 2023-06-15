import DashboardHeader from "@/components/admin/Header";
import VehicleTable from "@/components/admin/CarsTable";


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