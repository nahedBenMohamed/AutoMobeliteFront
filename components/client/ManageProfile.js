import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import InformationProfile from "@/components/client/InformationProfile";
import Parameters from "@/components/client/Parameters";

function ManageProfile() {
    return (
        <div className="container mx-auto my-8">
            <h1 className="text-2xl uppercase font-bold mb-4">MY PERSONAL INFORMATION</h1>
            <Tabs className="mt-5">
                <TabList>
                    <Tab>informations</Tab>
                    <Tab>parameters</Tab>
                </TabList>
                <TabPanel className="mt-8">
                    <InformationProfile/>
                </TabPanel>
                <TabPanel className="mt-8">
                    <Parameters/>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default ManageProfile;
