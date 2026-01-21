import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import CostosPanel from "../components/CostosPanel";


export default function CalendarAdmin() {
  const [eventos, setEventos] = useState([]);
  const [casas, setCasas] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [modal, setModal] = useState(null);
  const [tareasHoy, setTareasHoy] = useState([]);


  useEffect(() => {
    cargarDatos();
  }, []);

  const hoy = new Date().toISOString().split("T")[0];

const { data: tareasDia } = await supabase
  .from("tareas")
  .select("*, casas(nombre)")
  .eq("fecha", hoy);

setTareasHoy(tareasDia);


  async function cargarDatos() {
    const { data: tareas } = await supabase
      .from("tareas")
      .select("*, casas(nombre, lote, estado)");

    const eventosMap = tareas.map(t => ({
      id: t.id,
      title: `${t.casas.nombre} - ${t.casas.lote}`,
      start: `${t.fecha}T${t.hora_inicio}`,
      end: `${t.fecha}T${t.hora_fin}`,
      backgroundColor: t.casas.estado ? "#16a34a" : "#2563eb"
    }));

    const { data: casasData } = await supabase.from("casas").select("*");
    const { data: supData } = await supabase
      .from("usuarios")
      .select("id")
      .eq("rol", "supervisor");

    setEventos(eventosMap);
    setCasas(casasData);
    setSupervisores(supData);
  }

  function onDateClick(info) {
    setModal({
      fecha: info.dateStr,
      inicio: "08:00",
      fin: "17:00"
    });
  }

  async function crearTarea(e) {
    e.preventDefault();

    await supabase.from("tareas").insert({
      casa_id: modal.casa,
      supervisor_id: modal.supervisor,
      fecha: modal.fecha,
      hora_inicio: modal.inicio,
      hora_fin: modal.fin
    });

    setModal(null);
    cargarDatos();
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable
        dateClick={onDateClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={eventos}
        height="auto"
      />

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={crearTarea}
            className="bg-white p-6 rounded-xl w-96"
          >
            <h2 className="font-bold mb-4">Asignar Casa</h2>

            <select
              className="w-full mb-3 p-2 border rounded"
              required
              onChange={e =>
                setModal({ ...modal, casa: e.target.value })
              }
            >
              <option value="">Seleccionar casa</option>
              {casas.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} - {c.lote}
                </option>
              ))}
            </select>

            <select
              className="w-full mb-3 p-2 border rounded"
              required
              onChange={e =>
                setModal({ ...modal, supervisor: e.target.value })
              }
            >
              <option value="">Seleccionar supervisor</option>
              {supervisores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id}
                </option>
              ))}
            </select>

            <div className="flex gap-2 mb-4">
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={modal.inicio}
                onChange={e =>
                  setModal({ ...modal, inicio: e.target.value })
                }
              />
              <input
                type="time"
                className="border p-2 rounded w-full"
                value={modal.fin}
                onChange={e =>
                  setModal({ ...modal, fin: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-3 py-1"
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Asignar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
  <CostosPanel tareas={tareasHoy} />

}
