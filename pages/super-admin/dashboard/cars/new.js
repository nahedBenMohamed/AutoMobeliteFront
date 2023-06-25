import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminCarform from "@/components/super-admin/super-admin-carform";


export default function SuperAdminNewCars({session}){
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session}/>
                <div style={{ margin: '60px 90px' }}>
                    <SuperAdminCarform />
                </div>

            </section>
        </main>

        );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
