import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProjectProvider } from "./context/Project.Context";
import { EventProvider } from "./context/EventContext";
import { RealtimeProvider } from "./context/RealTimeContext"; 
import AppRoutes from "./routes/AppRoutes";

// NOTE: We use RealtimeProvider instead of RealtimeContext for clarity and proper context usage.
const AppWithRealtime = () => {
  const { accessToken } = useAuth();
  console.log("AppWithRealtime accessToken:", accessToken);
  return (
    <RealtimeProvider token={ accessToken }>
      <AppRoutes />
    </RealtimeProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ProjectProvider>
        <EventProvider>
          <AppWithRealtime />
        </EventProvider>
      </ProjectProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
