import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/admin/Spinner";

const ReservationDetails = ({ id }) => {
  const [rentalData, setRentalData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/manage-reservation/reservation?id=${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setRentalData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  const handleGoBack = () => {
    router.push("/admin/dashboard/reservations");
  };

  if (!rentalData) {
    return (
      <p>
        <Spinner />
      </p>
    );
  }

  function goEditRental(id) {
    router.push(`/admin/dashboard/reservations/edit/${id}`);
  }

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 text-gray-900">
          Details Rental
        </h2>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2">
            <div className="rounded-lg p-4 space-y-2">
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Name:</p>
                <p className="w-2/3 text-sm">{rentalData.client.name}</p>
              </div>
              <div className="flex">
                <p className=" w-1/3 text-sm font-bold">Email:</p>
                <p className="w-2/3 text-sm">{rentalData.client.email}</p>
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Telephone:</p>
                <p className="w-2/3 text-sm">{rentalData.client.telephone}</p>
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Licence Number:</p>
                <p className="w-2/3 text-sm">{rentalData.client.numPermis}</p>
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Address:</p>
                <p className="w-2/3 text-sm">{rentalData.client.address}</p>
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">City:</p>
                <p className="w-2/3 text-sm">{rentalData.client.city}</p>
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Brand:</p>
                <p className="w-2/3 text-sm">{rentalData.car.brand}</p>
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Model:</p>
                <p className="w-2/3 text-sm">{rentalData.car.model}</p>
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Start Date:</p>
                {new Date(rentalData.startDate).toLocaleDateString()}
                {" A "}
                {new Date(rentalData.startTime).toLocaleTimeString()}
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">End Date:</p>
                {new Date(rentalData.endDate).toLocaleDateString()}
                {" A "}
                {new Date(rentalData.endTime).toLocaleTimeString()}
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">Rental Status:</p>
                {rentalData.status}
              </div>
              <div className="flex">
                <p className="w-1/3 text-sm font-bold">.</p>
              </div>
              <div className="mt-8 text-center">
                <p className=" text-xl font-bold">
                  Total: {rentalData.total} DT
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="rounded-lg p-4 space-y-2">
              <div className="w-auto h-auto mb-4 relative">
                {rentalData.car.image ? (
                  <img
                    src={rentalData.car.image}
                    alt="Car"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-500 text-lg">
                      <img src="/placeholder.png" alt="img" />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg p-4 space-y-2">
              <div className="w-full h-48 mb-4 relative">
                {rentalData.client.image ? (
                  <img
                    src={rentalData.client.image}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-500 text-lg">
                      <img src="/placeholder.png" alt="img" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => goEditRental(rentalData.id)}
            className="uppercase bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-1"
          >
            Update Rental
          </button>
          <button
            onClick={handleGoBack}
            className="uppercase bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
