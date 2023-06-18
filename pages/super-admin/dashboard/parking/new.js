import SuperAdminHeader from "@/components/super-admin/super-admin-header";
import ParkingForm from "@/components/super-admin/super-admin-parkingform";


export default function Car ()  {
    return (
        <div>
            <SuperAdminHeader />
            <div style={{ margin: '0px 90px' }}>
                <ParkingForm />
            </div>
        </div>
    );
};