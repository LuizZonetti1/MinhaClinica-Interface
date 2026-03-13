import { AuthProvider, ThemeModeProvider } from "./contexts";
import { AppToastContainer } from "./components/AppToastContainer";
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <AppRoutes />
        <AppToastContainer />
      </AuthProvider>
    </ThemeModeProvider>
  );
}

export default App;
