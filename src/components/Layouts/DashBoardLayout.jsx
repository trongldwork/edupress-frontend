import { Box, Card, Stack } from "@mui/material";
import { Button } from "@mui/material";
import { Divider } from "@mui/material";
import { Toolbar } from "@mui/material";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";

import React, { useEffect } from "react";
import { routes } from "../../routes";
import { useLocation, useNavigate } from "react-router-dom";
import UserHeader from "../HeaderNavBar/UserHeader";
import { handleGetAccessToken } from "../../services/axiosJWT";
import { jwtDecode } from "jwt-decode";

function DashBoardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = handleGetAccessToken();
    const decoded = jwtDecode(accessToken);
    if(decoded?.role !== "Admin") {
      navigate("/");
    }
  }, [])

  return (
    <>
      <UserHeader />
      <Stack
        direction="row"
        height={"calc(100vh - 72px)"}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          overflow: "auto",
        })}
      >
        <Card
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            {routes
              .filter((item) => item.showInDashBoardLayout == true)
              .map((item, index) => (
                <ListItem key={item.path} disablePadding>
                  <Button
                    onClick={() => navigate(item.path)}
                    fullWidth
                    variant={location.pathname == item.path ? "contained" : ""}
                  >
                    <ListItemText primary={item.title} />
                  </Button>
                </ListItem>
              ))}
          </List>
        </Card>

        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Stack>
    </>
  );
}

export default DashBoardLayout;
