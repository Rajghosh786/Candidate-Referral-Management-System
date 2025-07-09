import React, { useContext, useEffect,useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import axios from "axios"

const Metrics = () => {
    const { isLoggedIn,setIsLoggedIn } = useContext(AuthContext);
    const [metrics, setMetrics] = useState({totalReferred: 0,pending: 0,reviewed: 0,hired: 0,});
  const apiUrl = import.meta.env.VITE_API_URL;
  async function fullData() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/user/all-referral`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }

  useEffect(()=>{
      const token = localStorage.getItem("token");
  if (token && !isLoggedIn) {
    setIsLoggedIn(true);
  }

  if (token) {
    fullData();
  }
  },[])


  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <h1 className="text-xl font-semibold text-blue-700">Please login to access this page</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-600">Your Referral Metrics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Referred" value={metrics.totalReferred} color="bg-indigo-100" />
        <MetricCard title="Hired" value={metrics.hired} color="bg-green-100" />
        <MetricCard title="Reviewed" value={metrics.reviewed} color="bg-yellow-100" />
        <MetricCard title="Pending" value={metrics.pending} color="bg-red-100" />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-md ${color}`}>
    <h2 className="text-xl font-medium text-gray-800 mb-2">{title}</h2>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default Metrics;
