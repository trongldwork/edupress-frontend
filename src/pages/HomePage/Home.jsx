import React from "react";
import { css } from "@emotion/react";
import HeroBannerImage from "../../assets/HeroBanner.svg";
import BasePadding from "../../components/BasePadding/BasePadding";
import {
  CategoriesWrapper,
  CategoryHeaderWrapper,
  CoursesHeaderWrapper,
  CoursesWrapper,
  HeroBannerContent,
  HeroBannerWrapper,
} from "./styled";
import {
  Code as CodeIcon,
  Palette as PaletteIcon,
  Chat as ChatIcon,
  Videocam as VideocamIcon,
  CameraAlt as CameraAltIcon,
  BarChart as BarChartIcon,
  Create as CreateIcon,
  MonetizationOn as MonetizationOnIcon,
  Science as ScienceIcon,
  NetworkCheck as NetworkCheckIcon,
} from "@mui/icons-material";
import { Button, Grid2 } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function Home() {
  const user = useSelector((state) => state.user);
  // const navigate = useNavigate();

  const categories = [
    { name: "Art & Design", icon: PaletteIcon },
    { name: "Development", icon: CodeIcon },
    { name: "Communication", icon: ChatIcon },
    { name: "Videography", icon: VideocamIcon },
    { name: "Photography", icon: CameraAltIcon },
    { name: "Marketing", icon: BarChartIcon },
    { name: "Content Writing", icon: CreateIcon },
    { name: "Finance", icon: MonetizationOnIcon },
    { name: "Science", icon: ScienceIcon },
    { name: "Network", icon: NetworkCheckIcon },
  ];

  const {
    data: { courses = [], totalCourses = 0 } = {},
    isPending,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      courseServices.getCourses({
        limit: 6,
      }),
    enabled: true,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false
  });

  return (
    <div
      
    >
      <HeroBannerWrapper>
        <img
          src={HeroBannerImage}
          
        />
        <HeroBannerContent>
          <div
           
          >
            Build Skills with Online Course
          </div>
          <div
           
          >
            We denounce with righteous indignation and dislike men who are so
            beguiled and demoralized that cannot trouble.
          </div>
          <button
            
          >
            Posts comment
          </button>
        </HeroBannerContent>
      </HeroBannerWrapper>
      <BasePadding
        paddingLeftRightPercent={20}
        backgroundColor="white"
        
      >
        <CategoriesWrapper>
          <CategoryHeaderWrapper>Categories</CategoryHeaderWrapper>
          <Grid2
            container
            spacing={3}
            justifyContent="space-between"
            marginTop="20px"
          >
            {categories.map((category) => (
              <Grid2
                item
                xs={6}
                sm={4}
                md={2.4}
                style={{ display: "flex", justifyContent: "center" }}
                key={category.name}
              >
                <div>
                  Name = {category.name}
                  icon = {category.icon}
                </div>
              </Grid2>
            ))}
          </Grid2>
        </CategoriesWrapper>

        <CoursesWrapper>
          <CoursesHeaderWrapper>
            <span
              
            >
              Featured courses
            </span>
            <Button
              
              onClick={() => console.log("All courses")}
            >
              All courses
            </Button>
          </CoursesHeaderWrapper>
          <Grid2 container spacing={3} marginTop="20px">
            {courses?.map((course, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                // temp course card component for testing
                <div style={{ height: "300px", backgroundColor: "yellow" }}/>
              </Grid2>
            ))}
          </Grid2>
        </CoursesWrapper>
      </BasePadding>
    </div>
  );
}

export default Home;
