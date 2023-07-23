import Header from "@/components/client/Header";
import Footer2 from "@/components/client/Footeur2";
import Step2 from "@/components/client/Step2";

function ReservationStep2() {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header/>
            <div style={{ flex: 1, padding: '10px 0px' ,margin: '100px 0px'}}>
                <Step2/>
            </div>
            <Footer2/>
        </main>
    )
}

export default ReservationStep2;
