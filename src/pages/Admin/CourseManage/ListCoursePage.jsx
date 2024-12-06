import {
  Box,
  Button,
  Stack,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashBoardLayout from "../../../components/Layouts/DashBoardLayout";
import React, { useEffect, useState } from "react";
import courseServices from "../../../services/courseServices";
import CourseFormDialog from "./CourseFormDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQuery } from "@tanstack/react-query";
import { handleGetAccessToken } from "../../../services/axiosJWT";
import CourseEditDialog from "./CourseEditDialog";

function ListCoursePage() {
  const [courses, setCourses] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  console.log(courses);
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { data: coursesData = [], refetch: refetchCourses } = useQuery({
    queryKey: ["courses", "admin"],
    queryFn: async () => {
      const response = await courseServices.getCourses({
        page: 1,
        limit: Infinity,
      });
      return response.courses;
    },
  });

  useEffect(() => {
    if (coursesData) {
      setCourses(coursesData);
    }
  }, [coursesData]);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (course) => {
    setCourseToEdit(course);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setCourseToEdit(null);
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setOpenDeleteDialog(true);
  };

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId) => {
      const accessToken = handleGetAccessToken();
      return await courseServices.deleteCourse(courseId, accessToken);
    },
    onSuccess: (response, courseId) => {
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c._id !== courseId)
      );
      handleShowSnackbar("Course deleted successfully", "success");
      refetchCourses();
    },
    onError: (error) => {
      handleShowSnackbar(
        error.response?.data?.message || "Failed to delete course",
        "error"
      );
    },
  });

  // Hàm gọi mutation khi xác nhận xóa
  const confirmDelete = async () => {
    if (courseToDelete) {
      deleteCourseMutation.mutate(courseToDelete._id);
    }
    setOpenDeleteDialog(false);
    setCourseToDelete(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCourseToDelete(null);
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
      headerName: "ID",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Course Name",
      headerAlign: "center",
      flex: 5,
    },
    {
      field: "description",
      headerName: "Description",
      headerAlign: "center",
      flex: 3,
    },
    {
      field: "category",
      headerName: "Category",
      align: "center",
      headerAlign: "center",
      flex: 3,
    },
    {
      field: "level",
      headerName: "Level",
      flex: 3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      align: "center",
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "discountPrice",
      headerName: "Sale Price",
      align: "center",
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenEditDialog(params.row)}
            >
              <EditIcon
                sx={{
                  fontSize: 20,
                  color: "primary.main",
                }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row)}
            >
              <DeleteIcon
                sx={{
                  fontSize: 20,
                  color: "error.main",
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = courses?.map((course, index) => ({
    id: index + 1,
    _id: course._id,
    name: course.name,
    image: course.image,
    description: course.description,
    category: course.category,
    level: course.level,
    price: course.price,
    discountPrice: course.discountPrice,
  }));

  return (
    <Box>
      <Stack direction="row" justifyContent={"flex-end"} mb={2}>
        <Button variant="contained" onClick={handleOpenAddDialog}>
          Add Course
        </Button>
      </Stack>

      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
      </Box>

      <CourseFormDialog
        open={openAddDialog}
        handleClose={handleCloseDialog}
        courseServices={courseServices}
        refetchCourses={refetchCourses}
      />

      <CourseEditDialog
        open={openEditDialog}
        handleClose={handleCloseDialog}
        courseServices={courseServices}
        refetchCourses={refetchCourses}
        initialData={courseToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this course? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}

export default ListCoursePage;
