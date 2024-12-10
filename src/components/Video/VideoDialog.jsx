import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Slider, Typography, Menu, MenuItem } from "@mui/material";
import ReactPlayer from "react-player";
import { PlayArrow, Pause, VolumeUp, VolumeOff, Fullscreen, FullscreenExit, Speed } from "@mui/icons-material";

const VideoDialog = ({ open, onClose, videoUrl, title }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [sliderTimeout, setSliderTimeout] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const volumeSliderRef = useRef(null);

  const localStorageKey = `video-${videoUrl}`;

  // Load totalPlayTime từ localStorage khi videoUrl thay đổi
  useEffect(() => {
    const savedTime = localStorage.getItem(localStorageKey);
    setTotalPlayTime(savedTime ? parseInt(savedTime, 10) : 0);
    setPlaying(false);
    setMuted(false);
    setVolume(0.5);
    setCurrentTime(0);
    setIsFullScreen(false);
    setPlaybackRate(1);
  }, [videoUrl]);

  const videoDuration = playerRef.current?.getDuration() || 999999;

  // Lưu totalPlayTime vào localStorage khi giá trị thay đổi
  useEffect(() => {
    localStorage.setItem(localStorageKey, totalPlayTime);
  }, [totalPlayTime]);
  // set isCompleted khi totalPlayTime > 0.8 duration

  useEffect(() => {
    if (totalPlayTime > 0.8 * videoDuration) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [totalPlayTime]);
  const togglePlayPause = () => setPlaying(!playing);

  const toggleMute = () => setMuted(!muted);

  const handleVolumeChange = (event, newValue) => setVolume(newValue);

  const handleSeekChange = (event, newValue) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newValue);
    }
  };

  const handleProgress = (state) => {
    const elapsedTime = state.playedSeconds;
    setCurrentTime(elapsedTime);

    if (playing) {
      setTotalPlayTime((prevTime) => prevTime + 1); // Cộng thời gian xem mỗi giây
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if (videoContainerRef.current.mozRequestFullScreen) {
        videoContainerRef.current.mozRequestFullScreen();
      } else if (videoContainerRef.current.webkitRequestFullscreen) {
        videoContainerRef.current.webkitRequestFullscreen();
      } else if (videoContainerRef.current.msRequestFullscreen) {
        videoContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleSpeedClick = (event) => setAnchorEl(event.currentTarget);

  const handleSpeedClose = () => setAnchorEl(null);

  const handleSpeedSelect = (rate) => {
    setPlaybackRate(rate);
    setAnchorEl(null);
  };

  const handleVolumeHover = () => {
    setShowVolumeSlider(true);
    if (sliderTimeout) clearTimeout(sliderTimeout);
  };

  const handleVolumeLeave = () =>
    setSliderTimeout(setTimeout(() => setShowVolumeSlider(false), 500));

  
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        style={{overflowY:'hidden'}}
      >
        {videoUrl ? (
          <div
            ref={videoContainerRef}
            style={{
              position: "relative",
              width: "100%",
              height: "400px",
              pointerEvents: "none",
              overflowY: "hidden",
            }}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={playing}
              muted={muted}
              volume={volume}
              playbackRate={playbackRate}
              width="100%"
              height="100%"
              controls={false}
              onProgress={handleProgress}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    fs: 0,
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>No video available</p>
        )}
      </DialogContent>

      <div
        style={{
          position: "relative",
          padding: "10px",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Slider
          value={currentTime}
          min={0}
          max={playerRef.current?.getDuration() || 0}
          onChange={handleSeekChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 0 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={togglePlayPause} color="primary">
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>

            <IconButton
              onClick={toggleMute}
              color="primary"
              onMouseEnter={handleVolumeHover}
              onMouseLeave={handleVolumeLeave}
            >
              {muted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>

            {showVolumeSlider && !muted && (
              <Slider
                ref={volumeSliderRef}
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onMouseLeave={handleVolumeLeave}
                onMouseEnter={() => clearTimeout(sliderTimeout)}
                onChange={handleVolumeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => Math.round(value * 100)}
                style={{ width: "100px", marginLeft: "10px" }}
              />
            )}

            <IconButton onClick={handleSpeedClick} color="primary" style={{ marginLeft: "10px" }}>
              <Speed />
            </IconButton>

            <Typography variant="caption" color="textSecondary" style={{ marginLeft: "10px" }}>
              {playbackRate}x
            </Typography>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSpeedClose}>
              <MenuItem onClick={() => handleSpeedSelect(1)}>1x</MenuItem>
              <MenuItem onClick={() => handleSpeedSelect(1.5)}>1.5x</MenuItem>
              <MenuItem onClick={() => handleSpeedSelect(2)}>2x</MenuItem>
            </Menu>

            <IconButton onClick={toggleFullScreen} color="primary">
              {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </div>
          <Typography variant="caption" color="textSecondary">
            {formatTime(currentTime)} / {formatTime(playerRef.current?.getDuration() || 0)}
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "10px",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            Total Time Played: {formatTime(totalPlayTime)}
          </Typography>

          {isCompleted && (
            <Typography variant="body2" color="success.main">
              Completed 🎉 
            </Typography>
          )}
        </div>
      </div>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoDialog;
