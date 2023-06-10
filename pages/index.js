import {CurrentValueProvider} from "@/components/context/currentValue";
import {TogglersProvider} from "@/components/context/togglers";
import {InputValueProvider} from "@/components/context/inputValue";
import Header from "@/components/client/Header";
import MobileNavbar from "@/components/client/MobilNavbar";
import Hero from "@/components/client/Hero";
import Booking from "@/components/client/Booking";
import BookingModal from "@/components/client/BookingModal";
import ToTop from "@/components/client/ToTop";
import QuickEasy from "@/components/client/QuickEasy";
import RentalFleet from "@/components/client/RentalFleet";
import ChooseUs from "@/components/client/ChooseUs";
import Footer from "@/components/client/Footer";
import VehicleSearchForm from "@/components/client/VehicleSearchForm";



export default function Home() {
    return (
        <TogglersProvider>
            <InputValueProvider>
                <CurrentValueProvider>
                    <main>
                        <Header/>
                        <MobileNavbar />
                        <div className=" flex justify-center ">
                            <VehicleSearchForm />

                        </div>
                        <div className="-mt-6">
                            <Hero />
                        </div>
                        <BookingModal/>
                        <ToTop />
                        <QuickEasy/>
                        <RentalFleet/>
                        <ChooseUs/>
                        <Footer/>
                    </main>
                </CurrentValueProvider>
            </InputValueProvider>
        </TogglersProvider>
    )
}
