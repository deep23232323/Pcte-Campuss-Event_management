import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function HandleUser() {
  const { url } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",

    department: "",
    semester: "",
    studentId: "",

    employeeId: "",
    phone: "",

    adminCode: ""
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle role change and clear unrelated fields
  const handleRoleChange = (e) => {
    const role = e.target.value;

    setFormData({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,

      department: "",
      semester: "",
      studentId: "",
      employeeId: "",
      phone: "",
      adminCode: ""
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${url}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || data.errors?.[0]?.msg || "Registration failed");
        setLoading(false);
        return;
      }

      setMessage("✅ Registration successful!");
    } catch (err) {
      setMessage("❌ Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          User Registration
        </h2>

        {/* Common Fields */}
        <input
          className="input"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Role Selector */}
        <select
          className="input"
          name="role"
          value={formData.role}
          onChange={handleRoleChange}
        >
          <option value="student">Student</option>
          <option value="staff">Teacher / Staff</option>
          <option value="admin">Admin</option>
        </select>

        {/* STUDENT FIELDS */}
        {formData.role === "student" && (
          <>
            <select
              className="input"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Pharma">Pharma</option>
              <option value="Hotel Management">Hotel Management</option>
              <option value="Administration">Administration</option>
            </select>

            <input
              className="input"
              type="number"
              name="semester"
              placeholder="Semester"
              value={formData.semester}
              onChange={handleChange}
            />

            <input
              className="input"
              name="studentId"
              placeholder="Student ID"
              value={formData.studentId}
              onChange={handleChange}
            />
          </>
        )}

        {/* STAFF FIELDS */}
        {formData.role === "staff" && (
          <>
            <select
              className="input"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Pharma">Pharma</option>
              <option value="Hotel Management">Hotel Management</option>
              <option value="Administration">Administration</option>
            </select>

            <input
              className="input"
              name="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
            />

            <input
              className="input"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </>
        )}

        {/* ADMIN FIELDS */}
        {formData.role === "admin" && (
          <>
            <select
              className="input"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Administration">Administration</option>
            </select>

            <input
              className="input"
              name="adminCode"
              placeholder="Admin Authorization Code"
              value={formData.adminCode}
              onChange={handleChange}
            />
          </>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
