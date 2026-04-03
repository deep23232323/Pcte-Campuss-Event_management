import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bell, 
  BookOpen, 
  User,
  Star,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const StudentPortal: React.FC = () => {
  const { user } = useAuth();
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      const [scheduleData, eventsData, announcementsData] = await Promise.all([
        apiService.getTimetableByDay(today, { 
          department: user?.department, 
          semester: user?.semester 
        }),
        apiService.getUpcomingEvents(3),
        apiService.getAnnouncements({ limit: 5 })
      ]);

      setTodaySchedule(scheduleData || []);
      setUpcomingEvents(eventsData || []);
      setAnnouncements(announcementsData.announcements || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">This portal is only available for students.</p>
        </div>
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
            backgroundImage: 'url(/image.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-700 text-lg">Welcome back, {user?.name}! Here's your personalized dashboard</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span>Student ID: {user?.studentId}</span>
              <span>•</span>
              <span>{user?.department}</span>
              <span>•</span>
              <span>{user?.semester} Semester</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Today's Schedule
              </h2>
              
              {todaySchedule.length > 0 ? (
                <div className="space-y-4">
                  {todaySchedule.map((classItem: any, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{classItem.subject.name}</h3>
                        <p className="text-sm text-gray-600">{classItem.subject.code}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {classItem.timeSlot.start} - {classItem.timeSlot.end}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {classItem.room?.code}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {classItem.teacher?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No classes scheduled for today</p>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Upcoming Events
              </h2>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event: any) => (
                    <div key={event._id} className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{event.category}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time.start}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                        Register
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming events</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Classes Today</span>
                  <span className="font-semibold text-blue-600">{todaySchedule.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Upcoming Events</span>
                  <span className="font-semibold text-yellow-600">{upcomingEvents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attendance</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current CGPA</span>
                  <span className="font-semibold text-purple-600">8.5</span>
                </div>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-600" />
                Announcements
              </h3>
              
              {announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((announcement: any) => (
                    <div key={announcement._id} className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{announcement.title}</h4>
                      <p className="text-gray-600 text-xs line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          announcement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {announcement.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No recent announcements</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">View Full Timetable</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Campus Navigation</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Find Teacher</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900">View Events</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;