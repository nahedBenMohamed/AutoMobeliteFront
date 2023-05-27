'use client'

import HeaderConnected from '@/app/components/Connected';
import { TogglersProvider } from '@/app/context/togglers';
import { InputValueProvider } from '@/app/context/inputValue';
import { CurrentValueProvider } from '@/app/context/currentValue';
import MobileNavConnected from '@/app/components/MobileNavConnected';
import Hero from '@/app/components/Hero';
import ToTop from '@/app/components/ToTop';
import Booking from '@/app/components/Booking';
import BookingModal from '@/app/components/BookingModal';
import QuickEasy from '@/app/components/QuickEasy';
import RentalFleetConnected from '@/app/components/RentalFleetConnected';
import ChooseUs from '@/app/components/ChooseUs';
import Footer from '@/app/components/Footer';

function page() {
    return (
        <main>
            <TogglersProvider>
                <InputValueProvider>
                    <CurrentValueProvider>
                        <HeaderConnected />
                        <MobileNavConnected />
                        <Hero />
                        <ToTop />
                        <Booking />
                        <BookingModal />
                        <QuickEasy />
                        <RentalFleetConnected />
                        <ChooseUs />
                        <Footer />
                    </CurrentValueProvider>
                </InputValueProvider>
            </TogglersProvider>
        </main>


    );
}

export default page;