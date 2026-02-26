import { Outlet } from "react-router";

/**
 * Layout base da aplicação (área autenticada).
 * Envolve todas as páginas protegidas com estrutura comum
 * como sidebar, header, etc.
 *
 * Substitua o conteúdo abaixo pelo seu layout real.
 */
export const AppLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar / Menu lateral */}
      {/* <Sidebar /> */}

      <div style={{ flex: 1 }}>
        {/* Header */}
        {/* <Header /> */}

        <main>
          {/* Aqui renderiza a página filha */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
