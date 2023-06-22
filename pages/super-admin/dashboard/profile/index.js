import {protectRoute} from "@/utils/auth";
import SuperAdminProfile from "@/components/super-admin/super-admin-profile";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";



export default function ProfileUsers ({session})  {
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session}/>
                <div style={{ margin: '60px 90px' }}>
                    <SuperAdminProfile />
                </div>

            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
