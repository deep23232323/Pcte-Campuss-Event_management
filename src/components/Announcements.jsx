import React, { useState, useEffect } from "react";
import { Calendar, Users, AlertCircle, Tag, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Announcements = ({ showDelete = false }) => {
  const { url,token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${url}/api/announcements`);
      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };


    const handleDelete = async(id) => {
    console.log("Delete announcement", id);
     if (!window.confirm("Are you sure you want to delete this announcement?")) return;

  try {
    await axios.delete(`${url}/api/announcements/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    
   setAnnouncements(prev => prev.filter(item => item._id !== id))

    alert("announcement deleted successfully!");
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Failed to delete event");
  }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">📢 Announcements</h2>

      {announcements.length === 0 ? (
        <p className="text-gray-600">No announcements available</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col hover:shadow-xl transition-shadow"
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{a.title}</h3>
              {showDelete && (
                <div className="relative left-[100%] top-[-30px]"><button
              onClick={() => handleDelete(a._id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button></div>
              )}

              {/* Content */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{a.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {a.type && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {a.type}
                  </span>
                )}
                {a.priority && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      a.priority === "urgent"
                        ? "bg-red-100 text-red-700"
                        : a.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {a.priority}
                  </span>
                )}
                {a.department && (
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    {a.department}
                  </span>
                )}
                {a.targetAudience && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {a.targetAudience}
                  </span>
                )}
              </div>

              {/* Footer Info */}
              <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                {a.expiryDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Expires: {new Date(a.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {a.author?.name && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>By {a.author.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
