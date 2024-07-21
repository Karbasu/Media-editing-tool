import React from "react";
import { CssBaseline, ThemeProvider, createTheme, Button } from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import AudioUploader from "./AudioUploader";
import MergingVideoWithAudio from "./MergingVideoWithAudio";
import "./App.css";
import MergingVideoToVideo from "./MergeVideoTOVideo";
import MergeVideoWithBackgroundAudio from "./MergeVideoWithBackgroundAudio";
import TrimVideo from "./TrimVideo";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#2BE068",
      },
      secondary: {
        main: "#2BE0A6",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="root" className="app-container">
        <div className="navigation-bar">
          <Link to="/audio-merging" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "30px" }}
            >
              Go to Audio Merging
            </Button>
          </Link>
          <Link to="/video-audio-merging" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: "30px" }}
            >
              Go to Video-Audio Merging
            </Button>
          </Link>
          <Link to="/video-to-video" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: "30px" }}
            >
              Go to Video-Video Merging
            </Button>
          </Link>
          <Link to="/video+background-music" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: "30px" }}
            >
              Go to Video-backGround-music Merging
            </Button>
          </Link>
          <Link to="/video-trim" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: "30px" }}
            >
              {" "}
              Go to Video Trim
            </Button>
          </Link>
        </div>
        <Routes>
          <Route path="/audio-merging" element={<AudioUploader />} />
          <Route
            path="/video-audio-merging"
            element={<MergingVideoWithAudio />}
          />
          <Route path="/video-to-video" element={<MergingVideoToVideo />} />
          <Route
            path="/video+background-music"
            element={<MergeVideoWithBackgroundAudio />}
          />
          <Route path="/video-trim" element={<TrimVideo />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
