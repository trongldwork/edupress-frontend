import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import courseServices from '../../services/courseServices';
import lessonServices from '../../services/lessonService';
import { handleGetAccessToken } from '../../services/axiosJWT';
import { use } from 'react';

const EditCourseDetails = () => {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const accessToken = handleGetAccessToken();

  const [editingLesson, setEditingLesson] = useState(null);
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState(false);
  const [editLessonDialogOpen, setEditLessonDialogOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch course data
  const { data: course, isLoading: isLoadingCourse, isError: isCourseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseServices.getCourseById(courseId, accessToken),
    enabled: !!courseId,
  });

  // Fetch lessons for the course
  const { data: lessons, isLoading: isLoadingLessons, isError: isLessonsError } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => lessonServices.getLessons(accessToken, courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (course) {
      setTitle(course.name || '');
      setDescription(course.description || '');
    }
  }, [course]);

  const { mutate: updateCourseMutation, isLoading: isUpdating } = useMutation({
    mutationFn: (updatedCourse) => courseServices.updateCourse(courseId, updatedCourse, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
      setSnackbarMessage('Course updated successfully');
      setShowSnackbar(true);
    },
    onError: (error) => {
      console.log('Error updating course:', error);
      setSnackbarMessage('Error updating course');
      setShowSnackbar(true);
    }
  });

  const { mutate: saveLessonMutation } = useMutation({
    mutationFn: (lesson) => lessonServices.updateLesson(accessToken, lesson._id, lesson),
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
      setEditLessonDialogOpen(false);
      setSnackbarMessage('Lesson saved successfully');
      setShowSnackbar(true);
    },
    onError: (error) => {
      console.log('Error saving lesson:', error);
      setSnackbarMessage('Error saving lesson');
      setShowSnackbar(true);
    }
  });

  const { mutate: addLessonMutation } = useMutation({
    mutationFn: (lesson) => lessonServices.createLesson(accessToken, { ...lesson, courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
      setAddLessonDialogOpen(false);
      setSnackbarMessage('Lesson added successfully');
      setShowSnackbar(true);
    },
    onError: (error) => {
      console.log('Error adding lesson:', error);
      setSnackbarMessage('Error adding lesson');
      setShowSnackbar(true);
    }
  });

  const { mutate: deleteLessonMutation } = useMutation({
    mutationFn: (lessonId) => lessonServices.deleteLesson(accessToken, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
      setSnackbarMessage('Lesson deleted successfully');
      setShowSnackbar(true);
    },
    onError: (error) => {
      console.log('Error deleting lesson:', error);
      setSnackbarMessage('Error deleting lesson');
      setShowSnackbar(true);
    }
  });

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'description') setDescription(value);
  };

  const openAddLessonDialog = () => {
    setEditingLesson({ title: '', description: '', order: '', videos: [] });
    setAddLessonDialogOpen(true);
  };

  const openEditLessonDialog = (lesson) => {
    setEditingLesson(lesson);
    setEditLessonDialogOpen(true);
  };

  const saveLesson = () => {
    saveLessonMutation({ ...editingLesson, courseId });
  };

  const addLesson = () => addLessonMutation(editingLesson);

  const deleteLesson = (lessonId) => deleteLessonMutation(lessonId);

  const openVideoDialog = (lesson, video = null) => {
    setEditingLesson(lesson);
    setEditingVideo(video || { title: '', url: '', duration: '' });
    setVideoDialogOpen(true);
  };

  const saveVideo = () => {
    const updatedVideos = editingLesson.videos.map((v) =>
      v._id === editingVideo._id ? editingVideo : v
    );
    const updatedLesson = { ...editingLesson, videos: updatedVideos };
    saveLessonMutation(updatedLesson);
    setVideoDialogOpen(false);
  };

  const addVideo = () => {
    const newVideo = { ...editingVideo};
    const updatedLesson = { ...editingLesson, videos: [...editingLesson.videos, newVideo] };
    saveLessonMutation(updatedLesson);
    setVideoDialogOpen(false);
  };

  const deleteVideo = (lesson, videoId) => {
    const updatedLesson = {
      ...lesson,
      videos: lesson.videos.filter((v) => v._id !== videoId),
    };
    saveLessonMutation(updatedLesson);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCourseMutation({...course, name: title, description: description});
  };

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isCourseError || isLessonsError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">Error loading course or lesson data</Typography>
      </Box>
    );
  }
  
  

  return (
    <Paper sx={{ padding: 4, margin: 4 }} elevation={3}>
      <Typography variant="h4" gutterBottom>
        Edit Course Detail
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Title"
              name="title"
              value={title}
              onChange={handleCourseChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Description"
              name="description"
              value={description}
              onChange={handleCourseChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Lessons
            </Typography>
            {lessons.map((lesson) => (
              <Box
                key={lesson._id}
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle1">{lesson.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {lesson.description}
                </Typography>
                <Box>
                  {lesson.videos.map((video) => (
                    <Box
                      key={video._id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {video.title} - {video.duration}
                      </Typography>
                      <Box>
                        <IconButton
                          onClick={() => openVideoDialog(lesson, video)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteVideo(lesson, video._id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Button
                  size="small"
                  onClick={() => openVideoDialog(lesson)}
                  startIcon={<Add />}
                >
                  Add Video
                </Button>
                <Box sx={{ marginTop: 1 }}>
                  <Button
                    size="small"
                    onClick={() => openEditLessonDialog(lesson)}
                    startIcon={<Edit />}
                  >
                    Edit Lesson
                  </Button>
                  <Button
                    size="small"
                    onClick={() => deleteLesson(lesson._id)}
                    startIcon={<Delete />}
                    color="error"
                  >
                    Delete Lesson
                  </Button>
                </Box>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={openAddLessonDialog}
            >
              Add Lesson
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Save Course
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Add Lesson Dialog */}
      <Dialog open={addLessonDialogOpen} onClose={() => setAddLessonDialogOpen(false)}>
        <DialogTitle>Add Lesson</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lesson Title"
            name="title"
            value={editingLesson?.title || ''}
            onChange={(e) =>
              setEditingLesson((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
          <TextField
            fullWidth
            label="Lesson Description"
            name="description"
            value={editingLesson?.description || ''}
            onChange={(e) =>
              setEditingLesson((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
          <TextField
            fullWidth
            label="Order"
            name="order"
            value={editingLesson?.order || ''}
            onChange={(e) =>
              setEditingLesson((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddLessonDialogOpen(false)}>Cancel</Button>
          <Button onClick={addLesson} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={editLessonDialogOpen} onClose={() => setEditLessonDialogOpen(false)}>
        <DialogTitle>Edit Lesson</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lesson Title"
            name="title"
            value={editingLesson?.title || ''}
            onChange={(e) =>
              setEditingLesson((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
          <TextField
            fullWidth
            label="Lesson Description"
            name="description"
            value={editingLesson?.description || ''}
            onChange={(e) =>
              setEditingLesson((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
          <TextField
            disabled
            fullWidth
            label="Order"
            name="order"
            value={editingLesson?.order || ''}
            onChange={(e) =>
              setEditingLesson((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditLessonDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveLesson} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onClose={() => setVideoDialogOpen(false)}>
        <DialogTitle>
          {editingVideo?._id ? 'Edit Video' : 'Add Video'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Video Title"
            name="title"
            value={editingVideo?.title || ''}
            onChange={(e) =>
              setEditingVideo((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
          <TextField
            fullWidth
            label="Video URL"
            name="url"
            value={editingVideo?.url || ''}
            onChange={(e) =>
              setEditingVideo((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={editingVideo?.duration || ''}
            onChange={(e) =>
              setEditingVideo((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoDialogOpen(false)}>Cancel</Button>
          <Button onClick={editingVideo?._id ? saveVideo : addVideo} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EditCourseDetails;