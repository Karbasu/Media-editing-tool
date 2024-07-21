import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Typography,
  Box,
  LinearProgress,
  TextField,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";

const TrimVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [trimmedVideo, setTrimmedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let videoDuration = await calculateDuration(startTime, endTime);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("startTime", startTime);
    formData.append("endTime", videoDuration);

    try {
      const response = await axios.post(
        "http://localhost:5000/trim-video",
        formData,
        {
          headers: {
            "Content-Type": "video",
          },
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" })
      );
      setTrimmedVideo(url);
      setMessage(
        "Trimming complete! Click the link below to download the trimmed video."
      );
    } catch (error) {
      setMessage("Error trimming video. Please try again later.");
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trim Video
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          Select Video
          <input
            type="file"
            hidden
            onChange={handleVideoChange}
            accept="video/*"
          />
        </Button>
        {videoFile && (
          <Typography variant="body1">
            Video selected: {videoFile.name}
          </Typography>
        )}

        <TextField
          label="Start Time (HH:MM:SS)"
          value={startTime}
          onChange={handleStartTimeChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="End Time (HH:MM:SS)"
          value={endTime}
          onChange={handleEndTimeChange}
          variant="outlined"
          fullWidth
        />

        {loading && <LinearProgress />}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!videoFile || !startTime || !endTime || loading}
        >
          {loading ? "Trimming..." : "Trim Video"}
        </Button>
      </Box>
      {message && (
        <Typography
          variant="body1"
          color={trimmedVideo ? "textPrimary" : "error"}
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
      {trimmedVideo && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Trimmed Video:</Typography>
          <video controls width="100%">
            <source src={trimmedVideo} type="video/mp4" />
          </video>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            href={trimmedVideo}
            download="trimmed_output.mp4"
          >
            Download Trimmed Video
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default TrimVideo;

async function calculateDuration(startTime, endTime) {
  const startParts = startTime.split(":").map(Number);
  const endParts = endTime.split(":").map(Number);

  const startSeconds =
    startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
  const endSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];

  const durationSeconds = endSeconds - startSeconds;

  if (durationSeconds < 0) {
    throw new Error("End time must be after start time");
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = (durationSeconds % 3600) % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}
