import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiHome, HiMail, HiUser } from "react-icons/hi";
import axios from "axios";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

const EditAdmin = ({ id }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [images, setImages] = useState([]);
  const [goToAdmin, setGoToAdmin] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get("/api/super-admin/manage-admin/admin?id=" + id, {
          withCredentials: true,
        })
        .then((response) => {
          const adminData = response.data;
          setName(adminData.name);
          setFirstName(adminData.firstname);
          setEmail(adminData.email);
          setImages(adminData.image ? [adminData.image] : []);
          setAgencyName(adminData.Agency?.name);
          setIsActive(adminData.status === "activate");
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
    setIsLoading(true);

    // Vérification des données côté client (facultatif)
    if (!name || !firstname || !email) {
      toast.error("Please complete all fields.");
      setIsLoading(false);
      return;
    }

    const data = {
      name,
      firstname,
      email,
      image: images.length > 0 ? images[0] : null,
      agencyName,
      isActive,
    };
    try {
      if (id) {
        // Update
        if (agencyName) {
          await axios.put("/api/super-admin/manage-admin/admin/", {
            ...data,
            id,
          });
        } else {
          const { agencyName, ...adminData } = data;
          await axios.put("/api/super-admin/manage-admin/admin/", {
            ...adminData,
            id,
          });
        }
      }

      toast.success("The Agency has been successfully registered!");
      setIsLoading(false);
      setTimeout(() => {
        setGoToAdmin(true);
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
          setIsLoading(false);
        } else if (errorMessage === "Admin not found.") {
          toast.warning("Admin not found.");
          setIsLoading(false);
        } else if (errorMessage === "Invalid agency name.") {
          toast.warning("Invalid agency name.");
          setIsLoading(false);
        } else if (
          errorMessage === "The specified agency already has a responsible."
        ) {
          toast.warning("The specified agency already has a responsible.");
          setIsLoading(false);
        } else if (
          errorMessage ===
          "An agency name is required when the admin is responsible for an agency."
        ) {
          toast.warning(
            "An agency name is required when the admin is responsible for an agency."
          );
          setIsLoading(false);
        } else {
          toast.warning(errorMessage);
          setIsLoading(false);
        }
      } else {
        toast.error("An error occurred. Please try again later");
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
          "/api/super-admin/manage-admin/upload",
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
      await axios.delete(`/api/super-admin/manage-admin/delete?id=${id}`, {
        withCredentials: true,
      });
      toast.success("Image deleted successfully!");
      setImages([]);
    } catch (error) {
      toast.error(`An error occurred while deleting the image`);
    }
  }

  if (goToAdmin) {
    router.push("/super-admin/dashboard/manage");
  }
  function goBack() {
    router.push("/super-admin/dashboard/manage");
    return null;
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
          {id ? "Edit Admin" : "Add Agency"}
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
                className="-mt-3 text-blue-500 hover:text-blue-700 mx-1 cursor-pointer"
              >
                <FiPlus size={18} />
              </label>
              <button
                type="button"
                className="-mt-4 text-red-500 hover:text-red-700"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative">
                <HiHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                <input
                  id="agencyName"
                  name="agencyName"
                  type="text"
                  autoComplete="email"
                  placeholder="Enter your Agency name"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
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
                className="uppercase ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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

export default EditAdmin;
