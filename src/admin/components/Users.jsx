import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";

const Users = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [meetLink, setMeetLink] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // FETCH USERS
  const fetchSuccessUsers = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/coursepayment/success-users`
      );

      if (response.data.success) {

        setUsers(response.data.users);

      }

    } catch (error) {

      console.log("FETCH USERS ERROR =>", error);

    } finally {

      setLoading(false);

    }

  };

  // UPDATE MEET LINK
  const updateMeetLink = async () => {

    try {

      const response = await axios.put(
        `${API_URL}/coursepayment/update-meet-link/${selectedPayment._id}`,
        {
          meetLink,
        }
      );

      if (response.data.success) {

        alert("Meet link updated successfully");

        setShowModal(false);

        fetchSuccessUsers();

      }

    } catch (error) {

      console.log("UPDATE LINK ERROR =>", error);

    }

  };

  useEffect(() => {

    fetchSuccessUsers();

  }, []);

  return (
    <>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-orange-50">

              <tr className="text-left text-sm text-gray-600">

                <th className="px-6 py-4">Name</th>

                <th className="px-6 py-4">Email</th>

                <th className="px-6 py-4">Course</th>

                <th className="px-6 py-4">Joined</th>

                <th className="px-6 py-4">Status</th>

                <th className="px-6 py-4">Actions</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-orange-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Loading Users...
                  </td>

                </tr>

              ) : users.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No users found
                  </td>

                </tr>

              ) : (

                users.map((u) => (

                  <tr
                    key={u._id}
                    className="hover:bg-orange-50 transition"
                  >

                    {/* NAME */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">

                          {u.userName?.charAt(0)?.toUpperCase() || "U"}

                        </div>

                        <span className="font-medium text-gray-800">
                          {u.userName}
                        </span>

                      </div>

                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-4 text-gray-600">
                      {u.userEmail}
                    </td>

                    {/* COURSE */}
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {u.courseId?.title || "No Course"}
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-gray-600">

                      {new Date(u.createdAt).toLocaleDateString()}

                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">

                        Success

                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">

                      <button
                        onClick={() => {
                          setSelectedPayment(u);
                          setMeetLink(u.meetLink || "");
                          setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >

                        <FaEdit />

                        Edit Meet Link

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </motion.div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">

            <h2 className="text-2xl font-bold text-gray-800 mb-5">

              Update Google Meet Link

            </h2>

            {/* USER */}
            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User
              </label>

              <div className="bg-orange-50 rounded-xl px-4 py-3 text-gray-700">

                {selectedPayment?.userName}

              </div>

            </div>

            {/* COURSE */}
            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course
              </label>

              <div className="bg-orange-50 rounded-xl px-4 py-3 text-gray-700">

                {selectedPayment?.courseId?.title}

              </div>

            </div>

            {/* LINK */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Meet Link
              </label>

              <input
                type="text"
                placeholder="https://meet.google.com/..."
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={updateMeetLink}
                className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
              >
                Save Link
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default Users;