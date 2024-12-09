import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Box } from "@mui/material";
import { People, School, Feedback, PersonAdd } from "@mui/icons-material";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import userServices from "../../services/userServices";
import registerCourseService from "../../services/registerCourseService";
import courseServices from "../../services/courseServices";
import courseReviewService from "../../services/courseReviewService";
import { handleGetAccessToken } from "../../services/axiosJWT";

// Cấu hình Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// Mock Data
const mockData = {
  monthlyRegistrations: [30, 40, 50, 60, 80, 90, 100, 110, 120, 130, 140, 150],
  userGrowth: [10, 20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 200]
};

// Biểu đồ đăng ký theo tháng
const registrationChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "New Registrations",
      data: mockData.monthlyRegistrations,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

// Biểu đồ tăng trưởng người dùng
const userGrowthChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "User Growth",
      data: mockData.userGrowth,
      fill: false,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

// Thẻ thống kê
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card elevation={3} sx={{ display: "flex", alignItems: "center", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: color,
          color: "#fff",
          borderRadius: "50%",
          width: 50,
          height: 50,
          mr: 2,
        }}
      >
        <Icon />
      </Box>
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function AdminHomePage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const accessToken = handleGetAccessToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { totalUsers } = await userServices.getTotalUsers(accessToken);
        const { totalRegistrations } = await registerCourseService.getTotalRegistrations(accessToken);
        const { totalCourses } = await courseServices.getTotalCourses(accessToken);
        const { totalReviews } = await courseReviewService.getTotalReviews(accessToken);
        setTotalUsers(totalUsers);
        setTotalRegistrations(totalRegistrations);
        setTotalCourses(totalCourses);
        setTotalReviews(totalReviews);
      } catch (error) {
        console.log("Failed to fetch total users:", error);
      }
    };
    
    fetchData();
  }, [accessToken]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Users */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={totalUsers} icon={People} color="blue" />
        </Grid>
        {/* Registrations */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Registrations" value={totalRegistrations} icon={PersonAdd} color="green" />
        </Grid>
        {/* Courses */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Courses" value={totalCourses} icon={School} color="orange" />
        </Grid>
        {/* Feedbacks */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Feedbacks Received" value={totalReviews} icon={Feedback} color="red" />
        </Grid>
      </Grid>

      {/* Biểu đồ đăng ký */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Registrations
              </Typography>
              <Bar data={registrationChartData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ tăng trưởng người dùng */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Growth Over Time
              </Typography>
              <Line data={userGrowthChartData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminHomePage;
