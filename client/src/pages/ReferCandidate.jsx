import React, { useContext, useState,useEffect,useRef } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Spinner from "../components/Spinner"

const ReferCandidate = () => {
  const [currentRefer, setCurrentRefer] = useState({ name: "", email: "", phone: "", jobTitle: "", resume: null })
  const fileInputRef = useRef(null);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  function handleChange(e) {
    setCurrentRefer({ ...currentRefer, [e.target.name]: e.target.value })
  }

  function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      alert("File size should not exceed 3MB");
      return;
    }
    setCurrentRefer({ ...currentRefer, resume: file });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    let resumeUrl = "";

    if (currentRefer.resume) {
      const formData = new FormData();
      formData.append("resume", currentRefer.resume);

      const res = await axios.post(`${apiUrl}/candidate/upload-resume`, formData);
      resumeUrl = res.data.url;
    }

    const referraldata = {
      name: currentRefer.name,
      email: currentRefer.email,
      phone: currentRefer.phone,
      jobTitle: currentRefer.jobTitle,
      resume: resumeUrl,
    };
    const token = localStorage.getItem("token");
    await axios.post(`${apiUrl}/candidate`, referraldata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Candidate referred successfully");
    setCurrentRefer({ name: "", email: "", phone: "", jobTitle: "", resume: null });
    fileInputRef.current.value = "";
    setIsLoading(false);
  }

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
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
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Refer a Candidate</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            value={currentRefer.name}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            value={currentRefer.email}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="flex space-x-2 mt-1">
            <input
              type="text"
              value="+91"
              disabled
              className="w-14 text-center border border-gray-300 rounded-md bg-gray-100 py-2"
            />
            <input
              onChange={handleChange}
              type="text"
              name="phone"
              id="phone"
              value={currentRefer.phone}
              maxLength={10}
              pattern="\d{10}"
              required
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            onChange={handleChange}
            type="text"
            name="jobTitle"
            id="jobTitle"
            value={currentRefer.jobTitle}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF only)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            ref={fileInputRef}
            className="block w-full text-gray-600"
          />
        </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Refer Now
        </button>
      )}
        {/* <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Refer Now
        </button> */}
      </form>
    </div>
  )
}

export default ReferCandidate
