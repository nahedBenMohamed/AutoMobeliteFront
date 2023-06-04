import {TogglersProvider} from "@/components/context/togglers";
import {InputValueProvider} from "@/components/context/inputValue";
import {CurrentValueProvider} from "@/components/context/currentValue";
import HeaderConnected from "@/components/client/Connected";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import Hero from "@/components/client/Hero";
import ToTop from "@/components/client/ToTop";
import Booking from "@/components/client/Booking";
import BookingModal from "@/components/client/BookingModal";
import QuickEasy from "@/components/client/QuickEasy";
import RentalFleet from "@/components/client/RentalFleet";
import ChooseUs from "@/components/client/ChooseUs";
import Footer from "@/components/client/Footer";



function page() {
    return (
        <main>
            <TogglersProvider>
                <InputValueProvider>
                    <CurrentValueProvider>
                        <HeaderConnected/>
                        <MobileNavConnected/>
                        <Hero/>
                        <ToTop/>
                        <Booking/>
                        <BookingModal/>
                        <QuickEasy/>
                        <RentalFleet/>
                        <ChooseUs/>
                        <Footer/>
                    </CurrentValueProvider>
                </InputValueProvider>
            </TogglersProvider>
        </main>


    );
}

export default page;