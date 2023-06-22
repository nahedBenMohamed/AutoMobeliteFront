import React from "react";
import { TogglersProvider } from "@/components/context/togglers";
import Header from "@/components/client/Header";
import BannerHero from "@/components/client/BannerHero";
import Models from "@/components/client/Models";
    import Footer from "@/components/client/Footer";


function page() {
    return (
        <TogglersProvider>
            <main>
                <Header />
                <BannerHero htmlId="models-hero" page="Vehicle Models" />
                <Models />
                <Footer />
            </main>
        </TogglersProvider>
    );
}

export default page;
