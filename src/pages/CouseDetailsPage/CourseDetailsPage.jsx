import React, { useState, useEffect } from "react";
import {
  Breadcrumbs,
  css,
  Link,
  Typography,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  CircularProgress,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  BreadcrumbWrapper,
  CategoryName,
  CoureInfoWrapper,
  CourseRegisterCard,
  HeaderReviewWrapper,
  HeroBannerWrapper,
  InfoWrapper,
  ReviewsWrapper,
  ReviewWrapper,
  SubInfo,
  SubInfoWrapper,
  TabMenu,
  TabPanelItem,
  VideoInfoWrapper,
  VideoTitleWrapper,
} from "./styled";
import {
  NavigateNext,
  ExpandMore,
  AccessTime,
  School,
  SignalCellularAlt,
  PlayLesson,
  Delete,
} from "@mui/icons-material";
import BasePadding from "../../components/BasePadding/BasePadding";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import DOMPurify from "dompurify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courseServices from "../../services/courseServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import courseReviewService from "../../services/courseReviewService";
import { handleGetAccessToken } from "../../services/axiosJWT";
import { useSelector } from "react-redux";
import registerCourseService from "../../services/registerCourseService";
import lessonService from "../../services/lessonService";
import VideoDialog from "../../components/Video/VideoDialog";

