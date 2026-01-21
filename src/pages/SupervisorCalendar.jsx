import Calendar from '../components/Calendar'

export default function SupervisorDashboard() {
  return (
    <div className="layout">
      <h2>Mis Tareas</h2>
      <Calendar role="supervisor" />
    </div>
  )
}
