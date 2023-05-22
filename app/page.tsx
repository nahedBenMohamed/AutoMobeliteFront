"use client";
import Header from "@/app/front-end/component/Header";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import {CurrentValueProvider} from "@/app/front-end/context/currentValue";
import {TogglersProvider} from "@/app/front-end/context/togglers";
import {InputValueProvider} from "@/app/front-end/context/inputValue";
import HeroHome from "@/app/front-end/component/HeroHome";
import HomeDetails from "@/app/front-end/component/HomeDetails";
import Booking from "@/app/front-end/component/Booking";
import BookingModal from "@/app/front-end/component/BookingModal";
import RentalFleet from "@/app/front-end/component/RentalFleet";
import Footer from "@/app/front-end/component/Footer";

export default function Home() {
  return (
      <TogglersProvider>
          <InputValueProvider>
              <CurrentValueProvider>
            <main>

              <Header />
                <MobileNavbar />
                <HeroHome />
                <HomeDetails />
                <Booking />
                <BookingModal />
                <RentalFleet />
                <Footer />

            </main>
        </CurrentValueProvider>
        </InputValueProvider>
        </TogglersProvider>


  );
}
