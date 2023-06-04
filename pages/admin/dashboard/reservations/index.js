import DashboardHeader from "@/components/admin/Header";
import RentalTable from "@/components/admin/ReservationTable";


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