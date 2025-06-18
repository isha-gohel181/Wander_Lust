//client/src/services/payment.js
import api from "./api";

export const paymentService = {
  createOrder: async ({ bookingId, orderAmount }) => {
    const response = await api.post("/payments/create-order", {
      bookingId,
      orderAmount,
    });
    return response.data;
  },

  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/payments/status/${orderId}`);
    return response.data;
  },
};
