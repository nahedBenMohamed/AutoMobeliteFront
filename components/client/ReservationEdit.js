import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaCalendar, FaCar, FaEquals, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import moment from "moment/moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { HiPhone, HiUser } from "react-icons/hi";
import { HiMapPin } from "react-icons/hi2";
import "boxicons/css/boxicons.min.css";
import { BeatLoader } from "react-spinners";

function ReservationEdit({ id }) {
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [images, setImages] = useState([]);
  const [model, setModel] = useState("");
  const [livraison, setLivraison] = useState(20);
  const [telephone, setTelephone] = useState("");
  const [agencePhone, setAgencePhone] = useState("");
  const [agenceEmail, setAgenceEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [oldStartDate, setOldStartDate] = useState("");
  const [oldEndDate, setOldEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const formattedPickupDate = moment(oldStartDate).format("DD MMMM");
  const formattedReturnDate = moment(oldEndDate).format("DD MMMM");
  const { data } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get("/api/client/reservation?id=" + id, { withCredentials: true })
        .then((response) => {
          const rentalData = response.data;
          setAgencePhone(rentalData.car.Agency.telephone);
          setAgenceEmail(rentalData.car.Agency.email);
          setModel(rentalData.car.model);
          setBrand(rentalData.car.brand);
          setCarPrice(rentalData.car.price);
          setPrice(rentalData.total.toString());
          setImages(rentalData.car.image ? [rentalData.car.image] : []);
          setOldStartDate(rentalData.startDate);
          setOldEndDate(rentalData.endDate);
          const formattedStartTime = moment(rentalData.startTime).format(
            "HH:mm"
          );
          const formattedEndTime = moment(rentalData.endTime).format("HH:mm");
          setStartTime(formattedStartTime);
          setEndTime(formattedEndTime);
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
        user: { telephone, address, city },
      } = data;

      setTelephone(telephone);
      setAddress(address);
      setCity(city);
    }
  }, [data]);

  function goBack() {
    router.push("/manage-reservations");
  }
  const goStep2 = () => {
    setIsLoading(true);
    router.push(`/reservations/edit/step2?id=${id}`);
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
            By modifying your reservation, you accept the
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
          <h1>Reservation Modification Policy</h1>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex flex-col h-full">
            <div className="overflow-auto">
              <p className="mb-4">
                On our platform, we understand that your plans may change, and
                you might need to modify your car reservation. Here's our
                reservation modification policy:
              </p>
              <h2 className="text-lg font-semibold mb-2">
                How to Modify Your Reservation:
              </h2>
              <p className="mb-4">
                To modify your reservation, please follow the steps below:
                <br />
                1. Log in to your account on our platform.
                <br />
                2. Go to the "My Reservations" section.
                <br />
                3. Select the reservation you wish to modify.
                <br />
                4. Click on the "Modify Reservation" button.
                <br />
                5. Follow the instructions to make the desired changes.
                <br />
                6. Click on the "EDIT RENTAL" button on your right to begin the
                process.
              </p>
              <p className="mb-4">
                Please note that reservation modifications are allowed up to 24
                hours before the start of the rental. After this time, no
                modifications can be made.
              </p>
              <p>
                For any questions or additional assistance regarding the
                modification of your reservation, feel free to contact the
                agency via their mobile at{" "}
                <a
                  href={`tel:${agencePhone}`}
                  className="font-semibold text-blue-500 hover:text-blue-600"
                >
                  {agencePhone}{" "}
                </a>
                or their email at{" "}
                <a
                  href={`mailto:${agenceEmail}`}
                  className="font-semibold text-blue-500 hover:text-blue-600"
                >
                  {agenceEmail}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        <motion.div
          className="flex mt-4 mb-4"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 20, y: 0 }}
          transition={{ type: "spring", stiffness: 90 }}
        >
          <button
            onClick={goBack}
            className="uppercase w-32 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            cancel
          </button>
        </motion.div>
      </div>
      <div className="flex-grow-0 mr-16">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="uppercase text-center mt-4 mb-4 text-black text-xl font-extrabold">
            <h2>Your recent order</h2>
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
              {formattedPickupDate}, {startTime}
            </p>
          </div>
          <div className="flex items-center">
            <i className="text-blue-500 bx bxs-map-pin"></i>
            <div className="border-l h-8 mx-2"></div>
            <p className="text-xl">
              {formattedReturnDate}, {endTime}
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
                <p className="text-xl text-blue-400 font-bold">{price} DT</p>
              </div>
            </motion.div>
            <motion.div
              className="flex justify-center mt-4 mb-4"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 20, y: 0 }}
              transition={{ type: "spring", stiffness: 90 }}
            >
              <button
                onClick={goStep2}
                className="uppercase w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {isLoading ? "Wait..." : "Edit rental"}
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

export default ReservationEdit;
