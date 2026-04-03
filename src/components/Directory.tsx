import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Mail, MapPin, Building, Users, GraduationCap, ChevronDown } from 'lucide-react';
import apiService from '../services/api';

const Directory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: 'all',
    block: 'all'
  });

  const departments = ['Engineering', 'Management', 'Pharma', 'Hotel Management'];
  const blocks = ['Engineering', 'Management', 'Pharma', 'Hotel Management'];

  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: searchQuery
      };

      switch (activeTab) {
        case 'teachers':
          const teachersData = await apiService.getTeachers(params);
          setTeachers(teachersData.teachers || []);
          break;
        case 'staff':
          const staffData = await apiService.getStaff(params);
          setStaff(staffData.staff || []);
          break;
        case 'rooms':
          const roomsData = await apiService.getRooms(params);
          setRooms(roomsData.rooms || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  const tabs = [
    { id: 'teachers', label: 'Faculty', icon: GraduationCap },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: Building }
  ];

  const TeacherCard = ({ teacher }: { teacher: any }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover-lift">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{teacher.name}</h3>
          <p className="text-blue-600 font-medium mb-2">{teacher.designation}</p>
          <p className="text-gray-600 text-sm mb-3">{teacher.department}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{teacher.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Office: {teacher.office?.roomCode}, {teacher.office?.block} Block, Floor {teacher.office?.floor}</span>
            </div>
          </div>

          {teacher.expertise && teacher.expertise.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Expertise:</p>
              <div className="flex flex-wrap gap-1">
                {teacher.expertise.map((skill: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              teacher.availability?.status === 'Available' ? 'bg-green-100 text-green-800' :
              teacher.availability?.status === 'In Class' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {teacher.availability?.status || 'Available'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const StaffCard = ({ staffMember }: { staffMember: any }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover-lift">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Users className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{staffMember.name}</h3>
          <p className="text-green-600 font-medium mb-2">{staffMember.designation}</p>
          <p className="text-gray-600 text-sm mb-3">{staffMember.department}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{staffMember.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{staffMember.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Office: {staffMember.office?.roomCode}, {staffMember.office?.block} Block</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Responsibility:</p>
            <p className="text-sm text-gray-600">{staffMember.responsibility}</p>
          </div>

          {staffMember.availability?.workingHours && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Working Hours:</p>
              <p className="text-sm text-gray-600">
                {staffMember.availability.workingHours.start} - {staffMember.availability.workingHours.end}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const RoomCard = ({ room }: { room: any }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover-lift">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Building className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.name}</h3>
          <p className="text-purple-600 font-medium mb-2">{room.code}</p>
          <p className="text-gray-600 text-sm mb-3">{room.block} Block, Floor {room.floor}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Type</p>
              <p className="text-sm text-gray-600">{room.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Capacity</p>
              <p className="text-sm text-gray-600">{room.capacity} people</p>
            </div>
          </div>

          {room.facilities && room.facilities.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
              <div className="flex flex-wrap gap-1">
                {room.facilities.map((facility: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              room.availability?.status === 'Available' ? 'bg-green-100 text-green-800' :
              room.availability?.status === 'Occupied' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {room.availability?.status || 'Available'}
            </span>
            
            {room.availability?.currentClass && (
              <div className="text-xs text-gray-600">
                <p>Current: {room.availability.currentClass.subject}</p>
                <p>{room.availability.currentClass.startTime} - {room.availability.currentClass.endTime}</p>
              </div>
            )}
          </div>
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
            backgroundImage: 'url(/image.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Campus Directory</h1>
            <p className="text-gray-700 text-lg">Find faculty, staff, and room information across the campus</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Department/Block Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'rooms' ? 'Block' : 'Department'}
              </label>
              <div className="relative">
                <select
                  value={activeTab === 'rooms' ? filters.block : filters.department}
                  onChange={(e) => setFilters({
                    ...filters,
                    [activeTab === 'rooms' ? 'block' : 'department']: e.target.value
                  })}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All {activeTab === 'rooms' ? 'Blocks' : 'Departments'}</option>
                  {(activeTab === 'rooms' ? blocks : departments).map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeTab === 'teachers' && teachers.map((teacher: any) => (
              <TeacherCard key={teacher._id} teacher={teacher} />
            ))}
            {activeTab === 'staff' && staff.map((staffMember: any) => (
              <StaffCard key={staffMember._id} staffMember={staffMember} />
            ))}
            {activeTab === 'rooms' && rooms.map((room: any) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && (
          (activeTab === 'teachers' && teachers.length === 0) ||
          (activeTab === 'staff' && staff.length === 0) ||
          (activeTab === 'rooms' && rooms.length === 0)
        ) && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;