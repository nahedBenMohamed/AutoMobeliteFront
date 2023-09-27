import { FiUser, FiPhone, FiHome, FiMap } from "react-icons/fi";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

function InformationForm() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [images, setImages] = useState([]);
  const [drivingLicense, setDrivingLicense] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validateInput = (input) => input.trim() !== "";

  const getDefaultTelephone = () => {
    const defaultCountryCode = getCountryCallingCode("TN");
    return `+${defaultCountryCode}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "/api/client/profile?id=" + session.user.id
        );
        const { name, firstname, telephone, numPermis, address, city, image } =
          response.data.user;
        setName(name);
        setFirstname(firstname);
        setDrivingLicense(numPermis);
        setTelephone(telephone);
        setCity(city);
        setAddress(address);
        setImages(image ? [image] : []);
      } catch (error) {
        if (error.response) {
          toast.warning("An error occurred while loading data");
        }
      }
    };
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

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
      toast.error("Please enter a valid Tunisian phone number");
      return;
    }
    const data = {
      name,
      firstname,
      telephone,
      drivingLicense,
      address,
      city,
      image: images?.length > 0 ? images[0] : null,
    };
    try {
      const response = await axios.put(
        "/api/client/profile?id=" + session.user.id,
        { ...data }
      );
      toast.success("Successfully updated");
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };

  async function uploadImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      data.append("file", files[0]);
      try {
        const res = await axios.post(
          `/api/client/upload?clientId=${session?.user?.id}`,
          data
        );
        const { message, imagePath } = res.data;
        if (message === "Image uploaded successfully") {
          setImages([imagePath]);
          toast.info("Image uploaded successfully");
        } else {
          toast.warning("Upload failed");
        }
      } catch (error) {
        if (error.response) {
          toast.warning("An error occurred while downloading the image");
        }
      }
    }
  }

  async function deleteImage() {
    if (images.length === 0) {
      toast.error("No image to delete");
      return;
    }
    setImages([]);
    try {
      await axios.delete(`/api/client/delete?id=${session?.user.id}`, {
        withCredentials: true,
      });
      toast.success("Image deleted successfully!");
      setImages([]);
    } catch (error) {
      toast.error("An error occurred while deleting the image.");
    }
  }

  return (
    <div className="bg-white rounded shadow p-6 flex justify-center items-start">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme="colored"
      />
      <form onSubmit={handleSubmit} className="mr-6">
        <p className="mb-5">
          We invite you to modify your personal information in the event of an
          error or a change of situation.
        </p>
        <div className="mb-4 relative">
          <FiUser className="absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Name"
            className={`border py-2 pl-10 pr-3 rounded w-72 ${
              validateInput(name) ? "border-green-500" : "border-red-500"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <FiUser className="absolute top-3 left-3" />
          <input
            type="text"
            placeholder="First Name"
            className={`border py-2 pl-10 pr-3 rounded w-72 ${
              validateInput(firstname) ? "border-green-500" : "border-red-500"
            }`}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <FiPhone className="absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Phone Number"
            className={`border py-2 pl-10 pr-3 rounded w-72 ${
              validateInput(telephone) ? "border-green-500" : "border-red-500"
            }`}
            value={telephone || getDefaultTelephone()}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>
        <div className="mb-1 relative">
          <FiMap className="absolute top-3 left-3" />
          <input
            type="text"
            placeholder="City"
            className={`border py-2 pl-10 pr-3 rounded w-72 ${
              validateInput(city) ? "border-green-500" : "border-red-500"
            }`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <p className="mt-2 mb-4 text-xs text-gray-500">
          Remember to check that your mobile phone number is up to date. It will
          be used to contact you during the delivery and collection of the
          vehicle.
        </p>
        <div className="mb-4 relative">
          <FiHome className="absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Address"
            className={`border py-2 pl-10 pr-3 rounded w-72 ${
              validateInput(address) ? "border-green-500" : "border-red-500"
            }`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <p className="mt-2 mb-4 text-xs text-gray-500">
          The personal address is necessary information for the creation of the
          rental contract.
        </p>
        <button
          type="submit"
          className="uppercase bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-72"
        >
          {isLoading ? "Wait..." : "confirm"}
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
      </form>
      <div className="flex flex-col items-center">
        <div className=" mt-16 w-full h-48 relative">
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
        <div className="mt-8 flex flex-row space-x-2">
          <input
            type="file"
            id="image"
            name="image"
            onChange={uploadImage}
            hidden
          />
          <label
            htmlFor="image"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2"
          >
            <FaPlus />
          </label>
          <button
            className="bg-red-500 hover:bg-red-900 text-white font-bold py-1 px-4 rounded ml-2"
            onClick={deleteImage}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InformationForm;
