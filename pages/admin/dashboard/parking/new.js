import Sidebar from "@/components/admin/Sidebar";
import ParkingForm from "@/components/admin/Parkingform";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";



export default function ParkingNew ({session})  {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session}/>
                <div style={{ margin: '0px 0px' }}>
                    <ParkingForm />
                </div>

            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
