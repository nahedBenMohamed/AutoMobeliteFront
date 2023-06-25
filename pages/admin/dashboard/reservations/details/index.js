import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import CarForm from "@/components/admin/CarForm";
import ReservationDetails from "@/components/admin/DetailsReservation";


export default function Car ()  {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar/>
                <div style={{ margin: '60px 90px' }}>
                    <ReservationDetails />
                </div>

            </section>
        </main>
    );
};

/*
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};*/
