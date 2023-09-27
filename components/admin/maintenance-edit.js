import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isSameDay } from "date-fns";
import { FaCar } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

export default function MaintenanceEdit({ id }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [mileage, setMileage] = useState("");
  const [registration, setRegistration] = useState("");
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [oldStartDate, setOldStartDate] = useState("");
  const [oldEndDate, setOldEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [goToMaintenance, setGoToMaintenance] = useState(false);
  const [reservedDates, setReservedDates] = useState([]);
  const [maintenanceDates, setMaintenanceDates] = useState([]);
  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [description, setDescription] = useState("");
  const [carId, setCarId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/manage-maintenance/maintenance?id=${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          const maintenanceData = response.data;
          setCarId(maintenanceData.car.id);
          setBrand(maintenanceData.car.brand);
          setModel(maintenanceData.car.model);
          setMileage(maintenanceData.car.mileage.toString());
          setRegistration(maintenanceData.car.registration.toString());
          setOldStartDate(
            maintenanceData.startDate
              ? new Date(maintenanceData.startDate)
              : null
          );
          setOldEndDate(
            maintenanceData.endDate ? new Date(maintenanceData.endDate) : null
          );
          setPrice(maintenanceData.cost);
          setDescription(maintenanceData.description);
          setImages(
            maintenanceData.car.image ? [maintenanceData.car.image] : []
          );
          const availabilityDates = maintenanceData.car.availability.map(
            (availability) => new Date(availability.date)
          );
          const reservedDates = [];
          for (const rental of maintenanceData.car.rentals) {
            let date = new Date(rental.startDate);
            let endDate = new Date(rental.endDate);
            while (date <= endDate) {
              reservedDates.push(new Date(date));
              date.setDate(date.getDate() + 1);
            }
          }
          // Récupérer les dates de maintenance
          const maintenanceDates = [];
          let currentDate = new Date(maintenanceData.startDate);
          const endDate = new Date(maintenanceData.endDate);
          while (currentDate <= endDate) {
            maintenanceDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setMaintenanceDates(maintenanceDates);
          setReservedDates(reservedDates);
          setAvailabilityDates(availabilityDates);
          setMaintenanceDates(maintenanceDates);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  async function maintenance(ev) {
    ev.preventDefault();
    setIsLoading(true);

    if (!price) {
      toast.error("Please complete all fields.");
      setIsLoading(false);
      return;
    }

    const data = {
      maintenanceId: id,
      carId: carId,
      description,
      price,
      oldStartDate: oldStartDate,
      oldEndDate: oldEndDate,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    try {
      if (id) {
        await axios.put(
          `/api/admin/manage-maintenance/maintenance/`,
          { ...data, id },
          { withCredentials: true }
        );
      }
      toast.success("maintenance updated with success");
      setIsLoading(false);
      setTimeout(() => {
        setGoToMaintenance(true);
      }, 10);
    } catch (error) {
      if (error.response) {
        if (error.response.data.error) {
          toast.warning(error.response.data.error);
          setIsLoading(false);
        }
        toast.error("Verify your informations");
        setIsLoading(false);
      }
    }
  }

  if (goToMaintenance) {
    router.push("/admin/dashboard/maintenance");
  }

  function goBack() {
    router.push("/admin/dashboard/maintenance");
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
        hideProgressBar={true}
        newestOnTop
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme="colored"
      />
      <div className="flex-grow flex flex-col space-y-5 mr-8">
        <div className="uppercase ml-7 mt-4 mb-4 text-black text-xl font-extrabold">
          Update Maintenance
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex flex-row justify-center items-center mt-4 mb-4 rounded-lg">
            <form onSubmit={maintenance} className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="kilometer" className="block text-xs mb-1">
                    Mileage:
                  </label>
                  <div className="relative">
                    <input
                      id="kilometer"
                      value={mileage}
                      onChange={(ev) => setMileage(ev.target.value)}
                      disabled={true}
                      placeholder="kilometer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="matricule" className="block text-xs mb-1">
                    Registration:
                  </label>
                  <div className="relative">
                    <input
                      id="matricule"
                      value={registration}
                      onChange={(ev) => setRegistration(ev.target.value)}
                      disabled={true}
                      placeholder="Registration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                {id && (
                  <>
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
                        value={
                          endDate ? endDate.toLocaleDateString("fr-FR") : ""
                        }
                        onChange={(event) =>
                          setEndDate(new Date(event.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="End Date"
                      />
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <label htmlFor="gearBox" className="block text-xs mb-1">
                    Maintenance Price :
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      type="text"
                      value={price}
                      onChange={(ev) => setPrice(ev.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Maintenance Price"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white h-48 p-5 rounded-lg">
                <div className="flex flex-col h-full">
                  <div className="relative overflow-auto">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={description}
                      onChange={(ev) => setDescription(ev.target.value)}
                      rows={5}
                      placeholder="Enter a description..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="uppercase ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={goBack}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="uppercase ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {isLoading ? "Wait" : "Update"}
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
