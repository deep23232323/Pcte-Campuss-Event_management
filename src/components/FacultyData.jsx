import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Edit, Trash2 } from "lucide-react"; 
import AnnouncementForm from "./HandleAnnouncements";
import UpdateEventForm from "./UpdateEvente";
import UpdateTeacherForm from "./UpdateTeacherForm";
import axios from "axios";

const FacultyData = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [edit,setEdit] = useState("")
  const [editTacherName,setEditTacherName] = useState("");
  const { url } = useAuth();
  const formref = useRef();
  

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${url}/api/teachers`);
        if (!response.ok) {
          throw new Error("Failed to fetch teachers");
        }
        const data = await response.json();
      
        setTeachers(data.teachers);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeachers();
  }, [url]);


   useEffect(() => {
    if (edit && formref.current) {
      formref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [edit]);

  const handleEdit = (id,teacherName) => {
    
    setEdit(id);
    setEditTacherName(teacherName);
  }

  const handleDelete = async(id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
    const token = localStorage.getItem("token"); // your admin JWT

    const res = await axios.delete(`${url}/api/teachers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTeachers(prev => prev.filter(item => item._id !== id))

    alert(res.data.message); // "Teacher deleted successfully"
    return true;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error deleting teacher");
    return false;
  }
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">👩‍🏫 Faculty Members</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.employeeId}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300"
          >
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-4">
              
              <div>
                <h3 className="text-xl font-semibold">{teacher.name}</h3>
                <p className="text-gray-600 text-sm">
                  {teacher.designation}, {teacher.department}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {teacher.employeeId}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  teacher.availability?.status === "In Class"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {teacher.availability?.status || "Unknown"}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                📍 {teacher.availability?.currentLocation || "N/A"}
              </p>
            </div>

            {/* Expertise */}
            {teacher.expertise?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Expertise:
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Office Info */}
            {teacher.office && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Office:
                </h4>
                <p className="text-sm text-gray-600">
                  {teacher.office.roomCode}, {teacher.office.block}, Floor{" "}
                  {teacher.office.floor}
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="text-sm text-gray-700">
              <p>📧 {teacher.email}</p>
              <p>📞 {teacher.phone}</p>
            </div>

            {/* Qualifications */}
            {teacher.qualifications?.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Qualifications:
                </h4>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {teacher.qualifications.map((q) => (
                    <div className="flex gap-7">
                        <li key={q._id}>
                      {q.degree} ({q.year}) – {q.institution}
                    </li>
                   <div className="flex gap-2 cursor-pointer">
                     <Edit onClick={() => handleEdit(teacher._id, teacher)}/> 
                      <Trash2 onClick={() => handleDelete(teacher._id)}/>
                   </div>
                    </div>
                    
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {edit && (
        <div ref={formref}>
        <UpdateTeacherForm teacherId= {edit}/></div>
      )}
    </div>
  );
};

export default FacultyData;
