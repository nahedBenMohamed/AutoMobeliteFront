import { HiPhone, HiUser } from "react-icons/hi";
import { FaCalendar, FaCar, FaEquals } from "react-icons/fa";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import "boxicons/css/boxicons.min.css";
import { HiMapPin } from "react-icons/hi2";
import { io } from "socket.io-client";
import { BeatLoader } from "react-spinners";

function ReservationEditStep3() {
  const router = useRouter();
  const { id, pickupDate, returnDate, pickupTime, returnTime, totalPrice } =
    router.query;
  const { data } = useSession();
  const [model, setModel] = useState("");
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [carPrice, setCarPrice] = useState(0);
  const [oldStartDate, setOldStartDate] = useState("");
  const [oldEndDate, setOldEndDate] = useState("");
  const [carId, setCarId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formattedPickupDate = moment(pickupDate).format("DD MMMM");
  const formattedReturnDate = moment(returnDate).format("DD MMMM");

  useEffect(() => {
    if (id) {
      axios
        .get("/api/client/reservation?id=" + id)
        .then((response) => {
          const rentalData = response.data;
          setCarId(rentalData.car.id);
          setModel(rentalData.car.model);
          setBrand(rentalData.car.brand);
          setCarPrice(rentalData.car.price);
          setOldStartDate(
            rentalData.startDate ? new Date(rentalData.startDate) : null
          );
          setOldEndDate(
            rentalData.endDate ? new Date(rentalData.endDate) : null
          );
          setImages(rentalData.car.image ? [rentalData.car.image] : []);
        })
        .catch((error) => {
          if (error.response) {
            toast.warning("An error occurred while loading data");
          }
        });
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      const {
        user: { email, telephone, address, city },
      } = data;
      setTelephone(telephone);
      setAddress(address);
      setCity(city);
      setEmail(email);
    }
  }, [data]);

  // Connect to the socket server after you have received the agencyId
  let agencyId = null;
  let socket = null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = {
      carId,
      email,
      oldStartDate: oldStartDate,
      oldEndDate: oldEndDate,
      startDate: moment(pickupDate).format(),
      endDate: moment(returnDate).format(),
      startTime: pickupTime,
      endTime: returnTime,
      total: parseFloat(totalPrice),
      status: "reserved",
    };
    try {
      const response = await axios.put(`/api/client/reservation?id=${id}`, {
        ...data,
      });
      if (response.status === 201) {
        toast.success("Reservation modified with success!");

        // Get agencyId from the response
        agencyId = response.data.agencyId;
        // Now that we have the agencyId, we can connect to the socket server
        socket = io("http://localhost:8000", {
          transports: ["websocket"],
          query: { agencyId: agencyId },
        });
        // Emit 'newReservation' event
        const { data: rentalData } = response;
        socket.emit("editReservation", rentalData);
        console.log("Emitted editReservation:", rentalData);
        setTimeout(() => {
          router.push("/manage-reservations");
        }, 10);
      } else {
        console.error("Error creating rental:", response);
      }
    } catch (error) {
      console.error("Error creating rental:", error);
    }
  };

  const UserInputForm = () => (
    <div className="flex">
      <div className="flex-grow flex flex-col space-y-5 mt-4 ml-16 mr-8">
        <h3 className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
          my personal info
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="mb-4">
            <label htmlFor="telephone" className="block text-xs mb-1">
              Phone:
            </label>
            <div className="relative">
              <HiPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
              <input
                id="telephone"
                value={telephone}
                disabled={true}
                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-xs mb-1">
              City:
            </label>
            <div className="relative">
              <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
              <input
                id="city"
                value={city}
                disabled={true}
                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-xs mb-1">
              Address:
            </label>
            <div className="relative">
              <HiMapPin className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
              <input
                id="address"
                value={address}
                disabled={true}
                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="flex text-justify text-xs">
          <p>
            By validating your reservation, you acknowledge that you are 21
            years old, have a minimum license of 2 years and accept and accept
            the
            <a
              href="/your-url"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              {" "}
              Conditions the General Rental Conditions and the Privacy Policy{" "}
            </a>
            by Automobelite
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <div className="flex-grow flex flex-col space-y-5 mt-4 ml-16 mr-8">
        <div className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
          <h1>{`Hello, ${data?.user.name} ${data?.user.firstname}`}</h1>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          {data && (
            <>
              <UserInputForm />
            </>
          )}
        </div>
        <div className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
          <h1>Payment and Cancellation Policy</h1>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex flex-col h-full">
            <div className="overflow-auto">
              <p className="text-justify mt-4">
                Cancellations made up to 24 hours before the rental start date
                are free. If you cancel less than 24 hours before, a 50%
                cancellation fee applies. If the rental is canceled after the
                start of the rental period, no refund is possible.
              </p>
              <p className="text-justify mt-4">
                Payment is made on site on the day of rental. If the customer
                does not show up within one hour of the scheduled rental time,
                the reservation will be canceled and cancellation fees may
                apply.
              </p>
            </div>
          </div>
        </div>

        <div className="uppercase mt-2 mb-2 text-black text-xl font-extrabold">
          <h1>The day of the rental</h1>
        </div>
        <div className="bg-white h-48 p-5 rounded-lg shadow-lg">
          <div className="flex flex-col h-full">
            <div className="overflow-auto">
              <p className="text-justify mt-4">
                Please ensure you arrive on time to collect your vehicle. Bring
                your valid driver's license, as well as a credit card for the
                security deposit. Also, be sure to inspect the vehicle and
                report any damage before setting off.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow-0 mr-16">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="uppercase text-center mt-4 mb-4 text-black text-xl font-extrabold">
            <h2>Your order</h2>
          </div>
          <div className="justify-items-center mt-4 w-full h-full">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt="Car"
                className="max-w-56 max-h-56 mb-4 rounded-lg"
              />
            ) : (
              <div className="max-w-56 max-h-56 flex items-center justify-center bg-gray-200 rounded-lg">
                <img src="/placeholder.png" alt="img" className="w-1/2" />
              </div>
            )}
            <div className="mt-4 flex items-center">
              <FaCar size={20} className="text-blue-500" />
              <p className="ml-2 text-xl text-blue-700 font-bold">{brand}</p>
            </div>
            <div className="flex flex-col mb-4">
              <p className="ml-2 text-sm">{model}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaCalendar size={20} className="text-blue-500" />
            <div className="h-4 mx-2"></div>
            <p className="text-lg">Options selected </p>
          </div>
          <div className="flex items-center mt-4">
            <i className=" text-blue-500 bx bx-map"></i>
            <div className="border-l h-8 mx-2"></div>
            <p className="text-xl">
              {formattedPickupDate}, {pickupTime}
            </p>
          </div>
          <div className="flex items-center">
            <i className="text-blue-500 bx bxs-map-pin"></i>
            <div className="border-l h-8 mx-2"></div>
            <p className="text-xl">
              {formattedReturnDate}, {returnTime}
            </p>
          </div>
          <hr className="my-4" />
          <div className="flex flex-col">
            <motion.div
              className="flex items-center p-2 rounded-lg w-full"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 20, y: 0 }}
              transition={{ type: "spring", stiffness: 90 }}
            >
              <h3 className="text-lg text-black font-extrabold mt-2 mb-2 mr-4">
                TOTAL{" "}
              </h3>
              <FaEquals size={20} className="text-blue-400" />
              <div className="ml-4">
                <p className="text-xl text-blue-400 font-bold">
                  {totalPrice} DT
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex justify-center mt-4 mb-4"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 20, y: 0 }}
              transition={{ type: "spring", stiffness: 90 }}
            >
              <button
                onClick={handleSubmit}
                className="uppercase w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {isLoading ? "Wait..." : "place the order"}
                {isLoading && (
                  <BeatLoader
                    color={"#ffffff"}
                    size={10}
                    css={`
                      margin-left: 10px;
                    `}
                  />
                )}
              </button>
            </motion.div>
            <div className="flex text-sm">
              <p>
                A deposit of 300DT will be requested automatically on the day of
                your rental
              </p>
            </div>
            <div className="flex text-sm">
              <p>
                This sum will be released 7 days after the return of the vehicle
                provided that the general rental conditions have been respected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationEditStep3;
