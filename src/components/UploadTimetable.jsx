import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UploadTimetable = () => {
  const { url } = useAuth();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage("⚠️ Please upload a valid .xlsx file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".xlsx")) {
      setFile(droppedFile);
      setMessage("");
    } else {
      setMessage("⚠️ Please upload a valid .xlsx file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${url}/upload-timetable`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "✅ Uploaded successfully!");
      setFile(null);
    } catch (error) {
      setMessage("❌ Error uploading file!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📤 Upload New Timetable
        </h2>

        {/* Drag & Drop Zone */}
        <div
          className="border-2 border-dashed border-gray-400 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition bg-gray-50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-gray-600 text-lg">
            {file ? (
              <span className="font-semibold text-blue-600">{file.name}</span>
            ) : (
              <>
                Drag & drop your <span className="font-semibold">Excel file</span> here
                <br /> or <span className="text-blue-600 underline">browse</span>
              </>
            )}
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Timetable"}
        </button>

        {/* Status Message */}
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadTimetable;
