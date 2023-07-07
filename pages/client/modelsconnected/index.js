import HeaderConnected from "@/components/client/HeaderConnected";
import BannerHero from "@/components/client/BannerHero";
import Modelsconnected from "@/components/client/ModelsConnected";
import Footer from "@/components/client/Footer";



function page() {
    return (
            <main>
                <HeaderConnected />
                <BannerHero htmlId="models-hero" page="Vehicle Models" />
                <Modelsconnected />
                <Footer />
            </main>
    );
}

export default page;
