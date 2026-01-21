import { supabase } from '../supabase'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) setError(error.message)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Control de Limpieza</h1>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Iniciar Sesión</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
