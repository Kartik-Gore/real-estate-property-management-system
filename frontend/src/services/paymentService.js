import api from './api';

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payments/my');
    return response.data;
  },

  getOwnerPayments: async () => {
    const response = await api.get('/payments/owner');
    return response.data;
  },

  getAllPayments: async () => {
    const response = await api.get('/payments/all');
    return response.data;
  },

  getPaymentByBooking: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  }
};
