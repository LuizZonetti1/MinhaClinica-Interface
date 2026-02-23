import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
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
        <Route path="/registro/inicial" element={<RegisterStart />} />
        <Route path="/registro/verificar" element={<RegisterVerify />} />
        {/* Rota gerada pelo backend no e-mail de verificação */}
        <Route path="/verify-email" element={<RegisterVerify />} />
        {/* Rota de destino do redirect 302 feito pelo backend após verificar o token */}
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
