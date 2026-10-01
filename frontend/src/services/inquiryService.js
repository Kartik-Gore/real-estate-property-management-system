import api from './api';

export const inquiryService = {
  createInquiry: async (inquiryData) => {
    const response = await api.post('/inquiries', inquiryData);
    return response.data;
  },

  getMyInquiries: async () => {
    const response = await api.get('/inquiries/my');
    return response.data;
  },

  getOwnerInquiries: async () => {
    const response = await api.get('/inquiries/owner');
    return response.data;
  },

  getAllInquiries: async () => {
    const response = await api.get('/inquiries/all');
    return response.data;
  },

  replyToInquiry: async (id, responseText) => {
    const response = await api.put(`/inquiries/${id}/reply`, { response: responseText });
    return response.data;
  },

  closeInquiry: async (id) => {
    const response = await api.put(`/inquiries/${id}/close`);
    return response.data;
  }
};
