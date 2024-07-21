// // src/components/MergingVideoWithAudio.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, Container, Typography, Box, LinearProgress } from '@mui/material';
// import { UploadFile } from '@mui/icons-material';

// const MergingVideoWithAudio = () => {
//   const [videoFile, setVideoFile] = useState(null);
//   const [audioFile, setAudioFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [mergedVideo, setMergedVideo] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleVideoChange = (e) => {
//     setVideoFile(e.target.files[0]);
//   };

//   const handleAudioChange = (e) => {
//     setAudioFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('video', videoFile);
//     formData.append('audio', audioFile);

//     try {
//       const response = await axios.post('http://localhost:5000/merge-video-audio', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         responseType: 'blob',
//       });
//       const url = URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }));
//       setMergedVideo(url);
//       setMessage('Merging complete! Click the link below to download the merged video.');
//     } catch (error) {
//       setMessage('Error merging video and audio files.');
//       console.error('There was an error!', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Merge Video with Audio
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//         <Button
//           variant="contained"
//           component="label"
//           startIcon={<UploadFile />}
//         >
//           Select Video
//           <input type="file" hidden onChange={handleVideoChange} />
//         </Button>
//         {videoFile && <Typography variant="body1">{videoFile.name}</Typography>}
//         <Button
//           variant="contained"
//           component="label"
//           startIcon={<UploadFile />}
//         >
//           Select Audio
//           <input type="file" hidden onChange={handleAudioChange} />
//         </Button>
//         {audioFile && <Typography variant="body1">{audioFile.name}</Typography>}
//         {loading && <LinearProgress />}
//         <Button type="submit" variant="contained" color="primary" disabled={loading || !videoFile || !audioFile}>
//           {loading ? 'Merging...' : 'Upload and Merge'}
//         </Button>
//       </Box>
//       {message && <Typography variant="body1" color="error" sx={{ mt: 2 }}>{message}</Typography>}
//       {mergedVideo && (
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6">Merged Video:</Typography>
//           <video controls width="100%">
//             <source src={mergedVideo} type="video/mp4" />
//           </video>
//           <Button
//             variant="outlined"
//             sx={{ mt: 2 }}
//             href={mergedVideo}
//             download="merged_output.mp4"
//           >
//             Download Merged Video
//           </Button>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default MergingVideoWithAudio;





import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Box, LinearProgress, TextField } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

const MergingVideoWithAudio = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [message, setMessage] = useState('');
  const [mergedVideo, setMergedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleAudioChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('audio', audioFile);
    formData.append('startTime', startTime);

    try {
      const response = await axios.post('http://localhost:5000/merge-video-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }));
      setMergedVideo(url);
      setMessage('Merging complete! Click the link below to download the merged video.');
    } catch (error) {
      setMessage('Error merging video and audio files.');
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Merge Video with Audio
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          Select Video
          <input type="file" hidden onChange={handleVideoChange} />
        </Button>
        {videoFile && <Typography variant="body1">{videoFile.name}</Typography>}
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          Select Audio
          <input type="file" hidden onChange={handleAudioChange} />
        </Button>
        {audioFile && <Typography variant="body1">{audioFile.name}</Typography>}
        <TextField
          label="Start Time (in seconds)"
          type="number"
          value={startTime}
          onChange={handleStartTimeChange}
          variant="outlined"
        />
        {loading && <LinearProgress />}
        <Button type="submit" variant="contained" color="primary" disabled={loading || !videoFile || !audioFile}>
          {loading ? 'Merging...' : 'Upload and Merge'}
        </Button>
      </Box>
      {message && <Typography variant="body1" color="error" sx={{ mt: 2 }}>{message}</Typography>}
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

export default MergingVideoWithAudio;
