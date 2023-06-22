import {TogglersProvider} from "@/components/context/togglers";
import HeaderConnected from "@/components/client/Connected";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import BannerHero from "@/components/client/BannerHero";
import Modelsconnected from "@/components/client/ModelsConnected";
import Footer from "@/components/client/Footer";



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
