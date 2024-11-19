// Import các thành phần từ React và MUI (Material-UI) để xây dựng giao diện
import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// Import các biểu tượng (icons) từ thư viện MUI Icons
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Assignment } from "@mui/icons-material";

// Import các hooks từ React Router và Redux
import { useNavigate } from "react-router-dom"; // Điều hướng giữa các trang
import userServices from "../../services/userServices"; // Dịch vụ liên quan đến người dùng
import { useDispatch } from "react-redux"; // Dispatch hành động để thay đổi state Redux
import { resetUser } from "../../redux/userStore"; // Hành động để reset thông tin người dùng

// Component hiển thị menu tài khoản cho người dùng
export default function AccountMenu({ user }) {
  // State quản lý phần tử HTML mà menu sẽ gắn vào (anchor element)
  const [anchorEl, setAnchorEl] = React.useState(null); 
  const open = Boolean(anchorEl); // Xác định xem menu có mở hay không
  const navigate = useNavigate(); // Hook dùng để chuyển hướng trang
  const dispatch = useDispatch(); // Hook để gửi hành động tới Redux store

  // Xử lý khi nhấn vào nút mở menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Đặt phần tử làm điểm neo cho menu
  };

  // Xử lý khi đóng menu
  const handleClose = () => {
    setAnchorEl(null); // Hủy bỏ phần tử neo và đóng menu
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await userServices.logoutUser(); // Gọi API đăng xuất
    localStorage.removeItem("access_token"); // Xóa token khỏi localStorage
    dispatch(resetUser()); // Reset thông tin người dùng trong Redux
    navigate('/'); // Chuyển hướng về trang chủ
  };

  // Xử lý khi điều hướng đến trang hồ sơ cá nhân
  const handleToProfile = async () => {
    navigate(`/user/profile`); // Chuyển hướng đến trang hồ sơ
  };

  const handleToAdmin = async () => {
    navigate(`/admin/dashboard`); // Chuyển hướng đến trang hồ sơ
  };

  return (
    <React.Fragment>
      {/* Vùng chứa avatar và nút mở menu */}
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings"> {/* Tooltip khi hover vào avatar */}
          <IconButton
            onClick={handleClick} // Mở menu khi nhấn
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined} // Điều khiển menu
            aria-haspopup="true" // Cho biết nút có mở menu hay không
            aria-expanded={open ? "true" : undefined} // Mở rộng menu nếu đang mở
          >
            {/* Hiển thị avatar người dùng hoặc ký tự đầu tiên trong email nếu không có avatar */}
            {user?.avatarUrl ? (
              <Avatar sx={{ width: 32, height: 32 }} src={user?.avatarUrl} />
            ) : (
              <Avatar sx={{ width: 32, height: 32, bgcolor: "orange" }}>
                {user?.email[0]?.toUpperCase()}
              </Avatar>
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Menu tài khoản */}
      <Menu
        anchorEl={anchorEl} // Neo menu vào phần tử được chọn
        id="account-menu"
        open={open} // Kiểm tra trạng thái mở
        onClose={handleClose} // Đóng menu khi nhấn ra ngoài
        onClick={handleClose} // Đóng menu sau khi chọn mục
        slotProps={{
          paper: {
            elevation: 0, // Không đổ bóng mặc định
            sx: {
              overflow: "visible", // Cho phép tràn nội dung
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))", // Đổ bóng cho menu
              mt: 1.5, // Khoảng cách trên
              "& .MuiAvatar-root": {
                width: 32, height: 32, ml: -0.5, mr: 1, // Avatar trong menu
              },
              "&::before": { // Mũi tên chỉ lên menu
                content: '""',
                display: "block",
                position: "absolute",
                top: 0, right: 14,
                width: 10, height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }} // Gốc xoay khi mở menu
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }} // Gốc neo
      >
        {/* Mục vào trang hồ sơ */}
        <MenuItem onClick={handleToProfile}>
          <Avatar sx={{ bgcolor: "green" }} /> Profile
        </MenuItem>
        
        <Divider /> {/* Đường kẻ phân cách */}

        {/* Mục quản lý hệ thống chỉ hiện với người dùng Admin */}
        {user?.role === "Admin" && (
          <MenuItem onClick={handleToAdmin}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Manage system
          </MenuItem>
        )}

        {/* Mục vào danh sách khóa học của tôi */}
        <MenuItem onClick={() => { navigate('/my-courses'); }}>
          <ListItemIcon>
            <Assignment fontSize="small" sx={{ color: "orange" }} />
          </ListItemIcon>
          My courses
        </MenuItem>

        {/* Mục đăng xuất */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "red" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}