import {
  TableContainer,
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Card,
  TableBody,
  Checkbox,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashBoardLayout from "../../../components/Layouts/DashBoardLayout";
import React, { useEffect, useState } from "react";
import courseServices from "../../../services/courseServices";
import CourseFormDialog from "./CourseFormDialog";

function ListCoursePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [open, setOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    getAllCourse();
  }, []);

  const getAllCourse = async () => {
    try {
      const data = await courseServices.getCourses();
      setCourses(data.courses);
    } catch (error) {
      handleShowSnackbar("Lỗi tải danh sách khóa học", "error");
    }
  };

  const handleAddCourse = async (courseData) => {
    try {
      // Gọi API để tạo khóa học mới
      const newCourse = await courseServices.createCourse(courseData);

      // Cập nhật danh sách khóa học ngay trên giao diện
      setCourses((prevCourses) => [...prevCourses, newCourse]);

      // Đóng dialog và hiển thị thông báo thành công
      setOpen(false);
      handleShowSnackbar("Thêm khóa học thành công", "success");
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo lỗi
      handleShowSnackbar("Lỗi thêm khóa học", "error");
    }
  };

  const handleShowSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "STT",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên khoá học",
      width: 200,
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 200,
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Danh mục",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "level",
      headerName: "Cấp độ",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Giá",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "discountPrice",
      headerName: "Giá Sale",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
  ];

  const rows = courses.map((course, index) => ({
    id: index + 1,
    name: course.name,
    description: course.description,
    category: course.category,
    level: course.level,
    price: course.price,
    discountPrice: course.discountPrice,
  }));

  return (
    <Box>
      <Stack direction="row" justifyContent={"flex-end"} mb={2}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Course
        </Button>
      </Stack>

      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) => {
            setSelectedCourses(newSelection);
          }}
        />
      </Box>

      <CourseFormDialog
        open={open}
        handleClose={() => setOpen(false)}
        courseServices={courseServices}
        onSubmit={handleAddCourse}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* <Dialog open={open}>
        <DialogTitle>Form thêm mới khoá học</DialogTitle>
        <DialogContent>
          <Stack spacing={2} p={2}>
            <TextField label="Tên khoá học" />
            <TextField label="Danh mục" />
            <TextField label="Cấp độ" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(false);
            }}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              alert("tính năng đang phát triển");
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
}

export default ListCoursePage;
