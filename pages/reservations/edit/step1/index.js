import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReservationEdit from "@/components/client/ReservationEdit";
import Header from "@/components/client/Header";
import Footer2 from "@/components/client/Footeur2";

export default function EditCar() {
  const [carInfo, setCarInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/client/reservation?id=" + id, { withCredentials: true })
      .then((response) => {
        setCarInfo(response.data);
      });
  }, [id]);

  return (
    <main
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ flex: 1, padding: "10px 0px", margin: "100px 0px" }}>
        {carInfo && <ReservationEdit {...carInfo} />}
      </div>
      <Footer2 />
    </main>
  );
}
