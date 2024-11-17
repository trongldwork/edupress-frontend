import React, { useState, useEffect } from "react";
import UserHeader from "../../components/HeaderNavBar/UserHeader";
import Footer from "../../components/Footer/Footer";
import { Fab } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // Icon mũi tên lên
import { useLocation } from "react-router-dom";

function UserBasePage({ children }) {
  const [showScroll, setShowScroll] = useState(false); // Trạng thái cho FAB hiện/ẩn
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScroll(true); // Hiện FAB khi cuộn qua 300px
      } else {
        setShowScroll(false); // Ẩn FAB khi cuộn ít hơn 300px
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup sự kiện khi component unmount
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang mượt mà
  };

  return (
    <>
      <UserHeader />
      {children}
      <Footer />

      {/* FAB - Nút cuộn lên đầu trang */}
      {showScroll && (
        <Fab
          color="info"
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 1000,
          }}
        >
          <ArrowUpwardIcon />
        </Fab>
      )}
    </>
  );
}

export default UserBasePage;
