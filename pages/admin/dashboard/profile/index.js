import DashboardHeader from "@/components/admin/Header";
import Profile from "@/components/admin/Profile";
import {protectRoute} from "@/utils/auth";


export default function ProfileUsers ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <Profile/>
            </div>
        </div>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};