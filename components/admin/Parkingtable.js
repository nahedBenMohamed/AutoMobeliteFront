import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import { FiEdit, FiInfo, FiTrash2, FaCog } from "react-icons/fi";

const Parkingtable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [parkings, setParkings] = useState([]);
  const [parkingToDelete, setParkingToDelete] = useState(null);
  const [selectedParck, setSelectedParck] = useState(null);
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [parkingsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(1);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/admin/manage-parking/parking", { withCredentials: true })
      .then((response) => {
        setParkings(response.data.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          toast.warning("An error occurred while loading data");
        }
      });
  }, []);

  // Pagination logic
  const indexOfLastParking = currentPage * parkingsPerPage;
  const indexOfFirstParking = indexOfLastParking - parkingsPerPage;
  const currentParkings = parkings.slice(
    indexOfFirstParking,
    indexOfLastParking,
  );

  const closeDetailsModal = () => {
    setDetailsModalIsOpen(false);
  };

  const openModal = (parking) => {
    setSelectedParck(parking);
    setDetailsModalIsOpen(true);
  };

  const handleDeleteParking = async () => {
    try {
      await axios.delete(
        `/api/admin/manage-parking/parking?id=${parkingToDelete.id}`,
        { withCredentials: true },
      );
      const updatedParkings = parkings.filter(
        (parking) => parking.id !== parkingToDelete.id,
      );
      setParkings(updatedParkings);
      setDetailsModalIsOpen(false);
      setParkingToDelete(null);
      toast.success("The parking has been deleted successfully!");
    } catch (error) {
      if (error.response) {
        toast.warning("An error occurred while deleting the parking");
      }
    }
  };

  const handleNextBtn = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + parkingsPerPage);
      setMinPageNumberLimit(minPageNumberLimit + parkingsPerPage);
    }
  };
  const handlePrevBtn = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % parkingsPerPage === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - parkingsPerPage);
      setMinPageNumberLimit(minPageNumberLimit - parkingsPerPage);
    }
  };

  function goToParking() {
    setIsLoadingNew(true);
    router.push("/admin/dashboard/parking/new");
  }

  function goEditParking(id) {
    router.push(`/admin/dashboard/parking/edit/${id}`);
  }
  return (
    <div className="mt-16">
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
      <div className="mb-4 flex justify-between">
        <button
          onClick={goToParking}
          className=" uppercase bg-blue-500 text-white p-2 rounded mx-1"
        >
          {isLoadingNew ? "Add Parc" : "Add Parc"}
          {isLoadingNew && (
            <BeatLoader
              color={"#ffffff"}
              size={10}
              css={`
                margin-left: 10px;
              `}
            />
          )}
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="py-2 px-4 border border-gray-300 rounded-3xl"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      ) : parkings.length === 0 ? (
        <div className="flex justify-center items-center h-full w-full ">
          <div className="mt-8 flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
            <img
              className="h-full w-full object-cover"
              src="/no-parking.png"
              alt="No reservations"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="uppercase text-2xl font-bold">
              you do not have a vehicle fleet
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentParkings
              .filter(
                (parking) =>
                  parking.name.toLowerCase().includes(search.toLowerCase()) ||
                  parking.city.toLowerCase().includes(search.toLowerCase()),
              )
              .map((parking) => (
                <div
                  key={parking.id}
                  className="border border-lighter-grey bg-white rounded"
                >
                  <div className="image-container">
                    {parking.image ? (
                      <img src={parking.image} alt="Car" />
                    ) : (
                      <img src="/placeholder.png" alt="Default" />
                    )}
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div>
                          <h1 className="-mt-6  font-bold text-xl lg:text-2xl">
                            {parking.name}{" "}
                          </h1>
                        </div>
                      </div>
                      <div className="text-right">
                        <h1 className="font-bold text-xl lg:text-2xl">
                          {parking.city}
                        </h1>
                        <p className="text-custom-grey">{parking.address}</p>
                      </div>
                    </div>
                    <div>
                      <hr className="border border-lighter-grey" />
                    </div>
                    <div className="flex space-x-4 justify-center items-center">
                      <button
                        onClick={() => goEditParking(parking.id)}
                        className="text-blue-500 hover:text-blue-700 mx-1"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 mx-1"
                        onClick={() => {
                          setModalIsOpen(true);
                          setParkingToDelete(parking);
                        }}
                      >
                        <FiTrash2 size={18} />
                      </button>
                      <button onClick={() => openModal(parking)}>
                        <FiInfo size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-center mt-4">
            {parkings.length > parkingsPerPage && (
              <ul className="flex items-center">
                {currentPage !== 1 && (
                  <>
                    <li>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                      >
                        First
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handlePrevBtn}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                      >
                        Prev
                      </button>
                    </li>
                  </>
                )}
                <li>
                  <button
                    className={`bg-blue-500 text-white font-bold py-2 px-4 mx-1 rounded`}
                  >
                    {currentPage}
                  </button>
                </li>
                {currentPage !==
                  Math.ceil(parkings.length / parkingsPerPage) && (
                  <>
                    <li>
                      <button
                        onClick={handleNextBtn}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                      >
                        Next
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.ceil(parkings.length / parkingsPerPage),
                          )
                        }
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                      >
                        Last
                      </button>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
          <Modal isOpen={detailsModalIsOpen}>
            {selectedParck && (
              <div className="flex justify-center items-center fixed inset-0 z-50 overflow-auto modal-overlay">
                <div className="w-11/12 sm:w-3/4 md:w-1/2  md:max-w-3xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
                  <h2 className="py-2 text-lg text-center sm:text-xl md:text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    PARKING'S DETAILS
                  </h2>
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/2 mx-4">
                      <div className="rounded-lg p-4">
                        {selectedParck.image ? (
                          <img
                            src={selectedParck.image}
                            alt="Car"
                            className="w-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                            <span className="text-gray-500 text-lg">
                              <img src="/placeholder.png" alt="img" />
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-between">
                        <button
                          onClick={closeDetailsModal}
                          className="uppercase bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2 mx-4 mt-4 sm:mt-0">
                      <div className="rounded-lg p-4 space-y-4">
                        <h2 className="text-xl sm:text-2xl font-bold">
                          {selectedParck.name}
                        </h2>
                        <p>
                          <span className="font-bold">Address:</span>&nbsp;
                          {selectedParck.address}
                        </p>
                        <p>
                          <span className="font-bold">City:</span>&nbsp;
                          {selectedParck.city}
                        </p>
                        <p>
                          <span className="font-bold">Agency Name:</span>&nbsp;
                          {selectedParck.Agency?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Confirmation Modal"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                maxWidth: "400px",
                width: "90%",
                height: "35%",
                margin: "auto",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                top: "50%",
                left: "55%",
                transform: "translate(-50%, -55%)",
              },
            }}
            contentClassName="custom-modal-content"
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              Confirmation
            </h2>
            {parkingToDelete && (
              <div>
                <p className="text-center mt-4 mb-4">
                  Are you sure you want to delete the parc &nbsp;
                  <span className="text-blue-500">
                    {parkingToDelete.name}
                  </span>{" "}
                  ?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleDeleteParking}
                  >
                    OUI
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setModalIsOpen(false)}
                  >
                    NON
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default Parkingtable;
