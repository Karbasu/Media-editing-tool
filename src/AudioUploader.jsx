import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Box, LinearProgress, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

const AudioUploader = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [mergedAudio, setMergedAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'audio/mp3' }));
      setMergedAudio(url);
      setMessage('Merging complete! Click the link below to download the merged audio.');
    } catch (error) {
      setMessage('Error uploading or merging files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Upload and Merge Audio Files</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          Select Files
          <input type="file" hidden multiple onChange={handleFileChange} />
        </Button>
        <List>
          {Array.from(files).map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
        {loading && <LinearProgress />}
        <Button type="submit" variant="contained" color="primary" disabled={loading || files.length === 0}>
          Upload and Merge
        </Button>
      </Box>
      {message && <Typography variant="body1" color="error" sx={{ mt: 2 }}>{message}</Typography>}
      {mergedAudio && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Merged Audio:</Typography>
          <audio controls>
            <source src={mergedAudio} type="audio/mp3" />
          </audio>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            href={mergedAudio}
            download="merged_output.mp3"
          >
            Download Merged Audio
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default AudioUploader;
