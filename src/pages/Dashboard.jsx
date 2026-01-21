import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import Calendar from "./Calendar";
import CalendarAdmin from "./CalendarAdmin";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    supabase
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setRol(data.rol));
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (!rol) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="font-bold">
          Sistema de Limpieza ({rol})
        </h1>
        <button onClick={logout} className="text-red-600">
          Cerrar sesión
        </button>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {rol === "admin" ? <CalendarAdmin /> : <Calendar />}
      </main>
    </div>
  );
}
