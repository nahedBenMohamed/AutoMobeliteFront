import Header from "@/components/client/Header";
import Footer2 from "@/components/client/Footeur2";
import ReservationForm from "@/components/client/Reservations";

function ManageReservations() {
  return (
    <main
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: 1, padding: "10px 0px", margin: "100px 20px" }}>
        <ReservationForm />
      </div>
      <Footer2 />
    </main>
  );
}

export default ManageReservations;
