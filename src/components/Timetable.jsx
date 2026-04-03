import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { CalendarDays, BookOpen, GraduationCap } from "lucide-react";

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const { url } = useAuth();

  useEffect(() => {
    fetch(`${url}/timetable`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTimetable(data);
        } else {
          setTimetable([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching timetable", err);
        setTimetable([]);
      });
  }, [url]);
  
  const classes = [...new Set(timetable.map((item) => item.Class))].filter(Boolean);
  const days = [...new Set(timetable.map((item) => item.DAY))].filter(Boolean);

  const filtered = timetable.find(
    (item) => item.Class === selectedClass && item.DAY === selectedDay
  );

  const className = filtered?.Class;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-4/5 lg:w-3/5 bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-indigo-700 flex items-center justify-center gap-3">
            <CalendarDays className="w-8 h-8 text-indigo-600" />
            Student Timetable
          </h2>
          <p className="text-gray-600 mt-2">
            Select your class and day to view your schedule 📅
          </p>
        </div>
        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <select
            className="border border-gray-300 bg-gray-50 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">🎓 Select Class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 bg-gray-50 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="">📅 Select Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {/* Timetable */}
       {filtered ? (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid gap-4"
  >
    {/* Class Header */}
    <div className="p-4 rounded-xl bg-indigo-100 text-indigo-800 font-semibold">
      Class: {className}
    </div>

    {/* Timetable */}
    {Object.entries(filtered)
      .filter(([key]) => key !== "Day" && key !== "DAY" && key !== "Class")
      .map(([time, subject], idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-gray-800">{time}</span>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 font-medium">
              {subject || "-"}
            </span>
            <span className="text-sm text-gray-500">
  Class: {filtered.Class}
</span>

          </div>
        </motion.div>
      ))}
  </motion.div>
) : (
  <p className="text-gray-600 text-center text-lg mt-6">
    🔍 Please select a{" "}
    <span className="font-semibold text-indigo-700">Class</span> and{" "}
    <span className="font-semibold text-indigo-700">Day</span> to see your
    timetable.
  </p>
)}

      </motion.div>
    </div>
  );
};

export default Timetable;
