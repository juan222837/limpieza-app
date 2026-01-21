import Calendar from '../components/Calendar'

export default function AdminDashboard() {
  return (
    <div className="layout">
      <h2>Cronograma Diario</h2>
      <Calendar role="admin" />
    </div>
  )
}
