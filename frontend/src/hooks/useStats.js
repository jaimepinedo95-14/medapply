import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useStats() {
  const [stats, setStats] = useState({ candidatos: 0, empresas: 0, ofertas: 0 });

  useEffect(() => {
    const fetch = () =>
      Promise.all([
        supabase.from("perfiles_candidato").select("*", { count: "exact", head: true }),
        supabase.from("perfiles_empresa").select("*", { count: "exact", head: true }),
        supabase.from("ofertas").select("*", { count: "exact", head: true }).eq("estado", "activa"),
      ]).then(([{ count: c }, { count: e }, { count: o }]) => {
        setStats({ candidatos: c ?? 0, empresas: e ?? 0, ofertas: o ?? 0 });
      });

    fetch();

    const ch = supabase
      .channel("stats-global")
      .on("postgres_changes", { event: "*", schema: "public", table: "perfiles_candidato" }, fetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "perfiles_empresa" }, fetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "ofertas" }, fetch)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  return stats;
}
