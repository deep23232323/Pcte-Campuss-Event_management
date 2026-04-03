import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const AnnouncementForm = () => {
  const departments = ["All", "Engineering", "Management", "Pharma", "Hotel Management"];
  const targetAudiences = ["All", "Students", "Staff", "Faculty"];
  const priorities = ["low", "medium", "high", "urgent"];
  const types = ["general", "academic", "event", "emergency", "maintenance"];
  const { url } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    department: "All",
    targetAudience: "All",
    priority: "low",
    type: "general",
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // assuming you store JWT after login
      const res = await fetch(`${url}/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // backend requires auth
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create announcement");

      alert("✅ Announcement created successfully!");
      setFormData({
        title: "",
        content: "",
        department: "All",
        targetAudience: "All",
        priority: "low",
        type: "general",
        expiryDate: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error creating announcement");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Announcement</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter announcement title"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Write announcement details..."
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium mb-1">Target Audience</label>
          <select
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            {targetAudiences.map((aud) => (
              <option key={aud} value={aud}>
                {aud}
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
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Announcement
        </button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
