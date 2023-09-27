import React, { useEffect, useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import axios from "axios";
import { useSession } from "next-auth/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import DeactivateAccountModal from "@/components/client/DeactivateAccountModal";
import { BeatLoader } from "react-spinners";

function ParametersForm() {
  const { data: session } = useSession();
  const [showEmailInputs, setShowEmailInputs] = useState(false);
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const validateInput = (input) => input.trim() !== "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "/api/client/profile?id=" + session.user.id
        );
        const { email } = response.data.user;
        setEmail(email);
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

  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Different password");
      return;
    }

    if (newPassword.length < 8 && newPassword !== "") {
      toast.error("The password must have at least 8 characters.");
      return;
    }

    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword) && newPassword !== "") {
      toast.info(
        "Your password must contain at least 8 characters, a capital letter, a number and a special character."
      );
      return;
    }

    const data = {
      oldPassword: oldPassword !== "" ? oldPassword : undefined,
      newPassword: newPassword !== "" ? newPassword : undefined,
    };
    try {
      const response = await axios.put(
        "/api/client/updatePassword?id=" + session.user.id,
        { ...data }
      );
      toast.success("Password updated successfully ");
      setIsLoading(false);
      setTimeout(() => {
        router.push("/edit-profile");
      }, 10);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };
  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!newEmail) {
      toast.error("Please complete email fields.");
      return;
    }

    const data = {
      newEmail: newEmail !== "" ? newEmail : undefined,
    };

    try {
      const response = await axios.put(
        "/api/client/updateEmail?id=" + session.user.id,
        { ...data }
      );
      toast.success("Email updated successfully");
      setIsLoading(false);
      setTimeout(() => {
        router.push("/edit-profile");
      }, 10);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
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
      <p className="mb-5">
        You can change your email address and password here.
      </p>
      <div>
        <div className="flex justify-between items-end">
          <h2>E-mail address</h2>
          <button onClick={() => setShowEmailInputs(!showEmailInputs)}>
            {showEmailInputs ? "Cancel" : "Edit"}
          </button>
        </div>
        {showEmailInputs && (
          <div>
            <form onSubmit={handleSubmitEmail}>
              <div className="mt-4 mb-4 relative">
                <FiMail className="absolute top-3 left-3" />
                <input
                  type="email"
                  placeholder="Old Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`border py-2 pl-10 pr-3 rounded w-full ${
                    validateInput(email) ? "border-green-500" : "border-red-500"
                  }`}
                />
              </div>
              <div className="mt-4 mb-4 relative">
                <FiMail className="absolute top-3 left-3" />
                <input
                  type="email"
                  placeholder="Confirm Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={`border py-2 pl-10 pr-3 rounded w-full ${
                    validateInput(newEmail)
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                />
              </div>
              <button
                type="submit"
                className="uppercase bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-48"
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
          </div>
        )}
        <hr className="my-4" />
      </div>
      <div>
        <div className="flex justify-between items-end">
          <h2>Password</h2>
          <button onClick={() => setShowPasswordInputs(!showPasswordInputs)}>
            {showPasswordInputs ? "Cancel" : "Edit"}
          </button>
        </div>
        {showPasswordInputs && (
          <>
            <p className="mt-2 mb-4 text-sm text-gray-500">
              Your password must contain at least 8 characters, a capital
              letter, a number and a special character.
            </p>
            <div>
              <form onSubmit={handleSubmitPassword}>
                <div className="mt-4 mb-4 relative">
                  <FiLock className="absolute top-3 left-3" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`border py-2 pl-10 pr-3 rounded w-full ${
                      validateInput(oldPassword)
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {passwordVisible ? (
                      <HiEyeOff
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setPasswordVisible(false)}
                      />
                    ) : (
                      <HiEye
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setPasswordVisible(true)}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4 mb-4 relative">
                  <FiLock className="absolute top-3 left-3" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`border py-2 pl-10 pr-3 rounded w-full ${
                      validateInput(newPassword)
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {passwordVisible ? (
                      <HiEyeOff
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setPasswordVisible(false)}
                      />
                    ) : (
                      <HiEye
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setPasswordVisible(true)}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4 mb-4 relative">
                  <FiLock className="absolute top-3 left-3" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`border py-2 pl-10 pr-3 rounded w-full ${
                      validateInput(confirmPassword)
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {passwordVisible ? (
                      <HiEyeOff
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setPasswordVisible(false)}
                      />
                    ) : (
                      <HiEye
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setPasswordVisible(true)}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="uppercase bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-48"
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
                </div>
              </form>
            </div>
          </>
        )}
        <hr className="my-4" />
      </div>
      <div className="flex justify-between items-center">
        <h2>Deactivate account</h2>
        <button onClick={handleOpenModal}>Delete account</button>
      </div>
      {isModalOpen && <DeactivateAccountModal onClose={handleCloseModal} />}
    </div>
  );
}

export default ParametersForm;
