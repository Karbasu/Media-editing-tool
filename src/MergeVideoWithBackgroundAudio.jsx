import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Box, LinearProgress, Slider } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

const MergeVideoWithBackgroundAudio = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [backgroundAudioFile, setBackgroundAudioFile] = useState(null);
  const [audioLevel, setAudioLevel] = useState(50);
  const [message, setMessage] = useState('');
  const [mergedVideo, setMergedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleBackgroundAudioChange = (e) => {
    setBackgroundAudioFile(e.target.files[0]);
  };

  const handleAudioLevelChange = (e, value) => {
    setAudioLevel(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('audio', backgroundAudioFile);
    formData.append('audioLevel', audioLevel); 
  
    try {
      const response = await axios.post('http://localhost:5000/merge-video-background-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }));
      setMergedVideo(url);
      setMessage('Merging complete! Click the link below to download the merged video.');
    } catch (error) {
      setMessage('Error merging video with background audio. Please try again later.');
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Merge Video with Background Audio
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" component="label" startIcon={<UploadFile />}>
          Select Video
          <input type="file" hidden onChange={handleVideoChange} accept="video/*" />
        </Button>
        {videoFile && <Typography variant="body1">Video selected: {videoFile.name}</Typography>}
        <Button variant="contained" component="label" startIcon={<UploadFile />}>
          Select Background Audio
          <input type="file" hidden onChange={handleBackgroundAudioChange} accept="audio/*" />
        </Button>
        {backgroundAudioFile && <Typography variant="body1">Background audio selected: {backgroundAudioFile.name}</Typography>}
        
        <Typography variant="body1">Set Background Audio Level</Typography>
        <Slider
          value={audioLevel}
          onChange={handleAudioLevelChange}
          aria-labelledby="audio-level-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
        />
        
        {loading && <LinearProgress />}
        <Button type="submit" variant="contained" color="primary" disabled={!videoFile || !backgroundAudioFile || loading}>
          {loading ? 'Merging...' : 'Merge Video'}
        </Button>
      </Box>
      {message && <Typography variant="body1" color={mergedVideo ? "textPrimary" : "error"} sx={{ mt: 2 }}>{message}</Typography>}
      {mergedVideo && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Merged Video:</Typography>
          <video controls width="100%">
            <source src={mergedVideo} type="video/mp4" />
          </video>
          <Button variant="outlined" sx={{ mt: 2 }} href={mergedVideo} download="merged_output.mp4">
            Download Merged Video
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MergeVideoWithBackgroundAudio;
