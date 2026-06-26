// Supabase Edge Function: enviar-email
//
// Envía un email vía Resend. Genérica: recibe { to, subject, html } y lo
// reenvía a la API de Resend usando la clave guardada como secret de
// Supabase (RESEND_API_KEY) — nunca se expone al navegador.
//
// Configurar antes de desplegar:
//   supabase secrets set RESEND_API_KEY=tu_clave_real
// Desplegar:
//   supabase functions deploy enviar-email

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REMITENTE = "MedApply <notificaciones@medapply.co>";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY no está configurada en los secrets de Supabase." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Faltan to, subject o html en la solicitud." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: `Resend respondió ${resp.status}: ${JSON.stringify(data)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error inesperado." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
