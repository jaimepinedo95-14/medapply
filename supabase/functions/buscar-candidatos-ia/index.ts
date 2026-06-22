// Supabase Edge Function: buscar-candidatos-ia
//
// Recibe { textoLibre, candidatos } desde el panel de empresa y calcula el
// porcentaje de afinidad de cada candidato llamando a Claude API del lado del
// servidor. La clave de Anthropic vive como secret de Supabase y NUNCA se
// envía al navegador.
//
// Configurar antes de desplegar:
//   supabase secrets set ANTHROPIC_API_KEY=tu_clave_real
// Desplegar:
//   supabase functions deploy buscar-candidatos-ia

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const LIMITE_CANDIDATOS = 40; // tope para no enviar listas gigantes al modelo

function construirPrompt(textoLibre: string, candidatos: any[]) {
  const lista = candidatos.slice(0, LIMITE_CANDIDATOS).map((c) => ({
    id: c.id,
    especialidad: c.categoria || "sin especificar",
    ciudad: c.ciudad || "sin especificar",
    experiencia_anios: c.experiencia ?? 0,
    resumen: c.resumen || "",
  }));

  return `Eres un asistente de reclutamiento para el sector salud en Colombia.

Una empresa describe lo que necesita:
"${textoLibre}"

Aquí está la lista de candidatos disponibles, en formato JSON:
${JSON.stringify(lista)}

Para cada candidato, asigna un porcentaje de afinidad (número entero de 0 a 100)
según qué tan bien encaja su especialidad, ciudad, experiencia y resumen con lo
que la empresa describió.

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional antes ni después,
con este formato exacto:
[{"id_candidato": "...", "porcentaje_afinidad": 85}]`;
}

function extraerJSON(texto: string) {
  try {
    return JSON.parse(texto);
  } catch {
    const match = texto.match(/\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY no está configurada en los secrets de Supabase." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { textoLibre, candidatos } = await req.json();
    if (!textoLibre || !Array.isArray(candidatos) || candidatos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Faltan textoLibre o candidatos en la solicitud." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const prompt = construirPrompt(textoLibre, candidatos);

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const texto = await resp.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `Claude API respondió ${resp.status}: ${texto.slice(0, 300)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();
    const textoRespuesta = data?.content?.[0]?.text || "";
    const resultado = extraerJSON(textoRespuesta);

    if (!Array.isArray(resultado)) {
      return new Response(
        JSON.stringify({ error: "La respuesta de Claude no tiene el formato esperado." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const afinidad = Object.fromEntries(
      resultado.map((r: any) => [r.id_candidato, Number(r.porcentaje_afinidad) || 0]),
    );

    return new Response(JSON.stringify({ afinidad }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error inesperado." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
