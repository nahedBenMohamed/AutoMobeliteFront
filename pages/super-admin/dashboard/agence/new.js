import { protectRoute } from "@/utils/auth";
import React from "react";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminAgenceForm from "@/components/super-admin/super-admin-agenceform";

export default function SuperAdminNewAgence({ session }) {
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
            Create Agencies {"\u{1F3E2}"}
          </h1>
          <div style={{ width: "100%" }}></div>
        </div>
        <div style={{ margin: "20px 10px" }}>
          <SuperAdminAgenceForm />
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
