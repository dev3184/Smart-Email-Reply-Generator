import React, { useState } from "react";
import axios from "axios"; // ✅ Import axios
import {
  TextField,
  MenuItem,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";

const App = () => {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("friendly");
  const [generatedReply, setGeneratedReply] = useState(""); // State for storing reply

  const handleGenerate = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });

      setGeneratedReply(typeof response.data === "string" ? response.data : JSON.stringify(response.data)); // Store generated reply in state
    } catch (error) {
      console.error("Error:", error);
      setGeneratedReply("Failed to generate reply. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #5A6378, #8A94A6)",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 4,
            backgroundColor: "#F2F4F8",
            padding: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#5A6378" }}
            >
              Smart Email Reply Generator ✉️
            </Typography>

            <TextField
              label="Email Content"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{
                mb: 2,
                backgroundColor: "#FFFFFF",
                borderRadius: 1,
              }}
            />

            <TextField
              select
              label="Select Tone"
              fullWidth
              variant="outlined"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              sx={{
                mb: 2,
                backgroundColor: "#FFFFFF",
                borderRadius: 1,
              }}
            >
              <MenuItem value="friendly">😊 Friendly</MenuItem>
              <MenuItem value="casual">😎 Casual</MenuItem>
              <MenuItem value="professional">📌 Professional</MenuItem>
            </TextField>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerate}
              sx={{
                backgroundColor: "#5A6378",
                color: "#FFFFFF",
                padding: "10px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#4A5468",
                },
              }}
            >
              Generate Reply 🚀
            </Button>

            {/* Display the generated reply */}
            {generatedReply && (
              <Card
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "#E3E7ED",
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: "#3A4151" }}>
                  Your Email:
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
                  {generatedReply}
                </Typography>
              </Card>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default App;
