import React, { useState } from "react";
import { Box, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./theme";
import { mockDataTeam } from "./mockData"; // Mock data dùng để test giao diện data-grid

const ReviewCourseRegister = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State để kiểm soát Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Hàm xử lý khi nhấn Confirm hoặc Cancel
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

  const handleDialogConfirm = () => {
    if (selectedAction === "confirm") {
      const record = mockDataTeam.find((item) => item.id === selectedId);
      if (record) {
        record.access = "confirmed"; // Thay đổi trạng thái trong mockData
      }
    } else if (selectedAction === "cancel") {
      const record = mockDataTeam.find((item) => item.id === selectedId);
      if (record) {
        record.access = "cancelled"; // Thay đổi trạng thái trong mockData
      }
    }

    setOpenDialog(false); // Đóng dialog sau khi xác nhận
  };

  const columns = [
    {
      field: "index",
      headerName: "#",
      width: 100,
      renderCell: (params) => {
        return <Typography>{params.row.id}</Typography>;
      },
    },
    { field: "id", headerName: "Email" },
    {
      field: "name",
      headerName: "User Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Course ID",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Course Name",
      flex: 1,
    },
    {
      field: "access",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        let backgroundColor;
        if (access === "confirmed") {
          backgroundColor = colors.greenAccent[600];
        } else if (access === "cancelled") {
          backgroundColor = colors.redAccent[600];
        } else {
          backgroundColor = "orange";
        }
  
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
            <Typography color={colors.grey[100]}>{access}</Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        if (row.access === "confirmed") {
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
        } else if (row.access === "cancelled") {
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
                onClick={() => handleConfirm(row.id)}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleCancel(row.id)}
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
    <Box sx={{ width: "100%", height: "100%", marginTop: '20px' }}>
      <Box
        m={0}
        p={0}
        height="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
          "& .MuiCheckbox-root": {
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-row:focus": {
            outline: "none",
          },
        }}
      >
        <DataGrid
          rows={mockDataTeam}
          columns={columns}
          sx={{
            height: "100%",
            width: "100%",
          }}
        />
      </Box>

      {/* Dialog xác nhận */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedAction === "confirm" ? "confirm" : "cancel"} this action?
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
