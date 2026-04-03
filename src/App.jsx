import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CampusMap from './components/CampusMap';
import Navigation from './components/Navigation';
import Timetable from './components/Timetable';

import Directory from './components/Directory';
import AdminPanel from './components/AdminPanel';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import Events from './components/Events';
import Announcements from './components/Announcements';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<CampusMap />} />
            <Route path="/navigation" element={<Navigation />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/events" element={<Events />} />
            <Route path='/announcements' element={<Announcements />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/student" element={<StudentPortal />} />
             <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
            
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;