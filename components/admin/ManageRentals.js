import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OngoingRental from "@/components/admin/OngoingRental";
import RentalTable from "@/components/admin/RentalTable";
import CompletedRental from "@/components/admin/CompletedRentals";
import CancelledRental from "@/components/admin/CancelledRentals";

function MesReservations() {
  return (
    <div className="container mx-auto mt-16 my-8">
      <Tabs className="mt-5">
        <TabList>
          <Tab>coming</Tab>
          <Tab>Ongoing</Tab>
          <Tab>Completed</Tab>
          <Tab>Cancelled</Tab>
        </TabList>
        <TabPanel className="mt-8">
          <RentalTable />
        </TabPanel>
        <TabPanel className="mt-8">
          <OngoingRental />
        </TabPanel>
        <TabPanel className="mt-8">
          <CompletedRental />
        </TabPanel>
        <TabPanel className="mt-8">
          <CancelledRental />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default MesReservations;
