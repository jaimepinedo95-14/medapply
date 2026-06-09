import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useStats() {
  const [stats, setStats] = useState({ candidatos: 0, empresas: 0, ofertas: 0 });

  const fetch = useCallback(async () => {
    // Use SECURITY DEFINER function — works for anon users, bypasses RLS
    const { data } = await supabase.rpc("get_stats_publicos");
    if (data) {
      setStats({
        candidatos: data.candidatos ?? 0,
        empresas:   data.empresas   ?? 0,
        ofertas:    data.ofertas    ?? 0,
      });
      return;
    }
    // Fallback: direct queries (require RLS policies to allow anon)
    const [{ count: c }, { count: e }, { count: o }] = await Promise.all([
      supabase.from("perfiles_candidato").select("*", { count: "exact", head: true }),
      supabase.from("perfiles_empresa").select("*", { count: "exact", head: true }),
      supabase.from("ofertas").select("*", { count: "exact", head: true }).eq("estado", "activa"),
    ]);
    setStats({ candidatos: c ?? 0, empresas: e ?? 0, ofertas: o ?? 0 });
  }, []);

  useEffect(() => {
    fetch();

    // Realtime: re-fetch stats on any INSERT/UPDATE/DELETE in these tables
    const ch = supabase
      .channel("stats-global")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "perfiles_candidato" }, fetch)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "perfiles_empresa" }, fetch)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ofertas" }, fetch)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ofertas" }, fetch)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [fetch]);

  return stats;
}
