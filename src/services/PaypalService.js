import axiosJWT from "./axiosJWT";

const apiUrl = import.meta.env.VITE_API_URL;

// Tạo order PayPal
export const createPayPalOrder = async ({ amount, currency, accessToken }) => {
  const response = await axiosJWT.post(
    `${apiUrl}/paypal/create-order`,
    {
      amount,
      currency,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data; // Trả về dữ liệu order
};

// Xác nhận thanh toán PayPal
export const capturePayPalOrder = async ({ paymentId, registrationId, accessToken }) => {
  const response = await axiosJWT.post(
    `${apiUrl}/paypal/capture-order/${registrationId}`,
    { paymentId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data; // Trả về dữ liệu xác nhận thanh toán
};
