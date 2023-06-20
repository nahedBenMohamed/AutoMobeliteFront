import {TogglersProvider} from "@/components/context/togglers";

import Footer from "@/components/client/Footer";
import HeaderConnected from "@/components/client/Connected";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import Hero from "@/components/client/Hero";
import ToTop from "@/components/client/ToTop";
import QuickEasy from "@/components/client/QuickEasy";



function page() {
    return (
        <TogglersProvider>
        <main className='overflow-hidden'>

                        <HeaderConnected/>
                        <MobileNavConnected/>
                        <Hero/>
                        <ToTop />
                        <QuickEasy/>
                        <Footer/>

        </main>
        </TogglersProvider>


    );
}

export default page;