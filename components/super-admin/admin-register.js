import React, { useState } from "react";
import { useRouter } from "next/router";
import { HiEye, HiEyeOff, HiLockClosed, HiMail, HiUser } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

const RegisterAdmin = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState();
  const [goToAdmin, setGoToAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Vérification des données côté client (facultatif)
    if (!name || !firstname || !email || !password || !confirmPassword) {
      toast.error("Please complete all fields.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.warning(
        "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/super-admin/manage-admin/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          firstname,
          email,
          password,
          role: "admin",
        }),
      });

      if (response.ok) {
        toast.success("User has been registered successfully!");
        setIsLoading(false);
        setTimeout(() => {
          setGoToAdmin(true);
        }, 10);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        setIsLoading(false);
      }
    } catch (errorData) {
      toast.success(errorData.message);
      setIsLoading(false);
    }
  };

  if (goToAdmin) {
    router.push("/super-admin/dashboard/manage");
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
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="mt-2 mb-4">
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
              <div className="mt-2 mb-4">
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
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <HiEyeOff className="text-blue-600" />
                    ) : (
                      <HiEye className="text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-2 mb-4">
                <div className="relative">
                  <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="uppercase w-1/2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? "Wait" : "Create Admin"}
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

export default RegisterAdmin;
