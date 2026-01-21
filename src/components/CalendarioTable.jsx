import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

export default function Calendar({ role }) {
  const [data, setData] = useState([])
  const [supervisors, setSupervisors] = useState([])

  useEffect(() => {
    loadData()
    loadSupervisors()
  }, [])

  const loadData = async () => {
    const { data } = await supabase
      .from('assignments')
      .select(`
        id,
        completed,
        start_time,
        end_time,
        schedule: schedule_id (
          date,
          house: house_id ( name )
        ),
        supervisor: supervisor_id ( email )
      `)
    setData(data || [])
  }

  const loadSupervisors = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'supervisor')
    setSupervisors(data || [])
  }

  const assignSupervisor = async (assignmentId, supervisorId) => {
    await supabase
      .from('assignments')
      .update({ supervisor_id: supervisorId })
      .eq('id', assignmentId)
    loadData()
  }

  return (
    <table className="calendar">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Casa</th>
          <th>Supervisor</th>
          <th>Horario</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.schedule.date}</td>
            <td>{row.schedule.house.name}</td>

            <td>
              {role === 'admin' ? (
                <select onChange={e => assignSupervisor(row.id, e.target.value)}>
                  <option>Asignar</option>
                  {supervisors.map(s => (
                    <option key={s.id} value={s.id}>{s.id}</option>
                  ))}
                </select>
              ) : (
                row.supervisor?.email
              )}
            </td>

            <td>{row.start_time} - {row.end_time}</td>
            <td>{row.completed ? '✅' : '⏳'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

