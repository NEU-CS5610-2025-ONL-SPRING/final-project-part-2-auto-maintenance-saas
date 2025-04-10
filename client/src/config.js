const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  SERVICES: {
    LIST: `${API_BASE_URL}/api/services`,
    CREATE: `${API_BASE_URL}/api/services`,
  },
  VEHICLES: {
    MAKES: `${API_BASE_URL}/api/vehicles/makes`,
    MODELS: (make) => `${API_BASE_URL}/api/vehicles/models/${make}`,
    VIN: (vin) => `${API_BASE_URL}/api/vehicles/vin/${vin}`,
  },
  APPOINTMENTS: {
    LIST: `${API_BASE_URL}/api/appointments`,
    CREATE: `${API_BASE_URL}/api/appointments`,
    TIME_SLOTS: `${API_BASE_URL}/api/appointments/time-slots`,
    ALL: `${API_BASE_URL}/api/appointments/all`,
    STATUS: (id) => `${API_BASE_URL}/api/appointments/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/api/appointments/${id}`,
  },
};
