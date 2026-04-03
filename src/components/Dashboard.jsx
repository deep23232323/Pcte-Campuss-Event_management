import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import {
  Calendar,
  MapPin,
  Users,
  Bell,
  TrendingUp,
  Clock,
  GraduationCap,
  Building,
  Search,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Events from "./Events";

const Dashboard = () => {
  const { user } = useAuth();
  const { url } = useAuth();

  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAnnouncements: 0,
    totalTeachers: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [teachersD, setTeachersD] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${url}/api/events`);
      const response2 = await fetch(`${url}/api/announcements`);
      const response3 = await fetch(`${url}/api/teachers`);
      const data = await response.json();
      const data2 = await response2.json();
      const data3 = await response3.json();
      setTeachersD(data3.teachers);

      setRecentAnnouncements(data2.announcements);
      setUpcomingEvents(data.events);

      setStats((prevStats) => ({
        ...prevStats,
        totalEvents: data.events.length,
        totalAnnouncements: data2.announcements.length,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{trend}</span>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-700 text-lg">
              {user?.role === "admin"
                ? "Manage your campus efficiently"
                : user?.role === "staff"
                ? "Your campus management dashboard"
                : "Your personalized campus dashboard"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={stats.totalEvents}
            color="bg-blue-600"
            
          />
          <StatCard
            icon={Bell}
            title="Announcements"
            value={stats.totalAnnouncements}
            color="bg-green-600"
           
          />
          <StatCard
            icon={Users}
            title="Faculty Members"
            value={teachersD.length}
            color="bg-purple-600"
          />
          <StatCard
            icon={Building}
            title="Campus Blocks"
            value={4}
            color="bg-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Upcoming Events
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                  <Link to="/events" className="flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </button>
              </div>

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
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Announcements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                
                <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                onClick={() => navigate("/timetable")}>
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">
                    View Timetable
                  </span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                  onClick={() => navigate("/directory")}
                >
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">
                    Find Teacher
                  </span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left"
                onClick={() => navigate("/map")}>
                  <Search className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900">
                    Campus Directory
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600" />
                  Announcements
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                  <Link to="/announcements" className="flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </button>
              </div>

              <div className="space-y-3">
                {recentAnnouncements.length > 0 ? (
                  recentAnnouncements.slice(0, 3).map((announcement) => (
                    <div
                      key={announcement._id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <h3 className="font-medium text-gray-900 text-sm mb-1">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            announcement.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : announcement.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {announcement.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            announcement.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No recent announcements</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Campus Overview */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Campus Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Engineering Block",
                code: "ET",
                color: "bg-blue-600",
                rooms: 90,
                floors: 6,
              },
              {
                name: "Management Block",
                code: "MT",
                color: "bg-green-600",
                rooms: 80,
                floors: 5,
              },
              {
                name: "Pharma Block",
                code: "PHR",
                color: "bg-purple-600",
                rooms: 60,
                floors: 5,
              },
              {
                name: "Hotel Management",
                code: "HM",
                color: "bg-orange-600",
                rooms: 70,
                floors: 5,
              },
            ].map((block) => (
              <div
                key={block.code}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${block.color}`}
                  >
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {block.name}
                    </h3>
                    <p className="text-sm text-gray-600">{block.code}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Rooms</p>
                    <p className="font-medium">{block.rooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Floors</p>
                    <p className="font-medium">{block.floors}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
