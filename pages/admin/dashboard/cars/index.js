import DashboardHeader from "@/components/admin/Header";
import VehicleTable from "@/components/admin/CarsTable";


export default function Car ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <VehicleTable />
            </div>
        </div>
    );
};