import React from "react";

import RegisterPage from "@/components/client/register";
import NavBar from "@/components/client/NavBar";






function page() {
    return (
        <main>
            <NavBar/>
            <RegisterPage />
        </main>


    );
}

export default page;