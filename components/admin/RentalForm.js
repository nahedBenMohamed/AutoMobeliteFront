import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInCalendarDays, isSameDay } from "date-fns";
import { FaCar } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

export default function RentalForm({ id }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [registration, setRegistration] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [reservedDates, setReservedDates] = useState([]);
  const [maintenanceDates, setMaintenanceDates] = useState([]);
  const [goToRental, setGoToRental] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("reserved");
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  const router = useRouter();

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/manage-cars/cars?id=${id}`, { withCredentials: true })
        .then((response) => {
          const carData = response.data;
          setBrand(carData.brand);
          setModel(carData.model);
          setYear(carData.year.toString());
          setMileage(carData.mileage.toString());
          setPrice(carData.price.toString());
          setImages(carData.image ? [carData.image] : []);
          setAvailabilityDates(
            carData.availability.map((avail) => new Date(avail.date))
          );
          const reservedDates = [];
          for (const rental of carData.rentals) {
            let date = new Date(rental.startDate);
            let endDate = new Date(rental.endDate);
            while (date <= endDate) {
              reservedDates.push(new Date(date));
              date.setDate(date.getDate() + 1);
            }
          }
          const maintenanceDates = [];
          for (const maintenance of carData.maintenances) {
            let date = new Date(maintenance.startDate);
            let endDate = new Date(maintenance.endDate);
            while (date <= endDate) {
              maintenanceDates.push(new Date(date));
              date.setDate(date.getDate() + 1);
            }
          }

          setMaintenanceDates(maintenanceDates);
          setReservedDates(reservedDates);
          setRegistration(carData.registration);
        })
        .catch((error) => {
          if (error.response) {
            toast.warning("An error occurred while loading data");
          }
        });
    }
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInCalendarDays(endDate, startDate) + 1;
      setTotal(days * price);
    }
  }, [startDate, endDate, price]);

  async function rental(ev) {
    ev.preventDefault();
    setIsLoading(true);

    if (!email || !startTime || !endTime || !startDate || !endDate) {
      toast.error("Please complete all fields.");
      setIsLoading(false);
      return;
    }

    const data = {
      carId: id,
      email,
      startTime,
      endTime,
      total,
      status: selectedStatus,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    try {
      if (id) {
        await axios.post(
          `/api/admin/reservation/reservation/`,
          { ...data, id },
          { withCredentials: true }
        );
      }
      toast.success("reservation created with success");
      setIsLoading(false);
      setTimeout(() => {
        setGoToRental(true);
      }, 10);
    } catch (error) {
      if (error.response) {
        if (error.response.data.error) {
          if (error.response.data.error === "Client not found") {
            toast.warning("Client not found");
            setIsLoading(false);
            return;
          }
        }
        toast.error("Verify your informations");
        setIsLoading(false);
      }
    }
  }

  if (goToRental) {
    router.push("/admin/dashboard/reservations");
  }

  function goBack() {
    router.push("/admin/dashboard/reservations/new");
  }

  const handleDateChange = (date) => {
    if (!startDate) {
      setStartDate(date);
    } else if (!endDate && date > startDate) {
      let currentDate = new Date(startDate);
      let nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + 1);

      while (currentDate < date) {
        const isReserved = reservedDates.some((reservedDate) =>
          isSameDay(nextDate, reservedDate)
        );
        const isMaintenance = maintenanceDates.some((maintenanceDate) =>
          isSameDay(nextDate, maintenanceDate)
        );

        if (isReserved || isMaintenance) {
          setEndDate(null);
          return;
        }

        currentDate.setDate(currentDate.getDate() + 1);
        nextDate.setDate(nextDate.getDate() + 1);
      }

      setEndDate(currentDate);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  return (
    <div className="flex">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme="colored"
      />
      <div className="flex-grow flex flex-col space-y-5 mr-4">
        <div className="uppercase ml-7 mt-4 mb-4 text-black text-xl font-extrabold">
          {id ? "create a new rental" : "put your car information"}
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex flex-row justify-center items-center mt-4 mb-4 rounded-lg">
            <form onSubmit={rental} className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="year" className="block text-xs mb-1">
                    Year:
                  </label>
                  <div className="relative">
                    <input
                      id="year"
                      name="year"
                      type="text"
                      value={year}
                      disabled={true}
                      onChange={(ev) => setYear(ev.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Year"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="kilometer" className="block text-xs mb-1">
                    Mileage:
                  </label>
                  <div className="relative">
                    <input
                      id="mileage"
                      name="mileage"
                      type="text"
                      value={mileage}
                      disabled={true}
                      onChange={(ev) => setMileage(ev.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Mileage"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-xs mb-1">
                    Price:
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      type="text"
                      value={price}
                      disabled={true}
                      onChange={(ev) => setPrice(ev.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Price"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="matricule" className="block text-xs mb-1">
                    Registration:
                  </label>
                  <div className="relative">
                    <input
                      id="registration"
                      name="registration"
                      type="text"
                      value={registration}
                      disabled={true}
                      onChange={(ev) => setRegistration(ev.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Registration"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="carStatus" className="block text-xs mb-1">
                    Car Status:
                  </label>
                  <div className="relative">
                    <input
                      id="status"
                      name="status"
                      type="text"
                      value={status}
                      disabled={true}
                      onChange={(ev) => setStatus(ev.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Car Status"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="gearBox" className="block text-xs mb-1">
                    Email Client:
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-xs mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={
                      startDate ? startDate.toLocaleDateString("fr-FR") : ""
                    }
                    onChange={(event) =>
                      setStartDate(new Date(event.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Start Date"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-xs mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={endDate ? endDate.toLocaleDateString("fr-FR") : ""}
                    onChange={(event) =>
                      setEndDate(new Date(event.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="End Date"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-xs mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Start Time"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-xs mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="End Time"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="door" className="block text-xs mb-1">
                    Rental Status:
                  </label>
                  <div className="relative">
                    <select
                      id="rentalStatus"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="reserved">Reserved</option>
                      <option value="ongoing">On going</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="uppercase ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {isLoading ? "Ongoing" : id ? "Update" : "Save"}
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
                <button
                  type="button"
                  className="uppercase ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={goBack}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-grow-0">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className=" justify-items-center mt-4 w-full h-full">
            <div className=" justify-items-center mt-4 w-full h-full">
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
          </div>
          <div className="mt-16 mb-16">
            <label className="mt-4 mb-4 flex items-center text-sm font-medium text-gray-700">
              Availability:
              <div className="flex flex-row space-x-2 ml-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium">Open</p>
                <div className="w-4 h-4 bg-red-500 rounded-full ml-2"></div>
                <p className="text-sm font-medium">Close</p>
                <div className="w-4 h-4 bg-yellow-500 rounded-full ml-2"></div>
                <p className="text-sm font-medium">Maintenance</p>
              </div>
            </label>
            <div className="flex flex-row justify-center items-center mt-8 mb-8 rounded-lg">
              <DatePicker
                selected={null}
                inline
                minDate={new Date()}
                highlightDates={[
                  {
                    selectable: false,
                    startDate,
                    endDate,
                    dates: availabilityDates.filter(
                      (date) =>
                        isSameDay(date, startDate) || isSameDay(date, endDate)
                    ),
                  },
                  {
                    selectable: true,
                    dates: availabilityDates,
                  },
                ]}
                dayClassName={(date) => {
                  if (
                    reservedDates.some((reservedDate) =>
                      isSameDay(date, reservedDate)
                    )
                  ) {
                    return "reserved-day";
                  } else if (
                    maintenanceDates.some((maintenanceDate) =>
                      isSameDay(date, maintenanceDate)
                    )
                  ) {
                    return "maintenance-day";
                  } else if (
                    availabilityDates.some((availableDate) =>
                      isSameDay(date, availableDate)
                    )
                  ) {
                    return "available-day";
                  } else {
                    return "unavailable-day"; // Ajout d'une classe pour les jours non disponibles
                  }
                }}
                onChange={handleDateChange}
                excludeDates={[...reservedDates, ...maintenanceDates]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
