import { protectRoute } from "@/utils/auth";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminUsertable from "@/components/super-admin/super-admin-usertable";
import React from "react";

export default function SuperAdminUsers({ session }) {
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
            margin: "40px 30px",
          }}
        >
          <h1
            style={{
              marginRight: "10px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Manage User's {"\u{1F464}"}
          </h1>
          <div style={{ width: "100%" }}></div>
        </div>
        <div style={{ margin: "-50px 0px" }}>
          <SuperAdminUsertable />
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
