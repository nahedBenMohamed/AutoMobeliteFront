import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  HiEye,
  HiEyeOff,
  HiHome,
  HiLocationMarker,
  HiLockClosed,
  HiMail,
  HiPhone,
  HiUser,
} from "react-icons/hi";
import { FaCalendar, FaCar, FaEquals, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import { BiIdCard } from "react-icons/bi";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import "boxicons/css/boxicons.min.css";
import { HiMapPin } from "react-icons/hi2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import { FiPlus } from "react-icons/fi";

function Step2() {
  const router = useRouter();
  const { id, pickupDate, returnDate, pickupTime, returnTime, totalPrice } =
    router.query;
  const { data } = useSession();
  const [model, setModel] = useState("");
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [firstname, setFirstName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [numPermis, setNumPermis] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephoneConnected, setTelephoneConnected] = useState("");
  const [cityConnected, setCityConnected] = useState("");
  const [addressConnected, setAddressConnected] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const formattedPickupDate = moment(pickupDate).format("DD MMMM");
  const formattedReturnDate = moment(returnDate).format("DD MMMM");
  const [selectedFileName, setSelectedFileName] = useState("");

  const getDefaultTelephone = () => {
    const defaultCountryCode = getCountryCallingCode("TN");
    return `+${defaultCountryCode}`;
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    // Obtenez le nom du fichier à partir du champ d'entrée
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName(""); // Réinitialisez le nom du fichier s'il n'y a pas de fichier sélectionné
    }
  };
  const handleSubmitRegister = async (event) => {
    event.preventDefault();
    setIsLoadingNew(true);

    // Vérification des données côté client (facultatif)
    if (
      !name ||
      !firstname ||
      !email ||
      !telephone ||
      !numPermis ||
      !password ||
      !confirmPassword ||
      !address ||
      !city ||
      !image
    ) {
      toast.error("Please fill in all fields and upload the license image");
      setIsLoadingNew(false);
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
      toast.error("Please enter a valid Tunisian phone number");
      setIsLoadingNew(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoadingNew(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoadingNew(false);
      return;
    }

    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      setIsLoadingNew(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("firstname", firstname);
    formData.append("email", email);
    formData.append("telephone", telephone);
    formData.append("numPermis", numPermis);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("city", city);
    if (image instanceof File) {
      // Vérifiez que image est bien un objet File
      formData.append("image", image);
    }
    try {
      const response = await fetch("/api/auth/register-client", {
        method: "POST",
        body: formData,
      });

      toast.success("Email sent successfully.");
      setIsLoadingNew(false);
      setTimeout(() => {
        const query = `pickupDate=${pickupDate}&returnDate=${returnDate}&pickupTime=${pickupTime}&returnTime=${returnTime}&totalPrice=${totalPrice}`;
        router.push(`/reservations/new/step2?id=${id}&${query}`);
        window.location.reload();
      }, 10);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        setIsLoadingNew(false);
      } else {
        toast.error("An error has occurred.");
        setIsLoadingNew(false);
      }
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoadingNew(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoadingNew(false);
      return;
    }
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (response?.error) {
      toast.error(response.error);
      setIsLoadingNew(false);
    } else {
      toast.success("login successful");
      setIsLoadingNew(false);
      const query = `pickupDate=${pickupDate}&returnDate=${returnDate}&pickupTime=${pickupTime}&returnTime=${returnTime}&totalPrice=${totalPrice}`;
      await router.push(`/reservations/new/step2?id=${id}&${query}`);
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get("/api/client/AllCars?id=" + id, { withCredentials: true })
        .then((response) => {
          const carData = response.data;
          setBrand(carData.brand);
          setModel(carData.model);
          setImages(carData.image ? [carData.image] : []);
        })
        .catch((error) => {
          if (error.response) {
            toast.warning("An error occurred while loading data");
          }
        });
    }
  }, [id]);

  const handleTabSelect = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (data) {
      const {
        user: { telephone, address, city },
      } = data;
      setTelephoneConnected(telephone);
      setAddressConnected(address);
      setCityConnected(city);
    }
  }, [data]);

  const goToStep3 = () => {
    setIsLoading(true);
    const query = `pickupDate=${pickupDate}.&returnDate=${returnDate}&pickupTime=${pickupTime}&returnTime=${returnTime}&totalPrice=${totalPrice}`;
    router.push(`/reservations/new/step3?id=${id}&${query}`);
  };

  const UserInputForm = () => (
    <div className="flex">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="flex-grow flex flex-col space-y-5 mt-4 ml-16 mr-8">
          <h3 className="uppercase mt-4 mb-4 text-black text-xs font-extrabold">
            I check that my mobile phone number is up to date.
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
                  value={telephoneConnected}
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
                  value={cityConnected}
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
                  value={addressConnected}
                  disabled={true}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="ageConfirmation"
              className="mr-2"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label htmlFor="ageConfirmation" className="text-sm">
              I acknowledge that I am 21 years old, and have a minimum license
              of 2 years and accept the
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
            </label>
          </div>
          <button
            onClick={goToStep3}
            disabled={!isChecked}
            className={`mt-4 w-full justify-center rounded-md px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isChecked ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Ongoing..." : "Continue"}
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
      </div>
    </div>
  );

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
      <div className="flex-grow flex flex-col space-y-5 mt-4 ml-32 mr-8 w-full">
        <div className="uppercase mt-4 mb-4 text-black text-xl font-extrabold">
          <h1>
            {data
              ? `Hello, ${data.user.name} ${data.user.firstname}`
              : "LOG IN OR SIGN UP"}
          </h1>
        </div>
        <div>
          {data?.user ? (
            <UserInputForm />
          ) : (
            <>
              <Tabs
                className=""
                selectedIndex={activeTab}
                onSelect={handleTabSelect}
              >
                <div className="w-full">
                  <TabList>
                    <Tab>Login</Tab>
                    <Tab>Sign Up</Tab>
                  </TabList>
                </div>
                <div className="w-full bg-white p-5 rounded-lg shadow-lg mt-8">
                  <TabPanel>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                      <form onSubmit={handleSubmitLogin}>
                        <div className="mt-4 grid grid-cols-2 gap-4"></div>
                        <div>
                          <div className="mt-2 mb-4">
                            <div className="relative">
                              <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                              <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mt-2 mb-4">
                            <div className="relative">
                              <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                              <input
                                id="password"
                                name="password"
                                type={passwordVisible ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              <div
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                                onClick={() =>
                                  setPasswordVisible(!passwordVisible)
                                }
                              >
                                {passwordVisible ? (
                                  <HiEyeOff className="text-blue-600" />
                                ) : (
                                  <HiEye className="text-blue-600" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-end mt-4 mb-2">
                              <a
                                href="/authentification/forget"
                                className="font-semibold text-blue-600 hover:text-indigo-500"
                              >
                                Forgot password?
                              </a>
                            </div>
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="uppercase mt-4 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              {isLoadingNew ? "Wait..." : "login"}
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
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="w-full mt-8 max-w-xl px-6 py-4 bg-white rounded-md ">
                      <form
                        onSubmit={handleSubmitRegister}
                        encType="multipart/form-data"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="mb-4">
                            <div className="relative">
                              <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                placeholder="Enter your first name"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="relative">
                              <HiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                placeholder="Enter your last name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="relative">
                            <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              placeholder="Enter your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="relative">
                            <BiIdCard className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                              id="permis"
                              name="permis"
                              type="text"
                              autoComplete="email"
                              placeholder="Enter your Tunisia permis drive"
                              value={numPermis}
                              onChange={(e) => setNumPermis(e.target.value)}
                              className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="mr-2">
                            <div className="relative">
                              <HiPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                              <input
                                id="phone"
                                name="phone"
                                type="phone"
                                autoComplete="email"
                                placeholder="Enter your Tunisia phone number"
                                value={telephone || getDefaultTelephone()} // Set default value with country code
                                onChange={(e) => setTelephone(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="relative">
                              <HiLocationMarker className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                              <input
                                id="city"
                                name="city"
                                type="text"
                                autoComplete="address-level2"
                                placeholder="Enter your city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-4 mt-4">
                          <div className="relative">
                            <HiHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                              id="address"
                              name="address"
                              type="text"
                              autoComplete="address"
                              placeholder="Enter your address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="relative">
                            <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                              id="password"
                              name="password"
                              type={passwordVisible ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <div
                              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                              onClick={() =>
                                setPasswordVisible(!passwordVisible)
                              }
                            >
                              {passwordVisible ? (
                                <HiEyeOff className="text-blue-600" />
                              ) : (
                                <HiEye className="text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="relative">
                            <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={passwordVisible ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <label
                            htmlFor="image"
                            className="block mb-2 text-blue-600"
                          >
                            Upload your driving licence image here:{" "}
                          </label>
                          <label
                            htmlFor="image"
                            className="mt-1 ml-4 text-red-500 hover:text-red-700 cursor-pointer rounded-full"
                            title="Select an image"
                          >
                            <FiPlus size={18} />
                          </label>
                        </div>
                        <span id="file-name-display" className="ml-2">
                          {selectedFileName
                            ? `Selected file: ${selectedFileName}`
                            : "No file chosen"}
                        </span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="uppercase w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {isLoadingNew ? "Wait..." : "Create account"}
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
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                </div>
              </Tabs>
            </>
          )}
        </div>
      </div>
      <div className="flex-grow-0 mr-16">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="uppercase text-center mt-4 mb-4 text-black text-xl font-extrabold">
            <h2>Your order</h2>
          </div>
          <div className=" justify-items-center mt-4 w-full h-full">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt="Car"
                className="max-w-64 max-h-64 mb-4 rounded-lg"
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
            <div className="flex text-justify text-sm">
              <p>
                A deposit of 300€ will be requested automatically on the day of
                your rental
              </p>
            </div>
            <div className="flex text-justify text-sm">
              <p>
                {" "}
                This sum will be released 7 days after the return of the vehicle
                subject to that the general rental conditions have been
                respected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2;
