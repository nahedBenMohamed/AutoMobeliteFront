import {TogglersProvider} from "@/components/context/togglers";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import Header from "@/components/client/Header";
import Reservations from "@/components/client/Reservations";
import Footer from "@/components/client/Footer";
import HeaderConnected from "@/components/client/Connected";



function page() {
    return (
        <main className='overflow-hidden'>
            <TogglersProvider>
                <HeaderConnected/>
                <MobileNavConnected/>
                <div className="mt-30">
                    <Reservations/>
                </div>

                <Footer/>
            </TogglersProvider>
        </main>


    );
}

export default page;