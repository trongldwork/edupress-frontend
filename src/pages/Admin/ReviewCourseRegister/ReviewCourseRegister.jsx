import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./theme";
import axiosJWT, { handleGetAccessToken } from "../../../services/axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;

const ReviewCourseRegister = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [registrations, setRegistrations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const _accessToken = handleGetAccessToken();
        const response = await axiosJWT.get(
          `${apiUrl}/register-course/admin/registrations`,
          { headers: { Authorization: `Bearer ${_accessToken}` } }
        );
      // Chuyển đổi dữ liệu từ JSON
      const formattedData = response.data.map((item, index) => ({
        _id: item._id,
        index: index + 1, // Thêm số thứ tự
        email: item.userId?.email || "N/A", // Lấy email từ userId
        userName: item.userId?.userName || "N/A", // Lấy userName từ userId
        courseName: item.courseId?.name || "N/A", // Lấy tên khóa học từ courseId
        status: item.status || "Pending", // Trạng thái đăng ký
      }));
      setRegistrations(formattedData);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };
    fetchRegistrations();
  }, []);

  const handleConfirm = (id) => {
    setSelectedAction("confirm");
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCancel = (id) => {
    setSelectedAction("cancel");
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = async () => {
    try {
      const _accessToken = handleGetAccessToken();
      await axiosJWT.patch(
        `${apiUrl}/register-course/admin/registrations/${selectedId}`,
        {
          status: selectedAction === "confirm" ? "Confirmed" : "Cancelled",
        },
        {
          headers: { Authorization: `Bearer ${_accessToken}` },
        }
      );
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === selectedId
            ? {
                ...reg,
                status: selectedAction === "confirm" ? "Confirmed" : "Cancelled",
              }
            : reg
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const columns = [
    { field: "index", headerName: "#", width: 100 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "userName", headerName: "User Name", flex: 1 },
    { field: "courseName", headerName: "Course Name", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        const backgroundColor =
          status === "Confirmed"
            ? colors.greenAccent[600]
            : status === "Cancelled"
            ? colors.redAccent[600]
            : "orange";

        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={backgroundColor}
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]}>{status}</Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        if (row.status === "Confirmed") {
          return (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography
                color={colors.greenAccent[600]}
                fontSize="20px"
                fontWeight="bold"
              >
                ✓
              </Typography>
            </Box>
          );
        } else if (row.status === "Cancelled") {
          return (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography
                color={colors.redAccent[600]}
                fontSize="20px"
                fontWeight="bold"
              >
                ✗
              </Typography>
            </Box>
          );
        } else {
          return (
            <Box display="flex" gap="10px" justifyContent="center">
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleConfirm(row._id)}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleCancel(row._id)}
              >
                Cancel
              </Button>
            </Box>
          );
        }
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%", marginTop: "20px" }}>
      <DataGrid
        rows={registrations}
        columns={columns}
        getRowId={(row) => row._id} // Sử dụng `_id` từ MongoDB làm `id`
        sx={{ height: "100%", width: "100%" }}
      />

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {selectedAction === "confirm" ? "confirm" : "cancel"} this action?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewCourseRegister;
