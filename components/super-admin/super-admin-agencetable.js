import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { FiEdit, FiInfo, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { MdDelete, MdEdit } from "react-icons/md";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const SuperAdminAgencetable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState(null);
  const [agences, setAgences] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [agencesPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/super-admin/manage-agence/agence").then((response) => {
      setAgences(response.data.reverse());
    });
  }, []);

  // Pagination logic
  const indexOfLastAgence = currentPage * agencesPerPage;
  const indexOfFirstAgence = indexOfLastAgence - agencesPerPage;
  const currentAgences = agences.slice(indexOfFirstAgence, indexOfLastAgence);

  const handleDeleteCar = async () => {
    try {
      await axios.delete(
        `/api/super-admin/manage-agence/agence?id=${agencyToDelete.id}`,
        { withCredentials: true }
      );
      const updatedAgences = agences.filter(
        (agence) => agence.id !== agencyToDelete.id
      );
      setAgences(updatedAgences);
      setModalIsOpen(false);
      setAgencyToDelete(null);
      toast.success("The agency has been deleted successfully!");
    } catch (error) {
      if (error.response) {
        toast.warning("An error occurred while deleting the car");
      }
    }
  };

  function goAgencyForm() {
    setIsLoadingNew(true);
    router.push("/super-admin/dashboard/agence/new");
  }

  function goEditAgency(id) {
    router.push(`/super-admin/dashboard/agence/edit/${id}`);
  }
  function goDetails(id) {
    router.push(`/super-admin/dashboard/agence/details/${id}`);
  }

  return (
    <div>
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
          onClick={goAgencyForm}
          className="uppercase bg-blue-500 text-white p-2 rounded mx-1"
        >
          {isLoadingNew ? "Add Agency" : "Add Agency"}
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
      ) : agences.length === 0 ? (
        <div className="flex justify-center items-center h-full w-full ">
          <div className="flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
            <img
              className="h-full w-full object-cover"
              src="/no-agencies.png"
              alt="No agencies"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="uppercase text-2xl font-bold">
              you do not have a agency
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="border rounded-md p-4">
            <table className="min-w-full">
              <thead className="text-center">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Agence Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="px-6 py-3  text-x font-medium text-gray-500 tracking-wider">
                {currentAgences
                  .filter(
                    (agence) =>
                      agence.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      agence.address
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      agence.email.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((agence) => (
                    <tr key={agence.id}>
                      <td className="text-center">{agence.name}</td>
                      <td className="text-left">{agence.address}</td>
                      <td className="text-center">{agence.email}</td>
                      <td className="text-center">{agence.telephone}</td>
                      <td className="px-6 py-4 justify-center flex space-x-2">
                        <button
                          onClick={() => goEditAgency(agence.id)}
                          className="bg-blue-500 text-white p-2 rounded mx-1"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          className="bg-green-500 text-white p-2 rounded mx-1"
                          onClick={() => goDetails(agence.id)}
                        >
                          <FiInfo size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setModalIsOpen(true);
                            setAgencyToDelete(agence);
                          }}
                          className="bg-red-500 text-white p-2 rounded mx-1"
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            {agences.length > agencesPerPage && (
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
                        onClick={() => setCurrentPage(currentPage - 1)}
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
                {currentPage !== Math.ceil(agences.length / agencesPerPage) && (
                  <>
                    <li>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 mx-1 rounded"
                      >
                        Next
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.ceil(agences.length / agencesPerPage)
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
            {agencyToDelete && (
              <div>
                <p className="text-center mt-4 mb-4">
                  Êtes-vous sûr de vouloir supprimer l'agence &nbsp;
                  <span className="text-blue-500">{agencyToDelete.name}</span>
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleDeleteCar}
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

export default SuperAdminAgencetable;
