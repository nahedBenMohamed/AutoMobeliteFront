import SuperAdminAgencetable from "@/components/super-admin/super-admin-agencetable";
import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";


export default function SuperAdminAgence ({session})  {
    return (
    <main>
        <SuperAdminSidebar />
        <section id="content">
            <SuperAdminNavbar session={session}/>
            <div style={{ margin: '60px 90px' }}>
                <SuperAdminAgencetable />
            </div>

        </section>
    </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};