import Header from "@/components/client/Header";
import Footer2 from "@/components/client/Footeur2";
import ManageProfile from "@/components/client/ManageProfile";

function ManageCompte() {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header/>
            <div style={{ flex: 1, padding: '20px 0' ,margin: '50px 0px'}}>
                <ManageProfile/>
            </div>
            <Footer2/>
        </main>
    )
}

export default ManageCompte;
