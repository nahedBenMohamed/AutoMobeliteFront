import React, { useEffect, useState } from "react";
import axios from "axios";
import "boxicons/css/boxicons.min.css";
import { FiInfo } from "react-icons/fi";
import { useRouter } from "next/router";

const AdminHome = () => {
  const [statistics, setStatistics] = useState({
    totalCar: 0,
    parc: 0,
    totalSales: 0,
    totalReservations: 0,
  });

  const [reservations, setReservations] = useState([]);
  const recentReservations = reservations.slice(0, 3);
  const router = useRouter();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("/api/admin/agence", {
          withCredentials: true,
        });
        const [agence] = response.data;

        const totalReservationsCancelled = await axios.get(
          "/api/admin/manage-reservation/cancelled",
          {
            withCredentials: true,
          }
        );

        const totalReservationsInProgress = await axios.get(
          "/api/admin/manage-reservation/ongoing",
          {
            withCredentials: true,
          }
        );

        const totalReservationsCompleted = await axios.get(
          "/api/admin/manage-reservation/completed",
          {
            withCredentials: true,
          }
        );

        setStatistics({
          totalCar: agence.totalCars,
          parc: agence.totalParkings,
          totalSales: agence.totalSales,
          totalReservations: agence.totalReservations,
          totalReservationsCancelled: totalReservationsCancelled.data.length,
          totalReservationsInProgress: totalReservationsInProgress.data.length,
          totalReservationsCompleted: totalReservationsCompleted.data.length,
        });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRental = async () => {
      try {
        const response = await axios.get(
          "/api/admin/manage-reservation/reservation",
          {
            withCredentials: true,
          }
        );
        setReservations(response.data.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatistics();
    fetchRental();
  }, []);

  function goDetailsReservations(id) {
    router.push(`/admin/dashboard/reservations/details/${id}`);
  }
  return (
    <main>
      <ul className="box-info">
        <li>
          <i className="bx bxs-car bx-fade-right"></i>
          <span className="text">
            <h3>{statistics.totalCar}</h3>
            <p>Total Cars</p>
          </span>
        </li>
        <li>
          <i className="bx bxs-parking bx-fade-right"></i>
          <span className="text">
            <h3>{statistics.parc}</h3>
            <p>Total Parc</p>
          </span>
        </li>
        <li>
          <i className="bx bx-transfer bx-fade-left"></i>
          <span className="text">
            <h3>{statistics.totalReservations}</h3>
            <p>Total Rentals</p>
          </span>
        </li>
      </ul>
      <ul className="box-info2">
        <li>
          <i className="bx bx-x bx-tada"></i>
          <span className="text">
            <h3>{statistics.totalReservationsCancelled}</h3>
            <p>Cancelled Reservations</p>
          </span>
        </li>
        <li>
          <i className="bx bx-trending-up bx-tada"></i>
          <span className="text">
            <h3>{statistics.totalReservationsInProgress}</h3>
            <p>Reservations in Progress</p>
          </span>
        </li>
        <li>
          <i className="bx bx-check-double bx-tada"></i>
          <span className="text">
            <h3>{statistics.totalReservationsCompleted}</h3>
            <p>Completed Reservations</p>
          </span>
        </li>
      </ul>
      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recent Orders</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                >
                  Brand
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody>
              {recentReservations
                .filter((rental) => rental.status === "reserved")
                .map((rental) => (
                  <tr key={rental.id}>
                    <td className="px-2 py-2 text-left whitespace-nowrap">
                      {rental.client ? rental.client.name : "-"}
                    </td>
                    <td className="px-2 py-2 text-left whitespace-nowrap">
                      {rental.car?.brand ?? "-"}
                    </td>
                    <td className="px-2 py-2 text-left whitespace-nowrap">
                      {rental.status}
                    </td>
                    <td>
                      <div className="flex items-center">
                        <button
                          onClick={() => goDetailsReservations(rental.id)}
                          className="text-blue-500 hover:text-blue-700 mx-1 flex items-center"
                        >
                          <FiInfo size={18} className="mr-2" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {recentReservations.filter(
                (rental) => rental.status === "reserved"
              ).length === 0 && (
                <tr className="justify-center">
                  <td className="text-center py-4">No reservations</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminHome;
