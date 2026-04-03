import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";


const AddTeacherForm = () => {
    const {url} = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    employeeId: "",
    designation: "",
    department: "Engineering",
    office: {
      roomCode: "",
      block: "",
      floor: "",
    },
    expertise: [""],
    qualifications: [{ degree: "", institution: "", year: "" }],
    experience: "",
    availability: {
      status: "Available",
      currentLocation: "",
      nextClass: { subject: "", time: "", room: "" },
    },
    subjects: [],
  });

  // generic field handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        let updated = { ...prev };
        let ref = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handle expertise array
  const handleExpertiseChange = (index, value) => {
    const updated = [...formData.expertise];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, expertise: updated }));
  };

  const addExpertise = () => {
    setFormData((prev) => ({ ...prev, expertise: [...prev.expertise, ""] }));
  };

  const removeExpertise = (index) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  // handle qualifications array
  const handleQualificationChange = (index, field, value) => {
    const updated = [...formData.qualifications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, qualifications: updated }));
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: "", institution: "", year: "" }],
    }));
  };

  const removeQualification = (index) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${url}/api/teachers`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Teacher created successfully!");
      console.log(res.data);
    } catch (err) {
      
      alert("Error creating teacher");
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 shadow-lg rounded-xl bg-white">
      <h2 className="text-xl font-bold">Add New Teacher</h2>

      {/* Basic Info */}
      <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="text" name="employeeId" placeholder="Employee ID" value={formData.employeeId} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full border p-2 rounded" required />

      {/* Department */}
      <select name="department" value={formData.department} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="Engineering">Engineering</option>
        <option value="Management">Management</option>
        <option value="Pharma">Pharma</option>
        <option value="Hotel Management">Hotel Management</option>
      </select>

      {/* Office */}
      <h3 className="font-semibold">Office</h3>
      <input type="text" name="office.roomCode" placeholder="Room Code" value={formData.office.roomCode} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="text" name="office.block" placeholder="Block" value={formData.office.block} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="number" name="office.floor" placeholder="Floor" value={formData.office.floor} onChange={handleChange} className="w-full border p-2 rounded" required />

      {/* Experience */}
      <input type="number" name="experience" placeholder="Experience (Years)" value={formData.experience} onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Expertise */}
      <h3 className="font-semibold">Expertise</h3>
      {formData.expertise.map((exp, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={exp}
            onChange={(e) => handleExpertiseChange(index, e.target.value)}
            placeholder="Enter expertise"
            className="flex-1 border p-2 rounded"
          />
          <button type="button" onClick={() => removeExpertise(index)} className="bg-red-500 text-white px-3 rounded">X</button>
        </div>
      ))}
      <button type="button" onClick={addExpertise} className="bg-blue-500 text-white px-4 py-1 rounded">+ Add Expertise</button>

      {/* Qualifications */}
      <h3 className="font-semibold mt-4">Qualifications</h3>
      {formData.qualifications.map((q, index) => (
        <div key={index} className="grid grid-cols-3 gap-2 mb-2">
          <input type="text" placeholder="Degree" value={q.degree} onChange={(e) => handleQualificationChange(index, "degree", e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="Institution" value={q.institution} onChange={(e) => handleQualificationChange(index, "institution", e.target.value)} className="border p-2 rounded" />
          <input type="number" placeholder="Year" value={q.year} onChange={(e) => handleQualificationChange(index, "year", e.target.value)} className="border p-2 rounded" />
          <button type="button" onClick={() => removeQualification(index)} className="bg-red-500 text-white px-3 rounded col-span-3">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addQualification} className="bg-blue-500 text-white px-4 py-1 rounded">+ Add Qualification</button>

      {/* Submit */}
      <button type="submit" className="ml-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4">Save Teacher</button>
    </form>
  );
};

export default AddTeacherForm;
