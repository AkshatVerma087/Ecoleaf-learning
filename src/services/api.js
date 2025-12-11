const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// API request helper
const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(options.requireAuth !== false),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle network errors
    if (!response) {
      throw new Error('Network error: Could not connect to server');
    }
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If response is not JSON, use status text
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Improve error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:5000');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      requireAuth: false,
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requireAuth: false,
    }),

  adminLogin: (credentials) =>
    request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requireAuth: false,
    }),

  getMe: () => request('/auth/me'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => request('/dashboard/stats'),
};

// Courses API
export const coursesAPI = {
  getAll: () => request('/courses'),
  getById: (id) => request(`/courses/${id}`),
  create: (courseData) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
  update: (id, courseData) =>
    request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
  delete: (id) =>
    request(`/courses/${id}`, {
      method: 'DELETE',
    }),
};

// Lessons API
export const lessonsAPI = {
  getByCourse: (courseId) => request(`/lessons/courses/${courseId}/lessons`),
  getById: (id) => request(`/lessons/${id}`),
  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/lessons/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload video');
    }
    
    return response.json();
  },
  create: (lessonData) =>
    request('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    }),
  update: (id, lessonData) =>
    request(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    }),
  delete: (id) =>
    request(`/lessons/${id}`, {
      method: 'DELETE',
    }),
  complete: (id) =>
    request(`/lessons/${id}/complete`, {
      method: 'POST',
    }),
  saveNotes: (id, notes) =>
    request(`/lessons/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
};

// Quizzes API
export const quizzesAPI = {
  getAll: () => request('/quizzes'),
  getById: (id) => request(`/quizzes/${id}`),
  getQuestions: (id) => request(`/quizzes/${id}/questions`),
  submit: (id, answers) =>
    request(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  create: (quizData) =>
    request('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    }),
  update: (id, quizData) =>
    request(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    }),
  delete: (id) =>
    request(`/quizzes/${id}`, {
      method: 'DELETE',
    }),
};

// Tasks API
export const tasksAPI = {
  getAll: () => request('/tasks'),
  complete: (id) =>
    request(`/tasks/${id}/complete`, {
      method: 'POST',
    }),
  uploadProof: (id, proofUrl) =>
    request(`/tasks/${id}/upload`, {
      method: 'POST',
      body: JSON.stringify({ proofUrl }),
    }),
};

// Carbon API
export const carbonAPI = {
  getEmissions: (days = 7) => request(`/carbon/emissions?days=${days}`),
  logEmissions: (emissionData) =>
    request('/carbon/emissions', {
      method: 'POST',
      body: JSON.stringify(emissionData),
    }),
  getScore: () => request('/carbon/score'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => request('/admin/dashboard'),
  getStudents: (search, sortBy, sortOrder) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    return request(`/admin/students?${params.toString()}`);
  },
};

export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  courses: coursesAPI,
  lessons: lessonsAPI,
  quizzes: quizzesAPI,
  tasks: tasksAPI,
  carbon: carbonAPI,
  admin: adminAPI,
};

