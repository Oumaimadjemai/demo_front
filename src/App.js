import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./Components/Login/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Simulate loading or do authentication check
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds splash

    // Listen to online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isOnline) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        flexDirection: "column",
        textAlign: "center"
      }}>
        <h1>😢 Oops!</h1>
        <p>Pas de connexion Internet.</p>
        <small>Vérifiez votre réseau et réessayez.</small>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
