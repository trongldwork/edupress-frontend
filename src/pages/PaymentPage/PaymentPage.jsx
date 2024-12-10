import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import registerCourseService from "../../services/registerCourseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleGetAccessToken } from "../../services/axiosJWT";
import { useSelector } from "react-redux";
import {
  Container,
  PaymentBox,
  PaymentMethodContainer,
  TransferDetails,
} from "./styled";
import myQR from "../../assets/MyQR.jpg";
import {
  capturePayPalOrder,
  createPayPalOrder,
} from "../../services/PaypalService";

const paypalClientID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const accessToken = handleGetAccessToken();

  const { courseId, courseName, coursePrice, returnUrl } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Mutation for course registration
  const registerCourseMutation = useMutation({
    mutationFn: () =>
      registerCourseService.registerCourse(accessToken, courseId),
    onError: (error) => {
      setAlertMessage("Failed to register course. Please try again.");
      setAlertSeverity("error");
    },
  });

  const { isPending } = registerCourseMutation;

  const handleRegisterCourse = async () => {
    if (!!accessToken && !!courseId && coursePrice >= 0) {
      try {
        const registrationData = await registerCourseMutation.mutateAsync();
        setAlertMessage("Course registration successful!");
        setAlertSeverity("success");
        return registrationData;
      } catch (error) {
        setAlertMessage("Failed to register course. Please try again.");
        setAlertSeverity("error");
      }
    }
  };

  // PayPal payment processing
  const createPayPalOrderMutation = useMutation({
    mutationFn: (data) => {
      return createPayPalOrder(data);
    },
    onError: () => {
      setAlertMessage("Failed to create PayPal order. Please try again.");
      setAlertSeverity("error");
    },
  });

  const capturePayPalOrderMutation = useMutation({
    mutationFn: (data) => {
      return capturePayPalOrder(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registration", user?.userName, courseId]);
      setAlertMessage("PayPal paid successfully!");
      setAlertSeverity("success");
    },
    onError: () => {
      setAlertMessage("Failed to capture PayPal payment. Please try again.");
      setAlertSeverity("error");
    },
  });

  const handleCreatePayPalOrder = async () => {
    if (!!accessToken && !!courseId && coursePrice >= 0) {
      const data = await createPayPalOrderMutation.mutateAsync({
        amount: coursePrice,
        currency: "USD",
        accessToken,
      });

      return data.id;
    }
  };

  const handleApprovePayPalOrder = async (data) => {
    try {
      const registrationData = await handleRegisterCourse(); // Wait for registration

      if (registrationData?._id) {
        await capturePayPalOrderMutation.mutateAsync({
          paymentId: data.orderID,
          registrationId: registrationData._id,
          accessToken,
        });
        setTimeout(() => {
          navigate(returnUrl, { replace: true });
        }, 5000);
      } else {
        setAlertMessage("Cannot create registration!");
        setAlertSeverity("error");
      }
    } catch (error) {
      setAlertMessage("Error processing PayPal payment.");
      setAlertSeverity("error");
    }
  };

  return (
    <Container>
      <PaymentBox>
        <h1 style={{ color: "#FF782D" }}>Payment for {courseName}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            padding: "10px 20px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              color: "#666",
              marginRight: "10px",
            }}
          >
            Price:
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: coursePrice === 0 ? "green" : "red",
            }}
          >
            {coursePrice === 0 ? "Free" : `$${coursePrice}`}{" "}
          </Typography>
        </div>

        {/* Show buttons only if coursePrice is not 0 */}
        {coursePrice !== 0 && (
          <PaymentMethodContainer>
            <h3>Select Payment Method</h3>
            <Button
              variant={paymentMethod === "transfer" ? "contained" : "outlined"}
              onClick={() => setPaymentMethod("transfer")}
            >
              Bank Transfer
            </Button>
            <Button
              variant={paymentMethod === "paypal" ? "contained" : "outlined"}
              onClick={() => setPaymentMethod("paypal")}
            >
              PayPal
            </Button>
          </PaymentMethodContainer>
        )}

        {alertMessage && (
          <Snackbar
            open={true}
            autoHideDuration={5000}
            onClose={() => setAlertMessage(null)}
          >
            <Alert
              onClose={() => setAlertMessage(null)}
              severity={alertSeverity}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        )}

        {paymentMethod === "paypal" && (
          <PayPalScriptProvider
            options={{
              clientId: paypalClientID,
              components: "buttons",
              currency: "USD",
            }}
          >
            <PayPalButtons
              createOrder={handleCreatePayPalOrder}
              onApprove={handleApprovePayPalOrder}
            />
          </PayPalScriptProvider>
        )}

        {paymentMethod === "transfer" && (
          <TransferDetails>
            <h4>Bank Transfer Details</h4>
            <p>Account Name: PHAM TUAN TRUNG</p>
            <p>Account Number: 0975853235</p>
            <p>Bank Name: MB Bank</p>
            <img src={myQR} alt="QR Code" width="80%" />
          </TransferDetails>
        )}

        {/* Only show the Register Course button if the course price is 0 */}
        {(coursePrice === 0 || paymentMethod == "transfer") && (
          <Button
            variant="contained"
            color="primary"
            style={{color: 'white'}}
            onClick={async () => {
              await handleRegisterCourse();
              setTimeout(() => {
                navigate(returnUrl, { replace: true });
              }, 3000);
            }}
            disabled={isPending}
          >
            {isPending ? <CircularProgress size={24} /> : "Register course"}
          </Button>
        )}
      </PaymentBox>
    </Container>
  );
}

export default PaymentPage;
