import Header from "@/components/client/Header";
import Footer2 from "@/components/client/Footeur2";
import MesReservations from "@/components/client/ManageReservations";

function ManageReservations() {
  return (
    <main
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: 1, padding: "20px 0", margin: "50px 0px" }}>
        <MesReservations />
      </div>
      <Footer2 />
    </main>
  );
}

export default ManageReservations;
