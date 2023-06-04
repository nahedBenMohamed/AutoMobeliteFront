import DashboardHeader from "@/components/admin/Header";
import ReservationDetails from "@/components/admin/DetailsReservation";


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