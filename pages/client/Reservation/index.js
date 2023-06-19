import {TogglersProvider} from "@/components/context/togglers";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import Header from "@/components/client/Header";
import IndexPage from "@/components/client/RerservationForm";



function page() {
    return (
        <main>
            <TogglersProvider>
                <Header/>
                <MobileNavConnected/>
                <IndexPage/>
            </TogglersProvider>
        </main>


    );
}

export default page;