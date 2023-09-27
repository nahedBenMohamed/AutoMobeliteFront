import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { HiEye, HiEyeOff, HiLockClosed, HiMail } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

export async function getServerSideProps(context) {
  const { token } = context.query;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const agentId = decodedToken.userId;

    // Vérifier si le token a déjà été utilisé pour valider un compte
    const agent = await prisma.agencyUser.findUnique({
      where: {
        id: agentId,
      },
    });

    return {
      props: {
        agentId: agent.id,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/admin/auth/login",
        permanent: false,
      },
    };
  }
}
const ResetPasswordPage = ({ agentId }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!password || !confirmPassword) {
      toast.error("Please complete all fields.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put("/api/admin/agent-reset-password", {
        agentId,
        password,
      });
      toast.success("Password changed successfully");
      setIsLoading(false);
      setTimeout(() => {
        router.push("/admin/auth/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
        setIsLoading(false);
      } else {
        toast.error("An error has occurred.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden rounded-lg shadow-lg ">
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
      <div className="w-full p-4 bg-white rounded-lg shadow-lg lg:max-w-xl">
        <h1 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset Password
        </h1>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <div className="mt-4 grid grid-cols-2 gap-4"></div>
            <div>
              <div className="mt-2 mb-4">
                <div className="relative">
                  <HiLockClosed className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
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
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
            <div className="mb-4 mt-4">
              <button
                type="submit"
                className="uppercase w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? "Wait..." : "Reset Password"}
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
  );
};

export default ResetPasswordPage;
