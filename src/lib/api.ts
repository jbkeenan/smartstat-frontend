import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'https://smartstatback.onrender.com/api';

// Mock data for test mode
const MOCK_DATA = {
  dashboard: {
    summary: {
      total_properties: 5,
      total_thermostats: 12,
      active_thermostats: 10,
      energy_savings: {
        today: 8.75,
        this_week: 42.30,
        this_month: 156.85
      }
    },
    energyUsage: {
      period: 'week',
      usage: [
        { timestamp: '2025-06-01', value: 24.5 },
        { timestamp: '2025-06-02', value: 22.8 },
        { timestamp: '2025-06-03', value: 21.3 },
        { timestamp: '2025-06-04', value: 23.1 },
        { timestamp: '2025-06-05', value: 20.7 },
        { timestamp: '2025-06-06', value: 19.9 },
        { timestamp: '2025-06-07', value: 21.5 }
      ]
    }
  },
  properties: [
    {
      id: 'mock-prop-1',
      name: 'Beach House',
      address: '123 Ocean Drive',
      city: 'Miami Beach',
      state: 'FL',
      zip_code: '33139',
      property_type: 'Vacation Rental',
      square_footage: 2200,
      bedrooms: 3,
      bathrooms: 2,
      year_built: 2010,
      created_at: '2025-01-15T12:00:00Z',
      updated_at: '2025-01-15T12:00:00Z'
    },
    {
      id: 'mock-prop-2',
      name: 'Mountain Cabin',
      address: '456 Pine Trail',
      city: 'Aspen',
      state: 'CO',
      zip_code: '81611',
      property_type: 'Vacation Rental',
      square_footage: 1800,
      bedrooms: 2,
      bathrooms: 2,
      year_built: 2005,
      created_at: '2025-02-10T12:00:00Z',
      updated_at: '2025-02-10T12:00:00Z'
    }
  ],
  thermostats: [
    {
      id: 'mock-therm-1',
      name: 'Living Room',
      property_id: 'mock-prop-1',
      current_temperature: 72,
      target_temperature: 70,
      mode: 'cool',
      fan_mode: 'auto',
      is_online: true,
      battery_level: 95,
      firmware_version: '2.1.0',
      created_at: '2025-01-20T12:00:00Z',
      updated_at: '2025-06-04T10:30:00Z',
      location: 'Living Room',
      model: 'EcoStat Pro'
    },
    {
      id: 'mock-therm-2',
      name: 'Master Bedroom',
      property_id: 'mock-prop-1',
      current_temperature: 74,
      target_temperature: 72,
      mode: 'cool',
      fan_mode: 'auto',
      is_online: true,
      battery_level: 87,
      firmware_version: '2.1.0',
      created_at: '2025-01-20T12:00:00Z',
      updated_at: '2025-06-04T10:30:00Z',
      location: 'Master Bedroom',
      model: 'EcoStat Pro'
    }
  ],
  schedules: [
    {
      id: 'mock-sched-1',
      name: 'Weekday Schedule',
      thermostat_id: 'mock-therm-1',
      start_time: '08:00:00',
      end_time: '17:00:00',
      target_temperature: 72,
      days_active: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      is_active: true,
      created_at: '2025-01-25T12:00:00Z',
      updated_at: '2025-01-25T12:00:00Z'
    }
  ],
  calendars: [
    {
      id: 'mock-cal-1',
      name: 'Airbnb Bookings',
      description: 'Calendar for Airbnb bookings',
      color: '#FF5A5F',
      is_active: true,
      created_at: '2025-02-01T12:00:00Z',
      updated_at: '2025-02-01T12:00:00Z'
    }
  ],
  calendarEvents: [
    {
      id: 'mock-event-1',
      calendar_id: 'mock-cal-1',
      title: 'Guest Booking',
      description: 'Family of 4 from Chicago',
      start_date: '2025-06-10T14:00:00Z',
      end_date: '2025-06-17T11:00:00Z',
      created_at: '2025-05-15T12:00:00Z',
      updated_at: '2025-05-15T12:00:00Z'
    }
  ],
  businessAnalysis: {
    analytics: {
      total_savings: 1245.75,
      roi_percentage: 320,
      average_temperature: 72.5,
      peak_usage_times: ['17:00', '18:00', '19:00']
    },
    energyUsage: {
      period: 'month',
      usage: [
        { timestamp: '2025-05-01', value: 450 },
        { timestamp: '2025-05-08', value: 425 },
        { timestamp: '2025-05-15', value: 410 },
        { timestamp: '2025-05-22', value: 390 },
        { timestamp: '2025-05-29', value: 380 }
      ]
    },
    costSavings: {
      period: 'month',
      savings: [
        { timestamp: '2025-05-01', value: 35.50 },
        { timestamp: '2025-05-08', value: 37.25 },
        { timestamp: '2025-05-15', value: 40.10 },
        { timestamp: '2025-05-22', value: 42.75 },
        { timestamp: '2025-05-29', value: 45.30 }
      ]
    }
  }
};

