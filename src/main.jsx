/* eslint-disable unused-imports/no-unused-imports */
import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";

import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import "./index.css";

import App from "./App.jsx";

const FormularioApi       = lazy(() => import("./pages/FormularioApi.jsx"));
const FundoInvestimento   = lazy(() => import("./pages/FundoInvestimento.jsx"));
const Cartas              = lazy(() => import("./pages/Cartas.jsx"));
const Relatorios          = lazy(() => import("./pages/Relatorios.jsx"));
const Insights            = lazy(() => import("./pages/Insights.jsx"));
const Compliance          = lazy(() => import("./pages/Compliance.jsx"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade.jsx"));
const TermosUso           = lazy(() => import("./pages/TermosUso.jsx"));
const SolicitacaoLGPD     = lazy(() => import("./pages/SolicitacaoLGPD.jsx"));
const PoliticaRetencaoLGPD = lazy(() => import("./pages/PoliticaRetencaoLGPD.jsx"));
const NotFound            = lazy(() => import("./pages/NotFound.jsx"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function WithScroll({ children }) {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        {children}
      </Suspense>
    </>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <WithScroll><App /></WithScroll> },
  { path: "/formulario-api", element: <WithScroll><FormularioApi /></WithScroll> },
  { path: "/fundo-de-investimento", element: <WithScroll><FundoInvestimento /></WithScroll> },
  { path: "/publicacoes/cartas", element: <WithScroll><Cartas /></WithScroll> },
  { path: "/publicacoes/relatorios", element: <WithScroll><Relatorios /></WithScroll> },
  { path: "/publicacoes/insights", element: <WithScroll><Insights /></WithScroll> },
  { path: "/publicacoes/compliance", element: <WithScroll><Compliance /></WithScroll> },
  { path: "/privacidade", element: <WithScroll><PoliticaPrivacidade /></WithScroll> },
  { path: "/termos", element: <WithScroll><TermosUso /></WithScroll> },
  { path: "/lgpd", element: <WithScroll><SolicitacaoLGPD /></WithScroll> },
  { path: "/docs/politica-retencao-lgpd", element: <WithScroll><PoliticaRetencaoLGPD /></WithScroll> },
  { path: "*", element: <WithScroll><NotFound /></WithScroll> },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);