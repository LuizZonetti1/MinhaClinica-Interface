import { AuthProvider } from "./contexts";
import { AppToastContainer } from "./components/AppToastContainer";
import AppRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <AppToastContainer />
    </AuthProvider>
  );
}

export default App;
