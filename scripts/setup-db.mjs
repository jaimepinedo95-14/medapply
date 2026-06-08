/**
 * MedApply — Setup de base de datos
 * Aplica el schema SQL usando la Supabase Management API.
 *
 * Uso:
 *   1. Crea un token en https://supabase.com/dashboard/account/tokens
 *   2. Pon el token en SUPABASE_ACCESS_TOKEN:
 *      $env:SUPABASE_ACCESS_TOKEN="tu_token_aqui"
 *   3. Ejecuta: node scripts/setup-db.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF    = "sgtfstuunasmhvizhjvp";
const MGMT_API       = "https://api.supabase.com/v1";
const ACCESS_TOKEN   = process.env.SUPABASE_ACCESS_TOKEN;
const SQL_FILE       = join(__dirname, "../supabase/migrations/001_schema.sql");

if (!ACCESS_TOKEN) {
  console.error("\n❌  Falta SUPABASE_ACCESS_TOKEN");
  console.error("   1. Ve a https://supabase.com/dashboard/account/tokens");
  console.error("   2. Crea un nuevo token");
  console.error("   3. Ejecuta:");
  console.error('      $env:SUPABASE_ACCESS_TOKEN="tu_token_aqui"  (PowerShell)');
  console.error('      export SUPABASE_ACCESS_TOKEN="tu_token_aqui"  (bash)');
  console.error("   4. Vuelve a ejecutar: node scripts/setup-db.mjs\n");
  console.error("   ── Alternativa rápida ──────────────────────────────────");
  console.error("   Copia el contenido de supabase/migrations/001_schema.sql");
  console.error("   y pégalo en Supabase Dashboard → SQL Editor → Run\n");
  process.exit(1);
}

const sql = readFileSync(SQL_FILE, "utf-8");

// Dividir en statements para ejecutar uno por uno
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

async function ejecutarSQL(query) {
  const res = await fetch(`${MGMT_API}/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }
  return res.json();
}

async function main() {
  console.log("🚀  MedApply — Configurando base de datos en Supabase...\n");

  // Ejecutar todo el SQL como una sola transacción
  try {
    await ejecutarSQL(sql);
    console.log("✅  Schema creado correctamente.");
  } catch (err) {
    // Si falla como bloque, intentar statement por statement
    console.log("   Ejecutando por partes...");
    let ok = 0;
    let errores = 0;
    for (const stmt of statements) {
      try {
        await ejecutarSQL(stmt);
        ok++;
      } catch (e) {
        // Ignorar errores de "ya existe"
        if (e.message.includes("already exists") || e.message.includes("ya existe")) {
          ok++;
        } else {
          errores++;
          console.warn(`   ⚠️  ${e.message.substring(0, 100)}`);
        }
      }
    }
    if (errores === 0) {
      console.log(`✅  ${ok} statements ejecutados correctamente.`);
    } else {
      console.log(`   ${ok} OK · ${errores} con errores (ver arriba)`);
    }
  }

  console.log("\n✅  Base de datos configurada.");
  console.log("   Siguiente paso: ve a Supabase Dashboard → Auth → Providers → Email");
  console.log("   y desactiva 'Confirm email' para pruebas rápidas.\n");
}

main().catch(console.error);
