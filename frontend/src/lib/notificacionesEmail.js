import { supabase } from "./supabase";

// Envía un email vía la Edge Function "enviar-email" (Resend del lado del
// servidor). Si falla, se captura en silencio — nunca debe romper el flujo
// principal (postulación, registro, etc.).
async function enviarEmail({ to, subject, html }) {
  try {
    await supabase.functions.invoke("enviar-email", { body: { to, subject, html } });
  } catch (_) {
    // silencioso a propósito
  }
}

function plantillaBase(contenidoHtml) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1f2937;">
      <p style="font-size: 20px; font-weight: 700; margin: 0 0 24px;">
        <span style="color: #1E3A5F;">Med</span><span style="color: #10b981;">Apply</span>
      </p>
      ${contenidoHtml}
      <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">
        MedApply — La plataforma de empleo 100% del sector salud.
      </p>
    </div>
  `;
}

// ── Postulación a vacante ─────────────────────────────────────────────────────

export function notificarNuevaPostulacionAEmpresa({ empresaEmail, empresaNombre, candidatoNombre, cargo }) {
  if (!empresaEmail) return;
  const html = plantillaBase(`
    <p style="font-size: 15px; line-height: 1.6;">
      Hola ${empresaNombre || "equipo"},<br/><br/>
      <strong>${candidatoNombre}</strong> acaba de aplicar a tu vacante "<strong>${cargo}</strong>".
      Ingresa a tu panel para ver su perfil:
    </p>
    <p style="margin: 24px 0;">
      <a href="https://medapply.co/empresa/candidatos" style="background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        Ver candidato →
      </a>
    </p>
  `);
  return enviarEmail({
    to: empresaEmail,
    subject: `Nuevo candidato aplicó a tu vacante — ${cargo}`,
    html,
  });
}

export function notificarPostulacionEnviadaACandidato({ candidatoEmail, candidatoNombre, cargo, empresaNombre }) {
  if (!candidatoEmail) return;
  const html = plantillaBase(`
    <p style="font-size: 15px; line-height: 1.6;">
      Hola ${candidatoNombre || "candidato"},<br/><br/>
      Tu postulación a "<strong>${cargo}</strong>" en <strong>${empresaNombre}</strong> fue enviada.
      Te notificaremos cuando haya novedades.
    </p>
    <p style="margin: 24px 0;">
      <a href="https://medapply.co/candidato/postulaciones" style="background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        Ver mis postulaciones →
      </a>
    </p>
  `);
  return enviarEmail({
    to: candidatoEmail,
    subject: `Postulación enviada exitosamente — ${cargo}`,
    html,
  });
}

const TEXTO_POR_ESTADO = {
  vista:           "fue revisada por la empresa",
  preseleccionada: "¡fue preseleccionada! La empresa quiere avanzar contigo",
  rechazada:       "no fue seleccionada esta vez",
};

export function notificarCambioEstadoPostulacion({ candidatoEmail, candidatoNombre, cargo, empresaNombre, nuevoEstado }) {
  if (!candidatoEmail) return;
  const detalle = TEXTO_POR_ESTADO[nuevoEstado];
  if (!detalle) return; // "pendiente" (recién creada) no aplica aquí
  const html = plantillaBase(`
    <p style="font-size: 15px; line-height: 1.6;">
      Hola ${candidatoNombre || "candidato"},<br/><br/>
      Tu postulación a "<strong>${cargo}</strong>" en <strong>${empresaNombre}</strong> ${detalle}.
    </p>
    <p style="margin: 24px 0;">
      <a href="https://medapply.co/candidato/postulaciones" style="background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        Ver mis postulaciones →
      </a>
    </p>
  `);
  return enviarEmail({
    to: candidatoEmail,
    subject: `Actualización de tu postulación — ${cargo}`,
    html,
  });
}

// ── Bienvenida al registrarse ────────────────────────────────────────────────

export function enviarBienvenidaCandidato({ email, nombre }) {
  if (!email) return;
  const html = plantillaBase(`
    <p style="font-size: 15px; line-height: 1.6;">
      Hola ${nombre || "candidato"}, bienvenido a la plataforma de empleo 100% del sector salud.
    </p>
    <p style="margin: 24px 0;">
      <a href="https://medapply.co/candidato/perfil" style="background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        Completa tu perfil →
      </a>
    </p>
  `);
  return enviarEmail({ to: email, subject: "Bienvenido a MedApply 🩺", html });
}

export function enviarBienvenidaEmpresa({ email, nombreEmpresa }) {
  if (!email) return;
  const html = plantillaBase(`
    <p style="font-size: 15px; line-height: 1.6;">
      Hola ${nombreEmpresa || "equipo"}, ya puedes publicar tus vacantes.
    </p>
    <p style="margin: 24px 0;">
      <a href="https://medapply.co/empresa/publicar-oferta" style="background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
        Publicar primera vacante →
      </a>
    </p>
  `);
  return enviarEmail({ to: email, subject: "Tu cuenta de empresa está lista — MedApply", html });
}
