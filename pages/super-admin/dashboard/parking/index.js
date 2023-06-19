import SuperAdminHeader from "@/components/super-admin/super-admin-header";
import SuperAdminParkingtable from "@/components/super-admin/super-admin-parkingtable";
import {protectRoute} from "@/utils/auth";


export default function Car ()  {
    return (
        <div>
            <SuperAdminHeader />
            <div style={{ margin: '60px 90px' }}>
                <SuperAdminParkingtable />
            </div>
        </div>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};