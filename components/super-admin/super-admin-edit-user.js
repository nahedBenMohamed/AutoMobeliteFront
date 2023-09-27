import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  HiHome,
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiUser,
} from "react-icons/hi";
import axios from "axios";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { BiIdCard } from "react-icons/bi";

const EditUser = ({ id }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [telephone, setTelephone] = useState("");
  const [numPermis, setNumPermis] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [goToUser, setGoToUser] = useState(false);
  const [images, setImages] = useState([]);

  const getDefaultTelephone = () => {
    const defaultCountryCode = getCountryCallingCode("TN");
    return `+${defaultCountryCode}`;
  };

  useEffect(() => {
    if (id) {
      axios
        .get("/api/super-admin/manage-user/user?id=" + id, {
          withCredentials: true,
        })
        .then((response) => {
          const userData = response.data;
          setName(userData.name);
          setFirstName(userData.firstname);
          setEmail(userData.email);
          setAddress(userData.address);
          setCity(userData.city);
          setTelephone(userData.telephone);
          setNumPermis(userData.numPermis);
          setImages(userData.image ? [userData.image] : []);
          setIsActive(userData.status === "activate");
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            toast.warning("An error occurred while loading data");
          }
        });
    }
  }, [id]);

  async function saveAdmin(ev) {
    ev.preventDefault();

    // Vérification des données côté client (facultatif)
    if (
      !name ||
      !firstname ||
      !email ||
      !telephone ||
      !numPermis ||
      !address ||
      !city
    ) {
      toast.error("Please complete all fields.");
      return;
    }

    // Convert telephone to a string
    const telephoneString = String(telephone);

    // Validate the phone number using the country code for Tunisia (TN)
    const phoneNumber = parsePhoneNumberFromString(telephoneString, "TN");

    // Additional validation for the phone number
    const phoneNumberRegex = /^\+216\d{8}$/; // Matches "+216" followed by 8 digits
    const isPhoneNumberValid =
      phoneNumber &&
      phoneNumber.isValid() &&
      phoneNumberRegex.test(telephoneString);

    if (!isPhoneNumberValid) {
      toast.error("Please enter a valid Tunisian phone number.");
      return;
    }

    const data = {
      name,
      firstname,
      email,
      image: images.length > 0 ? images[0] : null,
      numPermis,
      telephone,
      address,
      city,
      isActive,
    };
    try {
      if (id) {
        // Update
        await axios.put("/api/super-admin/manage-user/user/", { ...data, id });
      } else {
        //create
        await axios.post("/api/super-admin/manage-admin/admin/", { ...data });
      }

      toast.success("The User has been successfully registered!");
      setTimeout(() => {
        setGoToUser(true);
      }, 10);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Admin ID is required.") {
          toast.warning("Please provide an admin ID.");
        } else if (errorMessage === "Admin not found.") {
          toast.warning("Admin not found.");
        } else if (errorMessage === "Invalid agency name.") {
          toast.warning("Invalid agency name.");
        } else if (
          errorMessage === "The specified agency already has a responsible."
        ) {
          toast.warning("The specified agency already has a responsible.");
        } else if (
          errorMessage ===
          "An agency name is required when the admin is responsible for an agency."
        ) {
          toast.warning(
            "An agency name is required when the admin is responsible for an agency."
          );
        } else {
          // Si le message d'erreur ne correspond à aucune erreur spécifique, affichez un message générique
          toast.warning(errorMessage);
        }
      } else {
        toast.error("An error occurred. Please try again later");
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
          "/api/super-admin/manage-user/upload",
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
      await axios.delete(`/api/super-admin/manage-user/delete?id=${id}`, {
        withCredentials: true,
      });
      toast.success("Image deleted successfully!");
      setImages([]);
    } catch (error) {
      toast.error(`An error occurred while deleting the image`);
    }
  }

  if (goToUser) {
    router.push("/super-admin/dashboard/users");
  }
  function goBack() {
    router.push("/super-admin/dashboard/users");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl">
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
      <div className="max-w-screen-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="mt-2 mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {id ? "Edit User" : "Add User"}
        </h2>
        <div className="flex flex-1 ml-8">
          <div className="flex flex-col items-center mr-8">
            <div className="w-48 h-48 mb-4 relative">
              {images && images.length > 0 ? (
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

            <div className="flex mt-4 flex-row space-x-2">
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
                className="text-red-500 hover:text-red-700"
                onClick={deleteImage}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
          <form onSubmit={saveAdmin} className="flex-1 ml-16 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  disabled={true}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="firstname"
                  disabled={true}
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  disabled={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <BiIdCard className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="permis"
                  name="permis"
                  type="text"
                  autoComplete="numPermis"
                  placeholder="Enter your Tunisia permis drive"
                  disabled={true}
                  value={numPermis}
                  onChange={(e) => setNumPermis(e.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="phone"
                  name="phone"
                  type="phone"
                  autoComplete="phone"
                  placeholder="Enter your Tunisia phone number"
                  disabled={true}
                  value={telephone || getDefaultTelephone()} // Set default value with country code
                  onChange={(e) => setTelephone(e.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Enter your city"
                  disabled={true}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="address"
                  placeholder="Enter your address"
                  disabled={true}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {id ? "Update" : "Save"}
              </button>
              <button
                type="button"
                className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
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

export default EditUser;
