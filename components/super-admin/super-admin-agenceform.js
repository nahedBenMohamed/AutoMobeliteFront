import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiLocationMarker, HiMail, HiPhone, HiUser } from "react-icons/hi";
import axios from "axios";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

const SuperAdminAgenceForm = ({ id }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [responsibleEmail, setResponsibleEmail] = useState("");
  const [images, setImages] = useState([]);
  const [goToAgency, setGoToAgency] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Function to set the default telephone value with country code
  const getDefaultTelephone = () => {
    const defaultCountryCode = getCountryCallingCode("TN");
    return `+${defaultCountryCode}`;
  };

  useEffect(() => {
    if (id) {
      axios
        .get("/api/super-admin/manage-agence/agence?id=" + id, {
          withCredentials: true,
        })
        .then((response) => {
          const agencyData = response.data;
          setName(agencyData.name);
          setAddress(agencyData.address);
          setEmail(agencyData.email);
          setTelephone(agencyData.telephone);
          setImages(agencyData.image ? [agencyData.image] : []);
          setResponsibleEmail(agencyData.AgencyUser?.email);
          setIsActive(agencyData.status === "activate");
        })
        .catch((error) => {
          if (error.response) {
            toast.warning("An error occurred while loading data");
          }
        });
    }
  }, [id]);

  async function saveAgence(ev) {
    ev.preventDefault();
    setIsLoading(true);

    // Vérification des données côté client (facultatif)
    if (!name || !telephone || !email || !address || !responsibleEmail) {
      toast.error("Please complete all fields.");
      setIsLoading(false);
      return;
    }

    // Convert telephone to a string
    const telephoneString = String(telephone);

    // Validate the phone number
    const phoneNumber = parsePhoneNumberFromString(telephoneString, "TN");

    // Additional validation for the phone number
    const phoneNumberRegex = /^\+216\d{8}$/; // Matches "+216" followed by 8 digits
    const isPhoneNumberValid =
      phoneNumber &&
      phoneNumber.isValid() &&
      phoneNumberRegex.test(telephoneString);

    if (!isPhoneNumberValid) {
      toast.error("Please enter a valid Tunisian phone number.");
      setIsLoading(false);
      return;
    }

    const data = {
      name,
      address,
      email,
      telephone,
      image: images.length > 0 ? images[0] : null,
      responsibleEmail,
      isActive,
    };

    try {
      if (id) {
        // Update
        await axios.put("/api/super-admin/manage-agence/agence", {
          ...data,
          id,
        });
      } else {
        // Create
        await axios.post("/api/super-admin/manage-agence/agence", data);
      }
      toast.success("The Agency has been successfully registered!");
      setIsLoading(false);
      setTimeout(() => {
        setGoToAgency(true);
      }, 10);
    } catch (error) {
      if (error.response) {
        if (error.response.data.message) {
          toast.warning(error.response.data.message);
          setIsLoading(false);
        }
      } else {
        toast.error("An error occurred while saving the agency.");
        setIsLoading(false);
      }
    }
  }

  async function uploadImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("id", id);
      try {
        const res = await axios.post(
          "/api/super-admin/manage-agence/upload",
          data
        );
        const { message, imagePath } = res.data;
        if (message === "Image uploaded successfully") {
          setImages([imagePath]);
          toast.info(res.data.message);
        } else {
          toast.warning("Upload failed");
        }
      } catch (error) {
        if (error.response) {
          toast.warning(error.response.data.error);
        }
      }
    }
  }

  async function deleteImage() {
    if (images.length === 0) {
      toast.error("No image to delete");
      return;
    }

    try {
      await axios.delete(`/api/super-admin/manage-agence/delete?id=${id}`, {
        withCredentials: true,
      });
      toast.success("Image deleted successfully!");
      setImages([]);
    } catch (error) {
      toast.error(`An error occurred while deleting the image`);
    }
  }

  if (goToAgency) {
    router.push("/super-admin/dashboard/manage");

    return null;
  }
  function goBack() {
    router.push("/super-admin/dashboard/manage");
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl">
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
      <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {id ? "Edit Agency" : "Add Agency"}
        </h2>
        <div className="flex flex-1 ml-8">
          <div className="flex flex-col items-center mr-8">
            <div className="w-48 h-48 mb-4 relative">
              {images.length > 0 ? (
                <img
                  src={images[0]}
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
            <div className="flex flex-row space-x-2 mt-4">
              <input
                type="file"
                id="image"
                name="image"
                onChange={uploadImage}
                hidden
              />
              <label
                htmlFor="image"
                className=" text-blue-500 hover:text-blue-700 mx-1 cursor-pointer"
              >
                <FiPlus size={18} />
              </label>
              <button
                type="button"
                className="-mt-1.5 text-red-500 hover:text-red-700"
                onClick={deleteImage}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
          <form onSubmit={saveAgence} className="flex-1 ml-8 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="nameAgency"
                  name="nameAgency"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter agency Name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="responsable"
                  name="responsable"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter responsible email"
                  value={responsibleEmail}
                  onChange={(ev) => setResponsibleEmail(ev.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter agency email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="phone"
                  name="phone"
                  type="phone"
                  autoComplete="email"
                  placeholder="Enter your Tunisia phone number"
                  value={telephone || getDefaultTelephone()}
                  onChange={(ev) => setTelephone(ev.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="new-location"
                  placeholder="Enter agency location"
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="relative flex items-center mt-8">
              <label
                htmlFor="toggle"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    id="toggle"
                    type="checkbox"
                    className="hidden"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <div
                    className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"
                    style={{ backgroundColor: isActive ? "blue" : "gray" }}
                  ></div>
                  <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  {isActive ? "Active" : "Inactive"}
                </div>
              </label>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="uppercase ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {isLoading ? "Wait" : id ? "Update" : "Save"}
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
  );
};

export default SuperAdminAgenceForm;
