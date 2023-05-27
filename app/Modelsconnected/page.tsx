"use client";

import { TogglersProvider } from '@/app/context/togglers';
import HeaderConnected from '@/app/components/Connected';
import MobileNavConnected from '@/app/components/MobileNavConnected';
import BannerHero from '@/app/components/BannerHero';
import Modelsconnected from '@/app/components/Modelsconnected';
import Footer from '@/app/components/Footer';

function page() {
  return (
    <TogglersProvider>
      <main>
        <HeaderConnected />
        <MobileNavConnected />
        <BannerHero htmlId="models-hero" page="Vehicle Models" />
        <Modelsconnected />
        <Footer />
      </main>
    </TogglersProvider>
  );
}

export default page;
