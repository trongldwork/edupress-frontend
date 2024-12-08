import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  LinearProgress,
  Stack,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import userAPI from "../../../services/userServices";

function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editUser, setEditUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newUserDialog, setNewUserDialog] = useState(false);

  const [snackbars, setSnackbars] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [search, sortOrder, users]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      setUsers(response.users);
      enqueueSnackbar("Users fetched successfully", "success");
    } catch (error) {
      console.error("Error fetching users:", error);
      enqueueSnackbar(
        `Error fetching users: ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
  };

  const enqueueSnackbar = (message, severity = "success") => {
    const newSnackbar = {
      id: new Date().getTime(),
      message,
      severity,
      progress: 100,
    };

    setSnackbars((prev) => [...prev, newSnackbar]);

    const progressInterval = setInterval(() => {
      setSnackbars((prev) =>
        prev.map((sb) => {
          if (sb.id === newSnackbar.id) {
            const newProgress = Math.max(0, sb.progress - 10);
            if (newProgress === 0) {
              clearInterval(progressInterval);
              closeSnackbar(sb.id); // Đóng sau khi hoàn tất
            }
            return { ...sb, progress: newProgress };
          }
          return sb;
        })
      );
    }, 200);
  };

  const closeSnackbar = (id) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = () => {
    if (users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    let result = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const aValue = a[sortColumn]?.toString().toLowerCase() || "";
      const bValue = b[sortColumn]?.toString().toLowerCase() || "";
      if (sortOrder === "asc") return aValue.localeCompare(bValue);
      return bValue.localeCompare(aValue);
    });

    setFilteredUsers(result);
  };

  const handleSaveUser = async (user) => {
    try {
      if (user._id) {
        await userAPI.editUserProfile(user);
        enqueueSnackbar("User updated successfully", "success");
      } else {
        user.password = "123456";
        await userAPI.createUser(user);
        enqueueSnackbar("User created successfully", "success");
      }
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      enqueueSnackbar(
        `Error saving user: ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
    setOpenEditDialog(false);
    setNewUserDialog(false);
  };

  const handleDeleteUser = async (id) => {
    try {
      await userAPI.deleteUser(id);
      enqueueSnackbar("User deleted successfully", "success");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      enqueueSnackbar(
        `Error deleting user: ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "white", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Stack
        direction="row"
        display="flex"
        justifyContent="space-between"
        mb={2}
      >
        <TextField
          label="Search by name"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditUser({ userName: "", email: "", name: "", role: "User" });
            setNewUserDialog(true);
          }}
        >
          Add User
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setSortColumn("userName");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Username{" "}
                  {sortColumn === "userName"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setSortColumn("email");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Email{" "}
                  {sortColumn === "email"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setSortColumn("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Full Name{" "}
                  {sortColumn === "name"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setSortColumn("role");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Role{" "}
                  {sortColumn === "role"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditUser(user);
                        setOpenEditDialog(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setEditUser(user);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            margin="dense"
            value={editUser?.userName || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, userName: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Email"
            margin="dense"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Full Name"
            margin="dense"
            value={editUser?.name || ""}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <Select
            fullWidth
            value={editUser?.role || "User"}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button color="primary" onClick={() => handleSaveUser(editUser)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newUserDialog} onClose={() => setNewUserDialog(false)}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            margin="dense"
            value={editUser?.userName || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, userName: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Email"
            margin="dense"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Full Name"
            margin="dense"
            value={editUser?.name || ""}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <Select
            fullWidth
            value={editUser?.role || "User"}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserDialog(false)}>Cancel</Button>
          <Button color="primary" onClick={() => handleSaveUser(editUser)}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user `{editUser?.name}`?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={() => handleDeleteUser(editUser._id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={true}
          autoHideDuration={2000}
          onClose={() => closeSnackbar(snackbar.id)}
          sx={{
            mb: `${snackbars.indexOf(snackbar) * 60}px`,
            transition: "margin-bottom 0.3s ease-in-out",
            zIndex: snackbars.length - snackbars.indexOf(snackbar),
          }}
        >
          <Alert
            onClose={() => closeSnackbar(snackbar.id)}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              position: "relative",
              paddingBottom: "4px", // Thêm padding để chừa chỗ cho progress bar
            }}
          >
            {snackbar.message}
            <LinearProgress
              variant="determinate"
              value={snackbar.progress || 100}
              sx={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                height: "4px", // Làm mỏng progress bar
                backgroundColor: "transparent",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: (theme) =>
                    snackbar.severity === "error"
                      ? theme.palette.error.main
                      : snackbar.severity === "warning"
                        ? theme.palette.warning.main
                        : snackbar.severity === "info"
                          ? theme.palette.info.main
                          : theme.palette.success.main,
                },
              }}
            />
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}

export default UserManagePage;
