import SuperAdminHeader from "@/components/super-admin/super-admin-header";
import {protectRoute} from "@/utils/auth";
import SuperAdminParkingForm from "@/components/super-admin/super-admin-parkingform";


export default function Car ()  {
    return (
        <div>
            <SuperAdminHeader />
            <div style={{ margin: '0px 90px' }}>
                <SuperAdminParkingForm />
            </div>
        </div>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};