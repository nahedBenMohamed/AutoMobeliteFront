import React from "react";
import { TogglersProvider } from "@/components/context/togglers";
import Header from "@/components/client/Header";
import BannerHero from "@/components/client/BannerHero";
import ToTop from "@/components/client/ToTop";
import Footer from "@/components/client/Footer";
import SearchResults from "@/components/client/search-results";


function page() {
    return (
        <TogglersProvider>
            <main>
                <Header />
                <BannerHero htmlId="models-hero" page="Vehicle Models" />
                <ToTop />
                <SearchResults/>
                <Footer />
            </main>
        </TogglersProvider>
    );
}

export default page;
