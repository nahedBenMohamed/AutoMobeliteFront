import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SuperAdminAgencetable from "@/components/super-admin/super-admin-agencetable";
import SuperAdminManageTable from "@/components/super-admin/super-admin-manageadmin-table";

function Manage() {
  return (
    <div className="container mx-auto mt-16 my-8">
      <Tabs className="mt-5">
        <TabList>
          <Tab>Agencies</Tab>
          <Tab>Admin</Tab>
        </TabList>
        <TabPanel className="mt-8">
          <SuperAdminAgencetable />
        </TabPanel>
        <TabPanel className="mt-8">
          <SuperAdminManageTable />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Manage;
