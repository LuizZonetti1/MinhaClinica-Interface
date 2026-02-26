import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PatientAccess from "../pages/Patient/Access";
import RegisterComplete from "../pages/Register/Complete";
import CompleteRedirect from "../pages/Register/CompleteRedirect";
import RegisterStart from "../pages/Register/Start";
import RegisterVerify from "../pages/Register/Verify";
import { RegisterCompleteGuard } from "./RegisterCompleteGuard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/paciente/acesso" element={<PatientAccess />} />
        <Route path="/registro/inicial" element={<RegisterStart />} />
        <Route path="/registro/verificar" element={<RegisterVerify />} />
        <Route path="/verify-email" element={<RegisterVerify />} />
        <Route path="/completar-cadastro" element={<CompleteRedirect />} />
        <Route
          path="/registro/completo"
          element={
            <RegisterCompleteGuard>
              <RegisterComplete />
            </RegisterCompleteGuard>
          }
        />
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
