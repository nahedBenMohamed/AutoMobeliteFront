"use client";

import React from "react";
import HeaderConnected from "@/app/components/Connected";
import Booking from "@/app/components/Booking";
import Hero from "@/app/components/Hero";
import {TogglersProvider} from "@/app/context/togglers";
import {InputValueProvider} from "@/app/context/inputValue";
import {CurrentValueProvider} from "@/app/context/currentValue";
import BookingModal from "@/app/components/BookingModal";
import Footer from "@/app/components/Footer";
import MobileNavConnected from "@/app/components/MobileNavConnected";
import ToTop from "@/app/components/ToTop";
import QuickEasy from "@/app/components/QuickEasy";
import ChooseUs from "@/app/components/ChooseUs";
import RentalFleetConnected from '@/app/components/RentalFleetConnected';



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