const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://campuss-compass-backend.onrender.com/api';
class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData: any) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Teachers
  async getTeachers(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/teachers${queryString}`);
  }

  async getTeacher(id: string) {
    return this.request(`/teachers/${id}`);
  }

  async createTeacher(teacherData: any) {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  }

  async updateTeacher(id: string, teacherData: any) {
    return this.request(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    });
  }

  async deleteTeacher(id: string) {
    return this.request(`/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  async getTeacherLocation(id: string) {
    return this.request(`/teachers/${id}/location`);
  }

  // Staff
  async getStaff(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/staff${queryString}`);
  }

  // Rooms
  async getRooms(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/rooms${queryString}`);
  }

  async getRoom(id: string) {
    return this.request(`/rooms/${id}`);
  }

  // Blocks
  async getBlocks() {
    return this.request('/blocks');
  }

  // Events
  async getEvents(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/events${queryString}`);
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async registerForEvent(id: string) {
    return this.request(`/events/${id}/register`, {
      method: 'POST',
    });
  }

  async unregisterFromEvent(id: string) {
    return this.request(`/events/${id}/register`, {
      method: 'DELETE',
    });
  }

  async getUpcomingEvents(limit?: number) {
    const queryString = limit ? `?limit=${limit}` : '';
    return this.request(`/events/upcoming/list${queryString}`);
  }

  // Announcements
  async getAnnouncements(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/announcements${queryString}`);
  }

  async getAnnouncement(id: string) {
    return this.request(`/announcements/${id}`);
  }

  async createAnnouncement(announcementData: any) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(id: string, announcementData: any) {
    return this.request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(id: string) {
    return this.request(`/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  async markAnnouncementAsViewed(id: string) {
    return this.request(`/announcements/${id}/view`, {
      method: 'POST',
    });
  }

  // Timetable
  async getTimetable(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/timetable${queryString}`);
  }

  async getTimetableByDay(day: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/timetable/day/${day}${queryString}`);
  }

  async getTeacherTimetable(teacherId: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/timetable/teacher/${teacherId}${queryString}`);
  }

  async getRoomTimetable(roomId: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/timetable/room/${roomId}${queryString}`);
  }

  async createTimetableEntry(timetableData: any) {
    return this.request('/timetable', {
      method: 'POST',
      body: JSON.stringify(timetableData),
    });
  }

  async updateTimetableEntry(id: string, timetableData: any) {
    return this.request(`/timetable/${id}`, {
      method: 'PUT',
      body: JSON.stringify(timetableData),
    });
  }

  async deleteTimetableEntry(id: string) {
    return this.request(`/timetable/${id}`, {
      method: 'DELETE',
    });
  }

  // Navigation
  async findRoute(from: string, to: string) {
    return this.request('/navigation/route', {
      method: 'POST',
      body: JSON.stringify({ from, to }),
    });
  }

  // Statistics (Admin only)
  async getEventStats() {
    return this.request('/events/stats/overview');
  }

  async getAnnouncementStats() {
    return this.request('/announcements/stats/overview');
  }
}

export default new ApiService();