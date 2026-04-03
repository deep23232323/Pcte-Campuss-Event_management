import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateTeacherForm = ({ teacherId }) => {
  const { token, url } = useAuth();
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  // fetch teacher data on load
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`${url}/api/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data); // pre-fill with teacher data
      } catch (err) {
        console.error("Error fetching teacher:", err);
      }
    };
    fetchTeacher();
  }, [teacherId, token, url]);

  if (!formData) return <p>Loading teacher data...</p>;

  // generic handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("office.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        office: { ...prev.office, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // expertise handlers
  const handleExpertiseChange = (i, value) => {
    const updated = [...formData.expertise];
    updated[i] = value;
    setFormData((prev) => ({ ...prev, expertise: updated }));
  };

  const addExpertise = () => {
    setFormData((prev) => ({ ...prev, expertise: [...prev.expertise, ""] }));
  };

  const removeExpertise = (i) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, idx) => idx !== i),
    }));
  };

  // qualification handlers
  const handleQualificationChange = (i, field, value) => {
    const updated = [...formData.qualifications];
    updated[i][field] = value;
    setFormData((prev) => ({ ...prev, qualifications: updated }));
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: "", institution: "", year: "" }],
    }));
  };

  const removeQualification = (i) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, idx) => idx !== i),
    }));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${url}/api/teachers/${teacherId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Teacher updated successfully!");
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert(error.response?.data?.message || "Failed to update teacher");
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold">Update Teacher</h2>

      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

      <input type="text" name="employeeId" placeholder="Employee ID" value={formData.employeeId} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

      <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

      <select name="department" value={formData.department} onChange={handleChange} className="w-full border px-3 py-2 rounded">
        <option value="">Select Department</option>
        <option value="Engineering">Engineering</option>
        <option value="Management">Management</option>
        <option value="Pharma">Pharma</option>
        <option value="Hotel Management">Hotel Management</option>
      </select>

      {/* Office */}
      <div className="grid grid-cols-3 gap-2">
        <input type="text" name="office.roomCode" placeholder="Room Code" value={formData.office.roomCode} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input type="text" name="office.block" placeholder="Block" value={formData.office.block} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input type="number" name="office.floor" placeholder="Floor" value={formData.office.floor} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* Expertise */}
      <h3 className="font-semibold">Expertise</h3>
      {formData.expertise.map((exp, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input type="text" value={exp} onChange={(e) => handleExpertiseChange(i, e.target.value)} placeholder="Expertise" className="flex-1 border px-3 py-2 rounded" />
          <button type="button" onClick={() => removeExpertise(i)} className="bg-red-500 text-white px-3 rounded">X</button>
        </div>
      ))}
      <button type="button" onClick={addExpertise} className="bg-blue-500 text-white px-4 py-1 rounded">+ Add Expertise</button>

      {/* Qualifications */}
      <h3 className="font-semibold mt-4">Qualifications</h3>
      {formData.qualifications.map((q, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 mb-2">
          <input type="text" placeholder="Degree" value={q.degree} onChange={(e) => handleQualificationChange(i, "degree", e.target.value)} className="border px-3 py-2 rounded" />
          <input type="text" placeholder="Institution" value={q.institution} onChange={(e) => handleQualificationChange(i, "institution", e.target.value)} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="Year" value={q.year} onChange={(e) => handleQualificationChange(i, "year", e.target.value)} className="border px-3 py-2 rounded" />
          <button type="button" onClick={() => removeQualification(i)} className="bg-red-500 text-white px-3 rounded col-span-3">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addQualification} className="bg-blue-500 text-white px-4 py-1 rounded">+ Add Qualification</button>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Update Teacher</button>
    </form>
  );
};

export default UpdateTeacherForm;
