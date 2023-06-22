import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import ReservationTable from "@/components/admin/ReservationTable";
import {protectRoute} from "@/utils/auth";


export default function Reservations ({session})  {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session}/>
                <div style={{ margin: '60px 90px' }}>
                    <ReservationTable />
                </div>

            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
