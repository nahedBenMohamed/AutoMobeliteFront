"use client";

import React from "react";
import {TogglersProvider} from "@/app/front-end/context/togglers";
import {InputValueProvider} from "@/app/front-end/context/inputValue";
import {CurrentValueProvider} from "@/app/front-end/context/currentValue";
import Header from "@/app/front-end/component/Header";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import HeroHome from "@/app/front-end/component/HeroHome";
import HomeDetails from "@/app/front-end/component/HomeDetails";
import Booking from "@/app/front-end/component/Booking";
import BookingModal from "@/app/front-end/component/BookingModal";
import RentalFleet from "@/app/front-end/component/RentalFleet";
import Footer from "@/app/front-end/component/Footer";



function page() {
    return (
        <main>
            <TogglersProvider>
                <InputValueProvider>
                    <CurrentValueProvider>
                        <Header />
                        <MobileNavbar />
                        <HeroHome />
                        <HomeDetails />
                        <Booking />
                        <BookingModal />
                        <RentalFleet />
                        <Footer />
                    </CurrentValueProvider>
                </InputValueProvider>
            </TogglersProvider>
        </main>


    );
}

export default page;