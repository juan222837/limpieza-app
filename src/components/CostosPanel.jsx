import { calcularHoras, calcularCosto } from "../services/costos";

export default function CostosPanel({ tareas }) {
  let totalDia = 0;

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-4">Costos del Día</h2>

      {tareas.map(t => {
        const horas = calcularHoras(t.hora_inicio, t.hora_fin);
        const costo = calcularCosto(t.hora_inicio, t.hora_fin);
        totalDia += costo;

        return (
          <div
            key={t.id}
            className="flex justify-between border-b py-2"
          >
            <span>
              {t.casas.nombre} ({horas.toFixed(1)}h)
            </span>
            <span className="font-semibold">
              ${costo.toFixed(2)}
            </span>
          </div>
        );
      })}

      <div className="flex justify-between font-bold mt-4">
        <span>Total</span>
        <span>${totalDia.toFixed(2)}</span>
      </div>
    </div>
  );
}
