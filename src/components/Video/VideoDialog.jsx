import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Slider, Typography, Menu, MenuItem } from "@mui/material";
import ReactPlayer from "react-player";
import { PlayArrow, Pause, VolumeUp, VolumeOff, Fullscreen, FullscreenExit, Speed } from "@mui/icons-material";

const VideoDialog = ({ open, onClose, videoUrl, title }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // 0 to 1 range
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [totalPlayTime, setTotalPlayTime] = useState(0); // Tổng thời gian xem thực tế
  const [playbackRate, setPlaybackRate] = useState(1); // Tốc độ phát
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the speed menu
  const [showVolumeSlider, setShowVolumeSlider] = useState(false); // Điều khiển hiển thị slider âm lượng khi hover nút âm lượng
  const [sliderTimeout, setSliderTimeout] = useState(null); // Timeout để ẩn slider sau 0.25s không hover

  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const volumeSliderRef = useRef(null); // Thêm ref cho slider âm lượng

  // Reset states when videoUrl changes
  useEffect(() => {
    // Reset all states when video changes
    setPlaying(false);
    setMuted(false);
    setVolume(0.5);
    setCurrentTime(0);
    setTotalPlayTime(0);
    setIsFullScreen(false);
    setPlaybackRate(1); // Reset playback speed
  }, [videoUrl]);

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleSeekChange = (event, newValue) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newValue);
    }
  };

  const handleProgress = (state) => {
    const elapsedTime = state.playedSeconds;
    setCurrentTime(elapsedTime);

    // Cộng thời gian xem vào tổng thời gian chỉ khi video đang chạy
    if (playing) {
      setTotalPlayTime(prevTime => prevTime + 1); // Cộng thời gian thực tế
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if (videoContainerRef.current.mozRequestFullScreen) { /* Firefox */
        videoContainerRef.current.mozRequestFullScreen();
      } else if (videoContainerRef.current.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        videoContainerRef.current.webkitRequestFullscreen();
      } else if (videoContainerRef.current.msRequestFullscreen) { /* IE/Edge */
        videoContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // Tính toán điều kiện hiển thị "Hoàn thành"
  const isCompleted = totalPlayTime > (playerRef.current?.getDuration() * 0.8);

  // Mở menu tốc độ phát
  const handleSpeedClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSpeedClose = () => {
    setAnchorEl(null);
  };

  const handleSpeedSelect = (rate) => {
    setPlaybackRate(rate);
    setAnchorEl(null);
  };

  // Hiển thị slider âm lượng khi hover lên nút âm lượng
  const handleVolumeHover = () => {
    setShowVolumeSlider(true);
    if (sliderTimeout) {
      clearTimeout(sliderTimeout); // Clear existing timeout if any
    }
  };

  // Ẩn slider sau 0.25s không có sự kiện hover
  const handleVolumeLeave = () => {
    setSliderTimeout(setTimeout(() => setShowVolumeSlider(false), 500)); // Ẩn slider sau 0.25s
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" >
      
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {videoUrl ? (
          <div ref={videoContainerRef} 
          style={{ position: 'relative', width: '100%', height: '400px', 
          pointerEvents: "none", overflowY:'hidden'}}>
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={playing}
              muted={muted}
              volume={volume}
              playbackRate={playbackRate} // Tốc độ phát
              width="100%"
              height="100%"
              controls={false} // Disable default player controls
              onProgress={handleProgress}
            />
          </div>
        ) : (
          <p>No video available</p>
        )}
      </DialogContent>

      <div style={{ position: 'relative', padding: '10px', paddingTop: 0, paddingBottom: 0 }}>
        <Slider
          value={currentTime}
          min={0}
          max={playerRef.current?.getDuration() || 0}
          onChange={handleSeekChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={togglePlayPause} color="primary">
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>

            {/* Hiển thị slider âm lượng khi hover lên nút muted */}
            <IconButton
              onClick={toggleMute}
              color="primary"
              onMouseEnter={handleVolumeHover}
              onMouseLeave={handleVolumeLeave}
            >
              {muted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>

            {/* Hiển thị slider âm lượng nếu đang hover */}
            {showVolumeSlider && !muted && (
              <Slider
                ref={volumeSliderRef}
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onMouseLeave={handleVolumeLeave} // Ẩn slider khi rời khỏi slider
                onMouseEnter={() => clearTimeout(sliderTimeout)} // Clear timeout khi hover vào slider
                onChange={handleVolumeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => Math.round(value * 100)}
                style={{ width: '100px', marginLeft: '10px' }} // Chiều rộng nhỏ cho slider âm lượng
              />
            )}

            {/* Nút điều chỉnh tốc độ phát */}
            <IconButton onClick={handleSpeedClick} color="primary" style={{ marginLeft: '10px' }}>
              <Speed />
            </IconButton>

            <Typography variant="caption" color="textSecondary" style={{ marginLeft: '10px' }}>
              {playbackRate}x
            </Typography>

            {/* Menu chọn tốc độ phát */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSpeedClose}
            >
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

        {/* Hiển thị tổng thời gian xem thực tế */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
          <Typography variant="caption" color="textSecondary">
            Total Time Played: {formatTime(totalPlayTime)}
          </Typography>

          {/* Hiển thị "Hoàn thành" nếu totalPlayTime > 80% duration */}
          {isCompleted && (
            <Typography variant="body2" color="success.main">
              Hoàn thành
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
