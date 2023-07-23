import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Ongoing from "@/components/client/Ongoing";
import Coming from "@/components/client/Coming";
import Past from "@/components/client/Past";


function MesReservations() {
    return (
        <div className="container mx-auto my-8">
            <h1 className="text-2xl uppercase font-bold mb-4">My Reservations</h1>
            <Tabs className="mt-5">
                <TabList>
                    <Tab>coming</Tab>
                    <Tab>Ongoing</Tab>
                    <Tab>past</Tab>
                </TabList>
                <TabPanel className="mt-8">
                    <Coming />
                </TabPanel>
                <TabPanel className="mt-8">
                    <Ongoing />
                </TabPanel>
                <TabPanel className="mt-8">
                    <Past/>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default MesReservations;
