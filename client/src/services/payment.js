//client/src/services/payment.js
import api from "./api";

export const paymentService = {
  createOrder: async ({ bookingId, orderAmount }) => {
    const response = await api.post("/payment/create-order", {
      bookingId,
      orderAmount,
    });
    return response.data;
  },

  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/payment/status/${orderId}`);
    return response.data;
  },
};