// Error handling helper
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    // Handle Axios errors with response data
    if (error.response) {
      const statusCode = error.response.status;
      const responseData = error.response.data;
      
      throw new Error(
        `Request failed with status ${statusCode}: ${
          typeof responseData === 'object' 
            ? JSON.stringify(responseData) 
            : responseData || error.message
        }`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response received from server. Please check your network connection.');
    } else {
      // Error in setting up the request
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }
  
  // For non-Axios errors
  throw error;
};

// Check if test mode is active
const isTestModeActive = () => {
  return localStorage.getItem('thermostat_test_mode') === 'true';
};

// Request interceptor for adding auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear token if it's invalid or expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        // Reload the page to reset auth state
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  created_at: string;
  updated_at: string;
}

export interface Thermostat {
  id: string;
  name: string;
  property_id: string;
  current_temperature: number;
  target_temperature: number;
  mode: 'heat' | 'cool' | 'auto' | 'off';
  fan_mode: 'auto' | 'on';
  is_online: boolean;
  battery_level: number;
  firmware_version: string;
  created_at: string;
  updated_at: string;
  // Additional fields needed by the UI
  location?: string;
  model?: string;
}

export interface Schedule {
  id: string;
  name: string;
  thermostat_id: string;
  start_time: string;
  end_time: string;
  target_temperature: number;
  days_active: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Calendar {
  id: string;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  calendar_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

// Dashboard API
const dashboard = {
  getSummary: async () => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock dashboard summary data');
        return MOCK_DATA.dashboard.summary;
      }
      
      const response = await axios.get(`${API_URL}/dashboard/summary/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock dashboard summary data after error');
        return MOCK_DATA.dashboard.summary;
      }
      return handleApiError(error);
    }
  },
  
  getEnergyUsage: async (timeRange: string) => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock energy usage data');
        return MOCK_DATA.dashboard.energyUsage;
      }
      
      const response = await axios.get(`${API_URL}/dashboard/energy-usage/?time_range=${timeRange}`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock energy usage data after error');
        return MOCK_DATA.dashboard.energyUsage;
      }
      return handleApiError(error);
    }
  }
};

// API functions for properties
const properties = {
  getAll: async (): Promise<Property[]> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock properties data');
        return MOCK_DATA.properties;
      }
      
      const response = await axios.get(`${API_URL}/properties/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock properties data after error');
        return MOCK_DATA.properties;
      }
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Property> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock property data');
        const property = MOCK_DATA.properties.find(p => p.id === id);
        if (property) return property;
        return MOCK_DATA.properties[0]; // Return first mock property if ID not found
      }
      
