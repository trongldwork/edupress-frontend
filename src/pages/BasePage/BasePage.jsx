import React, { useState, useEffect } from "react";
import { Fab } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // Icon mũi tên lên

function UserBasePage({ children }) {
    const [showScroll, setShowScroll] = useState(false); // Trạng thái cho FAB hiện/ẩn

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


    // temp footer and header component for testing

    const Header = () => {
        return (
            <div style={{ height: "100px", backgroundColor: "red" }}>
                Header
            </div>
        );
    };
    const Footer = () => {
        return (
            <div style={{ height: "100px", backgroundColor: "blue" }}>
                Footer
            </div>
        );
    };

    const FakeChildren = () => {
        return (
            <div style={{ height: "2000px", backgroundColor: "green" }}>
                Fake Children
            </div>
        );
    };

    // end of temp footer and header component for testing

    return (
        <>
            <Header />
            <FakeChildren />
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
