import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const COSTO_HORA = 62;

export default function App() {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [casas, setCasas] = useState([]);
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        cargarRol(data.user.id);
      }
    });
  }, []);

  async function cargarRol(userId) {
    const { data } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", userId)
      .single();

    setRol(data.rol);
    cargarDatos(data.rol, userId);
  }

  async function cargarDatos(rol, userId) {
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
        .eq("supervisor_id", userId);

      setCasas(data.map(t => t.casas));
    }
  }

  async function marcarLimpia(id) {
    await supabase.from("casas").update({ estado: true }).eq("id", id);
    cargarDatos(rol, user.id);
  }

  function horasTrabajadas(inicio, fin) {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fin.split(":").map(Number);
    return (h2 + m2 / 60) - (h1 + m1 / 60);
  }

  if (!user) return <Login />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sistema de Limpieza</h1>

      {rol === "supervisor" && (
        <>
          <h2 className="font-semibold mb-4">Mis Casas</h2>
          {casas.map(c => (
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
        </>
      )}

      {rol === "admin" && (
        <>
          <h2 className="font-semibold mb-4">Panel Administrador</h2>

          <h3 className="font-semibold">Estado de Casas</h3>
          {casas.map(c => (
            <p key={c.id}>
              {c.nombre} — {c.estado ? "✅ Limpia" : "⏳ Pendiente"}
            </p>
          ))}

          <h3 className="font-semibold mt-4">Costos</h3>
          {tareas.map(t => {
            const horas = horasTrabajadas(t.hora_inicio, t.hora_fin);
            const costo = horas * COSTO_HORA;
            return (
              <p key={t.id}>
                {t.casas.nombre} — {horas.toFixed(1)}h — 💲{costo.toFixed(2)}
              </p>
            );
          })}
        </>
      )}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    await supabase.auth.signInWithPassword({ email, password });
    window.location.reload();
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="border p-6 rounded-xl w-80">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
        <input
          className="border w-full p-2 mb-2"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border w-full p-2 mb-4"
          placeholder="Contraseña"
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