function CourseDetailsPage() {
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const { urlSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("1");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState({});



  const accessToken = handleGetAccessToken();

  const { data: course, isPending } = useQuery({
    queryKey: ["course", urlSlug],
    queryFn: () => courseServices.getCourse(urlSlug),
    enabled: !!urlSlug,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { data: reviews, isPending: isPendingReviews } = useQuery({
    queryKey: ["reviews", course?.urlSlug],
    queryFn: () => courseReviewService.getReviewsByCourse(course?._id),
    enabled: !!course,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { data: registration, isPendingGetRegistration } = useQuery({
    queryKey: ["registration", user?.userName, course?._id],
    queryFn: () =>
      registerCourseService.getRegistration(user?.accessToken, course?._id),
    enabled: !!user?.accessToken && !!course?._id,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { data: lessons = [], isPendingGetLessons } = useQuery({
    queryKey: ["lessons", user?.userName, course?._id],
    queryFn: () =>
      lessonService.getLessons(user?.accessToken || "", course?._id),
    enabled: !!course?._id,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { mutate: mutateCreateReview, isPending: isPendingCreateReview } =
    useMutation({
      mutationFn: (reviewData) =>
        courseReviewService.postReview(accessToken, reviewData),
      onSuccess: () => {
        queryClient.invalidateQueries(["reviews", course?.urlSlug]);
        setRating(0);
        setComment("");
      },
      onError: (error) => {
        console.log("Error submitting review:", error);
      },
    });

  const { mutate: mutateDeleteReview, isPending: isPendingDeleteReview } =
    useMutation({
      mutationFn: (reviewId) =>
        courseReviewService.deleteReview(accessToken, reviewId),
      onSuccess: () => {
        queryClient.invalidateQueries(["reviews", course?.urlSlug]);
      },
      onError: (error) => {
        console.log("Error delete review:", error);
      },
    });

  const { mutate: mutateRegisterCourse, isPending: isPendingRegisterCourse } =
    useMutation({
      mutationFn: () =>
        registerCourseService.registerCourse(accessToken, course?._id),
      onError: (error) => {
        console.log("Error registered course:", error);
      },
    });

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();

    mutateCreateReview({
      courseId: course?._id,
      rating,
      review: comment,
    });
  };

  const handleOpenVideoDialog = (video) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  const handleCloseVideoDialog = () => {
    setSelectedVideo(null);
    setVideoDialogOpen(false);
  };

  const handleClickOpenDialog = (reviewId) => {
    setSelectedReviewId(reviewId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReviewId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedReviewId) {
      mutateDeleteReview(selectedReviewId);
    }
    handleCloseDialog();
  };

  const handleRegisterCourse = () => {
    if (!user?.accessToken) {
      const returnUrl = encodeURIComponent(location.pathname); // Lấy đường dẫn hiện tại làm returnUrl
      navigate(`/sign-in?returnUrl=${returnUrl}`);
    } else {
      const currentPath = location.pathname + location.search;
      navigate("/payment", {
        state: {
          courseId: course?._id,
          courseName: course?.name,
          coursePrice: course?.discountPrice ?? course?.price,
          returnUrl: currentPath,
        },
      });
    }
  };
  
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Homepage
    </Link>,
    <Link underline="hover" key="1" color="inherit" href="/courses">
      Courses
    </Link>,
    <Typography key="2" sx={{ color: "text.primary" }}>
      {course?.name}
    </Typography>,
  ];

  const cleanCourseDescription = DOMPurify.sanitize(course?.description);

  useEffect(() => {
    const completed = {};
    lessons?.forEach((lesson) => {
      lesson?.videos?.forEach((video) => {
        const localStorageKey = `video-${video?.url}`;
        const watchedTime = parseFloat(localStorage.getItem(localStorageKey)) || 0;
        const duration = video?.duration || "0:00"; // Default to "0:00" if duration is not provided

        // Split the duration string into an array
        const durationArray = duration.split(":").map(Number);

        // Calculate the total duration in seconds
        const durationInSeconds = durationArray.reduceRight((acc, time, index, arr) => {
          return acc + time * Math.pow(60, arr.length - 1 - index);
        }, 0);
        if (watchedTime / durationInSeconds >= 0.8) {
          completed[video?.url] = true;
        }
      });
    });
    setCompletedVideos(completed);
  }, [lessons]);


  return (
    <div
      css={css`
        background-color: white;
        padding-bottom: 50px;
        display: flex;
        flex-direction: column;
      `}
    >
      {isPending ||
        isPendingReviews ||
        isPendingCreateReview ||
        isPendingDeleteReview ||
        isPendingGetRegistration ||
        isPendingGetLessons ? (
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          `}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <BreadcrumbWrapper>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </BreadcrumbWrapper>

          <CoureInfoWrapper>
            <HeroBannerWrapper>
              <InfoWrapper>
                <CategoryName>{course?.category}</CategoryName>
                <h1 style={{ color: "white" }}>{course?.name}</h1>
                <SubInfoWrapper>
                  <SubInfo>
                    <School color="primary" />{" "}
                    <span>{course?.students} Students</span>
                  </SubInfo>
                  <SubInfo>
                    <SignalCellularAlt color="primary" />{" "}
                    <span>{course?.level}</span>
                  </SubInfo>
                  <SubInfo>
                    <PlayLesson color="primary" />{" "}
                    <span>{lessons?.length} Lessons</span>
                  </SubInfo>
                </SubInfoWrapper>
              </InfoWrapper>
              <CourseRegisterCard>
                <div style={{ backgroundColor: "gray" }}>
                  <img src={course?.image} alt={course?.name} />
                </div>
                {(!registration ||
                  ["Pending", "Cancelled"].includes(registration?.status)) && (
                  <div style={{ padding: "10%" }}>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "20px",
                          alignItems: "center",
                        }}
                      >
                        {course?.discountPrice !== null &&
                          course?.discountPrice !== undefined && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ textDecoration: "line-through" }}
                            >
                              ${course?.price.toFixed(2)}
                            </Typography>
                          )}
                        <Typography
                          component="span"
                          color={
                            course?.discountPrice === 0 ? "green" : "primary"
                          }
                          sx={{ fontSize: "20px", fontWeight: "bold" }}
                        >
                          {course?.discountPrice !== null &&
                          course?.discountPrice !== undefined
                            ? course?.discountPrice === 0
                              ? "Free"
                              : `$${course?.discountPrice}`
                            : `$${course?.price}`}
                        </Typography>
                      </Box>
                      {["Pending"].includes(
                        registration?.status
                      ) && (
                        <Button
                          sx={{
                            borderRadius: "20px",
                            backgroundColor: "#FF782D",
                            color: "white",
                            fontWeight: "500",
                            padding: "5px 20px",
                            cursor: "default",
                          }}
                        >
                          Wait for admin to confirm
                        </Button>
                      )}
                      {(!registration || (["Cancelled"].includes(registration?.status))) &&
                        <Button
                          sx={{
                            borderRadius: "20px",
                            backgroundColor: "#FF782D",
                            color: "white",
                            fontWeight: "500",
                            padding: "5px 20px",
                          }}
                          onClick={handleRegisterCourse}
                        >
                          Register
                        </Button>
                      }
                    </div>
                  </div>
                )}
              </CourseRegisterCard>
            </HeroBannerWrapper>

            <BasePadding paddingLeftRightPercent={20}>
              <TabContext value={selectedTab}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    marginTop: "50px",
                  }}
                >
                  <TabList
                    sx={{ borderRadius: "10px" }}
                    onChange={handleChangeTab}
                  >
                    <TabMenu label="Overview" value="1" />
                    <TabMenu label="Curriculum" value="2" />
                    <TabMenu label="Reviews" value="3" />
                  </TabList>
                </Box>
                <TabPanelItem value="1">
                  <div
                    style={{ color: "#555555" }}
                    dangerouslySetInnerHTML={{
                      __html: cleanCourseDescription,
                    }}
                  />
                </TabPanelItem>
                <TabPanelItem value="2">
                  <div style={{ color: "#555555" }}>
                    {lessons?.map((lesson) => (
                      <Accordion key={lesson?._id}>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography>{lesson?.title}</Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom width='50%'
                            textAlign='left' paddingLeft='20px'>{lesson?.description}</Typography>
                        </AccordionSummary>

                        <AccordionDetails
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                          }}
                        >

                          {lesson?.videos?.map((video) => (
                            <VideoInfoWrapper key={video?.url || video?.title}>
                              <VideoTitleWrapper>
                                <PlayLesson />
                                <span >
                                  {video?.duration} {' - '}
                                  {video?.title}{" "}
                                  {completedVideos[video?.url] && (
                                    <Typography component="span" sx={{ fontSize: "0.85rem", color: "green", fontWeight: "bold", ml: 1 }}>
                                      Completed ✔️
                                    </Typography>
                                  )}
                                </span>


                              </VideoTitleWrapper>
                              {video?.url && (
                                <Button
                                  variant="text"
                                  onClick={() => handleOpenVideoDialog(video)}
                                >
                                  Watch
                                </Button>

                              )}
                            </VideoInfoWrapper>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                </TabPanelItem>
                <TabPanelItem value="3">
                  <ReviewsWrapper>
                    {reviews?.map((review) => {
                      const timeReview = new Date(review?.updatedAt);
                      return (
                        <ReviewWrapper key={review?._id}>
                          <HeaderReviewWrapper>
                            <div className="name-wrapper">
                              <span className="user-name">
                                {review?.userId?.name || review?.userId?.email}
                              </span>
                              <Rating
                                name="read-only"
                                value={review?.rating}
                                readOnly
                              />
                            </div>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <div className="time">
                                {timeReview.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "2-digit",

                                  hour: "2-digit",
                                  minute: "2-digit",

                                })}
                              </div>
                              {review?.userId?.email === user?.email && (
                                <IconButton
                                  aria-label="delete"
                                  onClick={() =>
                                    handleClickOpenDialog(review._id)
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </Box>
                          </HeaderReviewWrapper>
                          <div className="review">{review?.review}</div>
                        </ReviewWrapper>
                      );
                    })}
                  </ReviewsWrapper>
                </TabPanelItem>
              </TabContext>
              {user?.accessToken && (
                <Box
                  component="form"
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                  }}
                  onSubmit={handleSubmitComment}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: "black", fontWeight: "500" }}
                  >
                    Leave a comment
                  </Typography>
                  <Rating
                    name="course-rating"
                    defaultValue={0}
                    value={rating}
                    size="large"
                    required
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                  />

                  <TextField
                    label="Comment"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                    fullWidth
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        handleSubmitComment(e);
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ alignSelf: "flex-start", mt: 2, color: "white" }}
                  >
                    Post Comment
                  </Button>
                </Box>
              )}
            </BasePadding>
          </CoureInfoWrapper>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Confirm to delete review?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure to delete this review?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ color: "gray" }}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <VideoDialog
            open={videoDialogOpen}
            onClose={handleCloseVideoDialog}
            videoUrl={selectedVideo?.url}
            title={selectedVideo?.title}
          />

        </>
      )}
    </div>
  );
}

export default CourseDetailsPage;
