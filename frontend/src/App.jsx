import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { NotificacionesProvider } from "./context/NotificacionesContext";

// Layouts
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import LayoutDashboard from "./components/dashboard/LayoutDashboard";
import BannerVistaEmpresa from "./components/dashboard/BannerVistaEmpresa";
import LayoutAdmin from "./components/admin/LayoutAdmin";
import LayoutModerador from "./components/moderador/LayoutModerador";

// Páginas SEO
import EmpleosDispatch    from "./pages/seo/EmpleosDispatch";
import EmpleosProfesion   from "./pages/seo/EmpleosProfesion";
import DirectorioIpsCiudad from "./pages/seo/DirectorioIpsCiudad";
import DirectorioIpsSlug  from "./pages/seo/DirectorioIpsSlug";
import SalarioProfesion   from "./pages/seo/SalarioProfesion";

// Páginas públicas
import Inicio from "./pages/Inicio";
import Empleos from "./pages/Empleos";
import DetalleOferta from "./pages/DetalleOferta";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
// Oculto temporalmente: acceso gratuito ilimitado, sin planes de pago.
// Reactivar este import junto con la ruta /precios más abajo.
// import Precios from "./pages/Precios";
import Nosotros from "./pages/Nosotros";
import FAQ from "./pages/FAQ";
import Salarios from "./pages/Salarios";
import ParaEmpresas from "./pages/ParaEmpresas";
import NotFound from "./pages/NotFound";
import PerfilPublicoEmpresa from "./pages/PerfilPublicoEmpresa";
import PerfilPublicoCandidato from "./pages/PerfilPublicoCandidato";
import Notificaciones from "./pages/Notificaciones";
import Mensajes from "./pages/Mensajes";

// Autenticación
import Login from "./pages/Login";
import RecuperarPassword from "./pages/RecuperarPassword";
import NuevaPassword from "./pages/NuevaPassword";
import AuthCallback from "./pages/AuthCallback";
import RegistroCandidato from "./pages/RegistroCandidato";
import RegistroEmpresa from "./pages/RegistroEmpresa";

// Panel candidato
import DashboardCandidato from "./pages/candidato/DashboardCandidato";
import PerfilCandidato from "./pages/candidato/PerfilCandidato";
import MisPostulaciones from "./pages/candidato/MisPostulaciones";
import AlertasEmpleo from "./pages/candidato/AlertasEmpleo";
import SuscripcionCandidato from "./pages/candidato/SuscripcionCandidato";
import ConfiguracionCandidato from "./pages/candidato/ConfiguracionCandidato";

// Panel empresa
import DashboardEmpresa from "./pages/empresa/DashboardEmpresa";
import PublicarOferta from "./pages/empresa/PublicarOferta";
import MisOfertas from "./pages/empresa/MisOfertas";
import Candidatos from "./pages/empresa/Candidatos";
import BuscarCandidatos from "./pages/empresa/BuscarCandidatos";
import MiPlan from "./pages/empresa/MiPlan";
import ConfiguracionEmpresa from "./pages/empresa/ConfiguracionEmpresa";
import Estadisticas from "./pages/empresa/Estadisticas";

// Panel admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import GestionEmpresas from "./pages/admin/GestionEmpresas";
import GestionOfertas from "./pages/admin/GestionOfertas";
import GestionSuscripciones from "./pages/admin/GestionSuscripciones";
import ConfiguracionPlataforma from "./pages/admin/ConfiguracionPlataforma";

// Panel moderador
import ModerarOfertas from "./pages/moderador/ModerarOfertas";
import HistorialModeracion from "./pages/moderador/HistorialModeracion";

