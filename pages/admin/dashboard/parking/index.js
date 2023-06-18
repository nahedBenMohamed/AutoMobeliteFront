import Parkingtable from "@/components/admin/Parkingtable";
import DashboardHeader from "@/components/admin/Header";
import {protectRoute} from "@/utils/auth";


export default function Car ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '60px 90px' }}>
                <Parkingtable />
            </div>
        </div>
    );
};
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};