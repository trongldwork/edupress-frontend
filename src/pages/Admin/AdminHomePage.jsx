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

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

function getLastNDaysDates(n) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates.reverse();
}

const last10Days = getLastNDaysDates(10);

function AdminHomePage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const accessToken = handleGetAccessToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { users } = await userServices.getUsers();
        const  allRegistration  = await registerCourseService.getRegistrations();
        const { totalUsers } = await userServices.getTotalUsers(accessToken);
        const { totalRegistrations } = await registerCourseService.getTotalRegistrations(accessToken);
        const { totalCourses } = await courseServices.getTotalCourses(accessToken);
        const { totalReviews } = await courseReviewService.getTotalReviews(accessToken);
        setTotalUsers(totalUsers);
        setTotalRegistrations(totalRegistrations);
        setTotalCourses(totalCourses);
        setTotalReviews(totalReviews);
        setUsers(users);
        setRegistrations(allRegistration);
      } catch (error) {
        console.log("Failed to fetch total users:", error);
      }
    };

    fetchData();
  }, [accessToken]);


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
  const filterDataByDate = (data, dateField) => {
    return last10Days.map(date => {
      return data.filter(item => item[dateField].startsWith(date)).length;
    });
  };

  const newUsersLast10Days = filterDataByDate(users, "createdAt");
  const newRegistrationsLast10Days = filterDataByDate(registrations, "createdAt");

  // Biểu đồ đăng ký theo tháng
  const registrationChartData = {
    labels: last10Days,
    datasets: [
      {
        label: "Daily Registrations",
        data: newRegistrationsLast10Days,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Biểu đồ tăng trưởng người dùng
  const userGrowthChartData = {
    labels: last10Days,
    datasets: [
      {
        label: "User Growth",
        data: newUsersLast10Days,
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

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
                Daily Registrations (Last 10 Days)
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
                User Growth (Last 10 Days)
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