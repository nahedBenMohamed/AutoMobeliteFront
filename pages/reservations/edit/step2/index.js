import Header from "@/components/client/Header";
import Footer2 from "@/components/client/Footeur2";
import ReservationEditStep2 from "@/components/client/ReservationEdit-step2";

function EditReservationStep2() {
  return (
    <main
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: 1, padding: "10px 0px", margin: "100px 0px" }}>
        <ReservationEditStep2 />
      </div>
      <Footer2 />
    </main>
  );
}

export default EditReservationStep2;
