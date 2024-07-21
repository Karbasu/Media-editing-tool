import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Box, LinearProgress } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

const MergingVideoToVideo = () => {
  const [videoFiles, setVideoFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [mergedVideo, setMergedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideoFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    videoFiles.forEach((file, index) => {
      formData.append(`videos`, file); 
    });

    try {
      const response = await axios.post('http://localhost:5000/merge-multiple-videos', formData, {
        headers: {
          'Content-Type': 'video',
        },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }));
      setMergedVideo(url);
      setMessage('Merging complete! Click the link below to download the merged video.');
    } catch (error) {
      setMessage('Error merging videos. Please try again later.');
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Merge Video to Video
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          Select Videos
          <input type="file" hidden onChange={handleVideoChange} multiple />
        </Button>
        {videoFiles.length > 0 && (
          <Typography variant="body1">
            {videoFiles.length} {videoFiles.length === 1 ? 'file selected' : 'files selected'}
          </Typography>
        )}
        {loading && <LinearProgress />}
        <Button type="submit" variant="contained" color="primary" disabled={loading || videoFiles.length === 0}>
          {loading ? 'Merging...' : 'Upload and Merge'}
        </Button>
      </Box>
      {message && <Typography variant="body1" color={mergedVideo ? "textPrimary" : "error"} sx={{ mt: 2 }}>{message}</Typography>}
      {mergedVideo && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Merged Video:</Typography>
          <video controls width="100%">
            <source src={mergedVideo} type="video/mp4" />
          </video>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            href={mergedVideo}
            download="merged_output.mp4"
          >
            Download Merged Video
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MergingVideoToVideo;