      const response = await axios.get(`${API_URL}/properties/${id}/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock property data after error');
        return MOCK_DATA.properties[0];
      }
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Property>): Promise<Property> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created property data');
        return {
          ...MOCK_DATA.properties[0],
          ...data,
          id: `mock-prop-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.post(`${API_URL}/properties/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created property data after error');
        return {
          ...MOCK_DATA.properties[0],
          ...data,
          id: `mock-prop-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Property>): Promise<Property> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated property data');
        return {
          ...MOCK_DATA.properties[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.put(`${API_URL}/properties/${id}/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated property data after error');
        return {
          ...MOCK_DATA.properties[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      // Do nothing if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Simulating property deletion');
        return;
      }
      
      await axios.delete(`${API_URL}/properties/${id}/`);
    } catch (error) {
      // If in test mode, ignore error
      if (isTestModeActive()) {
        console.log('Test mode active: Ignoring property deletion error');
        return;
      }
      return handleApiError(error);
    }
  }
};

// API functions for thermostats
const thermostats = {
  getAll: async (): Promise<Thermostat[]> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostats data');
        return MOCK_DATA.thermostats.map(thermostat => ({
          ...thermostat,
          mode: thermostat.mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: thermostat.fan_mode as 'on' | 'auto'
        }));
      }
      
      const response = await axios.get(`${API_URL}/thermostats/`);
      return response.data.map((thermostat: any) => ({
        ...thermostat,
        mode: thermostat.mode as 'heat' | 'cool' | 'auto' | 'off',
        fan_mode: thermostat.fan_mode as 'on' | 'auto'
      }));
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostats data after error');
        return MOCK_DATA.thermostats.map(thermostat => ({
          ...thermostat,
          mode: thermostat.mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: thermostat.fan_mode as 'on' | 'auto'
        }));
      }
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Thermostat> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostat data');
        const thermostat = MOCK_DATA.thermostats.find(t => t.id === id);
        if (thermostat) {
          return {
            ...thermostat,
            mode: thermostat.mode as 'heat' | 'cool' | 'auto' | 'off',
            fan_mode: thermostat.fan_mode as 'on' | 'auto'
          };
        }
        // Return first mock thermostat if ID not found
        return {
          ...MOCK_DATA.thermostats[0],
          mode: MOCK_DATA.thermostats[0].mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: MOCK_DATA.thermostats[0].fan_mode as 'on' | 'auto'
        };
      }
      
      const response = await axios.get(`${API_URL}/thermostats/${id}/`);
      return {
        ...response.data,
        mode: response.data.mode as 'heat' | 'cool' | 'auto' | 'off',
        fan_mode: response.data.fan_mode as 'on' | 'auto'
      };
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostat data after error');
        return {
          ...MOCK_DATA.thermostats[0],
          mode: MOCK_DATA.thermostats[0].mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: MOCK_DATA.thermostats[0].fan_mode as 'on' | 'auto'
        };
      }
      return handleApiError(error);
    }
  },
  
  getByProperty: async (propertyId: string): Promise<Thermostat[]> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostats for property');
        return MOCK_DATA.thermostats
          .filter(t => t.property_id === propertyId)
          .map(thermostat => ({
            ...thermostat,
            mode: thermostat.mode as 'heat' | 'cool' | 'auto' | 'off',
            fan_mode: thermostat.fan_mode as 'on' | 'auto'
          }));
      }
      
      const response = await axios.get(`${API_URL}/properties/${propertyId}/thermostats/`);
      return response.data.map((thermostat: any) => ({
        ...thermostat,
        mode: thermostat.mode as 'heat' | 'cool' | 'auto' | 'off',
        fan_mode: thermostat.fan_mode as 'on' | 'auto'
      }));
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostats for property after error');
        return MOCK_DATA.thermostats
          .filter(t => t.property_id === propertyId)
          .map(thermostat => ({
            ...thermostat,
            mode: thermostat.mode as 'heat' | 'cool' | 'auto' | 'off',
            fan_mode: thermostat.fan_mode as 'on' | 'auto'
          }));
      }
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Thermostat>): Promise<Thermostat> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created thermostat data');
        return {
          ...MOCK_DATA.thermostats[0],
          ...data,
          id: `mock-therm-${Date.now()}`,
          mode: (data.mode || MOCK_DATA.thermostats[0].mode) as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: (data.fan_mode || MOCK_DATA.thermostats[0].fan_mode) as 'on' | 'auto',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.post(`${API_URL}/thermostats/`, data);
      return {
        ...response.data,
        mode: response.data.mode as 'heat' | 'cool' | 'auto' | 'off',
        fan_mode: response.data.fan_mode as 'on' | 'auto'
      };
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created thermostat data after error');
        return {
          ...MOCK_DATA.thermostats[0],
          ...data,
          id: `mock-therm-${Date.now()}`,
          mode: (data.mode || MOCK_DATA.thermostats[0].mode) as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: (data.fan_mode || MOCK_DATA.thermostats[0].fan_mode) as 'on' | 'auto',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Thermostat>): Promise<Thermostat> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated thermostat data');
        return {
          ...MOCK_DATA.thermostats[0],
          ...data,
          id,
          mode: (data.mode || MOCK_DATA.thermostats[0].mode) as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: (data.fan_mode || MOCK_DATA.thermostats[0].fan_mode) as 'on' | 'auto',
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.put(`${API_URL}/thermostats/${id}/`, data);
      return {
        ...response.data,
        mode: response.data.mode as 'heat' | 'cool' | 'auto' | 'off',
        fan_mode: response.data.fan_mode as 'on' | 'auto'
      };
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated thermostat data after error');
        return {
          ...MOCK_DATA.thermostats[0],
          ...data,
          id,
          mode: (data.mode || MOCK_DATA.thermostats[0].mode) as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: (data.fan_mode || MOCK_DATA.thermostats[0].fan_mode) as 'on' | 'auto',
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  setTemperature: async (id: string, temperature: number): Promise<Thermostat> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostat with updated temperature');
        return {
          ...MOCK_DATA.thermostats[0],
          id,
          target_temperature: temperature,
          mode: MOCK_DATA.thermostats[0].mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: MOCK_DATA.thermostats[0].fan_mode as 'on' | 'auto',
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.post(`${API_URL}/thermostats/${id}/set_temperature/`, {
        target_temperature: temperature
      });
      return {
        ...response.data,
        mode: response.data.mode as 'heat' | 'cool' | 'auto' | 'off',
        fan_mode: response.data.fan_mode as 'on' | 'auto'
      };
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostat with updated temperature after error');
        return {
          ...MOCK_DATA.thermostats[0],
          id,
          target_temperature: temperature,
          mode: MOCK_DATA.thermostats[0].mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: MOCK_DATA.thermostats[0].fan_mode as 'on' | 'auto',
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  setMode: async (id: string, mode: string): Promise<Thermostat> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostat with updated mode');
        return {
          ...MOCK_DATA.thermostats[0],
          id,
          mode: mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: MOCK_DATA.thermostats[0].fan_mode as 'on' | 'auto',
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.post(`${API_URL}/thermostats/${id}/set_mode/`, {
        mode
      });
      return {
        ...response.data,
        mode: response.data.mode as 'heat' | 'cool' | 'auto' | 'off',
        fan_mode: response.data.fan_mode as 'on' | 'auto'
      };
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock thermostat with updated mode after error');
        return {
          ...MOCK_DATA.thermostats[0],
          id,
          mode: mode as 'heat' | 'cool' | 'auto' | 'off',
          fan_mode: MOCK_DATA.thermostats[0].fan_mode as 'on' | 'auto',
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      // Do nothing if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Simulating thermostat deletion');
        return;
      }
      
      await axios.delete(`${API_URL}/thermostats/${id}/`);
    } catch (error) {
      // If in test mode, ignore error
      if (isTestModeActive()) {
        console.log('Test mode active: Ignoring thermostat deletion error');
        return;
      }
      return handleApiError(error);
    }
  }
};

// API functions for schedules
const schedules = {
  getAll: async (): Promise<Schedule[]> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedules data');
        return MOCK_DATA.schedules;
      }
      
      const response = await axios.get(`${API_URL}/schedules/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedules data after error');
        return MOCK_DATA.schedules;
      }
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Schedule> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedule data');
        const schedule = MOCK_DATA.schedules.find(s => s.id === id);
        if (schedule) return schedule;
        return MOCK_DATA.schedules[0]; // Return first mock schedule if ID not found
      }
      
      const response = await axios.get(`${API_URL}/schedules/${id}/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedule data after error');
        return MOCK_DATA.schedules[0];
      }
      return handleApiError(error);
    }
  },
  
  getByThermostat: async (thermostatId: string): Promise<Schedule[]> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedules for thermostat');
        return MOCK_DATA.schedules.filter(s => s.thermostat_id === thermostatId);
      }
      
      const response = await axios.get(`${API_URL}/thermostats/${thermostatId}/schedules/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedules for thermostat after error');
        return MOCK_DATA.schedules.filter(s => s.thermostat_id === thermostatId);
      }
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Schedule>): Promise<Schedule> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created schedule data');
        return {
          ...MOCK_DATA.schedules[0],
          ...data,
          id: `mock-sched-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.post(`${API_URL}/schedules/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created schedule data after error');
        return {
          ...MOCK_DATA.schedules[0],
          ...data,
          id: `mock-sched-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated schedule data');
        return {
          ...MOCK_DATA.schedules[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.put(`${API_URL}/schedules/${id}/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated schedule data after error');
        return {
          ...MOCK_DATA.schedules[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  toggleActive: async (id: string, isActive: boolean): Promise<Schedule> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedule with updated active status');
        return {
          ...MOCK_DATA.schedules[0],
          id,
          is_active: isActive,
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.patch(`${API_URL}/schedules/${id}/`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock schedule with updated active status after error');
        return {
          ...MOCK_DATA.schedules[0],
          id,
          is_active: isActive,
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      // Do nothing if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Simulating schedule deletion');
        return;
      }
      
      await axios.delete(`${API_URL}/schedules/${id}/`);
    } catch (error) {
      // If in test mode, ignore error
      if (isTestModeActive()) {
        console.log('Test mode active: Ignoring schedule deletion error');
        return;
      }
      return handleApiError(error);
    }
  }
};

// API functions for calendars
const calendars = {
  getAll: async (): Promise<Calendar[]> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock calendars data');
        return MOCK_DATA.calendars;
      }
      
      const response = await axios.get(`${API_URL}/calendars/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock calendars data after error');
        return MOCK_DATA.calendars;
      }
      return handleApiError(error);
    }
  },
  
  getById: async (id: string): Promise<Calendar> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock calendar data');
        const calendar = MOCK_DATA.calendars.find(c => c.id === id);
        if (calendar) return calendar;
        return MOCK_DATA.calendars[0]; // Return first mock calendar if ID not found
      }
      
      const response = await axios.get(`${API_URL}/calendars/${id}/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock calendar data after error');
        return MOCK_DATA.calendars[0];
      }
      return handleApiError(error);
    }
  },
  
  getEvents: async (calendarId: string): Promise<CalendarEvent[]> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock calendar events');
        return MOCK_DATA.calendarEvents.filter(e => e.calendar_id === calendarId);
      }
      
      const response = await axios.get(`${API_URL}/calendars/${calendarId}/events/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock calendar events after error');
        return MOCK_DATA.calendarEvents.filter(e => e.calendar_id === calendarId);
      }
      return handleApiError(error);
    }
  },
  
  create: async (data: Partial<Calendar>): Promise<Calendar> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created calendar data');
        return {
          ...MOCK_DATA.calendars[0],
          ...data,
          id: `mock-cal-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.post(`${API_URL}/calendars/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created calendar data after error');
        return {
          ...MOCK_DATA.calendars[0],
          ...data,
          id: `mock-cal-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  createEvent: async (data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created calendar event data');
        return {
          ...MOCK_DATA.calendarEvents[0],
          ...data,
          id: `mock-event-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.post(`${API_URL}/calendar-events/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock created calendar event data after error');
        return {
          ...MOCK_DATA.calendarEvents[0],
          ...data,
          id: `mock-event-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  update: async (id: string, data: Partial<Calendar>): Promise<Calendar> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated calendar data');
        return {
          ...MOCK_DATA.calendars[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.put(`${API_URL}/calendars/${id}/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated calendar data after error');
        return {
          ...MOCK_DATA.calendars[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  updateEvent: async (id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated calendar event data');
        return {
          ...MOCK_DATA.calendarEvents[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      
      const response = await axios.put(`${API_URL}/calendar-events/${id}/`, data);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock updated calendar event data after error');
        return {
          ...MOCK_DATA.calendarEvents[0],
          ...data,
          id,
          updated_at: new Date().toISOString()
        };
      }
      return handleApiError(error);
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      // Do nothing if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Simulating calendar deletion');
        return;
      }
      
      await axios.delete(`${API_URL}/calendars/${id}/`);
    } catch (error) {
      // If in test mode, ignore error
      if (isTestModeActive()) {
        console.log('Test mode active: Ignoring calendar deletion error');
        return;
      }
      return handleApiError(error);
    }
  },
  
  deleteEvent: async (id: string): Promise<void> => {
    try {
      // Do nothing if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Simulating calendar event deletion');
        return;
      }
      
      await axios.delete(`${API_URL}/calendar-events/${id}/`);
    } catch (error) {
      // If in test mode, ignore error
      if (isTestModeActive()) {
        console.log('Test mode active: Ignoring calendar event deletion error');
        return;
      }
      return handleApiError(error);
    }
  }
};

// API functions for business analysis
const businessAnalysis = {
  getAnalytics: async () => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock business analytics data');
        return MOCK_DATA.businessAnalysis.analytics;
      }
      
      const response = await axios.get(`${API_URL}/business-analysis/`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock business analytics data after error');
        return MOCK_DATA.businessAnalysis.analytics;
      }
      return handleApiError(error);
    }
  },
  
  getEnergyUsage: async (timeRange: string) => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock business energy usage data');
        return MOCK_DATA.businessAnalysis.energyUsage;
      }
      
      const response = await axios.get(`${API_URL}/business-analysis/energy-usage/?time_range=${timeRange}`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock business energy usage data after error');
        return MOCK_DATA.businessAnalysis.energyUsage;
      }
      return handleApiError(error);
    }
  },
  
  getCostSavings: async (timeRange: string) => {
    try {
      // Return mock data if in test mode
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock business cost savings data');
        return MOCK_DATA.businessAnalysis.costSavings;
      }
      
      const response = await axios.get(`${API_URL}/business-analysis/cost-savings/?time_range=${timeRange}`);
      return response.data;
    } catch (error) {
      // If in test mode, return mock data even on error
      if (isTestModeActive()) {
        console.log('Test mode active: Returning mock business cost savings data after error');
        return MOCK_DATA.businessAnalysis.costSavings;
      }
      return handleApiError(error);
    }
  }
};

// Export all API functions
export const api = {
  dashboard,
  properties,
  thermostats,
  schedules,
  calendars,
  businessAnalysis
};

// For backward compatibility
export const propertiesApi = properties;
export const thermostatsApi = thermostats;
export const schedulesApi = schedules;
export const calendarsApi = calendars;
export const businessAnalysisApi = businessAnalysis;

export default api;
