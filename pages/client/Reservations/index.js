import Reservations from "@/components/client/Reservations";
import Footer from "@/components/client/Footer";
import HeaderConnected from "@/components/client/HeaderConnected";



function page() {
    return (
        <main className='overflow-hidden'>
                <HeaderConnected/>
                <div className="mt-30">
                    <Reservations/>
                </div>

                <Footer/>
        </main>


    );
}

export default page;