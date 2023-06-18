import ParkingForm from "@/components/super-admin/super-admin-parkingform";
import DashboardHeader from "@/components/admin/Header";


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