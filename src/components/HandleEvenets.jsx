import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const EventForm = () => {
  const { url } = useAuth();
  const categories = [
    "Festival",
    "Workshop",
    "Sports",
    "Cultural",
    "Educational",
    "Social",
    "Academic",
  ];
  const departments = [
    "All",
    "Engineering",
    "Management",
    "Pharma",
    "Hotel Management",
  ];
  const priorities = ["low", "medium", "high"];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: { start: "", end: "" },
    location: "",
    category: "",
    priority: "",
    department: "",
    maxAttendees: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // handle nested time object separately
    if (name === "time.start" || name === "time.end") {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        time: { ...prev.time, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token"); 

    const res = await fetch(`${url}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to create event");

    alert("✅ Event created successfully!");
    setFormData({
      title: "",
      description: "",
      date: "",
      time: { start: "", end: "" },
      location: "",
      category: "",
      priority: "",
      department: "",
      maxAttendees: "",
    });
  } catch (err) {
    console.error(err);
    alert("❌ Error creating event");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Event</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="time.start"
              value={formData.time.start}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              name="time.end"
              value={formData.time.end}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Priority</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Max Attendees */}
        <div>
          <label className="block text-sm font-medium mb-1">Max Attendees</label>
          <input
            type="number"
            name="maxAttendees"
            value={formData.maxAttendees}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
