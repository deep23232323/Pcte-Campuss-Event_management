import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useNavigation } from "react-router-dom";

const UpdateEventForm = ({ eventId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    priority: "",
    maxAttendees: 0,
  });
  const {url} = useAuth()
 const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Get token directly from localStorage
  const token = localStorage.getItem("token");

  // Fetch existing event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          title: res.data.title,
          description: res.data.description,
          date: res.data.date.split("T")[0],
          location: res.data.location,
          category: res.data.category,
          priority: res.data.priority,
          maxAttendees: res.data.maxAttendees,
        });
      } catch (err) {
        setMessage("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${url}/api/events/${eventId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating event");
      console.log(err.response?.data?.message)
      if(err.response?.data?.message === "Token is not valid"){
        navigate("/login")
      }
    }
  };

  if (loading) return <p className="text-gray-500">Loading event...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Update Event</h2>
      {message && <p className="mb-2 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          
          <option value="Festival">Festival</option>
          <option value="Workshop">Workshop</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
          <option value="Educational">Educational</option>
          <option value="Social">Social</option>
          <option value="Academic">Academic</option>
        </select>

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="number"
          name="maxAttendees"
          value={formData.maxAttendees}
          onChange={handleChange}
          placeholder="Max Attendees"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEventForm;
