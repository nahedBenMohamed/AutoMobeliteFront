import {TogglersProvider} from "@/components/context/togglers";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import Header from "@/components/client/Header";



function page() {
    return (
        <main>
            <TogglersProvider>
                <Header/>
                <MobileNavConnected/>
            </TogglersProvider>
        </main>


    );
}

export default page;