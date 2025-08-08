import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  // Default the API base URL to the local Django backend running on port 8001.
  // This can be overridden by setting REACT_APP_API_URL in the environment.
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for token refresh
api.interceptors.request.use(
  async (config) => {
    // Check if token is expired and refresh if needed
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Attempt to refresh the token
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/token/refresh/`,
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        
        // Update stored token
        localStorage.setItem('token', access);
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const login = async (email: string, password: string) => {
  // JWT authentication expects a `username` field.  We map the email into
  // `username` so that the backend can authenticate the user correctly.
  const response = await api.post('/token/', { username: email, password });
  return response.data;
};

export const register = async (userData: any) => {
  // Register a new user via the authentication app.  The backend route is
  // `/auth/register/` rather than the older `/users/register/` path.
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

export const getUserProfile = async () => {
  // Retrieve the current user's profile from the authentication app.
  const response = await api.get('/auth/profile/');
  return response.data;
};

// Thermostat API calls
export const getThermostats = async () => {
  const response = await api.get('/thermostats/');
  return response.data;
};

export const getThermostatsByUser = async () => {
  // Return all thermostats belonging to the current user.  The backend
  // automatically filters thermostats by the authenticated user, so the
  // top‑level `/thermostats/` endpoint is sufficient.
  const response = await api.get('/thermostats/');
  return response.data;
};

export const getThermostatsByProperty = async (propertyId: string) => {
  // List thermostats associated with a specific property.  The backend exposes
  // this via a nested route on the PropertyViewSet: `/properties/{id}/thermostats/`.
  const response = await api.get(`/properties/${propertyId}/thermostats/`);
  return response.data;
};

export const getThermostat = async (id: string) => {
  const response = await api.get(`/thermostats/${id}/`);
  return response.data;
};

export const addThermostat = async (thermostatData: any) => {
  const response = await api.post('/thermostats/', thermostatData);
  return response.data;
};

export const updateThermostat = async (id: string, thermostatData: any) => {
  const response = await api.put(`/thermostats/${id}/`, thermostatData);
  return response.data;
};

export const deleteThermostat = async (id: string) => {
  const response = await api.delete(`/thermostats/${id}/`);
  return response.data;
};

export const setThermostatTemperature = async (id: string, temperature: number) => {
  // Use the underscore‑separated path exposed by the Django backend for
  // backwards compatibility: `/set_temperature/`.
  const response = await api.post(`/thermostats/${id}/set_temperature/`, { temperature });
  return response.data;
};

export const setThermostatMode = async (id: string, mode: string) => {
  // Use the underscore‑separated path exposed by the Django backend for
  // backwards compatibility: `/set_mode/`.
  const response = await api.post(`/thermostats/${id}/set_mode/`, { mode });
  return response.data;
};

// Property API calls
export const getProperties = async () => {
  const response = await api.get('/properties/');
  return response.data;
};

export const getProperty = async (id: string) => {
  const response = await api.get(`/properties/${id}/`);
  return response.data;
};

export const addProperty = async (propertyData: any) => {
  const response = await api.post('/properties/', propertyData);
  return response.data;
};

export const updateProperty = async (id: string, propertyData: any) => {
  const response = await api.put(`/properties/${id}/`, propertyData);
  return response.data;
};

export const deleteProperty = async (id: string) => {
  const response = await api.delete(`/properties/${id}/`);
  return response.data;
};

// Calendar API calls
export const getCalendarEvents = async (propertyId: string) => {
  // Retrieve calendar events for a given property via the nested route on the
  // PropertyViewSet: `/properties/{id}/calendar/`.
  const response = await api.get(`/properties/${propertyId}/calendar/`);
  return response.data;
};

export const addCalendarEvent = async (eventData: any) => {
  // Create a new calendar event for a property.  The backend expects events
  // to be posted to `/properties/{propertyId}/calendar/`.  Ensure that
  // `eventData.property` contains the property ID.
  if (!eventData.property) {
    throw new Error('eventData.property is required');
  }
  const response = await api.post(`/properties/${eventData.property}/calendar/`, eventData);
  return response.data;
};

export const updateCalendarEvent = async (id: string, eventData: any) => {
  // Update an existing calendar event.  Use the `calendar-events` resource
  // provided by the Django backend.
  const response = await api.put(`/calendar-events/${id}/`, eventData);
  return response.data;
};

export const deleteCalendarEvent = async (id: string) => {
  // Delete a calendar event via the `calendar-events` resource.
  const response = await api.delete(`/calendar-events/${id}/`);
  return response.data;
};

// Statistics API calls
export const getStatistics = async (timeRange: string = 'month') => {
  // Retrieve general statistics across all properties/thermostats.  The backend
  // accepts a `period` query parameter rather than `time_range`.
  const response = await api.get(`/statistics/?period=${timeRange}`);
  return response.data;
};

export const getPropertyStatistics = async (propertyId: string, timeRange: string = 'month') => {
  // Fetch statistics for a specific property.  The backend exposes a nested
  // route on the PropertyViewSet: `/properties/{id}/statistics/` and accepts
  // a `period` query parameter instead of `time_range`.
  const response = await api.get(`/properties/${propertyId}/statistics/?period=${timeRange}`);
  return response.data;
};

export const getThermostatStatistics = async (thermostatId: string, timeRange: string = 'month') => {
  // Retrieve statistics for a specific thermostat.  While the backend does
  // not yet expose a thermostat‑specific endpoint, it supports filtering by
  // thermostat ID and period via query parameters.
  const response = await api.get(`/statistics/?thermostat_id=${thermostatId}&period=${timeRange}`);
  return response.data;
};
