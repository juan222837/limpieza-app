import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

const COSTO_HORA = 62;

export default function Dashboard() {
  const { user } = useAuth();
  const [rol, setRol] = useState(null);
  const [casas, setCasas] = useState([]);
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    if (user) cargarRol();
  }, [user]);

  async function cargarRol() {
    const { data } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    setRol(data.rol);
    cargarDatos(data.rol);
  }

  async function cargarDatos(rol) {
    if (rol === "admin") {
      const { data: casasData } = await supabase.from("casas").select("*");
      const { data: tareasData } = await supabase
        .from("tareas")
        .select("*, casas(nombre)");

      setCasas(casasData);
      setTareas(tareasData);
    } else {
      const { data } = await supabase
        .from("tareas")
        .select("*, casas(*)")
        .eq("supervisor_id", user.id);

      setCasas(data.map(t => t.casas));
    }
  }

  async function marcarLimpia(id) {
    await supabase.from("casas").update({ estado: true }).eq("id", id);
    cargarDatos(rol);
  }

  function horasTrabajadas(inicio, fin) {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fin.split(":").map(Number);
    return (h2 + m2 / 60) - (h1 + m1 / 60);
  }

  if (!rol) return <p>Cargando datos...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sistema de Limpieza</h1>

      {rol === "supervisor" && casas.map(c => (
        <div key={c.id} className="border p-4 rounded-xl mb-3">
          <p className="font-semibold">{c.nombre}</p>
          <p>Estado: {c.estado ? "✅ Limpia" : "⏳ Pendiente"}</p>
          {!c.estado && (
            <button
              onClick={() => marcarLimpia(c.id)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Marcar limpia
            </button>
          )}
        </div>
      ))}

      {rol === "admin" && tareas.map(t => {
        const horas = horasTrabajadas(t.hora_inicio, t.hora_fin);
        return (
          <p key={t.id}>
            {t.casas.nombre} — {horas.toFixed(1)}h — 💲{(horas * COSTO_HORA).toFixed(2)}
          </p>
        );
      })}
    </div>
  );
}
