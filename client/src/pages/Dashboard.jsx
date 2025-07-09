import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from "axios"

const Dashboard = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [fetchedData, setFetchedData] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newStatus, setNewStatus] = useState("");

const apiUrl = import.meta.env.VITE_API_URL;
    
async function fetchApi() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${apiUrl}/candidate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFetchedData(response.data.data);
  } catch (error) {
    console.error("Failed to fetch candidates:", error.message);
  }
}


useEffect(() => {
  const token = localStorage.getItem("token");
  if (token && !isLoggedIn) {
    setIsLoggedIn(true);
  }

  if (token) {
    fetchApi();
  }
}, []);

  const filteredData = fetchedData.filter((candidate) => {
    return (
      candidate.jobTitle.toLowerCase().includes(searchTitle.toLowerCase()) &&
      candidate.status?.toLowerCase().includes(searchStatus.toLowerCase())
    );
  });

  async function handleStatusChange(id, oldStatus) {
    if (newStatus === oldStatus) {
      setEditingId(null);
      return;
    }

  try {
    const token = localStorage.getItem("token");
    await axios.patch(`http://localhost:1305/candidate/${id}/status`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchApi();
  } catch (err) {
    console.error("Error updating status", err.message);
  }

  setEditingId(null);
}
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <h1 className="text-xl font-semibold text-blue-700">Please login to access this page</h1>
      </div>
    )
  }

return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">
        Referred Candidates
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search by Job Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Search by Status"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((e) => (
          <div
            key={e._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {e.name}
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>Email:</strong> {e.email}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Phone:</strong> +91 {e.phone}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Job Title:</strong> {e.jobTitle}
            </p>
            <p className="text-gray-600 mb-3">
            <strong>Status:</strong> {e.status}

            {editingId === e._id ? (
              <span className="ml-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="ml-2 px-2 py-1 border rounded text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="hired">Hired</option>
                </select>
                <button
                  onClick={() => handleStatusChange(e._id, e.status)}
                  className="ml-2 px-3 py-1 bg-green-500 text-white rounded"
                >
                  Update
                </button>
              </span>
            ) : (
              <button
                onClick={() => {
                  setEditingId(e._id);
                  setNewStatus(e.status);
                }}
                className="ml-2 px-3 py-1 bg-indigo-500 text-white rounded"
              >
                Change
              </button>
            )}
          </p>

            
            {e.resumeURL ? (
              <a
                href={e.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-indigo-500 hover:underline"
              >
                📄 View Resume
              </a>
            ) : (
              <p className="text-sm text-red-400 mt-2">No resume uploaded</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard