import { AuthProvider, NotificationProvider } from "./contexts";
import { AppToastContainer } from "./components/AppToastContainer";
import AppRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <AppToastContainer />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
