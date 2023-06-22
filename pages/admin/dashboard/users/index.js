import Sidebar from "@/components/admin/Sidebar";
import UserTable from "@/components/admin/UserTable";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";


export default function Users ({session})  {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session}/>
                <div style={{ margin: '60px 90px' }}>
                    <UserTable />
                </div>

            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
