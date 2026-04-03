import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Calendar,
  Bell,
  Settings,
  Plus,
  TrendingUp,
  Building,
  GraduationCap,
  Clock,
  Trash2,
  MapPin,
  Search,
  ChevronRight,
  Activity,
  Edit,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import EventForm from "./HandleEvenets";
import AnnouncementForm from "./HandleAnnouncements";
import { use } from "react";
import Announcements from "./Announcements";
import UploadTimetable from "./UploadTimetable";
import FacultyData from "./FacultyData";
import UpdateEventForm from "./UpdateEvente";
import axios from "axios";
import AddTeacherForm from "./AddTeacherForm";
import HandleUser from "./HandleUser";


const AdminPanel = () => {
  const [editEvenets, setEditEvenets] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const formRef = useRef(null);
  const eventFormRef = useRef(null);
  

  useEffect(() => {
    if (editEvenets && eventFormRef.current) {
      eventFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editEvenets]);

  const { url } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const { user } = useAuth();
  const [eventsVal, seteventsVal] = useState("");
  const [activeTab, setActiveTab] = useState("overview");


  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAnnouncements: 0,
    totalTeachers: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${url}/api/events`);

      const data = await response.json();

      setUpcomingEvents(data.events);

      setStats((prevStats) => ({
        ...prevStats,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventsVal && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [eventsVal]);
 
 const token = localStorage.getItem("token");
    const handleEditEvents = (eventId) => {
    console.log("edit", eventId);
    setEditEvenets(eventId);
  };

  const handleDelete = async(id) => {

  

     if (!window.confirm("Are you sure you want to delete this event?")) return;
     try {
    await axios.delete(`${url}/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update state (remove event from list)
    setUpcomingEvents((prev) => prev.filter((e) => e._id !== id));

    alert("Event deleted successfully!");
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Failed to delete event");
  }

      
      
  };


  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [eventsData, announcementsData, teachersData] = await Promise.all([
        apiService.getEvents({ limit: 5 }),
        apiService.getAnnouncements({ limit: 5 }),
        apiService.getTeachers({ limit: 5 }),
      ]);

      setStats({
        totalUsers: 150,
        totalEvents: eventsData.total || 0,
        totalAnnouncements: announcementsData.total || 0,
        totalTeachers: teachersData.total || 0,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleManagaData = (tab) => {
    seteventsVal(tab);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "events", label: "Events", icon: Calendar },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "faculty", label: "Faculty", icon: GraduationCap },
    { id: "infrastructure", label: "TimTable", icon: Building },
  ];

  const StatCard = ({ icon: Icon, title, value, color, change }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div
          className="relative bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 overflow-hidden"
          style={{
            backgroundImage: "url(/image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-700 text-lg">
              Manage your campus efficiently with comprehensive controls
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                color="bg-blue-600"
                change="+12% this month"
              />
              <StatCard
                icon={Calendar}
                title="Active Events"
                value={upcomingEvents.length}
                color="bg-green-600"
                change="+8% this week"
              />
              <StatCard
                icon={Bell}
                title="Announcements"
                value={stats.totalAnnouncements}
                color="bg-purple-600"
                change="+5% this week"
              />
              <StatCard
                icon={GraduationCap}
                title="Faculty Members"
                value={stats.totalTeachers}
                color="bg-orange-600"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleManagaData("event")}
                    className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Add Event</span>
                  </button>
                  <button
                    onClick={() => handleManagaData("announcement")}
                    className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">
                      New Announcement
                    </span>
                  </button>
                  <button
                    onClick={() => handleManagaData("user")}
                    className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">
                      Manage Users
                    </span>
                  </button>
                  <button
                    onClick={() => handleManagaData("faculty")}
                    className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">
                      Add Faculty
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  System Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Database</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Services</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Running
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Backup Status</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Scheduled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Update</span>
                    <span className="text-gray-600 text-sm">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "events" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 5).map((event) => (
                  <div
                    key={event._id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>

                    {/* Event details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {event.location}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time?.start} - {event.time?.end}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Priority + Delete button */}
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : event.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {event.priority}
                      </div>

                      {/* Delete Button */}
                      <button
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                        onClick={() => handleEditEvents(event._id)}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                 
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming events</p>
                </div>
              )}
            </div>
 {editEvenets && (
          <div ref={eventFormRef} className="mt-8">
            <UpdateEventForm eventId={editEvenets} />
          </div>
        )}          </div>
        )}

        {activeTab === "announcements" && (
          <div>
            <Announcements showDelete={true} />
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab === "infrastructure" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <UploadTimetable />
          </div>
        )}

        {activeTab === "faculty" && (
          <div>
            <FacultyData />
          </div>
        )}
      </div>
      {activeTab === "overview" && (
        <div ref={formRef}>
          {eventsVal == "event" && (
            <div>
              <EventForm />
             
            </div>
          )}

          {eventsVal == "announcement" && (
            <div>
              <AnnouncementForm />{" "}
            </div>
          )}
          {eventsVal == "user" && (
            <div>
              <h1><HandleUser /></h1>
            </div>
          )}
          {eventsVal == "faculty" && (
            <div>
              <AddTeacherForm />
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default AdminPanel;
