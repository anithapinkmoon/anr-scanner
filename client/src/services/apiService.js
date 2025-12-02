import api from '../utils/api';

/**
 * Attendee Registration API
 */
export const registerAttendee = async (data) => {
  const response = await api.post('/register', data);
  return response.data;
};

/**
 * QR Code Verification API
 */
export const verifyQRCode = async (code) => {
  const response = await api.get(`/verify?code=${code}`);
  return response.data;
};

/**
 * Admin Authentication APIs
 */
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

/**
 * Dashboard Statistics API
 */
export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

/**
 * Attendees Management APIs
 */
export const getAttendees = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/admin/attendees?${queryParams}`);
  return response.data;
};

export const markAttendeeEntry = async (id) => {
  const response = await api.patch(`/admin/attendees/${id}/mark-entry`);
  return response.data;
};
/**
 * Export APIs
 */
export const exportAttendeesCSV = async () => {
  const response = await api.get('/admin/export/csv', {
    responseType: 'blob',
  });
  return response.data;
};

export const exportAttendeesPDF = async () => {
  const response = await api.get('/admin/export/pdf', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Helper function to download blob files
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

