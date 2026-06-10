import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { NotificacionesProvider } from "./context/NotificacionesContext";

// Layouts
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LayoutDashboard from "./components/dashboard/LayoutDashboard";
import LayoutAdmin from "./components/admin/LayoutAdmin";
import LayoutModerador from "./components/moderador/LayoutModerador";

// Páginas públicas
import Inicio from "./pages/Inicio";
import Empleos from "./pages/Empleos";
import DetalleOferta from "./pages/DetalleOferta";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
import Precios from "./pages/Precios";
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
import RegistroCandidato from "./pages/RegistroCandidato";
import RegistroEmpresa from "./pages/RegistroEmpresa";

// Panel candidato
import DashboardCandidato from "./pages/candidato/DashboardCandidato";
import PerfilCandidato from "./pages/candidato/PerfilCandidato";
import MisPostulaciones from "./pages/candidato/MisPostulaciones";
import SuscripcionCandidato from "./pages/candidato/SuscripcionCandidato";
import ConfiguracionCandidato from "./pages/candidato/ConfiguracionCandidato";

// Panel empresa
import DashboardEmpresa from "./pages/empresa/DashboardEmpresa";
import PublicarOferta from "./pages/empresa/PublicarOferta";
import MisOfertas from "./pages/empresa/MisOfertas";
import BancoCandidatos from "./pages/empresa/BancoCandidatos";
import SuscripcionEmpresa from "./pages/empresa/SuscripcionEmpresa";
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
function LayoutPublico({ children }) {
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
        <Routes>

          {/* ── Páginas públicas ── */}
          <Route path="/"            element={<LayoutPublico><Inicio /></LayoutPublico>} />
          <Route path="/empleos"     element={<LayoutPublico><Empleos /></LayoutPublico>} />
          <Route path="/empleos/:id" element={<LayoutPublico><DetalleOferta /></LayoutPublico>} />
          <Route path="/privacidad"      element={<LayoutPublico><Privacidad /></LayoutPublico>} />
          <Route path="/politica-datos"  element={<LayoutPublico><Privacidad /></LayoutPublico>} />
          <Route path="/terminos"        element={<LayoutPublico><Terminos /></LayoutPublico>} />
          <Route path="/faq"             element={<LayoutPublico><FAQ /></LayoutPublico>} />
          <Route path="/salarios"        element={<LayoutPublico><Salarios /></LayoutPublico>} />
          <Route path="/para-empresas"   element={<LayoutPublico><ParaEmpresas /></LayoutPublico>} />
          <Route path="/precios"         element={<LayoutPublico><Precios /></LayoutPublico>} />
          <Route path="/nosotros"        element={<LayoutPublico><Nosotros /></LayoutPublico>} />
          <Route path="/empresas/:id"    element={<LayoutPublico><PerfilPublicoEmpresa /></LayoutPublico>} />
          <Route path="/candidatos/:id"  element={<LayoutPublico><PerfilPublicoCandidato /></LayoutPublico>} />
          <Route path="/notificaciones"  element={<LayoutPublico><Notificaciones /></LayoutPublico>} />
          <Route path="/mensajes"        element={<LayoutPublico><Mensajes /></LayoutPublico>} />

          {/* ── Autenticación ── */}
          <Route path="/login"              element={<Login />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
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
            <Route path="suscripcion"   element={<SuscripcionCandidato />} />
            <Route path="configuracion" element={<ConfiguracionCandidato />} />
          </Route>

          {/* ── Panel empresa ── */}
          <Route path="/empresa" element={
            <RutaProtegida rolesPermitidos={["empresa"]}>
              <LayoutDashboard tipo="empresa" />
            </RutaProtegida>
          }>
            <Route path="dashboard"       element={<DashboardEmpresa />} />
            <Route path="ofertas"         element={<MisOfertas />} />
            <Route path="publicar-oferta" element={<PublicarOferta />} />
            <Route path="candidatos"      element={<BancoCandidatos />} />
            <Route path="estadisticas"    element={<Estadisticas />} />
            <Route path="suscripcion"     element={<SuscripcionEmpresa />} />
            <Route path="configuracion"   element={<ConfiguracionEmpresa />} />
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
