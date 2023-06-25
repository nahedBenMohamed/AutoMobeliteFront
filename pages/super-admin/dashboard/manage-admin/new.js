import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import RegisterAdmin from "@/components/super-admin/admin-register";



export default function SuperAdminNewCars({session}){
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session}/>
                <div style={{ margin: '60px 90px' }}>
                    <RegisterAdmin/>
                </div>
            </section>
        </main>

    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
