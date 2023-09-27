import React from "react";
import { protectRoute } from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminParkingtable from "@/components/super-admin/super-admin-parkingtable";

export default function SuperAdminParking({ session }) {
  return (
    <main>
      <SuperAdminSidebar />
      <section id="content">
        <SuperAdminNavbar session={session} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            margin: "40px 40px",
          }}
        >
          <h1
            style={{
              marginRight: "10px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Manage Parking's {"\u{1F17F}"}
          </h1>
          <div style={{ width: "100%" }}></div>
        </div>
        <div style={{ margin: "-40px 0px" }}>
          <SuperAdminParkingtable />
        </div>
      </section>
    </main>
  );
}
export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