// ── Layout público ────────────────────────────────────────────────────────────
// Si el usuario autenticado es una empresa, NO mostramos el navbar de
// candidatos: mantenemos su panel lateral visible (igual que en /empresa/*)
// con un banner que le permite volver a su panel con un clic. Así una empresa
// nunca pierde su contexto de panel al navegar a páginas públicas como /empleos.
function LayoutPublico({ children }) {
  const { usuario } = useAuth();

  if (usuario?.rol === "empresa") {
    return (
      <LayoutDashboard tipo="empresa">
        <BannerVistaEmpresa />
        {children}
      </LayoutDashboard>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

// ── Guardia de rutas por rol ──────────────────────────────────────────────────
// Redirige al panel correcto si el usuario no tiene el rol requerido
function RutaProtegida({ rolesPermitidos, children, redirigirA = "/login" }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to={redirigirA} replace />;
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    // Redirige al panel propio del usuario
    const destinos = {
      candidato:  "/candidato/dashboard",
      empresa:    "/empresa/dashboard",
      moderador:  "/moderador/ofertas",
      admin:      "/admin/dashboard",
      superadmin: "/admin/dashboard",
    };
    return <Navigate to={destinos[usuario.rol] || "/"} replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <NotificacionesProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* ── Páginas públicas ── */}
          <Route path="/"            element={<LayoutPublico><Inicio /></LayoutPublico>} />
          <Route path="/empleos"                    element={<LayoutPublico><Empleos /></LayoutPublico>} />
          <Route path="/empleos/profesion/:slug"    element={<LayoutPublico><EmpleosProfesion /></LayoutPublico>} />
          <Route path="/empleos/:id"                element={<LayoutPublico><EmpleosDispatch /></LayoutPublico>} />
          <Route path="/privacidad"      element={<LayoutPublico><Privacidad /></LayoutPublico>} />
          <Route path="/politica-datos"  element={<LayoutPublico><Privacidad /></LayoutPublico>} />
          <Route path="/terminos"        element={<LayoutPublico><Terminos /></LayoutPublico>} />
          <Route path="/faq"             element={<LayoutPublico><FAQ /></LayoutPublico>} />
          <Route path="/salarios"        element={<LayoutPublico><Salarios /></LayoutPublico>} />
          <Route path="/para-empresas"                        element={<LayoutPublico><ParaEmpresas /></LayoutPublico>} />
          <Route path="/directorio/ips/:ciudad/:slugIps"    element={<LayoutPublico><DirectorioIpsSlug /></LayoutPublico>} />
          <Route path="/directorio/ips/:ciudad"             element={<LayoutPublico><DirectorioIpsCiudad /></LayoutPublico>} />
          <Route path="/salarios/:profesion"                element={<LayoutPublico><SalarioProfesion /></LayoutPublico>} />
          {/* Oculto temporalmente: acceso gratuito ilimitado, sin planes de pago.
              Reactivar junto con el import de Precios más arriba.
          <Route path="/precios"         element={<LayoutPublico><Precios /></LayoutPublico>} />
          */}
          <Route path="/nosotros"        element={<LayoutPublico><Nosotros /></LayoutPublico>} />
          <Route path="/empresas/:id"    element={<LayoutPublico><PerfilPublicoEmpresa /></LayoutPublico>} />
          <Route path="/candidatos/:id"  element={<LayoutPublico><PerfilPublicoCandidato /></LayoutPublico>} />
          <Route path="/notificaciones"  element={<LayoutPublico><Notificaciones /></LayoutPublico>} />
          <Route path="/mensajes"        element={<LayoutPublico><Mensajes /></LayoutPublico>} />

          {/* ── Autenticación ── */}
          <Route path="/login"              element={<Login />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/nueva-password"     element={<NuevaPassword />} />
          <Route path="/auth/callback"      element={<AuthCallback />} />
          <Route path="/registro/candidato" element={<RegistroCandidato />} />
          <Route path="/registro/empresa"   element={<RegistroEmpresa />} />

          {/* ── Panel candidato ── */}
          <Route path="/candidato" element={
            <RutaProtegida rolesPermitidos={["candidato"]}>
              <LayoutDashboard tipo="candidato" />
            </RutaProtegida>
          }>
            <Route path="dashboard"     element={<DashboardCandidato />} />
            <Route path="perfil"        element={<PerfilCandidato />} />
            <Route path="postulaciones" element={<MisPostulaciones />} />
            <Route path="alertas"       element={<AlertasEmpleo />} />
            <Route path="suscripcion"   element={<SuscripcionCandidato />} />
            <Route path="configuracion" element={<ConfiguracionCandidato />} />
          </Route>

          {/* ── Panel empresa ── */}
          <Route path="/empresa" element={
            <RutaProtegida rolesPermitidos={["empresa"]}>
              <LayoutDashboard tipo="empresa" />
            </RutaProtegida>
          }>
            <Route path="dashboard"          element={<DashboardEmpresa />} />
            <Route path="ofertas"            element={<MisOfertas />} />
            <Route path="mis-vacantes"       element={<MisOfertas />} />
            <Route path="publicar-oferta"    element={<PublicarOferta />} />
            <Route path="candidatos"         element={<Candidatos />} />
            <Route path="buscar-candidatos"  element={<BuscarCandidatos />} />
            <Route path="plan"               element={<MiPlan />} />
            <Route path="suscripcion"        element={<MiPlan />} />
            <Route path="estadisticas"       element={<Estadisticas />} />
            <Route path="configuracion"      element={<ConfiguracionEmpresa />} />
          </Route>

          {/* ── Panel admin (admin + superadmin) ── */}
          <Route path="/admin" element={
            <RutaProtegida rolesPermitidos={["admin", "superadmin"]}>
              <LayoutAdmin />
            </RutaProtegida>
          }>
            <Route index                element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"     element={<DashboardAdmin />} />
            <Route path="usuarios"      element={<GestionUsuarios />} />
            <Route path="empresas"      element={<GestionEmpresas />} />
            <Route path="ofertas"       element={<GestionOfertas />} />
            <Route path="suscripciones" element={
              <RutaProtegida rolesPermitidos={["superadmin"]}>
                <GestionSuscripciones />
              </RutaProtegida>
            } />
            <Route path="configuracion" element={
              <RutaProtegida rolesPermitidos={["superadmin"]}>
                <ConfiguracionPlataforma />
              </RutaProtegida>
            } />
          </Route>

          {/* ── Panel moderador ── */}
          <Route path="/moderador" element={
            <RutaProtegida rolesPermitidos={["moderador", "superadmin"]}>
              <LayoutModerador />
            </RutaProtegida>
          }>
            <Route index               element={<Navigate to="ofertas" replace />} />
            <Route path="ofertas"      element={<ModerarOfertas />} />
            <Route path="historial"    element={<HistorialModeracion />} />
          </Route>

          {/* ── 404 catchall ── */}
          <Route path="*" element={<LayoutPublico><NotFound /></LayoutPublico>} />

        </Routes>
      </BrowserRouter>
      </NotificacionesProvider>
    </AuthProvider>
  );
}

export default App;
