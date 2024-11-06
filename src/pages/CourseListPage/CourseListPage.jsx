import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import BasePadding from "../../components/BasePadding/BasePadding";
import {
  BreadcrumbWrapper,
  CourseListWrapper,
  HeaderWrapper,
  PageContainer,
} from "./styled";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Pagination,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HorizontalCourseCard from "../../components/CourseCard/HorizontalCourseCard";
import { useSearchParams } from "react-router-dom";
import courseServices from "../../services/courseServices";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../../utils/useDebounce";

function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const searchDebounce = useDebounce(searchTerm, 3000);
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.getAll("category") || []
  );
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.getAll("price") || []
  );
  const [selectedReview, setSelectedReview] = useState(
    searchParams.getAll("review").map(Number) || []
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.getAll("level") || []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  const queryKey = [
    "courses",
    searchDebounce,
    sortOrder,
    selectedCategory,
    selectedPrice,
    selectedReview,
    selectedLevel,
    currentPage,
    coursesPerPage
  ];
  const {
    data: { courses = [], totalCourses = 0 } = {},
    isPending,
  } = useQuery({
    queryKey,
    queryFn: () =>
      courseServices.getCourses({
        search: searchDebounce,
        sort: sortOrder,
        category: selectedCategory,
        price: selectedPrice,
        review: selectedReview,
        level: selectedLevel,
        page: currentPage,
        limit: coursesPerPage,
      }),
    enabled: true,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchDebounce);
    if (sortOrder) params.set("sort", sortOrder);
    if (selectedCategory.length)
      params.set("category", selectedCategory.join(","));
    if (selectedPrice.length) params.set("price", selectedPrice.join(","));
    if (selectedReview.length) params.set("review", selectedReview.join(","));
    if (selectedLevel.length) params.set("level", selectedLevel.join(","));

    setSearchParams(params);
  }, [
    searchDebounce,
    sortOrder,
    selectedCategory,
    selectedPrice,
    selectedReview,
    selectedLevel
  ]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Homepage
    </Link>,
    <Typography key="2" sx={{ color: "text.primary" }}>
      Courses
    </Typography>,
  ];

  const categories = [
    { name: "Art & Design" },
    { name: "Development" },
    { name: "Communication" },
    { name: "Videography" },
    { name: "Photography" },
    { name: "Marketing" },
    { name: "Content Writing" },
    { name: "Finance" },
    { name: "Science" },
    { name: "Network" },
  ];

  const levels = [
    { name: "All levels", count: 15 },
    { name: "Beginner", count: 15 },
    { name: "Intermediate", count: 15 },
    { name: "Expert", count: 15 },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (event) => {
    const price = event.target.value;
    setSelectedPrice((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const handleLevelChange = (event) => {
    const level = event.target.name;
    setSelectedLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Cập nhật trang hiện tại
  };
  
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
            All Courses
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Search Box */}
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 300 }}
              slotProps={{
                input: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Sort Dropdown */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOrder}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="name-asc">Name Ascending</MenuItem>
                <MenuItem value="name-desc">Name Descending</MenuItem>
                <MenuItem value="price-asc">Price Ascending</MenuItem>
                <MenuItem value="price-desc">Price Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </HeaderWrapper>

        <Box sx={{ display: "flex", gap: 4, marginTop: "20px" }}>
          {/* Filter Component */}
          <Box sx={{ flex: 1, width: "30%" }}>
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, color: "black", fontWeight: 600 }}
            >
              Filter
            </Typography>

            {/* Category Filter */}
            <Typography
              variant="subtitle1"
              sx={{ color: "black", fontWeight: 600 }}
            >
              Course Category
            </Typography>
            <FormGroup>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.name}
                  control={
                    <Checkbox
                      checked={selectedCategory.includes(category.name)}
                      onChange={handleCategoryChange}
                      name={category.name}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#555555" }}>
                      {`${category.name}`}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>

            {/* Price Filter */}
            <Typography
              variant="subtitle1"
              sx={{ marginTop: 2, color: "black", fontWeight: 600 }}
            >
              Price
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPrice.includes("free")}
                    onChange={handlePriceChange}
                    value="free"
                  />
                }
                label={<Typography sx={{ color: "#555555" }}>Free</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPrice.includes("paid")}
                    onChange={handlePriceChange}
                    value="paid"
                  />
                }
                label={<Typography sx={{ color: "#555555" }}>Paid</Typography>}
              />
            </FormGroup>
            {/* Level Filter */}
            <Typography
              variant="subtitle1"
              sx={{ marginTop: 2, color: "black", fontWeight: 600 }}
            >
              Level
            </Typography>
            <FormGroup>
              {levels.map((level) => (
                <FormControlLabel
                  key={level.name}
                  control={
                    <Checkbox
                      checked={selectedLevel.includes(level.name)}
                      onChange={handleLevelChange}
                      name={level.name}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#555555" }}>
                      {`${level.name}`}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {/* Course List */}
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

            {/* Pagination */}
            {courses.length && (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
              >
                <Pagination
                  count={Math.ceil(totalCourses / coursesPerPage)} // Tính số lượng trang
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  color="primary"
                />
              </Box>
            )}
          </CourseListWrapper>
        </Box>
      </BasePadding>
    </PageContainer>
  );
}

export default CoursesPage;
