import Sidebar from "@/components/admin/Sidebar";
import Profile from "@/components/admin/Profile";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";



export default function ProfileUsers ({session})  {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session}/>
                <div style={{ margin: '60px 90px' }}>
                    <Profile />
                </div>

            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
