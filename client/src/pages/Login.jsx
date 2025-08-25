import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { apiUrl } from '../api'

export default function Login(){
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [err,setErr] = useState(null)
  const { saveAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault(); setErr(null)
    try{
      const res = await fetch(apiUrl('/api/auth/login'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password: pass }) })
      if (!res.ok) throw new Error('Login falhou')
  const data = await res.json()
  saveAuth(data.token, data.user)
  // go to admin after login
  navigate('/admin')
    }catch(err){ setErr(String(err)) }
  }

  return (
    <section style={{padding:20,maxWidth:520,margin:'20px auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{display:'grid',gap:10}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Entrar</button>
        </div>
        {err && <div style={{color:'red'}}>{err}</div>}
      </form>
    </section>
  )
}
