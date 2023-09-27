import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

function MessagesTable() {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(1);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/admin/messages/messages", { withCredentials: true })
      .then((response) => {
        setMessages(response.data);
      });
    loadMessages();
  }, []);

  // Pagination logic
  const indexOfLastMessages = currentPage * messagesPerPage;
  const indexOfFirstMessages = indexOfLastMessages - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessages,
    indexOfLastMessages,
  );

  const loadMessages = async () => {
    // fetch notifications
    const response = await axios.get(`/api/admin/messages/messages`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setReadNotifications(
        response.data.filter(
          (notification) => notification.readStatus === true,
        ),
      );
      setUnreadNotifications(
        response.data.filter(
          (notification) => notification.readStatus === false,
        ),
      );
    } else {
      // handle error
    }
  };

  const markMessageAsRead = async (messageId, reservationId) => {
    try {
      const response = await axios.post(
        `/api/admin/messages/messages?id=${messageId}`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        // Navigate to the details page only if the API call was successful
        await router.push(
          `/admin/dashboard/reservations/details/${reservationId}`,
        );
      } else {
        throw new Error("Failed to mark message as read");
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`/api/admin/messages/messages?id=${messageId}`, {
        withCredentials: true,
      });
      toast.success("message deleted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      console.error(error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`/api/admin/messages/read-all`, {
        withCredentials: true,
      });
      toast.success("All messages have been read successfully");
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteAllRead = async () => {
    try {
      await axios.delete(`/api/admin/messages/delete-all`, {
        withCredentials: true,
      });
      toast.success("All messages deleted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleNextBtn = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + messagesPerPage);
      setMinPageNumberLimit(minPageNumberLimit + messagesPerPage);
    }
  };
  const handlePrevBtn = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % messagesPerPage === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - messagesPerPage);
      setMinPageNumberLimit(minPageNumberLimit - messagesPerPage);
    }
  };

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
      <>
        <div className="flex">
          {unreadNotifications.length > 2 && (
            <button
              className="uppercase bg-blue-600 text-white p-2 mb-4 rounded mx-1"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </button>
          )}
          {readNotifications.length > 2 && (
            <button
              className="uppercase bg-red-600 text-white p-2 mb-4 rounded mx-1"
              onClick={deleteAllRead}
            >
              Delete All Read
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full w-full ">
            <div className="mt-8 flex items-center justify-center transform -rotate-12 w-32 h-32 overflow-hidden rounded shadow-lg mr-5">
              <img
                className="h-full w-full object-cover"
                src="/no-messages.png"
                alt="No reservations"
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="uppercase text-2xl font-bold">
                you do not have a Messages
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
                      Messages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Time Elapsed
                    </th>
                  </tr>
                </thead>
                <tbody className="px-6 py-3  text-x font-medium text-gray-500 uppercase tracking-wider">
                  {currentMessages.map((messages) => {
                    const createdAt = moment(messages.createdAt);
                    const now = moment();
                    const diffMinutes = now.diff(createdAt, "minutes");
                    const diffHours = now.diff(createdAt, "hours");
                    const diffDays = now.diff(createdAt, "days");
                    let timeElapsed;
                    if (diffMinutes < 1) {
                      timeElapsed = "just now";
                    } else if (diffMinutes < 60) {
                      timeElapsed = `${diffMinutes} minutes ago`;
                    } else if (diffHours < 24) {
                      timeElapsed = `${diffHours} hours ago`;
                    } else {
                      timeElapsed = `${diffDays} days ago`;
                    }
                    return (
                      <tr key={messages.id}>
                        <td className="text-center">{messages.message}</td>
                        <td className="text-center">
                          {messages.readStatus ? (
                            <span className="flex justify-center items-center">
                              <span className="bg-green-400 rounded-full h-3 w-3 mr-2"></span>
                              Read
                            </span>
                          ) : (
                            <span className="flex justify-center items-center">
                              <span className="bg-red-400 rounded-full h-3 w-3 mr-2"></span>
                              Unread
                            </span>
                          )}
                        </td>
                        <td className="text-center">{timeElapsed}</td>
                        <td className="justify-center items-center ">
                          <button
                            onClick={() =>
                              markMessageAsRead(
                                messages.id,
                                messages.reservationId,
                              )
                            }
                            className="uppercase bg-blue-600 text-white p-2 rounded mx-1"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => deleteMessage(messages.id)}
                            className="uppercase bg-red-500 text-white p-2 rounded mx-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </>
      <div className="flex justify-center mt-4 mb-4">
        {messages.length > messagesPerPage && (
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
            {currentPage !== Math.ceil(messages.length / messagesPerPage) && (
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
                        Math.ceil(messages.length / messagesPerPage),
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
    </div>
  );
}

export default MessagesTable;
