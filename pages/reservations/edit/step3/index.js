import Header from "@/components/client/Header";
import Footer2 from "@/components/client/Footeur2";
import ReservationEditStep3 from "@/components/client/ReservationEdit-step3";


function EditReservationStep3() {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header/>
            <div style={{ flex: 1, padding: '10px 0px' ,margin: '100px 0px'}}>
                <ReservationEditStep3/>
            </div>
            <Footer2/>
        </main>
    )
}

export default EditReservationStep3;
