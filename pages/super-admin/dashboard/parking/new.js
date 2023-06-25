import {protectRoute} from "@/utils/auth";
import SuperAdminParkingForm from "@/components/super-admin/super-admin-parkingform";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";



export default function SuperAdminParkingNew ({session})  {
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session}/>
                <div style={{ margin: '0px 0px' }}>
                    <SuperAdminParkingForm />
                </div>

            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
