import React from "react";

import LoginPage from "@/components/client/login";
import NavBar from "@/components/client/NavBar";



function page() {
    return (
        <main>
            <NavBar/>
            <LoginPage/>
        </main>


    );
}

export default page;