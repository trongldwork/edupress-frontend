import React, { useEffect, useLayoutEffect, useState } from "react";
import BasePadding from "../../components/BasePadding/BasePadding";
import {
  BreadcrumbWrapper,
  CourseListWrapper,
  HeaderWrapper,
  PageContainer,
} from "./styled";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HorizontalCourseCard from "../../components/CourseCard/HorizontalCourseCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MyCourses() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Homepage
    </Link>,
    <Typography key="2" sx={{ color: "text.primary" }}>
      My Courses
    </Typography>,
  ];

  return (
    <PageContainer>
      <BreadcrumbWrapper>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </BreadcrumbWrapper>
      <BasePadding paddingLeftRightPercent={20}>
        <HeaderWrapper>
          <Typography variant="h4" sx={{ color: "black", fontWeight: "bold" }}>
            My Courses
          </Typography>
        </HeaderWrapper>

        <Box sx={{ display: "flex", gap: 4, marginTop: "20px" }}>
          <CourseListWrapper>
            {isPending ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
              >
                <CircularProgress />
              </Box>
            ) : (
              courses.map((course) => (
                <HorizontalCourseCard key={course._id} course={course} />
              ))
            )}
          </CourseListWrapper>
        </Box>
      </BasePadding>
    </PageContainer>
  );
}

export default MyCourses;
